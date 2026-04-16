"use client";

import {
  CheckCircle,
  Clock,
  FileStack,
  FileText,
  Filter,
  Flag,
  Languages,
  MessageSquare,
  PieChart,
  Search,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabId } from "./admin-types";

type NavItem = { id: TabId; title: string; icon: React.ComponentType<{ className?: string }> };

const salesItems: NavItem[] = [
  { id: "tab-crm", title: "CRM · Kanban", icon: Filter },
  { id: "tab-analise", title: "Preliminary analysis", icon: FileText },
  { id: "tab-agenda", title: "Video call agenda", icon: Video },
  { id: "tab-prop-vendas", title: "Proposals (sales)", icon: MessageSquare },
  { id: "tab-prop-aguardando", title: "Proposals (pending close)", icon: Clock },
  { id: "tab-contratos", title: "Contracts (completed)", icon: CheckCircle },
];

const opsItems: NavItem[] = [
  { id: "tab-cidadania", title: "Citizenship process", icon: Flag },
  { id: "tab-busca", title: "Document search", icon: Search },
  { id: "tab-traducao", title: "Document translation", icon: Languages },
  { id: "tab-transcricao", title: "USC transcription", icon: FileStack },
];

const mgmtItems: NavItem[] = [
  { id: "tab-financeiro", title: "Categorized finance", icon: PieChart },
];

type Props = {
  activeTab: TabId;
  onSelect: (id: TabId, title: string) => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
};

export default function AdminSidebar({ activeTab, onSelect, mobileOpen, onToggleMobile }: Props) {
  const renderNavList = (items: NavItem[]) => (
    <ul className="space-y-1 px-3">
      {items.map((item) => {
        const active = activeTab === item.id;
        const Icon = item.icon;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id, item.title)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="min-w-0 flex-1 leading-snug">{item.title}</span>
            </button>
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
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
            <div>
              <span className="text-lg font-bold tracking-tight text-sidebar-accent-foreground">
                Polonia4u<span className="text-primary">.</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleMobile}
              className="text-sidebar-foreground/80 hover:text-sidebar-accent-foreground md:hidden"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
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
      </aside>
    </>
  );
}
