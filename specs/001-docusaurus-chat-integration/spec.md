# Feature Specification: Chat Interface Integration

**Goal:** Add a floating chat widget to the Docusaurus book that connects to our RAG backend.

## Requirements
1. **Frontend:** Create src/components/ChatWidget.tsx using lucide-react icons.
2. **Logic:** It must fetch data from http://localhost:8000/chat.
3. **Global:** Mount it in src/theme/Root.tsx so it floats on every page.
4. **UI:** A simple button that expands into a chat window (Input + Message History).
