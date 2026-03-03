# Physical AI & Humanoid Robotics Textbook

An AI-native, interactive textbook for the Physical AI & Humanoid Robotics course by [Panaversity](https://panaversity.org).

## Demo Video

[![Physical AI & Humanoid Robotics Textbook — Hackathon Demo](https://img.youtube.com/vi/L_QQnkwb01c/maxresdefault.jpg)](https://youtu.be/L_QQnkwb01c)

## Live Deployment

| Service | URL | Status |
|---------|-----|--------|
| **Textbook (Vercel)** | https://physical-ai-textbook-blond-delta.vercel.app | ✅ Live |
| **RAG Chatbot API (HF Spaces)** | https://ashfaq1192-physica-ai-chatbot-c3cd96c.hf.space | ✅ Live |
| **HF Space Dashboard** | https://huggingface.co/spaces/ashfaq1192/physica-ai-chatbot | ✅ Running |
| **Vercel Dashboard** | https://vercel.com/ashfaq1192s-projects/physical-ai-textbook | ✅ Active |

## Completion Status

### Content

| Module | Topic | Status |
|--------|-------|--------|
| Module 1 | Robotic Nervous System (ROS 2) — Nodes, Topics, Services, Actions | ✅ Complete |
| Module 2 | The Digital Twin (Gazebo & Unity) | ✅ Complete |
| Module 3 | AI-Robot Brain (NVIDIA Isaac Sim) | ✅ Complete |
| Module 4 | Vision-Language-Action (VLA) Models | ✅ Complete |

### Features

| Feature | Status |
|---------|--------|
| Docusaurus textbook with 4 modules | ✅ Done |
| AI Tutor chatbot (floating widget) | ✅ Done |
| Skill-level aware responses (Beginner / Intermediate / Advanced) | ✅ Done |
| RAG pipeline (Gemini embeddings → Qdrant → Gemini LLM) | ✅ Done |
| Graceful fallback to LLM-only when Qdrant unavailable | ✅ Done |
| User signup & login (localStorage-based) | ✅ Done |
| Skill level persisted across sessions | ✅ Done |
| Dark / light mode | ✅ Done |
| Production deployment — Vercel + HF Spaces | ✅ Done |

## Project Structure

```
Physical-Ai-Book-Hackathon-I/
├── book-app/          # Docusaurus textbook (deployed to Vercel)
│   ├── docs/          # Chapter content (Modules 1–4)
│   ├── src/           # React components (ChatWidget, login, signup)
│   └── lib/           # Auth client
└── rag-backend/       # FastAPI RAG chatbot (deployed to HF Spaces)
    ├── main.py        # FastAPI app with /chat endpoint
    ├── ingest.py      # Qdrant ingestion script
    ├── Dockerfile     # HF Spaces Docker deployment
    └── requirements.txt
```

## Local Development

### Frontend (Docusaurus)

```bash
cd book-app
npm install
npm start
```

Open http://localhost:3000

### Backend (FastAPI)

```bash
cd rag-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn main:app --reload --port 8000
```

### Ingest docs into Qdrant

```bash
cd rag-backend
python ingest.py
```

## Environment Variables (backend)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key (aistudio.google.com) |
| `QDRANT_URL` | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | Qdrant Cloud API key |

Set these as **HF Space secrets** in the Space settings — never commit them to the repo.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Docusaurus 3, React 19, TypeScript |
| **Backend** | FastAPI, Python 3.11, Uvicorn |
| **Vector DB** | Qdrant Cloud (3072-dim Gemini embeddings) |
| **LLM** | Google Gemini 2.5 Flash Lite (via OpenAI-compatible API) |
| **Auth** | localStorage-based (signup stores email + skill level) |
| **Frontend Deploy** | Vercel (auto-deploys on push to `main`) |
| **Backend Deploy** | Hugging Face Spaces — Docker SDK |
