"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/components/providers/auth";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { redirect } from "next/navigation";

export default function DashboardPage() {

  const { loading, user } = useAuth();
  if (loading) {
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
  }

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Manage your payroll operations from one place."
      />

      <DashboardStats />

      <QuickActions />
    </div>
  );
}