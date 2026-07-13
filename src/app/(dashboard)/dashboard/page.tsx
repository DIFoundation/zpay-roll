import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { QuickActions } from "@/features/dashboard/components/QuickActions";

export default function DashboardPage() {
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