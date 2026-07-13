import { createClient } from "@/lib/supabase/client";

export abstract class BaseService {
  protected readonly supabase = createClient();

  protected async execute<T>(
    promise: PromiseLike<{
      data: T | null;
      error: Error | null;
    }>
  ): Promise<T> {
    const { data, error } = await promise;

    if (error) {
      throw error;
    }

    if (data === null) {
      throw new Error("No data returned.");
    }

    return data;
  }
}