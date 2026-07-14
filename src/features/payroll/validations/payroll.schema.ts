import { z } from "zod";

export const payrollSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title is required"),

  pay_period: z
    .string()
    .min(1, "Pay period is required"),

  employee_ids: z
    .array(z.string())
    .min(1, "Select at least one employee"),
});

export type PayrollFormData =
  z.infer<typeof payrollSchema>;