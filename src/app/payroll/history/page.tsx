"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth";
import { listBatches } from "@/lib/api";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { Plus, ArrowRight, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  broadcasting: { label: "Broadcasting", variant: "default" },
  pending: { label: "Pending", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  failed: { label: "Failed", variant: "destructive" },
};

function HistoryInner() {
  const { user } = useAuth();
  const [batches, setBatches] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      listBatches()
        .then(setBatches)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (batches && batches.length === 0) {
    return (
      <Card className="border-dashed border-border">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <History className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-sm">No payroll batches yet</p>
          <Button size="sm" onClick={() => router.push("/payroll/new")}>
            <Plus className="w-4 h-4 mr-1" /> New Payroll
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {batches?.map((batch, i) => {
        const badge = STATUS_BADGE[batch.status] ?? STATUS_BADGE.draft;
        return (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
          >
            <div onClick={() => router.push(`/payroll/${batch.id}`)}>
              <Card className="border-border hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{batch.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                      From: {batch.sender_address}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {batch.recipient_count} recipients · {Number(batch.total_zec).toFixed(4)} ZEC ·{" "}
                      {formatDistanceToNow(new Date(batch.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function PayrollHistory() {
  const { user, loading } = useAuth();

  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Please sign in to access payroll history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll History</h1>
          <p className="text-muted-foreground text-sm mt-0.5">All your Zcash payroll batches</p>
        </div>
        <Button onClick={() => router.push("/payroll/new")}>
          <Plus className="w-4 h-4 mr-2" /> New Payroll
        </Button>
      </div>
      <HistoryInner />
    </div>
  );
}
