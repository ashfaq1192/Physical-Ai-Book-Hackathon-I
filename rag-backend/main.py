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
            model="text-embedding-004",
            input=text,
            dimensions=768,
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
            "Explain concepts in simple, clear language. Avoid jargon; "
            "define every technical term. Use step-by-step explanations and analogies."
        )
    elif skill_level == "Intermediate":
        return (
            "Explain with moderate technical detail. Use standard terminology but "
            "clarify less-common terms. Provide practical examples and code snippets where helpful."
        )
    elif skill_level == "Advanced":
        return (
            "Assume deep familiarity with robotics and AI. Use precise technical language, "
            "focus on implementation nuances, trade-offs, and cutting-edge research."
        )
    return "Explain clearly and concisely."


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
async def health_check():
    return {"status": "ok", "service": "Physical AI RAG Chatbot"}


@app.post("/chat")
async def chat(request: ChatRequest):
    skill_instruction = _build_skill_instruction(request.skillLevel)

    # 1. Generate query embedding
    query_embedding = await get_embeddings(request.message)

    # 2. Search Qdrant for relevant context
    context_text = ""
    try:
        qdrant = _get_qdrant_client()
        search_result = await run_in_threadpool(
            qdrant.search,
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=3,
        )
        context_docs = [
            hit.payload["text"] for hit in search_result if hit.payload and "text" in hit.payload
        ]
        context_text = "\n\n".join(context_docs)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vector database error: {str(e)}",
        )

    # 3. Generate answer with LLM
    openai_client = _get_openai_client()
    try:
        if context_text:
            system_msg = (
                f"You are an expert teacher for a Physical AI & Humanoid Robotics course. "
                f"{skill_instruction} "
                "Answer the user's question using ONLY the provided textbook context. "
                "If the answer is not in the context, say so honestly."
            )
            user_msg = f"Context:\n{context_text}\n\nQuestion: {request.message}"
        else:
            system_msg = (
                f"You are an expert teacher for a Physical AI & Humanoid Robotics course. "
                f"{skill_instruction} "
                "Welcome the student and answer their question based on your general knowledge "
                "of robotics, ROS 2, NVIDIA Isaac, and AI."
            )
            user_msg = request.message

        response = await openai_client.chat.completions.create(
            model="gemini-2.0-flash",
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
