const TOKEN_KEY = 'auth_token';

// The cookie name must match what middleware reads: request.cookies.get('auth_token').
// The cookie is HttpOnly-safe for reads by the Edge runtime but must be written
// client-side here since the token arrives in a JSON response body (not a Set-Cookie header).
const COOKIE_OPTIONS = 'path=/; SameSite=Lax; Secure';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  // Write to localStorage for existing client-side reads (AuthContext, authService).
  localStorage.setItem(TOKEN_KEY, token);
  // Write to cookie so Next.js Edge middleware can authenticate navigation requests.
  document.cookie = `${TOKEN_KEY}=${token}; ${COOKIE_OPTIONS}`;
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  // Expire the cookie immediately to match localStorage removal.
  document.cookie = `${TOKEN_KEY}=; ${COOKIE_OPTIONS}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const hasToken = (): boolean => {
  return Boolean(getToken());
};

