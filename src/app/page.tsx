"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth";
import { listBatches } from "@/lib/api";
import { motion } from "motion/react";
import {
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  broadcasting: { label: "Broadcasting", variant: "default" },
  pending: { label: "Pending", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  failed: { label: "Failed", variant: "destructive" },
};

function DashboardInner() {
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

  const stats = {
    total: batches?.length ?? 0,
    completed: batches?.filter((b) => b.status === "completed").length ?? 0,
    pending: batches?.filter((b) => b.status === "pending" || b.status === "broadcasting").length ?? 0,
    totalZec: batches?.filter((b) => b.status === "completed").reduce((sum, b) => sum + Number(b.total_zec), 0) ?? 0,
  };

  const STAT_CARDS = [
    { label: "Total Batches", value: stats.total, icon: Users, color: "text-primary" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-green-400" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
    { label: "ZEC Disbursed", value: stats.totalZec.toFixed(4), icon: DollarSign, color: "text-primary" },
  ];

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Overview of your Zcash payroll activity</p>
        </div>
        <Button onClick={() => router.push("/payroll/new")}>
          <Plus className="w-4 h-4 mr-2" /> New Payroll
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07, ease: "easeOut" }}
          >
            <Card className="border-border">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold font-mono">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Batches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Recent Payroll Batches</h2>
          <Button variant="ghost" size="sm" onClick={() => router.push("/payroll/history")}>
            View all <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : batches && batches.length === 0 ? (
          <Card className="border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No payroll batches yet</p>
              <Button size="sm" onClick={() => router.push("/payroll/new")}>
                Create your first payroll
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {batches?.slice(0, 5).map((batch, i) => {
              const badge = STATUS_BADGE[batch.status] ?? STATUS_BADGE.draft;
              return (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                >
                  <div onClick={() => router.push(`/payroll/${batch.id}`)}>
                    <Card className="border-border hover:border-primary/40 transition-colors cursor-pointer">
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{batch.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {batch.recipient_count} recipients · {Number(batch.total_zec).toFixed(4)} ZEC ·{" "}
                            {formatDistanceToNow(new Date(batch.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading, signIn } = useAuth();

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
        {/* signup form */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Please sign in to access the dashboard</p>
          <Button onClick={signIn}>Sign In</Button>
        </div>
      </div>
    );
  }

  return <DashboardInner />;
}
