import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from openai import AsyncOpenAI, APIConnectionError, RateLimitError
from pydantic import BaseModel
from qdrant_client import QdrantClient, models
from qdrant_client.http.exceptions import UnexpectedResponse

load_dotenv()

app = FastAPI()

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

# Initialize Qdrant client
# ensure os is imported: import os
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
) # Initialize in-memory Qdrant client for now

class ChatRequest(BaseModel):
    message: str

async def get_embeddings(text: str):
    try:
        response = await openai_client.embeddings.create(
            model="text-embedding-004",  # Or another appropriate embedding model
            input=text
        )
        return response.data[0].embedding
    except (APIConnectionError, RateLimitError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OpenAI API error during embedding generation: {e}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during embedding generation: {e}"
        )

@app.get("/")
async def read_root():
    return {"message": "RAG Backend Server is running!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    query_embedding = await get_embeddings(request.message)

    try:
        # Search Qdrant for relevant documents (assuming collection 'my_documents' exists)
        search_result = qdrant_client.search(
            collection_name="my_documents", # This collection name needs to be consistent with ingest.py
            query_vector=query_embedding,
            limit=3 # Retrieve top 3 relevant documents
        )
    except UnexpectedResponse as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Qdrant client error during document retrieval: {e}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during Qdrant document retrieval: {e}"
        )

    context_docs = [hit.payload["text"] for hit in search_result.hits if hit.payload and "text" in hit.payload]

    # Combine context documents and user query for response generation
    prompt = "Based on the following context, answer the question:\n\n"
    for doc in context_docs:
        prompt += f"Context: {doc}\n\n"
    prompt += f"Question: {request.message}\n"
    prompt += "Answer:"

    try:
        response = await openai_client.chat.completions.create(
            model="gemini-pro",  # Or another appropriate chat model
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
    except (APIConnectionError, RateLimitError) as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OpenAI API error during response generation: {e}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during response generation: {e}"
        )

    return {"response": response.choices[0].message.content, "query": request.message, "context_docs": context_docs}
