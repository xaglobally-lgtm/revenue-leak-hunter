/// <reference types="vite/client" />
// Browser-side Supabase client, used ONLY for authentication (magic-link
// email sign-in). This is separate from the server's own Supabase
// persistence layer (src/server/db/store.ts), which talks to Supabase's
// REST API directly and never touches this file.
//
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are the same Project URL and
// anon key used server-side (SUPABASE_URL / SUPABASE_ANON_KEY), just
// re-exposed with a VITE_ prefix so Vite bundles them into the browser
// build. The anon key is safe to expose publicly: on its own it cannot
// read or write application data (Supabase Auth's own endpoints are the
// only thing this client calls).
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// When unset, the deployment stays in the original shared-demo-session mode
// (no login required) — this keeps existing deployments working exactly as
// before until someone opts in by setting these two env vars.
export const authEnabled = Boolean(url && anonKey);

export const supabaseAuth = authEnabled
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
