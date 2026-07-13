"use server";

import { createClient } from "@/lib/supabase/server";

export async function googleLogin() {
  const supabase = await createClient();

  const { data } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
        //   "https://ejnnbvzeilbguweztqbc.supabase.co/auth/v1/callback",
        // "http://localhost:3000/auth/callback",
          `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

  return data.url;
}