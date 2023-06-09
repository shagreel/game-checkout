/**
 * Key for the auth cookie.
 */
export const CFP_COOKIE_KEY = 'CFP-Auth-Key';

/**
 * Max age of the auth cookie in seconds.
 * Default: 30 days.
 */
export const CFP_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Paths that don't require authentication.
 * The /cfp_login path must be included.
 */
export const CFP_ALLOWED_PATHS = ['/cfp_login','/pico.min.css','/favicon.ico'];