"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Employee } from "@/types/supabase";

import {
  employeeSchema,
  EmployeeFormData,
} from "../validations/employee.schema";

import { useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployees";

import { Button } from "@/components/ui/button";

import { FormInput } from "@/components/form/form-input";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/lib/supabase";

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: () => void;
}

export function EmployeeForm({ employee, onSuccess }: EmployeeFormProps) {
  const isEditing = !!employee;

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { organizationId } = useOrganization();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),

    defaultValues: {
      employee_code: "",
      first_name: "",
      last_name: "",
      email: "",
      department: "",
      position: "",
      wallet_address: "",
      currency: "ZEC",
      base_salary: 0,
    },
  });

  useEffect(() => {
    if (!employee) return;

    form.reset({
      employee_code: employee.employee_code ?? "",
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email ?? "",
      department: employee.department ?? "",
      position: employee.position ?? "",
      wallet_address: employee.wallet_address ?? "",
      currency: employee.currency as "ZEC",
      base_salary: Number(employee.base_salary),
    });
  }, [employee, form]);

  async function onSubmit(values: EmployeeFormData) {

    const user = await supabase.auth.getUser();

    try {
      if (isEditing) {
        await updateEmployee.mutateAsync({
          id: employee.id,
          employee: values,
        });

        toast.success("Employee updated.");
      } else {
        await createEmployee.mutateAsync({
          ...values,
          organization_id: organizationId,
          wallet_address: values.wallet_address ?? "",
          created_by: user.data.user?.id
        });

        toast.success("Employee created.");
      }

      form.reset();

      onSuccess?.();
    } catch {
      toast.error("Something went wrong.");
    }
  }

  return (
      <form 
        className="space-y-6" 
        onSubmit={form.handleSubmit(onSubmit)}
    >
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            control={form.control}
            name="first_name"
            label="First Name"
          />

          <FormInput
            control={form.control}
            name="last_name"
            label="Last Name"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            type="email"
          />
          
          <FormInput
            control={form.control}
            name="employee_code"
            label="Employee ID"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            control={form.control}
            name="department"
            label="Department"
          />

          <FormInput
            control={form.control}
            name="position"
            label="Position"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            control={form.control}
            name="wallet_address"
            label="Zcash Wallet Address"
            />

          <FormInput
            control={form.control}
            name="base_salary"
            label="Salary"
            type="number"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createEmployee.isPending || updateEmployee.isPending}
        >
          {createEmployee.isPending || updateEmployee.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Employee"
          ) : (
            "Create Employee"
          )}
        </Button>
      </form>
  );
}
