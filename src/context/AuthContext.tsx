import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabaseAuth, authEnabled } from '../lib/supabaseAuthClient.ts';
import { setAccessToken } from '../lib/api.ts';

interface AuthContextType {
  // Whether this deployment has real login configured at all (i.e. the
  // VITE_SUPABASE_* build-time env vars were set). When false, the app
  // behaves exactly as it did before — a single shared demo session.
  authEnabled: boolean;
  // True while we're still checking for an existing session on first load.
  loading: boolean;
  session: Session | null;
  userEmail: string | null;
  signInWithEmail: (email: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(authEnabled);

  useEffect(() => {
    if (!supabaseAuth) {
      setLoading(false);
      return;
    }

    supabaseAuth.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAccessToken(data.session?.access_token ?? null);
      setLoading(false);
    });

    const { data: listener } = supabaseAuth.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setAccessToken(newSession?.access_token ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string): Promise<{ ok: boolean; error?: string }> => {
    if (!supabaseAuth) {
      return { ok: false, error: 'Sign-in is not configured on this deployment yet.' };
    }
    const { error } = await supabaseAuth.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const signOut = async (): Promise<void> => {
    if (!supabaseAuth) return;
    await supabaseAuth.auth.signOut();
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authEnabled,
        loading,
        session,
        userEmail: session?.user?.email ?? null,
        signInWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
