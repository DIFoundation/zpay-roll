"use client";

import { Control, useController } from "react-hook-form";
import { Check } from "lucide-react";

import { Employee } from "@/types/supabase";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { PayrollFormData } from "../validations/payroll.schema";

interface PayrollEmployeesTableProps {
  employees: Employee[];
  control: Control<PayrollFormData>;
}

export function PayrollEmployeesTable({
  employees,
  control,
}: PayrollEmployeesTableProps) {
  const {
    field: { value = [], onChange },
  } = useController({
    name: "employee_ids",
    control,
  });

  const toggleEmployee = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((employeeId) => employeeId !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Employees</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Wallet</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => {
                const checked = value.includes(employee.id);

                return (
                  <TableRow
                    key={employee.id}
                    className="cursor-pointer"
                    onClick={() => toggleEmployee(employee.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          toggleEmployee(employee.id)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {employee.first_name}{" "}
                          {employee.middle_name ?? ""}{" "}
                          {employee.last_name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {employee.employee_code}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {employee.department ?? "-"}
                    </TableCell>

                    <TableCell>
                      {employee.position ?? "-"}
                    </TableCell>

                    <TableCell>
                      {employee.base_salary.toLocaleString()}{" "}
                      {employee.currency}
                    </TableCell>

                    <TableCell>
                      {employee.wallet_address ? (
                        <Badge
                          variant="outline"
                          className="gap-1"
                        >
                          <Check className="h-3 w-3 text-green-500" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Missing
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}