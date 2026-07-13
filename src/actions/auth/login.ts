"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const supabase = await createClient();

  const { error } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect("/dashboard");
}