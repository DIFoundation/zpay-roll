"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PayrollForm } from "./PayrollForm";
import { PayrollBatch } from "@/types/supabase";

interface PayrollDialogProps {
  children: React.ReactNode;
  payroll?: PayrollBatch;
  mode?: "create" | "edit";
}

export function PayrollDialog({
  children,
  mode = "create",
  payroll,
}: PayrollDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          {children}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create Payroll"
              : "Update Payroll"}
          </DialogTitle>
        </DialogHeader>

        <PayrollForm
          payroll={payroll}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}