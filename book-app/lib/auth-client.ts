import { createAuthClient } from 'better-auth/client';

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:8000',
});

export const { signIn, signUp, signOut, useSession } = authClient;
export default authClient;
