"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { payrollService } from "@/services/payroll/payroll.service";
import {
  NewPayrollBatch,
  UpdatePayrollBatch,
} from "@/types/supabase";

const QUERY_KEY = ["payroll"];

export function usePayrolls() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: payrollService.getAll,
  });
}

export function usePayroll(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => payrollService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NewPayrollBatch) =>
      payrollService.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useUpdatePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePayrollBatch;
    }) => payrollService.update(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}

export function useDeletePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      payrollService.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
}