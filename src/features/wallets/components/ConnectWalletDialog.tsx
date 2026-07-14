"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useConnectWallet } from "@/hooks/useWallet";

interface Props {
  children: React.ReactNode;
}

interface FormData {
  address: string;
}

export function ConnectWalletDialog({
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  const connectWallet = useConnectWallet();

  const form = useForm<FormData>({
    defaultValues: {
      address: "",
    },
  });

  async function onSubmit(data: FormData) {
    // TODO
    const organizationId = "";
    const createdBy = "";

    await connectWallet.mutateAsync({
      address: data.address,
      organizationId,
      createdBy,
    });

    form.reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            placeholder="zs1..."
            {...form.register("address")}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={connectWallet.isPending}
          >
            {connectWallet.isPending
              ? "Connecting..."
              : "Connect Wallet"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}