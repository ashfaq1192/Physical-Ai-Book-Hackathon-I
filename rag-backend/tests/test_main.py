import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_read_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "RAG Backend Server is running!"}

# We'll add more comprehensive tests for /chat endpoint after ensuring basic setup works.