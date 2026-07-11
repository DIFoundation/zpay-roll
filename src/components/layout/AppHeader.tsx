"use client";

import { Bell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { UserMenu } from "./UserMenu";
import { useUIStore } from "@/store/ui-store";

export function AppHeader() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h2 className="font-semibold">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <ThemeSwitcher />

        <UserMenu />
      </div>
    </header>
  );
}