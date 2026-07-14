"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PayrollBatch } from "@/types/supabase";

import { Button } from "@/components/ui/button";

import { useEmployees } from "@/hooks/useEmployees";
import { useCreatePayroll } from "@/hooks/usePayroll";
import { payrollService } from "@/services/payroll/payroll.service";

import {
  PayrollFormData,
  payrollSchema,
} from "../validations/payroll.schema";
import { PayrollEmployeesTable } from "./PayrollEmployeesTable";
import { PayrollSummary } from "./PayrollSummary";
import { FormInput } from "@/components/form/form-input";

interface PayrollFormProps {
  payroll?: PayrollBatch;
  onSuccess?: () => void;
}

export function PayrollForm({
  payroll,
  onSuccess,
}: PayrollFormProps) {
  const form = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      title: payroll?.title ?? "",
      pay_period: payroll?.pay_period ?? "",
      employee_ids: [],
    },
  });

  const createPayroll = useCreatePayroll();

  const { data: employees = [] } = useEmployees();

  const selectedIds = form.watch("employee_ids");

  const selectedEmployees = useMemo(
    () =>
      employees.filter((employee) =>
        selectedIds.includes(employee.id)
      ),
    [employees, selectedIds]
  );

  const employeeCount = selectedEmployees.length;

  const totalAmount = selectedEmployees.reduce(
    (sum, employee) => sum + employee.base_salary,
    0
  );

  async function onSubmit(values: PayrollFormData) {
    try {
      // TODO: Replace with authenticated values
      const organizationId = "";
      const createdBy = "";

      const batch = await createPayroll.mutateAsync({
        title: values.title,
        pay_period: values.pay_period,
        organization_id: organizationId,
        created_by: createdBy,
        employee_count: employeeCount,
        total_amount: totalAmount,
      });

      await payrollService.createItems(
        selectedEmployees.map((employee) => ({
          batch_id: batch.id,
          employee_id: employee.id,
          amount: employee.base_salary,
          wallet_address: employee.wallet_address,
        }))
      );

      toast.success("Payroll generated successfully.");

      form.reset();

      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate payroll.");
    }
  }

  return (
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
            <FormInput
                control={form.control}
                name="title"
                label="Payroll Title"
            />

            <FormInput
                control={form.control}
                name="pay_period"
                label="Pay Period"
            />
        </div>

        <PayrollEmployeesTable
          employees={employees}
          control={form.control}
        />

        <PayrollSummary
          employeeCount={employeeCount}
          totalAmount={totalAmount}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createPayroll.isPending}
          >
            {createPayroll.isPending
              ? "Generating..."
              : "Generate Payroll"}
          </Button>
        </div>
      </form>
  );
}