export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; username: string };
};

export const AUTH_STORAGE_KEY = 'auth';

export function readStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredAuth(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredAuth(auth: StoredAuth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function isStoredAuth(value: unknown): value is StoredAuth {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accessToken' in value &&
    typeof value.accessToken === 'string' &&
    value.accessToken.length > 0
  );
}
