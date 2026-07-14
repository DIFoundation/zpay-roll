"use client";

import Link from "next/link";
import { toast } from "sonner";

import { format } from "date-fns";
import {
  Eye,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PayrollBatch } from "@/types/supabase";

import { PayrollStatusBadge } from "./PayrollStatusBadge";
import { PayrollDialog } from "./PayrollDialog";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { useDeletePayroll } from "@/hooks/usePayroll";

interface PayrollTableProps {
  payrolls: PayrollBatch[];
  loading?: boolean;
  error?: boolean;
}

export function PayrollTable({
  payrolls,
  loading = false,
  error = false,
}: PayrollTableProps) {

  const deletePayroll = useDeletePayroll();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load payrolls.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!payrolls.length) {
    return (
      <Card>
        <CardContent className="flex h-64 flex-col items-center justify-center gap-3">
          <h3 className="text-lg font-semibold">
            No payroll created yet
          </h3>

          <p className="text-sm text-muted-foreground">
            Create your first payroll batch.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>

          <TableHeader>

            <TableRow>
              <TableHead>Payroll</TableHead>

              <TableHead>Pay Period</TableHead>

              <TableHead>Employees</TableHead>

              <TableHead>Total</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Created</TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>

          </TableHeader>

          <TableBody>

            {payrolls.map((payroll) => (
              <TableRow key={payroll.id}>

                <TableCell className="font-medium">
                  {payroll.title}
                </TableCell>

                <TableCell>
                  {payroll.pay_period}
                </TableCell>

                <TableCell>
                  {payroll.employee_count}
                </TableCell>

                <TableCell>
                  {payroll.total_amount.toLocaleString()}{" "}
                  ZEC
                </TableCell>

                <TableCell>
                  <PayrollStatusBadge
                    status={payroll.status}
                  />
                </TableCell>

                <TableCell>
                  {format(
                    new Date(payroll.created_at),
                    "dd MMM yyyy"
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">

                    <Button
                      size="icon"
                      variant="ghost"
                    >
                      <Link href={`/payroll/${payroll.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>

                    <PayrollDialog
                      payroll={payroll}
                      mode="edit"
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </PayrollDialog>

                    <DeleteDialog
                      title="Delete Payroll"
                      description="Are you sure you want to delete this payroll?"
                      loading={deletePayroll.isPending}
                      onDelete={async () => {
                        await deletePayroll.mutateAsync(payroll.id);

                        toast.success("Payroll deleted.");
                      }}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </DeleteDialog>

                  </div>
                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>
      </CardContent>
    </Card>
  );
}