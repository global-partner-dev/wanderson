"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/lib/types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: null,
    loading: true,
  });

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return data as Profile | null;
    },
    [supabase],
  );

  /** Single source of truth: avoid calling getUser/getSession while onAuthStateChange
   *  is acquiring the auth lock for INITIAL_SESSION (causes 5s lock timeouts in dev / Strict Mode). */
  const applySession = useCallback(
    async (session: Session | null) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          role: profile?.role ?? "client",
          loading: false,
        });
      } else {
        setState({ user: null, profile: null, role: null, loading: false });
      }
    },
    [fetchProfile],
  );

  const refresh = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    await applySession(session);
  }, [supabase, applySession]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setState({ user: null, profile: null, role: null, loading: false });
        return;
      }
      // Never await other Supabase work inside this callback: it runs while the auth
      // lock may be held (e.g. tab refocus runs _recoverAndRefresh). Async + PostgREST
      // here deadlocks signOut and triggers "lock not released in 5000ms".
      setTimeout(() => {
        void applySession(session);
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, [supabase, applySession]);

  const signOut = useCallback(async () => {
    try {
      // Pause refresh ticks so they don't compete with signOut for the same auth lock
      // (common after switching away and back to the tab).
      try {
        await supabase.auth.stopAutoRefresh();
      } catch {
        /* non-fatal */
      }
      await supabase.auth.signOut({ scope: "local" });
    } catch (e) {
      console.error("signOut failed:", e);
    } finally {
      try {
        await supabase.auth.startAutoRefresh();
      } catch {
        /* non-fatal */
      }
      setState({ user: null, profile: null, role: null, loading: false });
    }
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signOut, refresh }),
    [state, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
