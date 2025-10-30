/**
 * Logger utility for structured logging
 * Automatically filters debug logs in production
 */

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

export const logger = {
  /**
   * Debug-level logs (only in development)
   */
  debug: (...args: unknown[]) => {
    if (isDev) console.log('[DEBUG]', ...args);
  },

  /**
   * Info-level logs (all environments except test)
   */
  info: (...args: unknown[]) => {
    if (!isTest) console.log('[INFO]', ...args);
  },

  /**
   * Warning-level logs (all environments)
   */
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Error-level logs (all environments)
   */
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },

  /**
   * Create a component-specific logger
   * @param name Component or module name
   */
  component: (name: string) => ({
    debug: (...args: unknown[]) => logger.debug(`[${name}]`, ...args),
    info: (...args: unknown[]) => logger.info(`[${name}]`, ...args),
    warn: (...args: unknown[]) => logger.warn(`[${name}]`, ...args),
    error: (...args: unknown[]) => logger.error(`[${name}]`, ...args),
  }),
};
