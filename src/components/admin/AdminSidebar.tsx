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
  { id: "tab-crm", title: "Lead funnel", icon: Filter },
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

function isSalesTab(id: TabId) {
  return (
    id === "tab-crm" ||
    id === "tab-analise" ||
    id === "tab-agenda" ||
    id.startsWith("tab-prop") ||
    id === "tab-contratos"
  );
}

type Props = {
  activeTab: TabId;
  onSelect: (id: TabId, title: string) => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
};

export default function AdminSidebar({ activeTab, onSelect, mobileOpen, onToggleMobile }: Props) {
  const renderBtn = (item: NavItem) => {
    const active = activeTab === item.id;
    const Icon = item.icon;
    const sales = isSalesTab(item.id);
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelect(item.id, item.title)}
        className={cn(
          "menu-btn flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
          active && sales && "bg-blue-600 text-white shadow-sm",
          active && !sales && "bg-slate-800 text-white",
          !active && "text-slate-400 hover:bg-slate-800 hover:text-white",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {item.title}
      </button>
    );
  };

  return (
    <>
      <aside
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div>
          <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Polonia4u<span className="text-amber-500">.</span>
              </span>
            </div>
            <button type="button" onClick={onToggleMobile} className="text-slate-400 hover:text-white md:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="custom-scroll h-[calc(100vh-4rem)] space-y-6 overflow-y-auto p-4">
            <div>
              <p className="mb-2 ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Sales</p>
              <div className="space-y-1">{salesItems.map(renderBtn)}</div>
            </div>

            <div>
              <p className="mb-2 ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Operations</p>
              <div className="space-y-1">{opsItems.map(renderBtn)}</div>
            </div>

            <div>
              <p className="mb-2 ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Management</p>
              <div className="space-y-1">{mgmtItems.map(renderBtn)}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
