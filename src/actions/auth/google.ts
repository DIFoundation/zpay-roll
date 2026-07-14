"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";

export async function googleLogin() {
  const supabase = await createClient();
  const headerStore = await headers();

  const forwardedProto = headerStore.get("x-forwarded-proto") ?? "https";
  const host = headerStore.get("host");
  const fallbackOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const redirectTo = host
    ? `${forwardedProto}://${host}/auth/callback`
    : `${fallbackOrigin.replace(/\/$/, "")}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo,
    },
  });

  if (error) {
    throw error;
  }

  return data.url;
}
