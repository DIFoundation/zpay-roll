import { User } from "@supabase/supabase-js";

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}