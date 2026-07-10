'use client';

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {

  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Button onClick={() => router.push("/")}>
          <Home className="w-4 h-4 mr-2" /> Go Home
        </Button>
      </div>
    </div>
  );
}
