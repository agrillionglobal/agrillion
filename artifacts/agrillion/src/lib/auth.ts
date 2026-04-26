import { setAuthTokenGetter } from "@workspace/api-client-react";

const ACCESS_KEY = "agrillion.accessToken";
const ACCESS_EXP_KEY = "agrillion.accessTokenExpiresAt";
const REFRESH_KEY = "agrillion.refreshToken";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
};

export function saveTokens(t: AuthTokens): void {
  try {
    localStorage.setItem(ACCESS_KEY, t.accessToken);
    localStorage.setItem(REFRESH_KEY, t.refreshToken);
    localStorage.setItem(ACCESS_EXP_KEY, t.accessTokenExpiresAt);
  } catch {
    // ignore (private mode / quota)
  }
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null;
  }
}

export function clearTokens(): void {
  try {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(ACCESS_EXP_KEY);
  } catch {
    // ignore
  }
}

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data = (await res.json()) as AuthTokens;
    saveTokens(data);
    return data.accessToken;
  } catch {
    return null;
  }
}

function isExpiringSoon(): boolean {
  try {
    const iso = localStorage.getItem(ACCESS_EXP_KEY);
    if (!iso) return false;
    const exp = new Date(iso).getTime();
    return Number.isFinite(exp) && exp - Date.now() < 30_000;
  } catch {
    return false;
  }
}

/** Install the bearer-token getter that customFetch uses for every request. */
export function installAuthBridge(): void {
  setAuthTokenGetter(async () => {
    if (isExpiringSoon()) {
      refreshing ??= refreshAccessToken().finally(() => {
        refreshing = null;
      });
      const fresh = await refreshing;
      if (fresh) return fresh;
    }
    return getAccessToken();
  });
}
