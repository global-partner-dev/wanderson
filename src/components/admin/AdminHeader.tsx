"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/UserMenu";

type Props = {
  title: string;
  onMenuClick: () => void;
};

export default function AdminHeader({ title, onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3 md:h-16 md:px-6">
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="-ml-1 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" size="icon" className="relative rounded-full" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-card bg-destructive" />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
