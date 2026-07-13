"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { googleLogin } from "@/actions/auth/google";

export function GoogleButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    try {
      setLoading(true);

      await googleLogin();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={handleGoogleLogin}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          {/* Replace with your SVG later */}
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.7 1.22 9.2 3.61l6.88-6.88C35.91 2.61 30.41 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8 6.21C12.52 13.56 17.8 9.5 24 9.5z"
            />
          </svg>

          Continue with Google
        </>
      )}
    </Button>
  );
}