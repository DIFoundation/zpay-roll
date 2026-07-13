"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboard/dashboard.service";
import { queryKeys } from "@/lib/query-keys";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => dashboardService.getStats(),
  });
}