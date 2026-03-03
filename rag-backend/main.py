import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool
from qdrant_client import QdrantClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Physical AI RAG Chatbot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Clients (initialised lazily so startup never crashes) ──────────────────────

def _get_openai_client() -> AsyncOpenAI:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GEMINI_API_KEY is not configured on the server.",
        )
    return AsyncOpenAI(
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        api_key=api_key,
    )


def _get_qdrant_client() -> QdrantClient:
    url = os.getenv("QDRANT_URL")
    api_key = os.getenv("QDRANT_API_KEY")
    if not url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="QDRANT_URL is not configured on the server.",
        )
    return QdrantClient(url=url, api_key=api_key)


COLLECTION_NAME = "docusaurus_docs"


# ── Models ─────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    skillLevel: str = "Beginner"


# ── Helpers ────────────────────────────────────────────────────────────────────

async def get_embeddings(text: str) -> list[float]:
    client = _get_openai_client()
    try:
        response = await client.embeddings.create(
            model="models/gemini-embedding-001",
            input=text,
        )
        return response.data[0].embedding
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Embedding error: {str(e)}",
        )


def _build_skill_instruction(skill_level: str) -> str:
    if skill_level == "Beginner":
        return (
            "The student is new to robotics and AI. "
            "Explain concepts in simple, friendly language — avoid unexplained jargon. "
            "Define every technical term when first used. "
            "Use step-by-step explanations, everyday analogies, and concrete examples. "
            "Focus on the 'what' and 'why' before the 'how'. "
            "Keep code examples minimal and well-commented."
        )
    elif skill_level == "Intermediate":
        return (
            "The student has some programming and robotics background. "
            "Explain with moderate technical depth, using standard ROS 2 / AI terminology. "
            "Briefly clarify non-obvious terms. "
            "Include practical examples, relevant CLI commands, and code snippets where helpful. "
            "Connect theory to real-world robotics applications and workflows."
        )
    elif skill_level == "Advanced":
        return (
            "The student has deep expertise in robotics, ROS 2, and machine learning. "
            "Use precise technical language — skip basic definitions. "
            "Focus on implementation trade-offs, architectural decisions, performance considerations, "
            "and cutting-edge research insights. "
            "Discuss specific API details, design patterns, and production-level considerations."
        )
    return "Explain clearly and concisely with examples."


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
async def health_check():
    return {"status": "ok", "service": "Physical AI RAG Chatbot"}


@app.post("/chat")
async def chat(request: ChatRequest):
    skill_instruction = _build_skill_instruction(request.skillLevel)

    # 1. Generate query embedding
    query_embedding = await get_embeddings(request.message)

    # 2. Search Qdrant for relevant context (graceful fallback if collection missing)
    context_text = ""
    try:
        qdrant = _get_qdrant_client()
        search_result = await run_in_threadpool(
            qdrant.query_points,
            collection_name=COLLECTION_NAME,
            query=query_embedding,
            limit=3,
        )
        context_docs = [
            hit.payload["text"] for hit in search_result.points if hit.payload and "text" in hit.payload
        ]
        context_text = "\n\n".join(context_docs)
    except HTTPException:
        raise
    except Exception as e:
        err = str(e)
        if "Not found" in err or "doesn't exist" in err or "404" in err:
            # Collection not yet ingested — fall back to general LLM knowledge
            context_text = ""
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Vector database error: {err}",
            )

    # 3. Generate answer with LLM
    openai_client = _get_openai_client()
    try:
        COURSE_CONTEXT = (
            "You are an expert AI tutor for the Physical AI & Humanoid Robotics course at Panaversity. "
            "The course covers four modules: "
            "(1) ROS 2 — nodes, topics, services, actions, and robot communication; "
            "(2) Digital Twin — Gazebo and Unity simulation for robot testing; "
            "(3) NVIDIA Isaac Sim — synthetic data generation and reinforcement learning; "
            "(4) Vision-Language-Action (VLA) models — frontier AI models for autonomous humanoid robots."
        )

        FORMATTING_RULES = (
            "FORMATTING RULES:\n"
            "- Use markdown: bold (**term**) for key concepts, `code` for commands/code, "
            "  ## headers to structure long answers.\n"
            "- For code examples, use fenced code blocks with the language tag (e.g. ```python).\n"
            "- Bullet points for lists; keep paragraphs short and scannable.\n"
            "- End with a one-sentence practical takeaway or next step when helpful."
        )

        if context_text:
            system_msg = (
                f"{COURSE_CONTEXT}\n\n"
                f"TEACHING STYLE: {skill_instruction}\n\n"
                f"{FORMATTING_RULES}\n\n"
                "GROUNDING RULE: Answer the student's question using ONLY the provided textbook excerpt below. "
                "If the excerpt does not contain enough information, say: "
                "'This specific detail isn't in the current chapter. "
                "Based on my general knowledge: …' and then answer from general knowledge."
            )
            user_msg = (
                f"## Textbook Excerpt\n\n{context_text}\n\n"
                f"---\n\n"
                f"## Student Question\n\n{request.message}"
            )
        else:
            system_msg = (
                f"{COURSE_CONTEXT}\n\n"
                f"TEACHING STYLE: {skill_instruction}\n\n"
                f"{FORMATTING_RULES}\n\n"
                "GROUNDING RULE: No textbook context is available for this query. "
                "Answer from your expert knowledge of robotics, ROS 2, NVIDIA Isaac Sim, and AI. "
                "Be accurate, pedagogically clear, and encourage the student."
            )
            user_msg = request.message

        response = await openai_client.chat.completions.create(
            model="models/gemini-2.5-flash-lite",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
        )
        return {"response": response.choices[0].message.content}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LLM error: {str(e)}",
        )
