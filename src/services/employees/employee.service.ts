import { BaseService } from "../base.service";
import { Employee, NewEmployee, UpdateEmployee } from "@/types/supabase";

class EmployeeService extends BaseService {
  async getAll(): Promise<Employee[]> {
    return this.execute(
      this.supabase
        .from("employees")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", {
          ascending: false,
        })
    );
  }

  async getById(id: string): Promise<Employee> {
    return this.execute(
      this.supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single()
    );
  }

  async create(
    employee: NewEmployee
  ): Promise<Employee> {
    return this.execute(
      this.supabase
        .from("employees")
        .insert(employee)
        .select()
        .single()
    );
  }

  async update(
    id: string,
    employee: UpdateEmployee
  ): Promise<Employee> {
    return this.execute(
      this.supabase
        .from("employees")
        .update(employee)
        .eq("id", id)
        .select()
        .single()
    );
  }

  async delete(id: string) {
    return this.execute(
      this.supabase
        .from("employees")
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq("id", id)
    );
  }
}

export const employeeService =
  new EmployeeService();