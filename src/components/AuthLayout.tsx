"use client";

import { useAuth } from "@/hooks/use-auth";
import SideNav from "@/components/SideNav";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // If not logged in, just show children (login page)
  if (!user) {
    return <>{children}</>;
  }

  // If logged in, show sidebar + children (dashboard)
  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
