"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

import { Employee, PayrollBatch } from "@/types/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";

import { PayrollStatusBadge } from "./PayrollStatusBadge";
import { PayrollDialog } from "./PayrollDialog";
import { PayrollInfoCard } from "./PayrollInfoCard";
import { PayrollEmployeesTable } from "./PayrollEmployeesTable";
import { PayrollSummary } from "./PayrollSummary";

interface Props {
  payroll: PayrollBatch;
}

export function PayrollDetailsPage({
  payroll,
\}: Props) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={payroll.title}
        description={payroll.pay_period}
        action={
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
            >
              <Link href="/payroll">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>

            {payroll.status === "draft" && (
              <PayrollDialog
                mode="edit"
                payroll={payroll}
              >
                <Button>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </PayrollDialog>
            )}
          </div>
        }
      />

      <PayrollSummary
        employeeCount={payroll.employee_count}
        totalAmount={payroll.total_amount}
      />

      <PayrollInfoCard payroll={payroll} />

      <div className="mt-6">
        <Button>
          Run Payroll
        </Button>
      </div>

      <div className="mt-8">
        <PayrollEmployeesTable />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
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

            <p className="font-semibold">
              {payroll.employee_count}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Total Payroll
            </p>

            <p className="font-semibold">
              {payroll.total_amount} ZEC
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Pay Period
            </p>

            <p className="font-semibold">
              {payroll.pay_period}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}