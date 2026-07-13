"use client";

import { Employee } from "@/types/supabase";

import { EmployeeCard } from "./EmployeeCard";

interface Props {
  employees: Employee[];
}

export function EmployeeTable({
  employees,
}: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
        />
      ))}
    </div>
  );
}