import pytest
from unittest.mock import AsyncMock, patch
import os

# Assuming ingest.py is in the same directory as test_ingest.py for relative import
# In a real project, you'd configure PYTHONPATH or use proper package structure
from ingest import get_markdown_files, read_markdown_content, load_documents, index_documents, COLLECTION_NAME, qdrant_client
from qdrant_client.http.models import Distance, VectorParams

# Mock environment variables if needed for tests
@pytest.fixture(autouse=True)
def mock_env_vars(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "dummy_api_key")

@pytest.fixture(name="docs_dir")
def docs_dir_fixture(tmp_path):
    # Create a dummy docs directory with some markdown files
    (tmp_path / "book-app" / "docs").mkdir(parents=True, exist_ok=True)
    (tmp_path / "book-app" / "docs" / "intro.md").write_text("# Introduction\nThis is an intro.")
    (tmp_path / "book-app" / "docs" / "tutorial" / "step1.md").mkdir(parents=True, exist_ok=True)
    (tmp_path / "book-app" / "docs" / "tutorial" / "step1.md").write_text("# Step 1\nDetails for step 1.")
    return str(tmp_path / "book-app" / "docs")

def test_get_markdown_files(docs_dir):
    files = get_markdown_files(docs_dir)
    assert len(files) == 2
    assert any("intro.md" in f for f in files)
    assert any("step1.md" in f for f in files)

def test_read_markdown_content(docs_dir):
    file_path = os.path.join(docs_dir, "intro.md")
    content = read_markdown_content(file_path)
    assert content["file_path"] == file_path
    assert "# Introduction" in content["content"]

def test_load_documents(docs_dir):
    documents = load_documents(docs_dir)
    assert len(documents) == 2
    assert all("file_path" in doc and "content" in doc for doc in documents)

@pytest.mark.asyncio
async def test_index_documents():
    mock_documents = [
        {"file_path": "/path/to/doc1.md", "content": "Content of document 1"},
        {"file_path": "/path/to/doc2.md", "content": "Content of document 2"},
    ]

    with patch('ingest.openai_client.embeddings.create', new_callable=AsyncMock) as mock_create_embeddings:
        mock_create_embeddings.return_value.data = [AsyncMock(embedding=[0.1]*768)]

        # Patch qdrant_client methods
        with patch.object(qdrant_client, 'recreate_collection') as mock_recreate,
             patch.object(qdrant_client, 'upsert') as mock_upsert:

            await index_documents(mock_documents)

            mock_recreate.assert_called_once_with(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=768, distance=Distance.COSINE)
            )
            mock_upsert.assert_called_once()
            args, kwargs = mock_upsert.call_args
            assert kwargs['collection_name'] == COLLECTION_NAME
            assert len(kwargs['points']) == len(mock_documents)

# Additional tests for error handling can be added here