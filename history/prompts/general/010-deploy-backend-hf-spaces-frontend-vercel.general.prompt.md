---
id: 010
title: Deploy backend HF Spaces frontend Vercel
stage: general
date: 2026-03-03
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: ashfaq1192
command: deploy to HuggingFace Spaces and Vercel
labels: ["deployment","huggingface","vercel","fastapi","docusaurus","production"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - rag-backend/Dockerfile
  - rag-backend/main.py
  - rag-backend/requirements.txt
  - rag-backend/README.md
  - vercel.json
tests:
  - HF Space health check: https://ashfaq1192-physica-ai-chatbot.hf.space
  - Vercel production URL: https://physical-ai-textbook-blond-delta.vercel.app
---

## Prompt

Our application/book is running fantastically in the localhost but now we need to deploy on cloud. For backend we will deploy on hugging face this is our token with write access: [HF_TOKEN_REDACTED] and for frontend we will deploy on vercel: https://vercel.com/ashfaq1192s-projects

## Response snapshot

Full cloud deployment executed:

**Backend → HuggingFace Spaces:**
- Verified token (user: ashfaq1192), Space `ashfaq1192/physica-ai-chatbot` already existed with Docker SDK
- Uploaded `rag-backend/` (excluding .env, __pycache__, tests) via `huggingface_hub.upload_folder`
- Set 3 secrets via `api.add_space_secret`: GEMINI_API_KEY, QDRANT_URL, QDRANT_API_KEY
- Space stage confirmed: RUNNING
- API live at: https://ashfaq1192-physica-ai-chatbot.hf.space

**Frontend → Vercel:**
- Vercel CLI (v50.20.0) was already installed and authenticated as ashfaq1192
- Deployed with `vercel --prod --yes --name physical-ai-textbook`
- GitHub repo connected: https://github.com/ashfaq1192/Physical-Ai-Book-Hackathon-I
- Docusaurus build succeeded (Client + Server compiled)
- Production URL: https://physical-ai-textbook-blond-delta.vercel.app

ChatWidget already hardcodes HF Space URL for non-localhost environments — no code changes needed.

## Outcome

- ✅ Impact: Full production deployment — both backend API and frontend textbook live
- 🧪 Tests: HF Space RUNNING status confirmed; Vercel build succeeded with 0 errors
- 📁 Files: No source files modified; .vercel/ dir created and auto-added to .gitignore
- 🔁 Next prompts: Rotate HF token; add custom domain to Vercel; monitor Space cold-start times
- 🧠 Reflection: Smooth deployment — all configs (Dockerfile port 7860, vercel.json, ChatWidget URL detection) were already production-ready

## Evaluation notes (flywheel)

- Failure modes observed: Initial Vercel deploy failed due to uppercase chars in directory name — fixed with --name flag
- Graders run and results (PASS/FAIL): HF Space stage=RUNNING (PASS); Vercel build=succeeded (PASS)
- Prompt variant (if applicable): none
- Next experiment: Add GitHub Actions for auto-sync of rag-backend/ to HF Space on push
