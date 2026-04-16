"use client";

import type { LucideIcon } from "lucide-react";
import {
  DollarSign,
  FileStack,
  Handshake,
  Languages,
  Search,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DetailModule, FinViewId, ModalId, TabId } from "./admin-types";
import CrmKanban from "./CrmKanban";

/** Matches refer `Dashboard` KPI cards: gradient icon tile + label + value. */
function DashboardStyleKpiCard({
  label,
  value,
  icon: Icon,
  gradientClass,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  gradientClass: "gradient-primary" | "gradient-success" | "gradient-warning" | "gradient-danger" | "gradient-info";
}) {
  return (
    <Card className="card-shadow overflow-hidden border-0">
      <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4 md:p-5">
        <div
          className={cn(
            gradientClass,
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12",
          )}
        >
          <Icon className="h-5 w-5 text-primary-foreground md:h-6 md:w-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground md:text-sm">{label}</p>
          <div className="truncate text-lg font-bold text-foreground md:text-2xl">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Compact summary for finance sub-tabs — same KPI row pattern as refer Dashboard. */
function FinanceSummaryStrip({
  accent,
  label,
  value,
}: {
  accent: "primary" | "warning" | "success" | "info";
  label: string;
  value: string;
}) {
  const Icon = { primary: Handshake, warning: Search, success: FileStack, info: Languages }[accent];
  const grad = {
    primary: "gradient-primary",
    warning: "gradient-warning",
    success: "gradient-success",
    info: "gradient-info",
  }[accent];
  return (
    <Card className="card-shadow w-full max-w-md overflow-hidden border-0 sm:w-max">
      <CardContent className="flex items-center gap-3 p-4 sm:gap-4 md:p-5">
        <div className={cn(grad, "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12")}>
          <Icon className="h-5 w-5 text-primary-foreground md:h-6 md:w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground md:text-sm">{label}</p>
          <p className="text-lg font-bold tabular-nums text-foreground md:text-2xl">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/** Category chip colors — aligned with refer `Settings` role badges (admin/manager/agent). */
const financeCategoryBadge: Record<string, string> = {
  CITIZENSHIP: "border-transparent bg-primary text-primary-foreground",
  "TRANSCR.": "border-transparent bg-success text-success-foreground",
  "DOC SEARCH": "border-transparent bg-warning text-warning-foreground",
};

const waSmall = (
  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type Props = {
  activeTab: TabId;
  detailOpen: Record<DetailModule, boolean>;
  setDetail: (m: DetailModule, open: boolean) => void;
  finTab: FinViewId;
  setFinTab: (id: FinViewId) => void;
  openModal: (id: ModalId) => void;
};

export default function BackofficePanels({ activeTab, detailOpen, setDetail, finTab, setFinTab, openModal }: Props) {
  const hidden = (tab: TabId) => activeTab !== tab;

  return (
    <>
      {/* CRM — Kanban + table (see CrmKanban) */}
      <div
        className={cn(
          "view-tab flex min-h-0 flex-1 flex-col overflow-hidden bg-background p-3 fade-in md:p-6",
          hidden("tab-crm") && "hidden",
        )}
      >
        <CrmKanban />
      </div>

      {/* Preliminary analysis */}
      <div className={cn("view-tab flex flex-1 flex-col overflow-hidden bg-background fade-in", hidden("tab-analise") && "hidden")}>
        <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen.analise && "hidden")} id="analise-lista">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Preliminary analysis vault</h3>
            <p className="text-sm text-muted-foreground">Documents submitted in the eligibility test for review.</p>
          </div>
          <div className="custom-scroll refer-table-wrap flex-1 overflow-y-auto">
            <table className="refer-table min-w-[600px]">
              <thead className="refer-thead">
                <tr>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4">Internal status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-warning/10">
                  <td className="px-6 py-4 font-bold text-foreground">Roberto Carlos</td>
                  <td className="px-6 py-4">
                    <span className="rounded border border-warning/30 bg-warning/15 px-2 py-1 text-xs font-bold text-warning">
                      Awaiting review
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setDetail("analise", true)}
                      className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={cn("flex flex-1 flex-col overflow-hidden bg-background fade-in md:flex-row", !detailOpen.analise && "hidden")} id="analise-detalhe">
          <div className="custom-scroll flex w-full flex-col overflow-y-auto border-r bg-muted/40 p-6 md:w-1/3">
            <button type="button" onClick={() => setDetail("analise", false)} className="mb-6 w-max text-sm font-bold text-muted-foreground">
              ← Back
            </button>
            <h3 className="text-xl font-bold">Roberto Carlos</h3>
            <div className="mt-8 space-y-3">
              <button type="button" className="w-full rounded-lg bg-success py-3 text-sm font-bold text-success-foreground">
                Viable! Schedule call
              </button>
              <button type="button" className="w-full rounded-lg bg-warning py-3 text-sm font-bold text-warning-foreground">
                Sell search
              </button>
              <button type="button" className="w-full rounded-lg border border-destructive/30 bg-card py-3 text-sm font-bold text-destructive">
                Not viable
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col overflow-y-auto p-6 md:w-2/3">
            <h3 className="mb-4 border-b pb-4 font-bold">Documents submitted</h3>
            <div className="flex items-center justify-between rounded-xl border bg-muted/50 p-4">
              <span className="text-sm font-bold">Passaporte_Velho.jpg</span>
              <button type="button" className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary">
                View image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div className={cn("view-tab custom-scroll flex-1 overflow-y-auto bg-muted/50 p-4 fade-in md:p-6", hidden("tab-agenda") && "hidden")}>
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Today&apos;s agenda</h3>
            <p className="mt-1 text-sm text-muted-foreground">Friday, April 24</p>
          </div>
          <div className="mt-4 flex w-full gap-3 md:mt-0 md:w-auto">
            <button type="button" className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm hover:bg-muted/50 md:flex-none">
              View calendar
            </button>
            <button type="button" className="flex-1 refer-btn-primary px-4 py-2.5 text-sm md:flex-none">
              + New meeting
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="card-shadow flex flex-col gap-4 rounded-xl border border-border border-l-4 border-l-primary bg-card p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="rounded bg-primary/10 px-2 py-1 text-xs font-bold text-primary">14:00 - 14:30</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-destructive">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" /> In 10 min
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground">Souza family (Silvana)</h4>
                <p className="mt-1 text-sm text-muted-foreground">Citizenship closing (holder + 2 minors)</p>
              </div>
              <div className="mt-2 flex w-full gap-2 md:mt-0 md:w-auto">
                <button type="button" className="flex-1 rounded-lg bg-muted px-4 py-2.5 text-sm font-bold text-foreground hover:bg-muted/80 md:flex-none">
                  View record
                </button>
                <button type="button" className="flex flex-1 items-center justify-center gap-2 refer-btn-primary px-4 py-2.5 text-sm md:flex-none">
                  Join room
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="refer-kpi border-border">
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-foreground">Week summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Meetings today</span>
                  <span className="font-bold text-foreground">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-bold text-foreground">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">No-shows</span>
                  <span className="font-bold text-destructive">0</span>
                </div>
              </div>
              <button type="button" className="mt-6 w-full rounded-lg border border-border bg-muted/50 py-2.5 text-sm font-bold text-foreground transition hover:bg-muted">
                Connect Google Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sales proposals */}
      <div className={cn("view-tab flex-1 overflow-auto bg-background p-6", hidden("tab-prop-vendas") && "hidden")}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Active sales proposals</h3>
          <button
            type="button"
            onClick={() => openModal("modal-nova-proposta")}
            className="refer-btn-primary px-4 py-2 text-sm transition"
          >
            + Generate new proposal (120h link)
          </button>
        </div>
        <div className="refer-table-wrap">
          <table className="refer-table">
            <thead className="refer-thead">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Sales rep status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 font-bold">João Pedro</td>
                <td className="px-6 py-4">Document search</td>
                <td className="px-6 py-4">
                  <span className="rounded bg-primary/15 px-2 py-1 text-xs font-bold text-primary">In negotiation</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openModal("modal-enviar-proposta")}
                      className="flex items-center gap-1 rounded border border-success bg-success/10 px-3 py-1.5 text-xs font-bold text-success transition hover:bg-success/15"
                    >
                      {waSmall} WhatsApp
                    </button>
                    <button type="button" className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground transition hover:bg-muted/50">
                      Email
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending proposals */}
      <div className={cn("view-tab flex-1 overflow-auto bg-background p-6", hidden("tab-prop-aguardando") && "hidden")}>
        <h3 className="mb-6 text-lg font-bold text-foreground">Awaiting signature / payment</h3>
        <div className="refer-table-wrap">
          <table className="refer-table">
            <thead className="refer-thead">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Contract status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-warning/10">
                <td className="px-6 py-4 font-bold">Marcos Silva</td>
                <td className="px-6 py-4 font-bold">R$ 200,00</td>
                <td className="px-6 py-4">
                  <span className="rounded border border-warning/30 bg-warning/15 px-2 py-1 text-xs font-bold text-warning">
                    Awaiting PIX
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" className="rounded border border-border bg-card px-4 py-1.5 text-xs font-bold text-foreground transition hover:bg-muted/50">
                    Request payment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contracts */}
      <div className={cn("view-tab flex-1 overflow-auto bg-background p-6", hidden("tab-contratos") && "hidden")}>
        <h3 className="mb-6 text-lg font-bold">Active contract database</h3>
        <div className="refer-table-wrap">
          <table className="refer-table">
            <thead className="refer-thead">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Signature date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 font-bold">Silvana Gomes</td>
                <td className="px-6 py-4">Citizenship</td>
                <td className="px-6 py-4">Apr 12, 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizenship section */}

      <CitizenshipSection
        hidden={hidden("tab-cidadania")}
        detailOpen={detailOpen.cidadania}
        setDetail={setDetail}
        openModal={openModal}
      />

      <DocumentSearchSection hidden={hidden("tab-busca")} detailOpen={detailOpen.busca} setDetail={setDetail} />

      <TranslationSection hidden={hidden("tab-traducao")} detailOpen={detailOpen.traducao} setDetail={setDetail} />

      <TranscriptionSection hidden={hidden("tab-transcricao")} detailOpen={detailOpen.transcricao} setDetail={setDetail} />

      <FinanceSection hidden={hidden("tab-financeiro")} finTab={finTab} setFinTab={setFinTab} />
    </>
  );
}

function CitizenshipSection({
  hidden: isHidden,
  detailOpen,
  setDetail,
  openModal,
}: {
  hidden: boolean;
  detailOpen: boolean;
  setDetail: (m: DetailModule, open: boolean) => void;
  openModal: (id: ModalId) => void;
}) {
  if (isHidden) return null;
  return (
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-background fade-in">
      <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen && "hidden")}>
        <div className="mb-6 flex shrink-0 flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h3 className="text-lg font-bold text-foreground">Citizenship cases</h3>
          <div className="flex w-full gap-2 md:w-auto">
            <button type="button" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-muted/50">
              + Import legacy case
            </button>
            <button type="button" className="refer-btn-primary px-4 py-2 text-sm transition">
              + New case
            </button>
          </div>
        </div>
        <div className="custom-scroll refer-table-wrap flex-1 overflow-y-auto border-border">
          <table className="refer-table min-w-[700px]">
            <thead className="refer-thead sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Holder / family</th>
                <th className="px-6 py-4">Status / timeline</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-warning/15">
                <td className="px-6 py-4 font-bold text-foreground">Silvana Gomes</td>
                <td className="px-6 py-4">
                  <span className="flex w-max items-center gap-1 rounded-md border border-warning/30 bg-warning/15 px-2.5 py-1 text-xs font-bold text-warning">
                    Validate documents
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => setDetail("cidadania", true)}
                    className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold transition hover:bg-muted/50"
                  >
                    Open vault
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-background fade-in md:flex-row", !detailOpen && "hidden")}>
        <div className="custom-scroll flex h-full w-full shrink-0 flex-col overflow-y-auto border-r bg-muted/40 p-6 md:w-1/3">
          <button
            type="button"
            onClick={() => setDetail("cidadania", false)}
            className="mb-6 flex w-max items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-bold text-muted-foreground transition hover:text-foreground"
          >
            ← Back
          </button>
          <h3 className="text-xl font-bold">Silvana Gomes</h3>
          <div className="mt-8 space-y-4">
            <label className="mb-3 block text-xs font-bold uppercase text-muted-foreground">Timeline status</label>
            <select className="w-full rounded-lg border p-3 text-sm font-bold" defaultValue="sworn">
              <option value="analysis">Document analysis</option>
              <option value="sworn">Sworn translation</option>
            </select>
            <button type="button" className="w-full rounded-lg bg-foreground py-3 text-sm font-bold text-background shadow-md">
              Save update
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col overflow-y-auto p-6 md:w-2/3">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
            <h3 className="text-lg font-bold text-foreground">Document audit</h3>
            <button
              type="button"
              onClick={() => openModal("modal-contrato")}
              className="refer-btn-primary w-full px-5 py-2.5 text-sm sm:w-auto"
            >
              Generate contract PDF
            </button>
          </div>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/35 bg-primary/5 p-5 text-center">
            <span className="text-sm font-bold text-primary">Share document with client</span>
            <p className="mb-3 mt-1 text-xs text-primary/90">The file uploaded here will appear in the client portal.</p>
            <button type="button" className="refer-btn-primary px-4 py-2.5 text-xs transition">
              Attach and send
            </button>
          </div>
          <div className="flex flex-col rounded-xl border-2 border-warning/35 bg-warning/10 p-5">
            <h4 className="text-sm font-bold">Certidao_Nascimento_Joao.pdf</h4>
            <p className="mb-2 mt-0.5 text-[11px] font-bold text-warning">Awaiting audit</p>
            <div className="mt-2 flex gap-2 border-t border-warning/25 pt-4">
              <button type="button" className="refer-btn-primary flex-1 py-2.5 text-xs">
                View
              </button>
              <button type="button" className="flex-1 rounded-lg bg-success py-2.5 text-xs font-bold text-success-foreground shadow-sm transition hover:opacity-95">
                Approve
              </button>
              <button
                type="button"
                onClick={() => openModal("modal-recusa")}
                className="flex-1 rounded-lg border border-destructive/35 bg-card py-2.5 text-xs font-bold text-destructive shadow-sm transition hover:bg-destructive/10"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentSearchSection({
  hidden: isHidden,
  detailOpen,
  setDetail,
}: {
  hidden: boolean;
  detailOpen: boolean;
  setDetail: (m: DetailModule, open: boolean) => void;
}) {
  if (isHidden) return null;
  return (
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-background fade-in">
      <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen && "hidden")}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Document search</h3>
        </div>
        <div className="custom-scroll refer-table-wrap flex-1 overflow-y-auto">
          <table className="refer-table">
            <thead className="refer-thead sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Status / timeline</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 font-bold text-foreground">Carlos Almeida</td>
                <td className="px-6 py-4">
                  <span className="rounded border border-warning/30 bg-warning/10 px-2.5 py-1 text-xs font-bold text-warning">
                    National archive research
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" onClick={() => setDetail("busca", true)} className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold">
                    Open vault
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-background fade-in md:flex-row", !detailOpen && "hidden")}>
        <div className="custom-scroll w-full shrink-0 overflow-y-auto border-r bg-warning/10 p-6 md:w-1/3">
          <button
            type="button"
            onClick={() => setDetail("busca", false)}
            className="mb-6 w-max rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-bold text-muted-foreground"
          >
            ← Back
          </button>
          <h3 className="text-xl font-bold">Carlos Almeida</h3>
          <div className="mt-8">
            <label className="mb-3 block text-xs font-bold uppercase text-muted-foreground">Timeline</label>
            <select className="w-full rounded-lg border p-3 text-sm font-bold">
              <option>National archive research</option>
              <option>Report issuance</option>
            </select>
            <button type="button" className="mt-4 w-full rounded-lg bg-warning py-3 text-sm font-bold text-warning-foreground shadow-sm">
              Update client
            </button>
          </div>
        </div>
        <div className="custom-scroll flex w-full flex-col p-6 md:w-2/3">
          <h3 className="mb-4 border-b pb-4 text-lg font-bold">Search vault</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/35 bg-primary/5 p-5 text-center">
            <span className="text-sm font-bold text-primary">Share document with client</span>
            <p className="mb-3 mt-1 text-xs text-primary/90">The file uploaded here will appear in the client portal.</p>
            <button type="button" className="refer-btn-primary px-4 py-2.5 text-xs transition">
              Attach and send
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <span className="text-sm font-bold">Passaporte_Antigo.jpg</span>
            <button type="button" className="rounded border bg-muted/50 px-2 py-1 text-xs font-bold text-primary">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TranslationSection({
  hidden: isHidden,
  detailOpen,
  setDetail,
}: {
  hidden: boolean;
  detailOpen: boolean;
  setDetail: (m: DetailModule, open: boolean) => void;
}) {
  if (isHidden) return null;
  return (
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-background fade-in">
      <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen && "hidden")}>
        <h3 className="mb-6 text-lg font-bold">Quotes and translations</h3>
        <div className="custom-scroll refer-table-wrap flex-1 overflow-y-auto">
          <table className="refer-table">
            <thead className="refer-thead sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Internal status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-primary/10">
                <td className="px-6 py-4 font-bold text-foreground">Roberto Pereira</td>
                <td className="px-6 py-4">
                  <span className="rounded border border-primary/25 bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                    Awaiting quote
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" onClick={() => setDetail("traducao", true)} className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold">
                    Open request
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-background fade-in md:flex-row", !detailOpen && "hidden")}>
        <div className="custom-scroll w-full shrink-0 border-r bg-muted/40 p-6 md:w-1/3">
          <button type="button" onClick={() => setDetail("traducao", false)} className="mb-6 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-bold">
            ← Back
          </button>
          <h3 className="text-xl font-bold">Roberto Pereira</h3>
          <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h4 className="border-b pb-2 text-sm font-bold">Generate quote</h4>
            <input type="text" placeholder="Amount (BRL)" className="w-full rounded-lg border p-3 text-sm" />
            <button type="button" className="refer-btn-primary w-full py-3 text-sm">
              Send quote
            </button>
          </div>
        </div>
        <div className="overflow-y-auto p-6 md:w-2/3">
          <h3 className="mb-4 border-b pb-4 font-bold">Translation files</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/35 bg-primary/5 p-5 text-center">
            <span className="text-sm font-bold text-primary">Share document with client</span>
            <p className="mb-3 mt-1 text-xs text-primary/90">The file uploaded here will appear in the client portal.</p>
            <button type="button" className="refer-btn-primary px-4 py-2.5 text-xs transition">
              Attach and send
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-muted/50 p-4">
            <span className="text-sm font-bold">Historico_Escolar.pdf</span>
            <button type="button" className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptionSection({
  hidden: isHidden,
  detailOpen,
  setDetail,
}: {
  hidden: boolean;
  detailOpen: boolean;
  setDetail: (m: DetailModule, open: boolean) => void;
}) {
  if (isHidden) return null;
  return (
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-background fade-in">
      <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen && "hidden")}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Civil status transcriptions (USC)</h3>
        </div>
        <div className="custom-scroll refer-table-wrap flex-1 overflow-y-auto border-border">
          <table className="refer-table min-w-[700px]">
            <thead className="refer-thead sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status / timeline</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="transition hover:bg-muted/50">
                <td className="px-6 py-4 font-bold text-foreground">Amanda Silva</td>
                <td className="px-6 py-4">
                  <span className="rounded border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                    Awaiting physical originals
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" onClick={() => setDetail("transcricao", true)} className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold">
                    Open vault
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-background fade-in md:flex-row", !detailOpen && "hidden")}>
        <div className="custom-scroll w-full shrink-0 overflow-y-auto border-r bg-success/10 p-6 md:w-1/3">
          <button
            type="button"
            onClick={() => setDetail("transcricao", false)}
            className="mb-6 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-bold text-muted-foreground shadow-sm transition hover:text-foreground"
          >
            ← Back
          </button>
          <h3 className="text-xl font-bold text-foreground">Amanda Silva</h3>
          <div className="mt-8 space-y-4">
            <select className="w-full rounded-lg border p-3 text-sm font-bold">
              <option>Awaiting physical shipment</option>
              <option>Filed in Poland</option>
            </select>
            <button type="button" className="w-full rounded-lg bg-success py-3 text-sm font-bold text-success-foreground shadow-sm">
              Update client
            </button>
          </div>
        </div>
        <div className="overflow-y-auto bg-background p-6 md:w-2/3">
          <h3 className="mb-4 border-b pb-4 text-lg font-bold">Transcription vault</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/35 bg-primary/5 p-5 text-center">
            <span className="text-sm font-bold text-primary">Share document with client</span>
            <p className="mb-3 mt-1 text-xs text-primary/90">The file uploaded here will appear in the client portal.</p>
            <button type="button" className="refer-btn-primary px-4 py-2.5 text-xs transition">
              Attach and send
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <span className="text-sm font-bold">Cert_Casamento.pdf (digital)</span>
            <button type="button" className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinanceSection({
  hidden: isHidden,
  finTab,
  setFinTab,
}: {
  hidden: boolean;
  finTab: FinViewId;
  setFinTab: (id: FinViewId) => void;
}) {
  if (isHidden) return null;

  const finBtn = (id: FinViewId, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setFinTab(id)}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium transition",
        finTab === id
          ? "gradient-primary border-0 text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );

  const categoryClass = (code: string) =>
    financeCategoryBadge[code] ?? "border-transparent bg-secondary text-secondary-foreground";

  return (
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-muted/50 fade-in">
      <div className="shrink-0 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="custom-scroll flex flex-wrap gap-2">
          {finBtn("fin-geral", "Stripe & reconciliation")}
          {finBtn("fin-cidadania", "Citizenship")}
          {finBtn("fin-busca", "Document search")}
          {finBtn("fin-traducao", "Document translation")}
          {finBtn("fin-transcricao", "USC transcription")}
        </div>
      </div>

      <div className="custom-scroll flex-1 overflow-auto p-4 sm:p-6">
        <div className={cn("fin-view fade-in", finTab !== "fin-geral" && "hidden")}>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <Card className="card-shadow border-l-4 border-l-warning border-0">
              <CardContent className="p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-warning">Grace · pending_payment</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Days 1–29 overdue: portal stays open; yellow banner + automated email/WhatsApp with payment link.
                </p>
              </CardContent>
            </Card>
            <Card className="card-shadow border-l-4 border-l-destructive border-0">
              <CardContent className="p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-destructive">Hard lock · suspended</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  30+ days: downloads revoked; client sees restricted payment screen; admin alerted to pause ops.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-6">
            <DashboardStyleKpiCard
              label="Total revenue"
              value="R$ 42,500.00"
              icon={DollarSign}
              gradientClass="gradient-danger"
            />
            <DashboardStyleKpiCard
              label="Citizenship"
              value="R$ 38,000.00"
              icon={Users}
              gradientClass="gradient-primary"
            />
            <DashboardStyleKpiCard
              label="Document search"
              value="R$ 3,000.00"
              icon={Search}
              gradientClass="gradient-warning"
            />
            <DashboardStyleKpiCard
              label="Trans. / transcription"
              value="R$ 1,500.00"
              icon={FileStack}
              gradientClass="gradient-success"
            />
          </div>

          <Card className="card-shadow border-0">
            <CardHeader>
              <CardTitle className="text-base">Recent payments</CardTitle>
              <CardDescription>
                Stripe webhooks → ledger; Conta Azul POST for accounting (no native P&amp;L in-app — demo labels).
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <p className="font-medium text-foreground">Silvana Gomes</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("shrink-0", categoryClass("CITIZENSHIP"))}>CITIZENSHIP</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-success">+ R$ 1,250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <p className="font-medium text-foreground">Amanda Silva</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("shrink-0", categoryClass("TRANSCR."))}>TRANSCR.</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-success">+ R$ 2,400.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className={cn("fin-view fade-in space-y-6", finTab !== "fin-cidadania" && "hidden")}>
          <FinanceSummaryStrip accent="primary" label="Citizenship total" value="R$ 38,000.00" />
          <Card className="card-shadow border-0">
            <CardHeader>
              <CardTitle className="text-base">Installments</CardTitle>
              <CardDescription>Citizenship revenue by client (demo).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Installment</TableHead>
                    <TableHead className="text-right">Amount paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <p className="font-medium text-foreground">Silvana Gomes</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">01/12</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-success">+ R$ 1,250.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className={cn("fin-view fade-in space-y-6", finTab !== "fin-busca" && "hidden")}>
          <FinanceSummaryStrip accent="warning" label="Search total" value="R$ 3,000.00" />
          <Card className="card-shadow border-0">
            <CardHeader>
              <CardTitle className="text-base">Document search</CardTitle>
              <CardDescription>Payments recorded for archive research (demo).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Amount paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <p className="font-medium text-foreground">Carlos Almeida</p>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-success">+ R$ 200,00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className={cn("fin-view fade-in space-y-6", finTab !== "fin-traducao" && "hidden")}>
          <FinanceSummaryStrip accent="info" label="Translations total" value="R$ 1,500.00" />
          <Card className="card-shadow border-0">
            <CardHeader>
              <CardTitle className="text-base">Translation services</CardTitle>
              <CardDescription>Invoice-style view (demo).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Amount paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <p className="font-medium text-foreground">Roberto Pereira</p>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-success">+ R$ 850.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className={cn("fin-view fade-in space-y-6", finTab !== "fin-transcricao" && "hidden")}>
          <FinanceSummaryStrip accent="success" label="Transcriptions total" value="R$ 2,400.00" />
          <Card className="card-shadow border-0">
            <CardHeader>
              <CardTitle className="text-base">USC transcription</CardTitle>
              <CardDescription>Civil status filings (demo).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Amount paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <p className="font-medium text-foreground">Amanda Silva</p>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-success">+ R$ 2,400.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
