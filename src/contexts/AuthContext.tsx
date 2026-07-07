import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, ApiError, VenuewalaUser } from '../lib/api';

/**
 * The backend sets an httpOnly session cookie on login, which can't be read
 * from JS directly - but it DOES expose GET /api/me to check whether that
 * cookie is still valid (returns { userId, role } if so, 401 if not).
 *
 * /api/me doesn't return name/email/photo though, so we still cache the full
 * profile in localStorage for display purposes, but we validate it against
 * /api/me on load: if the session is gone (expired/cleared), we drop the
 * cached profile so the UI doesn't show a stale "logged in" state.
 */

const STORAGE_KEY = 'venuewala_user_cache';

interface AuthContextValue {
  user: VenuewalaUser | null;
  setUser: (user: VenuewalaUser | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<VenuewalaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      let cached: VenuewalaUser | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) cached = JSON.parse(raw);
      } catch {
        // ignore corrupted cache
      }

      if (!cached) {
        setLoading(false);
        return;
      }

      try {
        // Confirm the httpOnly cookie is still valid before trusting the cache.
        await api.getMe();
        setUserState(cached);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          // Session actually expired/cleared server-side - drop stale cache.
          localStorage.removeItem(STORAGE_KEY);
          setUserState(null);
        } else {
          // Network hiccup (e.g. Render free-tier cold start) - keep showing
          // the cached user optimistically rather than logging them out.
          setUserState(cached);
        }
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const setUser = (nextUser: VenuewalaUser | null) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Even if the network call fails, still clear local state below so the
      // UI doesn't get stuck showing a logged-in user.
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
