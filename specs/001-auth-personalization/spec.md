Update RAG Backend for Personalization.
1. Modify `ChatRequest` in `rag-backend/main.py` to accept an optional `skillLevel` string.
2. Update the system prompt in `main.py` to dynamically change based on `skillLevel`.
   - If 'Beginner': 'Explain simply, use analogies.'
   - If 'Advanced': 'Be technical, use jargon, assume prior knowledge.'
3. Ensure `ChatWidget.tsx` sends the stored `user_skill_level` in the API request.