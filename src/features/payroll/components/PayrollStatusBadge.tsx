"use client";

import { Badge } from "@/components/ui/badge";
import { PayrollBatch } from "@/types/supabase";

interface PayrollStatusBadgeProps {
  status: PayrollBatch["status"];
}

const variants: Record<
  PayrollBatch["status"],
  string
> = {
  draft:
    "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",

  ready:
    "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",

  processing:
    "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",

  completed:
    "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",

  failed:
    "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
};

export function PayrollStatusBadge({
  status,
}: PayrollStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={variants[status]}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}