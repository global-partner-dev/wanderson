"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut, User, Shield, Briefcase } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roleMeta = {
  admin: { label: "Admin", icon: Shield, color: "text-red-500" },
  staff: { label: "Staff", icon: Briefcase, color: "text-blue-500" },
  client: { label: "Client", icon: User, color: "text-green-500" },
} as const;

export function UserMenu() {
  const { user, profile, role, signOut } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!user) return null;

  const meta = roleMeta[role ?? "client"];
  const RoleIcon = meta.icon;

  function handleLogout() {
    startTransition(async () => {
      await signOut();
      router.refresh();
      router.push("/login");
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {(profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{profile?.full_name ?? "User"}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="gap-2">
          <RoleIcon className={`h-4 w-4 ${meta.color}`} />
          <span>Role: {meta.label}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
