"use client";

import { AuthProvider } from "@/components/providers/auth";
import { QueryClientProvider } from "@/components/providers/query-client";
import { ThemeProvider } from "@/components/providers/theme";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
