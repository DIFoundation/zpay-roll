import { BaseService } from "../base.service";

class DashboardService extends BaseService {
  async getStats() {
    const [
      employees,
      payrolls,
      wallets,
      transactions,
    ] = await Promise.all([
      this.supabase
        .from("employees")
        .select("*", {
          count: "exact",
          head: true,
        }),

      this.supabase
        .from("payroll_batches")
        .select("*", {
          count: "exact",
          head: true,
        }),

      this.supabase
        .from("wallets")
        .select("*", {
          count: "exact",
          head: true,
        }),

      this.supabase
        .from("transactions")
        .select("*", {
          count: "exact",
          head: true,
        }),
    ]);

    return {
      employees: employees.count ?? 0,
      payrolls: payrolls.count ?? 0,
      wallets: wallets.count ?? 0,
      transactions:
        transactions.count ?? 0,
    };
  }
}

export const dashboardService =
  new DashboardService();