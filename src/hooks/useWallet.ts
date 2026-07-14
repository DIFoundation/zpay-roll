"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
    }) =>
      walletService.connectWallet(
        address,
        organizationId,
        createdBy
      ),

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletService.refreshBalance,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet"],
      });

      toast.success("Balance updated.");
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}