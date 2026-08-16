/**
 * CampusCare Rate Limit Configuration
 * All thresholds are configurable — change values here, not in the limiter code.
 */

export const RATE_LIMIT_CONFIG = {
  // Auth routes: login, signup, password reset
  auth: {
    maxAttempts: 5,           // Max attempts before backoff kicks in
    windowMs: 15 * 60 * 1000, // 15-minute sliding window
    backoffBaseMs: 2000,      // Initial backoff delay (2 seconds)
    backoffMaxMs: 60000,      // Maximum backoff delay (60 seconds)
    backoffMultiplier: 2,     // Exponential multiplier
  },

  // Public endpoints: browsing, searching
  public: {
    maxRequests: 30,
    windowMs: 60 * 1000,      // 1-minute window
  },

  // Authenticated user actions: complaint submission, profile updates
  authenticated: {
    maxRequests: 60,
    windowMs: 60 * 1000,      // 1-minute window
  },
};
