"use server";

import { createClient } from "@/lib/supabase/server";

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function register(data: RegisterData) {
  const supabase = await createClient();

  const { error } =
    await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message:
      "Account created successfully. Please check your email.",
  };
}