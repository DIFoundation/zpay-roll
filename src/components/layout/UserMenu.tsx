"use client";

import { ChevronDown, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

import { useAuth } from "../providers/auth";

export function UserMenu() {

  const { signOut, signIn } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuItem>
          <Link href="/settings">
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-500" onClick={signOut}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}