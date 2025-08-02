// Temporary user utilities for development
// In production, this would be replaced with actual Clerk user management

export const getTempUserId = (): string => {
  // For development, we'll use a localStorage-based user ID
  // This simulates having different users while bypassing authentication
  
  let userId = localStorage.getItem('temp-user-id');
  
  if (!userId) {
    // For testing, use a fixed user ID that matches our test data
    // In a real scenario, this would be generated uniquely per user
    userId = 'temp-user-1732876834892-abcd12345';
    localStorage.setItem('temp-user-id', userId);
  }
  
  console.log('Current temp user ID:', userId); // Debug log
  return userId;
};

export const getTempUserEmail = (): string => {
  // For development, use a consistent email based on the user ID
  const userId = getTempUserId();
  return `${userId}@example.com`;
};

// Utility to set a specific user ID (for testing)
export const setTempUserId = (userId: string): void => {
  localStorage.setItem('temp-user-id', userId);
};
