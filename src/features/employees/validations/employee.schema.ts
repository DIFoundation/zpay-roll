import { z } from "zod";

export const employeeSchema = z.object({
  employee_code: z
    .string()
    .trim()
    .min(1, "Employee ID is required"),

  first_name: z
    .string()
    .trim()
    .min(2, "First name is required"),

  last_name: z
    .string()
    .trim()
    .min(2, "Last name is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  department: z
    .string()
    .trim()
    .min(2, "Department is required"),

  position: z
    .string()
    .trim()
    .min(2, "Position is required"),

  wallet_address: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  base_salary: z
    .coerce
    .number()
    .positive("Salary must be greater than 0"),

  currency: z.enum(["ZEC", "USD", "NGN"]),

  status: z.enum(["active", "inactive"]).default("active"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;