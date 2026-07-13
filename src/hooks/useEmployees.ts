"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { employeeService } from "@/services/employees/employee.service";
import { queryKeys } from "@/lib/query-keys";
import {
  NewEmployee,
  UpdateEmployee,
} from "@/types/supabase";

export function useEmployees() {
  return useQuery({
    queryKey: queryKeys.employees,
    queryFn: () => employeeService.getAll(),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: queryKeys.employee(id),
    queryFn: () => employeeService.getById(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: NewEmployee) =>
      employeeService.create(employee),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      employee,
    }: {
      id: string;
      employee: UpdateEmployee;
    }) => employeeService.update(id, employee),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      employeeService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
}