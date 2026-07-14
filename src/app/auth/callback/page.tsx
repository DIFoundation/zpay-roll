"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the hash (OAuth callback)
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          toast.error("Authentication failed. Please try again.");
          router.push("/login?error=auth_failed");
          return;
        }

        if (data.session) {
          router.push("/dashboard");
        } else {
          console.error("✗ No session found after OAuth callback");
          router.push("/login?error=no_session");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        router.push("/login?error=unknown_error");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
