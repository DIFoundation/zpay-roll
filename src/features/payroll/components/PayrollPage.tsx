"use client";

import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { usePayrolls } from "@/hooks/usePayroll";

import { PayrollDialog } from "./PayrollDialog";
import { PayrollTable } from "./PayrollTable";

export function PayrollPage() {
  const {
    data: payrolls = [],
    isLoading,
    isError,
  } = usePayrolls();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description="Create, review and manage payroll batches."
        action={
          <PayrollDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Payroll
            </Button>
          </PayrollDialog>
        }
      />

      <PayrollTable
        payrolls={payrolls}
        loading={isLoading}
        error={isError}
      />
    </div>
  );
}