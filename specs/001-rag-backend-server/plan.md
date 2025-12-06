## Implementation Plan: RAG Backend Server

**Branch**: `001-rag-backend-server` | **Date**: 2025-11-30 | **Spec**: specs/001-rag-backend-server/spec.md
**Input**: Feature specification from `/specs/001-rag-backend-server/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a RAG Backend server using FastAPI, OpenAI client configured for Gemini, and Qdrant for document indexing from `book-app/docs`.

## Technical Context

**Language/Version**: Python 3.12
**Primary Dependencies**: FastAPI, Uvicorn, OpenAI, Qdrant-client, python-dotenv
**Storage**: Qdrant (Vector DB)
**Testing**: pytest
**Target Platform**: Linux server
**Project Type**: Single project
**Performance Goals**: FCP < 1.5s, LCP < 2.5s
**Constraints**: Requires `GEMINI_API_KEY` in `.env`
**Scale/Scope**: RAG for the "Physical AI & Humanoid Robotics Textbook" content

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Spec-Driven First**: PASS - The current task is driven by a clear specification.
- **II. Educational Tone**: N/A - This principle is about content, not backend implementation.
- **III. Matrix-Style Skills**: PASS - The backend will provide services consumed by agents/skills.
- **Technical Architecture**: PASS - The plan aligns with the defined technical architecture for the Agent Backend (FastAPI, OpenAI Agents SDK) and Knowledge Base (Qdrant).
- **Authentication**: N/A - Not explicitly part of this feature, but noted for future consideration.

## Project Structure

### Documentation (this feature)

```text
specs/001-rag-backend-server/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
rag-backend/
├── .env.example
├── main.py
├── ingest.py
├── requirements.txt
└── .venv/ (or venv/)
```

**Structure Decision**: The RAG backend will reside in a new `rag-backend/` directory at the project root, containing `main.py` for the FastAPI app, `ingest.py` for document indexing, `requirements.txt` for dependencies, and a `.env.example` for environment variables.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
|           |            |                                     |
