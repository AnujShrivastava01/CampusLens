import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth({
  // Optional: Add any Clerk options here
});

export const getAuthUser = (req) => {
  return req.auth;
};
