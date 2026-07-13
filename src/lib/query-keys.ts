export const queryKeys = {
  dashboard: ["dashboard"] as const,

  employees: ["employees"] as const,

  employee: (id: string) =>
    ["employee", id] as const,

  payrolls: ["payrolls"] as const,

  payroll: (id: string) =>
    ["payroll", id] as const,

  wallets: ["wallets"] as const,

  wallet: (id: string) =>
    ["wallet", id] as const,

  transactions: ["transactions"] as const,
};