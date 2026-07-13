import Link from "next/link";
import {
  Plus,
  Upload,
  Wallet,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    label: "Create Payroll",
    href: "/payroll/new",
    icon: Plus,
  },
  {
    label: "Import CSV",
    href: "/payroll/import",
    icon: Upload,
  },
  {
    label: "Connect Wallet",
    href: "/wallets",
    icon: Wallet,
  },
  {
    label: "Reports",
    href: "/analytics",
    icon: FileText,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-6 text-lg font-semibold">
          Quick Actions
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.href}
                asChild
                variant="outline"
                className="justify-start"
              >
                <Link href={action.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}