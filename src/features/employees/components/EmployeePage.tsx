"use client";

import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";

import { useEmployees } from "@/hooks/useEmployees";

import { EmployeeSearch } from "./EmployeeSearch";
import { EmployeeTable } from "./EmployeeTable";
import { EmployeeDialog } from "./EmployeeDialog";
import { EmployeeEmptyState } from "./EmployeeEmptyState";

export function EmployeePage() {
  const { data: employees = [], isLoading } = useEmployees();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;

    return employees.filter((employee) =>
      [
        employee.first_name,
        employee.last_name,
        employee.employee_code,
        employee.department,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [employees, search]);

  if (isLoading) {
    return <div>Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage your organization's employees."
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        }
      />

      <EmployeeSearch
        value={search}
        onChange={setSearch}
      />

      {filteredEmployees.length === 0 ? (
        <EmployeeEmptyState
          onAdd={() => setDialogOpen(true)}
        />
      ) : (
        <EmployeeTable employees={filteredEmployees} />
      )}

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}