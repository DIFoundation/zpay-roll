"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// Returns a URL to redirect the browser to for Google OAuth (PKCE flow).
export async function googleLogin(): Promise<string> {
  const supabase = await createClient();
  const headerStore = await headers();

  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const host = headerStore.get("host");
  const fallback =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const redirectTo = host ? `${proto}://${host}/auth/callback` : `${fallback.replace(/\/$/, "")}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // flowType: "pkce",
      queryParams: { access_type: "offline", prompt: "consent" },
      redirectTo,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error("No OAuth URL returned");

  return data.url;
}
