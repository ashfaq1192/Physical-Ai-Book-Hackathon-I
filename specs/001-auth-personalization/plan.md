# Implementation Plan: Auth & Personalization

## Technical Implementation
1.  **Install Dependencies:** 
pm install better-auth in ook-app/.
2.  **Create Auth Client:** Create ook-app/lib/auth-client.ts to initialize the Better-Auth client.
3.  **Create Signup Page:** Create ook-app/src/pages/signup.tsx with a form for Email, Password, and Skill Level.
4.  **Update ChatWidget:** Modify ChatWidget.tsx to read the user's session and send skillLevel to the backend.
5.  **Backend Update:** Modify ag-backend/main.py to accept skillLevel in the ChatRequest model and adjust the system prompt accordingly.
