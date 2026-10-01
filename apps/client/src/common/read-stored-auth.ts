export type StoredAuth = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; username: string };
};

export const authStorageKey = 'auth';

export function readStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(authStorageKey);
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

function isStoredAuth(value: unknown): value is StoredAuth {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accessToken' in value &&
    typeof value.accessToken === 'string' &&
    value.accessToken.length > 0
  );
}
