import os
import asyncio
import time
from pathlib import Path
from dotenv import load_dotenv
from openai import AsyncOpenAI, APIConnectionError, RateLimitError
from qdrant_client import QdrantClient, models
from qdrant_client.http.exceptions import UnexpectedResponse

load_dotenv()

# Initialize OpenAI client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in environment variables.")

openai_client = AsyncOpenAI(
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    api_key=GEMINI_API_KEY,
)

# Initialize Qdrant client
# Initialize Qdrant client (Corrected for Cloud)
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
) 
COLLECTION_NAME = "docusaurus_docs" # This must match the collection name in main.py

async def get_embeddings(text: str):
    try:
        response = await openai_client.embeddings.create(
            model="text-embedding-004",
            input=text
        )
        return response.data[0].embedding
    except (APIConnectionError, RateLimitError) as e:
        print(f"OpenAI API error during embedding generation: {e}")
        raise
    except Exception as e:
        print(f"An unexpected error occurred during embedding generation: {e}")
        raise

def get_markdown_files(docs_path: str):
    markdown_files = []
    try:
        for root, _, files in os.walk(docs_path):
            for file in files:
                if file.endswith(".md"):
                    file_path = Path(root) / file
                    markdown_files.append(str(file_path))
    except Exception as e:
        print(f"Error walking through documentation directory: {e}")
        raise
    return markdown_files

def read_markdown_content(file_path: str):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"file_path": file_path, "content": content}
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return {"file_path": file_path, "content": ""}
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        raise

def load_documents(docs_dir: str):
    files = get_markdown_files(docs_dir)
    documents = [read_markdown_content(file) for file in files]
    return documents

async def index_documents(documents: list[dict]):
    # Determine the vector size from the embedding model. This assumes a consistent embedding size.
    # For 'embedding-001', a common size is 768 or 1536. We'll use a placeholder and ideally
    # get this dynamically or from configuration. For this example, let's assume 768.
    vector_size = 768 # Placeholder: replace with actual embedding dimension

    try:
        # Create collection if it doesn't exist
        qdrant_client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=vector_size, distance=models.Distance.COSINE),
        )
    except UnexpectedResponse as e:
        print(f"Qdrant client error during collection creation: {e}")
        raise
    except Exception as e:
        print(f"An unexpected error occurred during Qdrant collection creation: {e}")
        raise

    points = []
    for doc in documents:
        try:
            # Generate embedding for the document content
            await asyncio.sleep(2)
            embedding = await get_embeddings(doc["content"])
            points.append(
                models.PointStruct(
                    id=hash(doc["file_path"]) % (2**63 - 1), # Simple hash for ID
                    vector=embedding,
                    payload={"file_path": doc["file_path"], "text": doc["content"]}
                )
            )
        except Exception as e:
            print(f"Error processing document {doc['file_path']}: {e}. Skipping this document.")
            continue

    try:
        # Batch insert points
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            wait=True,
            points=points
        )
        print(f"Indexed {len(points)} documents into Qdrant collection '{COLLECTION_NAME}'.")
    except UnexpectedResponse as e:
        print(f"Qdrant client error during document upsertion: {e}")
        raise
    except Exception as e:
        print(f"An unexpected error occurred during Qdrant document upsertion: {e}")
        raise


if __name__ == "__main__":
    DOCS_DIR = os.path.join(os.getcwd(), "book-app", "docs")
    if os.path.exists(DOCS_DIR):
        docs = load_documents(DOCS_DIR)
        print(f"Loaded {len(docs)} documents.")
        # Index documents
        asyncio.run(index_documents(docs))
    else:
        print(f"Documentation directory not found: {DOCS_DIR}")