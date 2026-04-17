import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;

/**
 * Supabase client using the service_role key. Bypasses RLS and must never be
 * imported into the browser bundle. Only use this from server actions or
 * route handlers that have already authorized the caller.
 */
export function createAdminClient(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
