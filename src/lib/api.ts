// Shared API helper. Every request carries the active organization id in the
// x-organization-id header so the server enforces strict tenant isolation.
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