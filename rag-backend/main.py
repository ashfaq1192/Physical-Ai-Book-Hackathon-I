import os
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from openai import AsyncOpenAI, APIConnectionError, RateLimitError
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool
from qdrant_client import QdrantClient, models
from qdrant_client.http.exceptions import UnexpectedResponse
from dotenv import load_dotenv

# Load env vars first
load_dotenv()

app = FastAPI()

# Mount static files for the chat interface
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="rag-backend/templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Setup OpenAI (Gemini) Client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="GEMINI_API_KEY is not set in environment variables."
    )

openai_client = AsyncOpenAI(
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    api_key=GEMINI_API_KEY,
)

# 2. Setup Qdrant Client
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not QDRANT_URL:
    print("❌ Warning: QDRANT_URL not found. Ensure .env is loaded.")

qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

COLLECTION_NAME = "docusaurus_docs"

class ChatRequest(BaseModel):
    message: str
    skillLevel: str = "Beginner" # Default to Beginner if not provided

async def get_embeddings(text: str):
    print(f"DEBUG: Generating embedding for text: {text[:50]}...")
    try:
        response = await openai_client.embeddings.create(
            model="text-embedding-004",
            input=text,
            dimensions=768 # Force 768 to match Qdrant config
        )
        print("DEBUG: Embedding generated successfully.")
        return response.data[0].embedding
    except Exception as e:
        print(f"ERROR: Error generating embedding: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Embedding error: {str(e)}"
        )

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/chat")
async def chat(request: ChatRequest):
    print(f"Query: {request.message}")
    print(f"Skill Level: {request.skillLevel}")

    # 1. Generate Embedding
    print("DEBUG: Calling get_embeddings...")
    query_embedding = await get_embeddings(request.message)
    print("DEBUG: get_embeddings call completed.")

    try:
        # 2. Search Qdrant
        print("DEBUG: Searching Qdrant...")
        search_result = await run_in_threadpool(qdrant_client.search,
                                                collection_name=COLLECTION_NAME,
                                                query_vector=query_embedding,
                                                limit=3)
        print("DEBUG: Qdrant search completed.")

        # Extract text from the payload
        context_docs = [hit.payload["text"] for hit in search_result if hit.payload]

        if not context_docs:
            print("⚠️ No relevant context found in Qdrant. Providing a general, skill-level-appropriate introduction.")
            context_text = "No specific context found in the textbook."
            print(f"DEBUG: Context text (no docs): {context_text}")
        else:
            context_text = "\n\n".join(context_docs)
            print(f"DEBUG: Context text (from Qdrant, first 200 chars): {context_text[:200]}...")

    except Exception as e:
        print(f"🔥 ERROR: Qdrant Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

    # 3. Generate Answer
    print("DEBUG: Generating answer with OpenAI (Gemini)...")
    try:
        base_system_message = "You are a helpful expert teacher for a Robotics course."

        skill_level_instructions = ""
        if request.skillLevel == "Beginner":
            skill_level_instructions = "Explain concepts in a simple and clear manner, avoiding jargon. Provide basic definitions and step-by-step explanations."
        elif request.skillLevel == "Intermediate":
            skill_level_instructions = "Explain concepts with moderate detail, using some technical terms but clarifying them. Provide practical examples."
        elif request.skillLevel == "Advanced":
            skill_level_instructions = "Explain concepts with high technical detail and assume familiarity with advanced terminology. Focus on nuances and complex interactions."

        system_prompt_suffix = ""
        user_prompt_content = ""

        if not context_docs:
            print("⚠️ No relevant context found in Qdrant. Providing a general, skill-level-appropriate introduction.")
            if request.skillLevel == "Beginner":
                system_prompt_suffix = f" {skill_level_instructions} Since no specific context was found, provide a warm welcome to the Robotics course and ask what foundational concepts or general topics from the textbook the user is curious about."
            elif request.skillLevel == "Intermediate":
                system_prompt_suffix = f" {skill_level_instructions} Since no specific context was found, offer an engaging welcome to the course, mentioning key areas like VLA models, and invite the user to explore specific technologies or topics within the textbook."
            elif request.skillLevel == "Advanced":
                system_prompt_suffix = f" {skill_level_instructions} Since no specific context was found, provide a concise, high-level overview of the advanced topics covered in this course and invite the user to delve into advanced research questions, architectural design choices, or complex implementation details."
            else: # Fallback
                system_prompt_suffix = f" {skill_level_instructions} Since no specific context was found, provide a general welcome related to the course/module, and ask what the user would like to learn about. Do NOT mention that no context was found."
            user_prompt_content = f"The user said: {request.message}"
        else:
            system_prompt_suffix = f" {skill_level_instructions} Answer the user's question clearly based ONLY on the provided context below. If the answer isn't in the context, say so."
            user_prompt_content = f"Context:\n{context_text}\n\nQuestion: {request.message}"

        print(f"DEBUG: System prompt suffix: {system_prompt_suffix[:200]}...")
        print(f"DEBUG: User prompt content: {user_prompt_content[:200]}...")
        response = await openai_client.chat.completions.create(
            model="gemini-2.5-flash", # Use the fast, free model
            messages=[
                {
                    "role": "system",
                    "content": f"{base_system_message} {system_prompt_suffix}"
                },
                {
                    "role": "user",
                    "content": user_prompt_content
                }
            ]
        )
        answer = response.choices[0].message.content
        return {"response": answer}

    except Exception as e:
        print(f"🔥 Gemini Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LLM generation error: {str(e)}"
        )