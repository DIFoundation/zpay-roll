"use client";

import { Employee } from "@/types/supabase";

import {
  Building2,
  Briefcase,
  Wallet,
  BadgeDollarSign,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { EmployeeActions } from "./EmployeeActions";

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({
  employee,
}: EmployeeCardProps) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="space-y-5 p-6">

        <div className="flex items-start justify-between">

          <div>
            <h3 className="text-lg font-semibold">
              {employee.first_name} {employee.last_name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {employee.email}
            </p>
          </div>

          <EmployeeActions employee={employee} />
        </div>

        <div className="space-y-3">

          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4" />
            {employee.department}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4" />
            {employee.position}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4" />

            <span className="truncate">
              {employee.wallet_address || "Not Connected"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <BadgeDollarSign className="h-4 w-4" />

            {employee.currency}{" "}
            {Number(employee.base_salary).toLocaleString()}
          </div>

        </div>

        <Badge
          variant={
            employee.status === "active"
              ? "default"
              : "secondary"
          }
        >
          {employee.status}
        </Badge>

      </CardContent>
    </Card>
  );
}