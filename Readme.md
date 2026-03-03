# Physical AI & Humanoid Robotics Textbook

An AI-native, interactive textbook for the Physical AI & Humanoid Robotics course by [Panaversity](https://panaversity.org).

## Live Demo

- **Textbook (Vercel):** https://physical-ai-textbook.vercel.app
- **RAG Chatbot API (HF Spaces):** https://ashfaq1192-physica-ai-chatbot.hf.space

## Project Structure

```
book-app-frontend/
├── book-app/          # Docusaurus textbook (deployed to Vercel)
│   ├── docs/          # Chapter content (Modules 1–4)
│   ├── src/           # React components (ChatWidget, signup page)
│   └── lib/           # Auth client
└── rag-backend/       # FastAPI RAG chatbot (deployed to HF Spaces)
    ├── main.py        # FastAPI app
    ├── ingest.py      # Qdrant ingestion script
    ├── Dockerfile     # HF Spaces deployment
    └── requirements.txt
```

## Modules

| Module | Topic |
|--------|-------|
| Module 1 | Robotic Nervous System (ROS 2) |
| Module 2 | The Digital Twin (Gazebo & Unity) |
| Module 3 | AI-Robot Brain (NVIDIA Isaac Sim) |
| Module 4 | Vision-Language-Action (VLA) Models |

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

## Tech Stack

- **Frontend:** Docusaurus 3, React, TypeScript
- **Backend:** FastAPI, Python, Qdrant, Gemini API
- **Auth:** better-auth
- **Deployment:** Vercel (frontend), Hugging Face Spaces (backend)
