/**
 * CampusCare Backend Rate Limiting — Express.js Middleware Scaffold
 * 
 * Drop this into your Express server when you add a backend.
 * Requires: npm install express-rate-limit
 * 
 * This is a REFERENCE IMPLEMENTATION — adapt to your stack.
 */

/*
import rateLimit from 'express-rate-limit';

// --- Auth Routes (login, signup, password reset) ---
// Stricter limits: 5 attempts per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many attempts. Please try again later.',
    retryAfterMs: null, // Will be set by the middleware
  },
  keyGenerator: (req) => {
    // Combine IP + email for per-account rate limiting
    const email = req.body?.email || '';
    return `${req.ip}_${email}`;
  },
});

// --- Public Endpoints (browsing, searching) ---
// Moderate limits: 30 requests per minute per IP
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Request limit reached. Please wait a moment.' },
});

// --- Authenticated User Actions (complaint submission, profile updates) ---
// Looser limits: 60 requests per minute per user
export const authenticatedLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use authenticated user ID when available, fall back to IP
    return req.user?.id || req.ip;
  },
  message: { error: 'You are performing actions too quickly. Please slow down.' },
});

// --- Usage Example ---
// import { authLimiter, publicLimiter, authenticatedLimiter } from './rate-limiters.js';
//
// app.post('/api/auth/login', authLimiter, loginHandler);
// app.post('/api/auth/signup', authLimiter, signupHandler);
// app.post('/api/auth/reset-password', authLimiter, resetPasswordHandler);
//
// app.get('/api/complaints', publicLimiter, listComplaintsHandler);
// app.get('/api/search', publicLimiter, searchHandler);
//
// app.post('/api/complaints', authenticatedLimiter, createComplaintHandler);
// app.put('/api/profile', authenticatedLimiter, updateProfileHandler);
*/
