// Current Supabase access token, if the visitor is signed in. Set by
// AuthContext whenever the session changes; read here so this plain
// function (not a React hook) can attach it to every request.
let currentAccessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  currentAccessToken = token;
}

// Shared API helper. Every request carries the active organization id in the
// x-organization-id header (legacy demo-mode tenant switching) and, once
// signed in, a real `Authorization: Bearer <token>` header — the server
// trusts the token over the header for any authenticated user.
export async function rlhFetch<T = unknown>(
  path: string,
  options?: RequestInit,
  orgId?: string
): Promise<{ ok: boolean; status: number; data: T }> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> | undefined),
  };
  if (orgId) {
    headers['x-organization-id'] = orgId;
  } else {
    const stored = localStorage.getItem('rlh_org');
    if (stored) headers['x-organization-id'] = stored;
  }
  if (currentAccessToken) {
    headers['Authorization'] = `Bearer ${currentAccessToken}`;
  }
  if (options?.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(path, { ...options, headers });
  let body: T = undefined as unknown as T;
  try {
    body = (await res.json()) as T;
  } catch {
    body = undefined as unknown as T;
  }
  return { ok: res.ok, status: res.status, data: body };
}