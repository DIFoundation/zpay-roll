import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Card className="mx-auto w-full max-w-md border-border/60 shadow-xl">
      <CardContent className="space-y-8 p-8">

        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {children}

      </CardContent>
    </Card>
  );
}