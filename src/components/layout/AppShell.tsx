import { ReactNode } from "react";

import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

interface Props {
  children: ReactNode;
}

export function AppShell({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}