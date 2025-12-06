# Tasks: RAG Backend Server

**Input**: Design documents from `/specs/001-rag-backend-server/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Tests**: The feature specification does not explicitly request tests, but the plan has confirmed `pytest` will be used for testing. Basic unit tests will be included in the polish phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `rag-backend/` at repository root
- Paths shown below assume `rag-backend/` as the project root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `rag-backend` directory at the project root.
- [x] T002 Create `.env.example` in `rag-backend/` with `GEMINI_API_KEY=YOUR_GEMINI_API_KEY`.
- [x] T003 Create `requirements.txt` in `rag-backend/` with `fastapi`, `uvicorn`, `openai`, `qdrant-client`, `python-dotenv`.
- [x] T004 Initialize Python virtual environment in `rag-backend/.venv/` and activate it.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Install dependencies from `rag-backend/requirements.txt` into the virtual environment.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Chat with RAG Backend (Priority: P1) 🎯 MVP

**Goal**: User can interact with the RAG backend via a chat endpoint.

**Independent Test**: Send a query to the `/chat` endpoint and verify a relevant response.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create `main.py` in `rag-backend/`.
- [x] T007 [US1] Initialize FastAPI app in `rag-backend/main.py`.
- [x] T008 [US1] Configure OpenAI client in `rag-backend/main.py` to use Gemini model with `base_url` and `api_key` from `.env`.
- [x] T009 [US1] Implement `POST /chat` endpoint in `rag-backend/main.py`.
- [x] T010 [US1] Add logic for document retrieval from Qdrant in `rag-backend/main.py` for the `/chat` endpoint.
- [x] T011 [US1] Add logic for response generation using the OpenAI client in `rag-backend/main.py` for the `/chat` endpoint.
- [x] T012 [US1] Implement basic error handling for `GEMINI_API_KEY` and Qdrant connection in `rag-backend/main.py`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Ingest Documentation (Priority: P2)

**Goal**: An administrator or developer can index `book-app/docs` content into Qdrant.

**Independent Test**: Run the ingestion script and verify documents are stored in Qdrant.

### Implementation for User Story 2

- [x] T013 [P] [US2] Create `ingest.py` in `rag-backend/`.
- [x] T014 [US2] Implement logic to read markdown files from `book-app/docs` in `rag-backend/ingest.py`.
- [x] T015 [US2] Initialize Qdrant client in `rag-backend/ingest.py`.
- [x] T016 [US2] Implement logic to embed documents and index them into Qdrant in `rag-backend/ingest.py`.
- [x] T017 [US2] Add error handling for file reading and Qdrant operations in `rag-backend/ingest.py`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 [P] Add unit tests for chat endpoint logic in `rag-backend/tests/test_main.py` using `pytest`.
- [x] T019 [P] Add unit tests for document processing and Qdrant interaction in `rag-backend/tests/test_ingest.py` using `pytest`.
- [x] T020 Update `.gitignore` at the project root to include `rag-backend/.venv/`, `__pycache__/` in `rag-backend/`, and any other generated files in `rag-backend/`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on User Story 1 for its core functionality, but conceptually relies on a working Qdrant setup which may be initiated by US1 or a separate Qdrant service.

### Within Each User Story

- Models before services (N/A for this feature)
- Services before endpoints (Implicitly followed for chat endpoint)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (N/A for this feature)
- All Foundational tasks marked [P] can run in parallel (N/A for this feature)
- Once Foundational phase completes, user stories can conceptually start in parallel, but for this feature, they are sequential due to direct task dependencies.
- Tasks within a story marked [P] can run in parallel (T006, T013, T018, T019)
- Different user stories can be worked on in parallel by different team members (Conceptually possible, but tasks are structured sequentially here)

---

## Parallel Example: User Story 1

```bash
# Launch creation of main.py:
Task: "Create `main.py` in `rag-backend/`."

# Launch creation of ingest.py for User Story 2 (can run in parallel):
Task: "Create `ingest.py` in `rag-backend/`."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (for polish phase tests)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
