"""
Ingest Docusaurus markdown docs into Qdrant.

Usage (from the repo root):
    python rag-backend/ingest.py
"""
import os
import asyncio
import time
from pathlib import Path
from dotenv import load_dotenv
from openai import AsyncOpenAI
from qdrant_client import QdrantClient, models

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set. Please create a .env file.")

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
if not QDRANT_URL:
    raise ValueError("QDRANT_URL is not set. Please create a .env file.")

openai_client = AsyncOpenAI(
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    api_key=GEMINI_API_KEY,
)

qdrant_client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

COLLECTION_NAME = "docusaurus_docs"
VECTOR_SIZE = 3072  # gemini-embedding-001 default output dimension


async def get_embedding(text: str) -> list[float]:
    """Generate a 3072-dimensional embedding for text."""
    response = await openai_client.embeddings.create(
        model="models/gemini-embedding-001",
        input=text,
    )
    return response.data[0].embedding


def get_markdown_files(docs_path: str) -> list[str]:
    """Recursively collect all .md files under docs_path."""
    files = []
    for root, _, filenames in os.walk(docs_path):
        for filename in filenames:
            if filename.endswith(".md") or filename.endswith(".mdx"):
                files.append(str(Path(root) / filename))
    return files


def read_document(file_path: str) -> dict:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"file_path": file_path, "content": content}
    except Exception as e:
        print(f"  ⚠️  Could not read {file_path}: {e}")
        return {"file_path": file_path, "content": ""}


async def rebuild_collection(documents: list[dict]):
    """Drop and recreate the Qdrant collection, then upsert all documents."""
    # Drop existing collection (ignore error if it doesn't exist)
    try:
        qdrant_client.delete_collection(COLLECTION_NAME)
        print(f"  Dropped existing collection '{COLLECTION_NAME}'.")
    except Exception:
        pass

    qdrant_client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=models.VectorParams(
            size=VECTOR_SIZE, distance=models.Distance.COSINE
        ),
    )
    print(f"  Created collection '{COLLECTION_NAME}' (dim={VECTOR_SIZE}, cosine).")

    points = []
    for i, doc in enumerate(documents, 1):
        if not doc["content"].strip():
            continue
        print(f"  [{i}/{len(documents)}] Embedding: {Path(doc['file_path']).name} …", end=" ")
        try:
            # Rate-limit guard: Gemini free tier allows ~60 RPM
            await asyncio.sleep(1.1)
            embedding = await get_embedding(doc["content"])
            point_id = abs(hash(doc["file_path"])) % (2 ** 31)
            points.append(
                models.PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload={
                        "file_path": doc["file_path"],
                        "text": doc["content"],
                    },
                )
            )
            print("✓")
        except Exception as e:
            print(f"✗  ({e})")

    if points:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            wait=True,
            points=points,
        )
        print(f"\n✅ Indexed {len(points)} documents into '{COLLECTION_NAME}'.")
    else:
        print("⚠️  No documents were indexed.")


if __name__ == "__main__":
    docs_dir = str(Path(__file__).parent.parent / "book-app" / "docs")
    if not os.path.exists(docs_dir):
        print(f"❌ Docs directory not found: {docs_dir}")
        exit(1)

    files = get_markdown_files(docs_dir)
    print(f"📂 Found {len(files)} markdown files in {docs_dir}")

    documents = [read_document(f) for f in files]
    documents = [d for d in documents if d["content"].strip()]
    print(f"📄 Loaded {len(documents)} non-empty documents.")

    asyncio.run(rebuild_collection(documents))
