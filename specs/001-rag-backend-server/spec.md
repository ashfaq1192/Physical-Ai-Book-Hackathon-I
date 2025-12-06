## Feature Specification: RAG Backend Server

**Feature Branch**: `001-rag-backend-server`
**Created**: 2025-11-30
**Status**: Draft
**Input**: User description: "Create the RAG Backend server.
1. Create a folder named `rag-backend`.
2. Initialize a Python environment with `requirements.txt` containing: `fastapi`, `uvicorn`, `openai`, `qdrant-client`, `python-dotenv`.
3. Create `main.py` with a FastAPI app.
4. Implement a `POST /chat` endpoint.
5. IMPORTANT: Configure the OpenAI client in `main.py` to use `base_url=https://generativelanguage.googleapis.com/v1beta/openai/` and `api_key=GEMINI_API_KEY` from .env, so we can use the free Gemini model for the chatbot.
6. Create an `ingest.py` script to index the `book-app/docs` files into Qdrant."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chat with RAG Backend (Priority: P1)

User wants to interact with the RAG backend to get answers based on indexed documentation.

**Why this priority**: Core functionality of the RAG system, enabling direct user interaction.

**Independent Test**: Can be fully tested by sending a query to the chat endpoint and verifying the relevance of the response.

**Acceptance Scenarios**:

1. **Given** the RAG backend is running and `book-app/docs` are indexed, **When** a user sends a query to the `/chat` endpoint, **Then** the system responds with a relevant answer based on the indexed documents.
2. **Given** the RAG backend is running and `book-app/docs` are indexed, **When** a user sends a query that is not covered by the indexed documents, **Then** the system responds with an appropriate fallback or indicates it cannot answer.

---

### User Story 2 - Ingest Documentation (Priority: P2)

An administrator or developer wants to index the `book-app/docs` content into the Qdrant vector store.

**Why this priority**: Essential for populating the knowledge base that the RAG system will use.

**Independent Test**: Can be fully tested by running the ingestion script and verifying that documents are stored in Qdrant.

**Acceptance Scenarios**:

1. **Given** `book-app/docs` contains markdown files, **When** the `ingest.py` script is executed, **Then** the content of the markdown files is successfully indexed into Qdrant.
2. **Given** `book-app/docs` is empty or contains no relevant files, **When** the `ingest.py` script is executed, **Then** the script completes without error, indicating no documents were indexed.

---

### Edge Cases

- What happens if the `GEMINI_API_KEY` is missing or invalid in the `.env`?
- How does the system handle large documents during ingestion?
- What is the response if the Qdrant service is unavailable during chat or ingestion?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a FastAPI application as the RAG backend.
- **FR-002**: The RAG backend MUST expose a `POST /chat` endpoint to handle user queries.
- **FR-003**: The `POST /chat` endpoint MUST use the OpenAI client configured with `base_url=https://generativelanguage.googleapis.com/v1beta/openai/` and `api_key=GEMINI_API_KEY` from `.env`.
- **FR-004**: The system MUST include a `requirements.txt` file with `fastapi`, `uvicorn`, `openai`, `qdrant-client`, `python-dotenv`.
- **FR-005**: The system MUST include an `ingest.py` script to index files from `book-app/docs` into Qdrant.

### Key Entities *(include if feature involves data)*

- **User Query**: The text input from the user for the chat endpoint.
- **Document**: A piece of text from `book-app/docs` indexed in Qdrant.
- **Response**: The generated answer from the RAG backend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The RAG backend server successfully starts and is accessible.
- **SC-002**: Users receive relevant answers to their queries via the `/chat` endpoint based on the indexed documentation.
- **SC-003**: The `ingest.py` script successfully processes and indexes all specified documents from `book-app/docs` into Qdrant.
- **SC-004**: The RAG backend correctly uses the Gemini model via the configured OpenAI client.
