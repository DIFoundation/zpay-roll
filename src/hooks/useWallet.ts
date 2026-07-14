"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { walletService } from "@/services/wallets/wallet.service";

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: walletService.getWallet,
  });
}

export function useConnectWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      address,
      organizationId,
      createdBy,
    }: {
      address: string;
      organizationId: string;
      createdBy: string;
    }) => walletService.connectWallet(address, organizationId, createdBy),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });

      toast.success("Wallet connected.");
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}

export function useDisconnectWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletService.disconnectWallet,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });

      toast.success("Wallet disconnected.");
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}

export function useRefreshWallet() {
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await fetch("/api/wallet/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh wallet");
      }

      return response.json();
    },
  });
}

// new
export function useCreateWallet() {
  return useMutation({
    mutationFn: async (organizationId: string) => {
      const response = await fetch("/api/wallet/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create wallet");
      }

      return response.json();
    },
  });
}

export function useWalletAddress(organizationId: string) {
  return useQuery({
    queryKey: ["wallet-address", organizationId],
    enabled: !!organizationId,
    queryFn: async () => {
      const response = await fetch(
        `/api/wallet/address?organizationId=${organizationId}`,
      );

      return response.json();
    },
  });
}

export function useWalletBalance(organizationId: string) {
  return useQuery({
    queryKey: ["wallet-balance", organizationId],
    enabled: !!organizationId,
    queryFn: async () => {
      const response = await fetch(
        `/api/wallet/balance?organizationId=${organizationId}`,
      );

      return response.json();
    },
  });
}
