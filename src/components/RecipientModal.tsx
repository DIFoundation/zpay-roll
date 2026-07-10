"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AlertCircle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { addRecipient, updateRecipient, deleteRecipient } from "@/lib/api";

const recipientSchema = z.object({
  name: z.string().optional(),
  address: z.string().min(1, "Address is required").regex(/^[zt]/, "Must be a valid Zcash address"),
  amount: z.string().min(1, "Amount is required").refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be > 0"),
  memo: z.string().optional(),
});

type RecipientFormValues = z.infer<typeof recipientSchema>;

interface RecipientModalProps {
  batchId: string;
  recipient?: {
    id: string;
    name?: string;
    address: string;
    amount: number;
    memo?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RecipientModal({ batchId, recipient, isOpen, onClose, onSuccess }: RecipientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showMemo, setShowMemo] = useState(!!recipient?.memo);
  const isEditing = !!recipient;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      name: recipient?.name ?? "",
      address: recipient?.address ?? "",
      amount: recipient?.amount.toString() ?? "",
      memo: recipient?.memo ?? "",
    },
  });

  // Reset form when modal opens/closes or recipient changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: recipient?.name ?? "",
        address: recipient?.address ?? "",
        amount: recipient?.amount.toString() ?? "",
        memo: recipient?.memo ?? "",
      });
      setShowMemo(!!recipient?.memo);
    }
  }, [isOpen, recipient, reset]);

  const onSubmit = async (values: RecipientFormValues) => {
    setIsLoading(true);
    try {
      if (isEditing && recipient) {
        await updateRecipient(recipient.id, {
          name: values.name || undefined,
          address: values.address,
          amount: parseFloat(values.amount),
          memo: values.memo || undefined,
        });
        toast.success("Recipient updated!");
      } else {
        await addRecipient(batchId, {
          name: values.name || undefined,
          address: values.address,
          amount: parseFloat(values.amount),
          memo: values.memo || undefined,
        });
        toast.success("Recipient added!");
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(isEditing ? "Failed to update recipient" : "Failed to add recipient");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !recipient) return;
    if (!confirm("Are you sure you want to delete this recipient?")) return;

    setIsLoading(true);
    try {
      await deleteRecipient(recipient.id);
      toast.success("Recipient deleted!");
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to delete recipient");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const amountValue = watch("amount");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {isEditing ? "Edit Recipient" : "Add Recipient"}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {isEditing ? "Update recipient details" : "Add a new payroll recipient"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                {...register("name")}
                disabled={isLoading}
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">The recipient's name for reference</p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Zcash Address
              </Label>
              <Input
                id="address"
                placeholder="z... or t..."
                className={cn("font-mono text-sm h-9", errors.address && "border-destructive")}
                {...register("address")}
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.address.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">Transparent (t...) or shielded (z...) address</p>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount (ZEC)
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  placeholder="0.0000"
                  className={cn("font-mono text-sm h-9 pr-12", errors.amount && "border-destructive")}
                  {...register("amount")}
                  disabled={isLoading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  ZEC
                </span>
              </div>
              {errors.amount && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.amount.message}
                </p>
              )}
              {amountValue && !errors.amount && (
                <p className="text-xs text-muted-foreground">
                  Sending {parseFloat(amountValue).toFixed(4)} ZEC
                </p>
              )}
            </div>

            {/* Memo */}
            {showMemo && (
              <div className="space-y-2">
                <Label htmlFor="memo" className="text-sm font-medium">
                  Memo <span className="text-xs text-muted-foreground">(shielded only)</span>
                </Label>
                <Input
                  id="memo"
                  placeholder="Add a message (appears in shielded transactions)"
                  {...register("memo")}
                  disabled={isLoading}
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground">Only visible in shielded (z...) transactions</p>
              </div>
            )}

            {!showMemo && !isEditing && (
              <button
                type="button"
                onClick={() => setShowMemo(true)}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                + Add memo
              </button>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-9"
              >
                {isLoading ? "Processing..." : isEditing ? "Save Changes" : "Add Recipient"}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Delete recipient"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-9"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
