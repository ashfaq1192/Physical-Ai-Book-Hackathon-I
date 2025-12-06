# Tasks: Auth & Personalization

## Setup
- [ ] Install etter-auth in ook-app/ <!-- id: 1 -->

## Frontend Implementation
- [ ] Create ook-app/lib/auth-client.ts to initialize the auth client <!-- id: 2 -->
- [ ] Create ook-app/src/pages/signup.tsx with Email, Password, and Skill Level dropdown <!-- id: 3 -->
- [ ] Update ook-app/src/components/ChatWidget.tsx to send skillLevel in the fetch body <!-- id: 4 -->

## Backend Implementation
- [ ] Update ag-backend/main.py to accept skillLevel in ChatRequest <!-- id: 5 -->
- [ ] Update ag-backend/main.py system prompt to adjust complexity based on skillLevel <!-- id: 6 -->
