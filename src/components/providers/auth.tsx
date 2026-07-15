"use client";

import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { googleLogin } from "@/actions/auth/google";

interface AuthContextType {
  user: Session["user"] | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    (async function init() {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        if (!mounted) return;

        if (error) {
          console.error("Error getting session:", error);
        } else if (existingSession) {
          setSession(existingSession);
          setUser(existingSession.user);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (newSession) {
        toast.success(`Signed in as ${newSession.user.email}`);
        setSession(newSession);
        setUser(newSession.user);
        router.push("/dashboard");
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out");
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Sign out failed");
      throw err;
    }
  };

  const signIn = async () => {
    try {
      const url = await googleLogin();
      if (!url) throw new Error("No OAuth URL");
      // navigate browser to OAuth provider
      window.location.assign(url);
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("Sign in failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
