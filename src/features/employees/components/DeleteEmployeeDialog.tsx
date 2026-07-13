"use client";

import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteEmployee } from "@/hooks/useEmployees";

interface DeleteEmployeeDialogProps {
  employeeId: string;
  employeeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteEmployeeDialog({
  employeeId,
  employeeName,
  open,
  onOpenChange,
}: DeleteEmployeeDialogProps) {
  const deleteEmployee = useDeleteEmployee();

  async function handleDelete() {
    try {
      await deleteEmployee.mutateAsync(employeeId);

      toast.success("Employee deleted.");

      onOpenChange(false);
    } catch {
      toast.error("Unable to delete employee.");
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Employee
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{employeeName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteEmployee.isPending}
          >
            {deleteEmployee.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}