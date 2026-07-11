import { createClient } from "@/lib/supabase/client";

import {
  AuthResponse,
  SignInData,
  SignUpData,
} from "./auth.types";

class AuthService {
  private supabase = createClient();

  async signIn({
    email,
    password,
  }: SignInData): Promise<AuthResponse> {
    const { data, error } =
      await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

    return {
      user: data.user,
      error: error?.message ?? null,
    };
  }

  async signUp({
    fullName,
    email,
    password,
  }: SignUpData): Promise<AuthResponse> {
    const { data, error } =
      await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

    return {
      user: data.user,
      error: error?.message ?? null,
    };
  }

  async signInWithGoogle() {
    return this.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          `${window.location.origin}/auth/callback`,
      },
    });
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  async getUser() {
    const { data } =
      await this.supabase.auth.getUser();

    return data.user;
  }

  async getSession() {
    const { data } =
      await this.supabase.auth.getSession();

    return data.session;
  }
}

export const authService = new AuthService();
