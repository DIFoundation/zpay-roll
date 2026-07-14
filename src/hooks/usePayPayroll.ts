"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePayPayroll() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(
        "/api/payroll/pay",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      return response.json();
    },

    onSuccess() {
      toast.success(
        "Payroll sent successfully."
      );
    },

    onError() {
      toast.error(
        "Unable to send payroll."
      );
    },
  });
}