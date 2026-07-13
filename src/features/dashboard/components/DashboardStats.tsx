'use client'

import {
  Users,
  Wallet,
  CreditCard,
  BarChart3,
} from "lucide-react";

import { StatCard } from "./StatCard";
import { useDashboard } from "@/hooks/useDashboard";

export function DashboardStats() {
  const { data, isLoading } = useDashboard();

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Employees"
        value={data?.employees || 'no data'}
        icon={<Users className="h-6 w-6" />}
      />

      <StatCard
        title="Payrolls"
        value={data?.payrolls || 0}
        icon={<CreditCard className="h-6 w-6" />}
      />

      <StatCard
        title="Wallet Balance"
        value={data?.wallets || 0}
        icon={<Wallet className="h-6 w-6" />}
      />

      <StatCard
        title="Monthly Volume"
        value={data?.transactions || 0}
        icon={<BarChart3 className="h-6 w-6" />}
      />
    </section>
  );
}