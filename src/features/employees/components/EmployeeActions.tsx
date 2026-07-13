"use client";

import { Employee } from "@/types/supabase";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { EmployeeDialog } from "./EmployeeDialog";
import { DeleteEmployeeDialog } from "./DeleteEmployeeDialog";

interface Props {
  employee: Employee;
}

export function EmployeeActions({
  employee,
}: Props) {

  const [editOpen, setEditOpen] = useState(false);
const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button
          variant="ghost"
          size="icon"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">

        <DropdownMenuItem>

          <EmployeeDialog
            open={editOpen}
            employee={employee}
            onOpenChange={setEditOpen}
        />

          <Pencil className="mr-2 h-4 w-4" />

          Edit

        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-500"
        >

          <DeleteEmployeeDialog
            open={deleteOpen}
            employeeId={employee.id}
            employeeName={`${employee.first_name} ${employee.last_name}`}
            onOpenChange={setDeleteOpen}
        />

          <Trash className="mr-2 h-4 w-4" />

          Delete

        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}