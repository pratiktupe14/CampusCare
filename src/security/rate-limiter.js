/**
 * CampusCare Client-Side Rate Limiter
 * 
 * Provides per-action rate limiting with exponential backoff for auth routes.
 * Uses localStorage for persistence across page reloads.
 * 
 * NOTE: This is a client-side best-effort layer. True rate limiting
 * requires a server-side implementation (see backend-rate-limit-example.js).
 */

import { RATE_LIMIT_CONFIG } from './rate-limit-config.js';

const STORAGE_PREFIX = 'cc_rl_';

/**
 * Get stored rate limit state for a given key.
 */
function getState(key) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    const state = JSON.parse(raw);
    return state;
  } catch {
    return null;
  }
}

/**
 * Save rate limit state.
 */
function setState(key, state) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — fail open
  }
}

/**
 * Clean expired entries from localStorage.
 */
function cleanExpired(key, windowMs) {
  const state = getState(key);
  if (!state) return;

  const now = Date.now();
  if (now - state.windowStart > windowMs) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }
}

/**
 * Check if an auth action (login, signup, password reset) is rate-limited.
 * Uses exponential backoff rather than hard lockout.
 * 
 * @param {string} identifier - Unique key (e.g. 'login', 'login_user@example.com')
 * @returns {{ allowed: boolean, retryAfterMs: number, attemptsMade: number }}
 */
export function checkAuthRateLimit(identifier = 'auth') {
  const config = RATE_LIMIT_CONFIG.auth;
  const key = `auth_${identifier}`;
  
  cleanExpired(key, config.windowMs);
  
  const now = Date.now();
  let state = getState(key);

  if (!state) {
    state = { windowStart: now, attempts: 0, lastAttempt: 0, consecutiveFailures: 0 };
  }

  // Reset window if expired
  if (now - state.windowStart > config.windowMs) {
    state = { windowStart: now, attempts: 0, lastAttempt: 0, consecutiveFailures: 0 };
  }

  // Check if within backoff period
  if (state.consecutiveFailures > 0) {
    const backoffMs = Math.min(
      config.backoffBaseMs * Math.pow(config.backoffMultiplier, state.consecutiveFailures - 1),
      config.backoffMaxMs
    );
    const timeSinceLastAttempt = now - state.lastAttempt;
    
    if (timeSinceLastAttempt < backoffMs) {
      return {
        allowed: false,
        retryAfterMs: backoffMs - timeSinceLastAttempt,
        attemptsMade: state.attempts,
      };
    }
  }

  // Check max attempts in window
  if (state.attempts >= config.maxAttempts) {
    const remainingWindowMs = config.windowMs - (now - state.windowStart);
    return {
      allowed: false,
      retryAfterMs: remainingWindowMs > 0 ? remainingWindowMs : 0,
      attemptsMade: state.attempts,
    };
  }

  return {
    allowed: true,
    retryAfterMs: 0,
    attemptsMade: state.attempts,
  };
}

/**
 * Record an auth attempt (call after each login/signup/reset attempt).
 * @param {string} identifier
 * @param {boolean} success - Whether the attempt succeeded
 */
export function recordAuthAttempt(identifier = 'auth', success = false) {
  const config = RATE_LIMIT_CONFIG.auth;
  const key = `auth_${identifier}`;
  const now = Date.now();

  let state = getState(key);
  if (!state || (now - state.windowStart > config.windowMs)) {
    state = { windowStart: now, attempts: 0, lastAttempt: 0, consecutiveFailures: 0 };
  }

  state.attempts++;
  state.lastAttempt = now;

  if (success) {
    state.consecutiveFailures = 0;
  } else {
    state.consecutiveFailures++;
  }

  setState(key, state);
}

/**
 * Check if a general action is rate-limited.
 * @param {string} identifier - Action key (e.g. 'complaint_submit')
 * @param {'public' | 'authenticated'} tier - Rate limit tier
 * @returns {{ allowed: boolean, retryAfterMs: number }}
 */
export function checkRateLimit(identifier, tier = 'authenticated') {
  const config = RATE_LIMIT_CONFIG[tier];
  if (!config) return { allowed: true, retryAfterMs: 0 };

  const key = `${tier}_${identifier}`;
  const now = Date.now();

  cleanExpired(key, config.windowMs);

  let state = getState(key);
  if (!state || (now - state.windowStart > config.windowMs)) {
    state = { windowStart: now, count: 0 };
  }

  if (state.count >= config.maxRequests) {
    const remainingMs = config.windowMs - (now - state.windowStart);
    return { allowed: false, retryAfterMs: remainingMs > 0 ? remainingMs : 0 };
  }

  state.count++;
  setState(key, state);

  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Format remaining wait time for display.
 * @param {number} ms - Milliseconds remaining
 * @returns {string} Human-readable string (e.g. "5s", "1m 30s")
 */
export function formatRetryTime(ms) {
  if (ms <= 0) return '0s';
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}
