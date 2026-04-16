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
import { Badge, ScheduleDateBadge, type BadgeVariant } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DetailModule, FinViewId, ModalId, TabId } from "./admin-types";
import AdminStaffApprovals from "./AdminStaffApprovals";
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

/** Compact summary for finance sub-tabs; same KPI row pattern as refer Dashboard. */
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

/** Finance category → vibrant badge variant. */
const financeCategoryVariant: Record<string, BadgeVariant> = {
  CITIZENSHIP: "default",
  "TRANSCR.": "success",
  "DOC SEARCH": "warning",
};

function categoryVariant(code: string): BadgeVariant {
  return financeCategoryVariant[code] ?? "secondary";
}

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
      <div className={cn("view-tab flex min-h-0 flex-1 flex-col overflow-hidden", hidden("tab-staff-approvals") && "hidden")}>
        <AdminStaffApprovals />
      </div>

      {/* CRM: Kanban + table (see CrmKanban) */}
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
            <h3 className="text-lg font-semibold text-foreground">Preliminary analysis vault</h3>
            <p className="text-sm text-muted-foreground">Documents submitted in the eligibility test for review.</p>
          </div>
          <Card className="card-shadow flex min-h-0 flex-1 flex-col border-0 overflow-hidden">
            <CardContent className="custom-scroll flex min-h-0 flex-1 flex-col overflow-auto p-6">
              <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
                <Table>
                  <TableHeader className="refer-table-header">
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Lead</TableHead>
                      <TableHead>Internal status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">Roberto Carlos</TableCell>
                      <TableCell>
                        <Badge variant="warning" className="uppercase">
                          Awaiting review
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => setDetail("analise", true)}
                          className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold"
                        >
                          Review
                        </button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className={cn("flex flex-1 flex-col overflow-hidden bg-muted/20 fade-in md:flex-row", !detailOpen.analise && "hidden")} id="analise-detalhe">
          <aside className="custom-scroll flex w-full flex-col overflow-y-auto border-b border-border bg-card p-6 shadow-sm md:w-[min(100%,18rem)] md:border-b-0 md:border-r lg:w-80">
            <button
              type="button"
              onClick={() => setDetail("analise", false)}
              className="mb-6 inline-flex w-max items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              ← Back
            </button>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Lead</p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Roberto Carlos</h3>
            <div className="mt-8 space-y-2.5">
              <button type="button" className="w-full rounded-lg bg-success py-2.5 text-sm font-semibold text-success-foreground shadow-sm transition hover:opacity-95">
                Viable · schedule call
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-warning/50 bg-background py-2.5 text-sm font-semibold text-warning shadow-sm transition hover:bg-warning/5"
              >
                Sell search
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-destructive/40 bg-background py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/5"
              >
                Not viable
              </button>
            </div>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background p-6 md:p-8">
            <h3 className="mb-6 text-base font-semibold text-foreground">Documents submitted</h3>
            <div className="card-shadow flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <span className="min-w-0 truncate text-sm font-medium text-foreground">Passaporte_Velho.jpg</span>
              <button type="button" className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:bg-muted">
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
            <h3 className="text-2xl font-semibold text-foreground">Today&apos;s agenda</h3>
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
            <div className="card-shadow flex flex-col gap-4 rounded-xl border border-border bg-card p-5 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <ScheduleDateBadge dateLine="Apr 24" timeLine="14:00" />
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="warning">Meeting</Badge>
                    <Badge variant="info">Scheduled</Badge>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
                      In 10 min
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">Souza family (Silvana)</h4>
                  <p className="mt-1 text-sm text-muted-foreground">Citizenship closing (holder + 2 minors)</p>
                </div>
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
          <h3 className="text-lg font-semibold text-foreground">Active sales proposals</h3>
          <button
            type="button"
            onClick={() => openModal("modal-nova-proposta")}
            className="refer-btn-primary px-4 py-2 text-sm transition"
          >
            + Generate new proposal (120h link)
          </button>
        </div>
        <Card className="card-shadow border-0">
          <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
            <Table>
              <TableHeader className="refer-table-header">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Sales rep status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-foreground">João Pedro</TableCell>
                  <TableCell>Document search</TableCell>
                  <TableCell>
                    <Badge variant="default">In negotiation</Badge>
                  </TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pending proposals */}
      <div className={cn("view-tab flex-1 overflow-auto bg-background p-6", hidden("tab-prop-aguardando") && "hidden")}>
        <h3 className="mb-6 text-lg font-semibold text-foreground">Awaiting signature / payment</h3>
        <Card className="card-shadow border-0">
          <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
            <Table>
              <TableHeader className="refer-table-header">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Contract status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">Marcos Silva</TableCell>
                  <TableCell className="font-semibold tabular-nums">R$ 200,00</TableCell>
                  <TableCell>
                    <Badge variant="warning">Awaiting PIX</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button type="button" className="rounded border border-border bg-card px-4 py-1.5 text-xs font-bold text-foreground transition hover:bg-muted/50">
                      Request payment
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Contracts */}
      <div className={cn("view-tab flex-1 overflow-auto bg-background p-6", hidden("tab-contratos") && "hidden")}>
        <h3 className="mb-6 text-lg font-semibold text-foreground">Active contract database</h3>
        <Card className="card-shadow border-0">
          <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
            <Table>
              <TableHeader className="refer-table-header">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Signature date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-foreground">Silvana Gomes</TableCell>
                  <TableCell>Citizenship</TableCell>
                  <TableCell>Apr 12, 2026</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
          <h3 className="text-lg font-semibold text-foreground">Citizenship cases</h3>
          <div className="flex w-full gap-2 md:w-auto">
            <button type="button" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-muted/50">
              + Import legacy case
            </button>
            <button type="button" className="refer-btn-primary px-4 py-2 text-sm transition">
              + New case
            </button>
          </div>
        </div>
        <Card className="card-shadow flex min-h-0 flex-1 flex-col border-0 overflow-hidden">
          <CardContent className="custom-scroll flex min-h-0 flex-1 flex-col overflow-auto p-6">
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header sticky top-0 z-10 bg-card">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Holder / family</TableHead>
                    <TableHead>Status / timeline</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">Silvana Gomes</TableCell>
                    <TableCell>
                      <Badge variant="warning" className="w-max">
                        Validate documents
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => setDetail("cidadania", true)}
                        className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold transition hover:bg-muted/50"
                      >
                        Open vault
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-muted/20 fade-in md:flex-row", !detailOpen && "hidden")}>
        <aside className="custom-scroll flex h-full w-full shrink-0 flex-col overflow-y-auto border-b border-border bg-card p-6 shadow-sm md:w-[min(100%,18rem)] md:border-b-0 md:border-r lg:w-80">
          <button
            type="button"
            onClick={() => setDetail("cidadania", false)}
            className="mb-6 inline-flex w-max items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ← Back
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Case</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Silvana Gomes</h3>
          <div className="mt-8 space-y-4">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Timeline status</label>
            <Select defaultValue="sworn">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="analysis">Document analysis</SelectItem>
                <SelectItem value="sworn">Sworn translation</SelectItem>
              </SelectContent>
            </Select>
            <button type="button" className="w-full rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background shadow-sm transition hover:opacity-95">
              Save update
            </button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background p-6 md:p-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-base font-semibold text-foreground">Document audit</h3>
            <button
              type="button"
              onClick={() => openModal("modal-contrato")}
              className="refer-btn-primary w-full px-5 py-2.5 text-sm sm:w-auto"
            >
              Generate contract PDF
            </button>
          </div>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-muted/20 p-6 text-center">
            <span className="text-sm font-semibold text-foreground">Share document with client</span>
            <p className="mb-4 mt-1 max-w-sm text-xs text-muted-foreground">Uploaded files appear in the client portal vault.</p>
            <button type="button" className="refer-btn-primary px-4 py-2 text-xs transition">
              Attach and send
            </button>
          </div>
          <div className="card-shadow rounded-xl border border-border border-l-4 border-l-warning bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-foreground">Certidao_Nascimento_Joao.pdf</h4>
              <Badge variant="warning">Awaiting audit</Badge>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              <button type="button" className="refer-btn-primary flex-1 py-2.5 text-xs min-[400px]:flex-none min-[400px]:px-4">
                View
              </button>
              <button type="button" className="flex-1 rounded-lg bg-success py-2.5 text-xs font-semibold text-success-foreground shadow-sm transition hover:opacity-95 min-[400px]:flex-none min-[400px]:px-4">
                Approve
              </button>
              <button
                type="button"
                onClick={() => openModal("modal-recusa")}
                className="flex-1 rounded-lg border border-destructive/40 bg-background py-2.5 text-xs font-semibold text-destructive transition hover:bg-destructive/5 min-[400px]:flex-none min-[400px]:px-4"
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
          <h3 className="text-lg font-semibold text-foreground">Document search</h3>
        </div>
        <Card className="card-shadow flex min-h-0 flex-1 flex-col border-0 overflow-hidden">
          <CardContent className="custom-scroll flex min-h-0 flex-1 flex-col overflow-auto p-6">
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header sticky top-0 z-10 bg-card">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Applicant</TableHead>
                    <TableHead>Status / timeline</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Carlos Almeida</TableCell>
                    <TableCell>
                      <Badge variant="warning">National archive research</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button type="button" onClick={() => setDetail("busca", true)} className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold">
                        Open vault
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-muted/20 fade-in md:flex-row", !detailOpen && "hidden")}>
        <aside className="custom-scroll w-full shrink-0 overflow-y-auto border-b border-border bg-card p-6 shadow-sm md:w-[min(100%,18rem)] md:border-b-0 md:border-r lg:w-80">
          <button
            type="button"
            onClick={() => setDetail("busca", false)}
            className="mb-6 inline-flex w-max items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ← Back
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Applicant</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Carlos Almeida</h3>
          <div className="mt-8 space-y-4">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">Timeline</label>
            <Select defaultValue="research">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose stage" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="research">National archive research</SelectItem>
                <SelectItem value="report">Report issuance</SelectItem>
              </SelectContent>
            </Select>
            <button type="button" className="w-full rounded-lg border border-warning/50 bg-background py-2.5 text-sm font-semibold text-warning shadow-sm transition hover:bg-warning/5">
              Update client
            </button>
          </div>
        </aside>
        <div className="custom-scroll flex min-w-0 flex-1 flex-col bg-background p-6 md:p-8">
          <h3 className="mb-6 text-base font-semibold text-foreground">Search vault</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-muted/20 p-6 text-center">
            <span className="text-sm font-semibold text-foreground">Share document with client</span>
            <p className="mb-4 mt-1 max-w-sm text-xs text-muted-foreground">Uploaded files appear in the client portal vault.</p>
            <button type="button" className="refer-btn-primary px-4 py-2 text-xs transition">
              Attach and send
            </button>
          </div>
          <div className="card-shadow flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <span className="min-w-0 truncate text-sm font-medium text-foreground">Passaporte_Antigo.jpg</span>
            <button type="button" className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:bg-muted">
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
        <h3 className="mb-6 text-lg font-semibold text-foreground">Quotes and translations</h3>
        <Card className="card-shadow flex min-h-0 flex-1 flex-col border-0 overflow-hidden">
          <CardContent className="custom-scroll flex min-h-0 flex-1 flex-col overflow-auto p-6">
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header sticky top-0 z-10 bg-card">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Client</TableHead>
                    <TableHead>Internal status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">Roberto Pereira</TableCell>
                    <TableCell>
                      <Badge variant="default">Awaiting quote</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button type="button" onClick={() => setDetail("traducao", true)} className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold">
                        Open request
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-muted/20 fade-in md:flex-row", !detailOpen && "hidden")}>
        <aside className="custom-scroll w-full shrink-0 border-b border-border bg-card p-6 shadow-sm md:w-[min(100%,18rem)] md:border-b-0 md:border-r lg:w-80">
          <button
            type="button"
            onClick={() => setDetail("traducao", false)}
            className="mb-6 inline-flex w-max items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ← Back
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Client</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Roberto Pereira</h3>
          <div className="mt-8 space-y-4 rounded-xl border border-border bg-background p-4 shadow-sm">
            <h4 className="border-b border-border pb-2 text-sm font-semibold text-foreground">Generate quote</h4>
            <input
              type="text"
              placeholder="Amount (BRL)"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-sm"
            />
            <button type="button" className="refer-btn-primary w-full py-2.5 text-sm">
              Send quote
            </button>
          </div>
        </aside>
        <div className="min-w-0 flex-1 overflow-y-auto bg-background p-6 md:p-8">
          <h3 className="mb-6 text-base font-semibold text-foreground">Translation files</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-muted/20 p-6 text-center">
            <span className="text-sm font-semibold text-foreground">Share document with client</span>
            <p className="mb-4 mt-1 max-w-sm text-xs text-muted-foreground">Uploaded files appear in the client portal vault.</p>
            <button type="button" className="refer-btn-primary px-4 py-2 text-xs transition">
              Attach and send
            </button>
          </div>
          <div className="card-shadow flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <span className="min-w-0 truncate text-sm font-medium text-foreground">Historico_Escolar.pdf</span>
            <button type="button" className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:bg-muted">
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
          <h3 className="text-lg font-semibold text-foreground">Civil status transcriptions (USC)</h3>
        </div>
        <Card className="card-shadow flex min-h-0 flex-1 flex-col border-0 overflow-hidden">
          <CardContent className="custom-scroll flex min-h-0 flex-1 flex-col overflow-auto p-6">
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header sticky top-0 z-10 bg-card">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Client</TableHead>
                    <TableHead>Status / timeline</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="transition hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">Amanda Silva</TableCell>
                    <TableCell>
                      <Badge variant="success">Awaiting physical originals</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button type="button" onClick={() => setDetail("transcricao", true)} className="rounded border border-border bg-card px-3 py-1.5 text-xs font-bold">
                        Open vault
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-muted/20 fade-in md:flex-row", !detailOpen && "hidden")}>
        <aside className="custom-scroll w-full shrink-0 overflow-y-auto border-b border-border bg-card p-6 shadow-sm md:w-[min(100%,18rem)] md:border-b-0 md:border-r lg:w-80">
          <button
            type="button"
            onClick={() => setDetail("transcricao", false)}
            className="mb-6 inline-flex w-max items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            ← Back
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Client</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Amanda Silva</h3>
          <div className="mt-8 space-y-4">
            <Select defaultValue="shipment">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="shipment">Awaiting physical shipment</SelectItem>
                <SelectItem value="filed">Filed in Poland</SelectItem>
              </SelectContent>
            </Select>
            <button type="button" className="w-full rounded-lg bg-success py-2.5 text-sm font-semibold text-success-foreground shadow-sm transition hover:opacity-95">
              Update client
            </button>
          </div>
        </aside>
        <div className="min-w-0 flex-1 overflow-y-auto bg-background p-6 md:p-8">
          <h3 className="mb-6 text-base font-semibold text-foreground">Transcription vault</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/25 bg-muted/20 p-6 text-center">
            <span className="text-sm font-semibold text-foreground">Share document with client</span>
            <p className="mb-4 mt-1 max-w-sm text-xs text-muted-foreground">Uploaded files appear in the client portal vault.</p>
            <button type="button" className="refer-btn-primary px-4 py-2 text-xs transition">
              Attach and send
            </button>
          </div>
          <div className="card-shadow flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <span className="min-w-0 truncate text-sm font-medium text-foreground">Cert_Casamento.pdf (digital)</span>
            <button type="button" className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold shadow-sm transition hover:bg-muted">
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
                  Days 1 to 29 overdue: portal stays open; yellow banner + automated email/WhatsApp with payment link.
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
              <CardTitle className="text-base font-semibold">Recent payments</CardTitle>
              <CardDescription>
                Stripe webhooks → ledger; Conta Azul POST for accounting (no native P&amp;L in-app; demo labels).
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header">
                  <TableRow className="hover:bg-transparent">
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
                      <Badge variant={categoryVariant("CITIZENSHIP")} className="shrink-0 uppercase">
                        CITIZENSHIP
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-success">+ R$ 1,250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <p className="font-medium text-foreground">Amanda Silva</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={categoryVariant("TRANSCR.")} className="shrink-0">
                        TRANSCR.
                      </Badge>
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
              <CardTitle className="text-base font-semibold">Installments</CardTitle>
              <CardDescription>Citizenship revenue by client (demo).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header">
                  <TableRow className="hover:bg-transparent">
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
              <CardTitle className="text-base font-semibold">Document search</CardTitle>
              <CardDescription>Payments recorded for archive research (demo).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header">
                  <TableRow className="hover:bg-transparent">
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
              <CardTitle className="text-base font-semibold">Translation services</CardTitle>
              <CardDescription>Invoice-style view (demo).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header">
                  <TableRow className="hover:bg-transparent">
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
              <CardTitle className="text-base font-semibold">USC transcription</CardTitle>
              <CardDescription>Civil status filings (demo).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header">
                  <TableRow className="hover:bg-transparent">
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
