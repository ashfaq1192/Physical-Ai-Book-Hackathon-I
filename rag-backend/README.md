---
title: Physical AI RAG Chatbot
emoji: 🤖
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
license: mit
---

# Physical AI RAG Chatbot Backend

FastAPI RAG backend for the Physical AI & Humanoid Robotics textbook.

## API Endpoints

- `GET /` — Health check
- `POST /chat` — Chat with the RAG assistant

## Environment Variables

Set these as Hugging Face Space secrets:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `QDRANT_URL` | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | Qdrant Cloud API key |

## Chat Request

```json
POST /chat
{
  "message": "What is ROS 2?",
  "skillLevel": "Beginner"
}
```

`skillLevel` options: `Beginner`, `Intermediate`, `Advanced`
