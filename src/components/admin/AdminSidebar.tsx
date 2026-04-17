"use client";

import {
  Briefcase,
  CheckCircle,
  Clock,
  FileStack,
  FileText,
  Filter,
  Flag,
  Languages,
  LogOut,
  MessageSquare,
  PieChart,
  Search,
  Shield,
  User,
  UserCheck,
  Users,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TabId } from "./admin-types";

const roleMeta = {
  admin:  { label: "Admin",  Icon: Shield,   color: "text-red-400"  },
  staff:  { label: "Staff",  Icon: Briefcase, color: "text-blue-400" },
  client: { label: "Client", Icon: User,      color: "text-green-400"},
} as const;

type NavItem = { id: TabId; title: string; icon: React.ComponentType<{ className?: string }> };

const salesItems: NavItem[] = [
  { id: "tab-crm", title: "CRM Kanban", icon: Filter },
  { id: "tab-analise", title: "Preliminary analysis", icon: FileText },
  { id: "tab-agenda", title: "Video call agenda", icon: Video },
  { id: "tab-prop-vendas", title: "Proposals", icon: MessageSquare },
  { id: "tab-prop-aguardando", title: "Proposals", icon: Clock },
  { id: "tab-contratos", title: "Contracts", icon: CheckCircle },
];

const opsItems: NavItem[] = [
  { id: "tab-cidadania", title: "Citizenship process", icon: Flag },
  { id: "tab-busca", title: "Document search", icon: Search },
  { id: "tab-traducao", title: "Document translation", icon: Languages },
  { id: "tab-transcricao", title: "USC transcription", icon: FileStack },
];

type Props = {
  activeTab: TabId;
  onSelect: (id: TabId, title: string) => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
};

export default function AdminSidebar({ activeTab, onSelect, mobileOpen, onToggleMobile }: Props) {
  const { user, profile, role, signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, startLogout] = useTransition();

  function handleLogout() {
    startLogout(async () => {
      await signOut();
      router.refresh();
      router.push("/login");
    });
  }

  const mgmtItems: NavItem[] = [
    ...(role === "admin"
      ? [
          { id: "tab-users" as const, title: "User management", icon: Users },
          { id: "tab-staff-approvals" as const, title: "Staff requests", icon: UserCheck },
        ]
      : []),
    { id: "tab-financeiro", title: "Categorized finance", icon: PieChart },
  ];

  const renderNavList = (items: NavItem[]) => (
    <ul className="space-y-1 px-3">
      {items.map((item) => {
        const active = activeTab === item.id;
        const Icon = item.icon;
        return (
          <li key={item.id}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onSelect(item.id, item.title)}
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                !active && "text-sidebar-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="min-w-0 flex-1 leading-snug">{item.title}</span>
            </Button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <aside
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-4">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <BrandLogo href="/" size="sm" className="h-8 max-h-8 w-auto shrink-0 opacity-95" />
              <span className="truncate text-lg font-bold leading-tight tracking-tight text-sidebar-accent-foreground">
                Polonia4u<span className="text-primary">.</span>
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleMobile}
              className="text-sidebar-foreground/80 hover:bg-transparent hover:text-sidebar-accent-foreground md:hidden"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="custom-scroll flex-1 overflow-y-auto py-4">
            <div className="space-y-6">
              <div>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-sidebar-muted">Sales</p>
                {renderNavList(salesItems)}
              </div>

              <div>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-sidebar-muted">Operations</p>
                {renderNavList(opsItems)}
              </div>

              <div>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-sidebar-muted">Management</p>
                {renderNavList(mgmtItems)}
              </div>
            </div>
          </nav>
        </div>

        {/* ── User profile + logout ── */}
        {user && (() => {
          const meta = roleMeta[role ?? "client"];
          const RoleIcon = meta.Icon;
          const initials = (profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase();
          return (
            <div className="shrink-0 border-t border-sidebar-border p-3">
              <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  {initials}
                </div>
                {/* Name + role */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-none text-sidebar-accent-foreground">
                    {profile?.full_name ?? "User"}
                  </p>
                  <span className={cn("mt-1 flex items-center gap-1 text-[11px] font-medium", meta.color)}>
                    <RoleIcon className="h-3 w-3" />
                    {meta.label}
                  </span>
                </div>
                {/* Logout icon button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  title="Log out"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-destructive disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })()}
      </aside>
    </>
  );
}
