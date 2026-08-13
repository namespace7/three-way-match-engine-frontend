// Phase 9.2: Tokens are issued as server-set HttpOnly cookies by the backend.
// Frontend JavaScript no longer writes or reads JWTs from localStorage or document.cookie.

export const getToken = (): string | null => {
  return null;
};

export const setToken = (): void => {
  // No-op: HttpOnly cookie set automatically by backend server
};

export const removeToken = (): void => {
  // No-op: HttpOnly cookie cleared automatically by backend POST /auth/logout
};

export const hasToken = (): boolean => {
  return false;
};
