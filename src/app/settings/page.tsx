"use client";

import { useAuth } from "@/components/providers/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import Image from "next/image";

export default function Settings() {
  const { user, signOut } = useAuth();

  const rpc = process.env.ZCASH_RPC_URL

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and Zcash node configuration</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="space-y-3">
              <div>
                <Image 
                  src={`${user.user_metadata.avatar_url}`} 
                  alt="Avatar" width={48} height={48} 
                  className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Name</div>
                <div className="text-sm font-medium">{user.user_metadata.name ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="text-sm font-medium">{user.email ?? "—"}</div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Not signed in</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Zcash Node Configuration</CardTitle>(Coming Soon)
        </CardHeader>
        {/* <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure your Zcash full node RPC credentials via the{" "}
            <span className="text-primary font-medium">Secrets</span> tab in the sidebar
            (under Advanced). Add these keys:
          </p>
          <div className="mt-3 space-y-2 font-mono text-xs bg-muted rounded-lg p-3">
            <div><span className="text-primary">ZCASH_RPC_URL</span> — {rpc}</div>
            <div><span className="text-primary">ZCASH_RPC_USER</span> — your RPC username</div>
            <div><span className="text-primary">ZCASH_RPC_PASS</span> — your RPC password</div>
          </div>
        </CardContent> */}
      </Card>
    </div>
  );
}
