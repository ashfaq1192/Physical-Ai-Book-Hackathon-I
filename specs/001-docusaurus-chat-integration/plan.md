# Implementation Plan: Chat Integration

## Technical Implementation
1.  **Install Dependencies:** 
pm install lucide-react clsx tailwind-merge
2.  **Create UI Component:** src/components/ChatWidget.tsx (Floating button + Chat Window).
3.  **Global Mount:** Create src/theme/Root.tsx to wrap the Docusaurus app with the ChatWidget.
4.  **Backend Connection:** Use etch to POST to http://localhost:8000/chat.
