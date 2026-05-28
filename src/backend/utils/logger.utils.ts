/**
 * Decoupled Backend Logging Utility
 * Standardized logging format for server actions.
 */
export const logger = {
  info: (message: string, context?: unknown) => {
    const timestamp = new Date().toISOString();
    if (context !== undefined) {
      console.log(`[INFO] [${timestamp}] ${message}`, JSON.stringify(context, null, 2));
    } else {
      console.log(`[INFO] [${timestamp}] ${message}`);
    }
  },
  warn: (message: string, context?: unknown) => {
    const timestamp = new Date().toISOString();
    if (context !== undefined) {
      console.warn(`[WARN] [${timestamp}] ${message}`, JSON.stringify(context, null, 2));
    } else {
      console.warn(`[WARN] [${timestamp}] ${message}`);
    }
  },
  error: (message: string, error?: unknown) => {
    const timestamp = new Date().toISOString();
    if (error !== undefined) {
      console.error(`[ERROR] [${timestamp}] ${message}`, error);
    } else {
      console.error(`[ERROR] [${timestamp}] ${message}`);
    }
  }
};
