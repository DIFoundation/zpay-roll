import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  onAdd: () => void;
}

export function EmployeeEmptyState({
  onAdd,
}: Props) {
  return (
    <div className="flex h-[420px] flex-col items-center justify-center rounded-xl border border-dashed">
      <Users className="mb-5 h-12 w-12 text-muted-foreground" />

      <h2 className="text-xl font-semibold">
        No Employees Found
      </h2>

      <p className="mt-2 max-w-sm text-center text-muted-foreground">
        Add your first employee to start creating
        payroll batches.
      </p>

      <Button
        className="mt-6"
        onClick={onAdd}
      >
        Add Employee
      </Button>
    </div>
  );
}