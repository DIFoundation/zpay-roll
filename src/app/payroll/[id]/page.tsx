"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth";
import { getBatch, getRecipients, broadcastBatch } from "@/lib/api";
import { broadcastTransaction } from "@/app/actions/broadcast";
import { RecipientModal } from "@/components/RecipientModal";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Users,
  Zap,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Loader2,
  Radio,
  Copy,
  Plus,
  Edit2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePayrollReceipt } from "@/lib/receipt";
import type { ReceiptBatch, ReceiptRecipient } from "@/lib/receipt";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_INFO: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  draft: { label: "Draft", icon: Clock, color: "text-muted-foreground", variant: "secondary" },
  broadcasting: { label: "Broadcasting", icon: Radio, color: "text-primary", variant: "default" },
  pending: { label: "Pending Confirmation", icon: Clock, color: "text-yellow-400", variant: "default" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-400", variant: "outline" },
  failed: { label: "Failed", icon: XCircle, color: "text-destructive", variant: "destructive" },
};

const RECIPIENT_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-muted-foreground" },
  confirmed: { label: "Confirmed", color: "text-green-400" },
  failed: { label: "Failed", color: "text-destructive" },
};

function CopyButton({ value }: { value: string }) {
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(value);
        toast.success("Copied to clipboard");
      }}
      className="text-muted-foreground hover:text-primary transition-colors ml-1"
    >
      <Copy className="w-3 h-3" />
    </button>
  );
}

function DetailInner({ batchId }: { batchId: string }) {
  const [batch, setBatch] = useState<any>(null);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcasting, setBroadcasting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const [batchData, recipientsData] = await Promise.all([
        getBatch(batchId),
        getRecipients(batchId),
      ]);
      setBatch(batchData);
      setRecipients(recipientsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [batchId]);

  // Poll for status updates when broadcasting
  useEffect(() => {
    if (!batch || (batch.status !== "broadcasting" && batch.status !== "pending")) {
      return;
    }

    const interval = setInterval(() => {
      loadData();
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [batch?.status]);

  const handleAddRecipient = () => {
    setEditingRecipient(null);
    setModalOpen(true);
  };

  const handleEditRecipient = (recipient: any) => {
    setEditingRecipient(recipient);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingRecipient(null);
  };

  const handleBroadcast = async () => {
    if (!batch || batch.recipient_count === 0) {
      toast.error("Cannot broadcast batch with no recipients");
      return;
    }

    if (!confirm(`Broadcast ${batch.recipient_count} payments totaling ${batch.total_zec} ZEC?`)) {
      return;
    }

    setBroadcasting(true);
    try {
      // First update database status to broadcasting
      await broadcastBatch(batchId);

      // Then attempt the actual broadcast
      const result = await broadcastTransaction({
        batchId,
        senderAddress: batch.sender_address,
        recipients: recipients.map((r) => ({
          address: r.address,
          amount: Number(r.amount),
          memo: r.memo,
        })),
      });

      toast.success("Transaction broadcast successfully!");
      
      // Reload data to get updated status
      setTimeout(() => {
        loadData();
      }, 1000);
    } catch (error) {
      console.error("Broadcast error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to broadcast transaction");
      // Reload to get error status from db
      loadData();
    } finally {
      setBroadcasting(false);
    }
  };

  const isDraft = batch?.status === "draft";

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const statusInfo = STATUS_INFO[batch.status] ?? STATUS_INFO.draft;
  const StatusIcon = statusInfo.icon;
  const isLive = batch.status === "broadcasting" || batch.status === "pending";

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {isLive ? (
                    <Loader2 className={`w-4 h-4 ${statusInfo.color} animate-spin`} />
                  ) : (
                    <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                  )}
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  {isLive && (
                    <span className="text-xs text-muted-foreground animate-pulse">Live updating...</span>
                  )}
                </div>
                <h2 className="text-xl font-bold mt-2">{batch.name}</h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <span className="truncate max-w-[280px]">{batch.sender_address}</span>
                  <CopyButton value={batch.sender_address} />
                </div>
                {batch.memo && <p className="text-xs text-muted-foreground">Memo: {batch.memo}</p>}
              </div>
              <div className="text-right space-y-1">
                <div className="text-2xl font-bold font-mono text-primary">
                  {Number(batch.total_zec).toFixed(4)} ZEC
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <Users className="w-3 h-3" /> {batch.recipient_count} recipients
                </div>
                <div className="text-xs text-muted-foreground">
                  Created {format(new Date(batch.created_at), "MMM d, yyyy HH:mm")}
                </div>
                {batch.broadcasted_at && (
                  <div className="text-xs text-muted-foreground">
                    Broadcast {format(new Date(batch.broadcasted_at), "MMM d, yyyy HH:mm")}
                  </div>
                )}
                {batch.completed_at && (
                  <div className="text-xs text-green-400">
                    Confirmed {format(new Date(batch.completed_at), "MMM d, yyyy HH:mm")}
                  </div>
                )}
              </div>
            </div>

            {/* Operation ID */}
            {batch.operation_id && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-1">Operation ID</p>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-mono text-muted-foreground break-all">{batch.operation_id}</p>
                  <CopyButton value={batch.operation_id} />
                </div>
              </div>
            )}

            {/* Tx IDs */}
            {batch.tx_ids && batch.tx_ids.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Transaction ID(s)</p>
                <div className="space-y-1">
                  {batch.tx_ids.map((txId: string) => (
                    <div key={txId} className="flex items-center gap-1">
                      <p className="text-xs font-mono text-primary break-all">{txId}</p>
                      <CopyButton value={txId} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {batch.error_message && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-destructive font-medium">Broadcast Failed</p>
                    <p className="text-xs text-destructive/80 mt-1">{batch.error_message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-border flex gap-2 flex-wrap items-center">
              {isDraft && (
                <Button
                  onClick={handleBroadcast}
                  disabled={broadcasting || recipients.length === 0}
                  className="gap-2"
                >
                  {broadcasting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Broadcast
                    </>
                  )}
                </Button>
              )}
              {batch.status === "completed" && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (!recipients) return;
                    generatePayrollReceipt(
                      batch as ReceiptBatch,
                      recipients as ReceiptRecipient[]
                    );
                    toast.success("Receipt downloaded!");
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" /> Download Receipt
                </Button>
              )}
              {batch.status !== "draft" && (
                <span className="text-xs text-muted-foreground ml-auto">
                  Status: <Badge variant="secondary" className="ml-1">{batch.status}</Badge>
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recipients Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" /> Recipients
                <Badge variant="secondary">{recipients.length}</Badge>
              </CardTitle>
              {isDraft && (
                <Button size="sm" onClick={handleAddRecipient}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">#</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Address</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">ZEC</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                    {isDraft && <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {recipients.map((r, i) => {
                    const rStatus = RECIPIENT_STATUS[r.status] ?? RECIPIENT_STATUS.pending;
                    return (
                      <tr
                        key={r.id}
                        className={cn(
                          "border-b border-border/50 last:border-0 transition-colors",
                          isDraft && "hover:bg-muted/20 cursor-pointer"
                        )}
                      >
                        <td className="py-2.5 px-2 text-xs text-muted-foreground">{i + 1}</td>
                        <td className="py-2.5 px-2 text-sm">
                          {r.name ?? <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs text-muted-foreground truncate max-w-[160px] md:max-w-[240px]">
                              {r.address}
                            </span>
                            <CopyButton value={r.address} />
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-medium">
                          {Number(r.amount).toFixed(4)}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span className={`text-xs font-medium ${rStatus.color}`}>{rStatus.label}</span>
                        </td>
                        {isDraft && (
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => handleEditRecipient(r)}
                              className="inline-flex items-center justify-center p-1 text-muted-foreground hover:text-primary transition-colors"
                              title="Edit recipient"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={isDraft ? 6 : 5} className="py-2 px-2 text-xs text-muted-foreground">
                      Total
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-primary">
                      {recipients.reduce((s, r) => s + Number(r.amount), 0).toFixed(4)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal */}
      <RecipientModal
        batchId={batchId}
        recipient={editingRecipient}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={loadData}
      />
    </div>
  );
}

export default function PayrollDetail() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link
        href="/payroll/history"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to History
      </Link>
      {id ? (
        <DetailInner batchId={id} />
      ) : (
        <p className="text-muted-foreground">Invalid batch ID</p>
      )}
    </div>
  );
}
