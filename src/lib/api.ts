/**
 * API client for the Venuewala backend (Node/Express, deployed on Render).
 *
 * IMPORTANT: this only wires up what the backend currently supports.
 * Right now that is just Google login (routes/auth.google.js -> POST /api/auth/google).
 * Everything else (venues, bookings, dashboards) still needs real backend routes
 * before the corresponding frontend pages can be switched off dummy data.
 */

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  // Fails loudly in dev if someone forgets to set VITE_API_URL, rather than
  // silently calling relative paths that 404.
  console.error(
    'VITE_API_URL is not set. Add it to your .env file, e.g.\nVITE_API_URL=https://venuewala-backend.onrender.com'
  );
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    // Required so the httpOnly auth cookie set by the backend is sent/stored.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response (e.g. Render cold-start HTML error page) - ignore body.
  }

  if (!res.ok) {
    const message =
      (body as { error?: string } | null)?.error || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return body as T;
}

export interface VenuewalaUser {
  id: number | string;
  name: string;
  email: string;
  photo?: string;
  role: 'customer' | 'owner' | 'admin';
}

/**
 * Sends the Google ID token (credential) to the backend for verification.
 * Matches POST /api/auth/google in routes/auth.google.js exactly.
 */
export function loginWithGoogle(
  credential: string,
  intendedRole?: 'customer' | 'owner'
): Promise<{ user: VenuewalaUser }> {
  return apiFetch<{ user: VenuewalaUser }>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential, intendedRole }),
  });
}

/**
 * Checks whether the httpOnly session cookie is still valid.
 * Matches GET /api/me in app.js. Note this only returns { userId, role } -
 * not name/email/photo - so the frontend still needs a cached copy of those
 * for display, this call just confirms the session is real.
 */
export function getMe(): Promise<{ userId: number | string; role: string }> {
  return apiFetch<{ userId: number | string; role: string }>('/api/me');
}

/**
 * Clears the session cookie server-side. Matches POST /api/auth/logout in app.js.
 */
export function logout(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
}

export const api = {
  loginWithGoogle,
  getMe,
  logout,
};
