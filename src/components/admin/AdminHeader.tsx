"use client";

import { Bell, Menu } from "lucide-react";

type Props = {
  title: string;
  onMenuClick: () => void;
};

export default function AdminHeader({ title, onMenuClick }: Props) {
  return (
    <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} className="text-muted-foreground hover:text-foreground md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-full bg-muted p-2 text-muted-foreground transition hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
        </button>
      </div>
    </header>
  );
}
