"use client";

import { PayrollBatch } from "@/types/supabase";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PayrollStatusBadge } from "./PayrollStatusBadge";

interface Props {
  payroll: PayrollBatch;
}

export function PayrollInfoCard({
  payroll,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Payroll Information
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <PayrollStatusBadge
            status={payroll.status}
          />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Employees
          </p>

          <p className="text-xl font-semibold">
            {payroll.employee_count}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Total
          </p>

          <p className="text-xl font-semibold">
            {payroll.total_amount.toLocaleString()}{" "}
            ZEC
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Pay Period
          </p>

          <p className="text-xl font-semibold">
            {payroll.pay_period}
          </p>
        </div>

      </CardContent>
    </Card>
  );
}