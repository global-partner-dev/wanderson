"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
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

  const loadUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const profile = await fetchProfile(user.id);
      setState({
        user,
        profile,
        role: profile?.role ?? "client",
        loading: false,
      });
    } else {
      setState({ user: null, profile: null, role: null, loading: false });
    }
  }, [supabase, fetchProfile]);

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        (event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED") &&
        session?.user
      ) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          role: profile?.role ?? "client",
          loading: false,
        });
      } else if (event === "SIGNED_OUT") {
        setState({ user: null, profile: null, role: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile, loadUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, profile: null, role: null, loading: false });
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signOut, refresh: loadUser }),
    [state, signOut, loadUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
