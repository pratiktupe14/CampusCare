/**
 * CampusCare Global Error Handler
 * 
 * Prevents stack traces, file paths, and raw database errors from
 * reaching the user. Shows generic messages to users while logging
 * full details for debugging (in development mode only).
 */

const IS_DEV = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) || false;

/**
 * Log error details — only outputs to console in development mode.
 * In production, errors could be sent to a logging service.
 * @param {string} context - Where the error occurred
 * @param {Error|string} error - The error object or message
 */
function logError(context, error) {
  if (IS_DEV) {
    console.error(`[CampusCare Error] [${context}]`, error);
  }
  // In production, you would send to a logging service:
  // sendToLoggingService({ context, error: error.message, stack: error.stack, timestamp: Date.now() });
}

/**
 * Show a generic, user-friendly error notification.
 * Never exposes internal details.
 * @param {string} [userMessage] - Optional user-facing message override
 */
export function showUserError(userMessage) {
  const message = userMessage || 'Something went wrong. Please try again or contact support if the issue persists.';
  
  // Remove existing error toasts
  const existing = document.querySelector('.cc-error-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'cc-error-toast fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 text-sm font-medium max-w-md animate-fade-slide-up';
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[20px]">error</span>
    <span>${escapeHtml(message)}</span>
    <button onclick="this.parentElement.remove()" class="ml-auto text-white/80 hover:text-white">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  `;

  document.body.appendChild(toast);

  // Auto-dismiss after 8 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 300ms ease-out';
      setTimeout(() => toast.remove(), 300);
    }
  }, 8000);
}

/**
 * Escape HTML to prevent XSS when inserting text into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Safe error handler wrapper for async functions.
 * Catches errors, logs them in dev, shows generic messages to users.
 * 
 * @param {Function} fn - Async function to wrap
 * @param {string} context - Description of the operation (for dev logs)
 * @param {string} [userMessage] - Optional custom user-facing message
 * @returns {Function}
 */
export function withErrorHandling(fn, context, userMessage) {
  return async function (...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      logError(context, error);
      showUserError(userMessage);
    }
  };
}

/**
 * Install global error handlers.
 * Call this once at app startup.
 */
export function installGlobalErrorHandler() {
  // Catch unhandled errors
  window.onerror = function (message, source, lineno, colno, error) {
    logError('window.onerror', error || message);
    // Do NOT show toast for every minor JS error — only log
    return true; // Prevents default browser error display
  };

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', function (event) {
    logError('unhandledrejection', event.reason);
    event.preventDefault(); // Prevents default console error
  });
}
