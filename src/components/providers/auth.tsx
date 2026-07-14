"use client";

import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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

  const router = useRouter();

  useEffect(() => {
    // Check if there's an existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        } else if (existingSession) {
          console.log("✓ Existing session found:", existingSession.user.email);
          setSession(existingSession);
          setUser(existingSession.user);
        } else {
          console.log("No existing session");
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        
        if (newSession) {
          toast.success(`✓ User authenticated as ${newSession.user.email}`);
          setSession(newSession);
          setUser(newSession.user);
        } else {
          toast.error("User session expired or invalid.");
          router.push("/login?error=session_expired");
          setSession(null);
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed. Please try again.");
      throw error;
    }
  };

  const signIn = async () => {
    try {
      const url = await googleLogin();

      if (!url) {
        throw new Error("Google sign-in URL was not returned.");
      }

      window.location.assign(url);
      toast.success("Redirecting to Google for authentication...");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Sign in failed. Please try again.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
