import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface GoogleSignInButtonProps {
  intendedRole?: 'customer' | 'owner';
  onSuccess: (role: string) => void;
  onError?: (message: string) => void;
}

/**
 * Renders Google's real "Sign in with Google" button using Google Identity
 * Services (loaded via <script> in index.html) and sends the resulting ID
 * token to the live backend (POST /api/auth/google) for verification.
 */
export default function GoogleSignInButton({
  intendedRole,
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { setUser } = useAuth();
  const [scriptReady, setScriptReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // The <script> tag in index.html loads async - poll briefly until it's ready.
    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return;
    }
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        setScriptReady(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scriptReady || !buttonRef.current || !window.google) return;

    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID is not set - Google Sign-In cannot initialize.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        setSubmitting(true);
        try {
          const { user } = await api.loginWithGoogle(response.credential, intendedRole);
          setUser(user);
          onSuccess(user.role);
        } catch (err) {
          const message =
            err instanceof ApiError ? err.message : 'Google sign-in failed. Please try again.';
          onError?.(message);
        } finally {
          setSubmitting(false);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 336,
      logo_alignment: 'center',
    });
    // Re-render whenever intendedRole changes so signup role toggle is respected.
  }, [scriptReady, clientId, intendedRole]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div ref={buttonRef} className={submitting ? 'opacity-50 pointer-events-none' : ''} />
      {!scriptReady && (
        <p className="text-xs text-gray-400">Loading Google Sign-In...</p>
      )}
      {submitting && <p className="text-xs text-gray-400">Signing you in...</p>}
    </div>
  );
}
