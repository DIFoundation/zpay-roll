"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PayrollSummaryProps {
  employeeCount: number;
  totalAmount: number;
}

export function PayrollSummary({
  employeeCount,
  totalAmount,
}: PayrollSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Selected Employees
          </span>

          <span className="text-2xl font-bold">
            {employeeCount}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Total Payroll
          </span>

          <span className="text-2xl font-bold">
            {totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ZEC
          </span>
        </div>
      </CardContent>
    </Card>
  );
}