/**
 * Decoupled Backend Logging Utility
 * Standardized logging format for server actions.
 */
export const logger = {
  info: (message: string, context?: unknown) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${message}`, context ? JSON.stringify(context, null, 2) : "");
  },
  warn: (message: string, context?: unknown) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] ${message}`, context ? JSON.stringify(context, null, 2) : "");
  },
  error: (message: string, error?: unknown) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${message}`, error ? error : "");
  }
};
