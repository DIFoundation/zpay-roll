"use client";

import { Employee } from "@/types/supabase";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { EmployeeForm } from "./EmployeeForm";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
}

export function EmployeeDialog({
  open,
  onOpenChange,
  employee
}: EmployeeDialogProps) {
    const isEditing = !!employee;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Employee" : "Add Employee"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the employee information."
              : "Create a new employee that can be included in payroll batches."}
          </DialogDescription>
        </DialogHeader>

        <EmployeeForm
          employee={employee}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}