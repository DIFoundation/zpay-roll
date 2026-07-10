import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

function SideNav() {
  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col justify-between">
      <div className="flex flex-col justify-between">
        {/* header */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">ZPay Roll</h1>
        </div>

        {/* navigation */}
        <nav className="px-4 py-2 space-y-1">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/payroll/history"
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary"
          >
            Payroll History
          </Link>
          <Link
            href="/payroll/new"
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary"
          >
            New Payroll
          </Link>
          <Link
            href="/settings"
            className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary"
          >
            Settings
          </Link>
        </nav>
      </div>

      <div>
        {/* footer */}
        <div className="p-4 border-t border-border">
          <Link
            href="/logout"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary"
          >
            <LogOut className="inline-block w-4 h-4 mr-1" />
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
