"use client";

import { useMemo, useState } from "react";
import {
  Clock,
  GitBranch,
  LayoutGrid,
  Link2,
  Shield,
  Table2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PipelineStage =
  | "acquisition"
  | "qualified"
  | "proposal"
  | "contract"
  | "active";

type LeadRow = {
  id: string;
  name: string;
  stage: PipelineStage;
  source: "triage" | "ecommerce" | "meta" | "referral";
  family?: string;
  nextAction: string;
  tags: string[];
};

const STAGES: { id: PipelineStage; title: string; hint: string }[] = [
  {
    id: "acquisition",
    title: "Acquisition",
    hint: "Triage wizard, exit intent, Meta/WhatsApp",
  },
  {
    id: "qualified",
    title: "Qualified",
    hint: "Hot leads only after full triage",
  },
  {
    id: "proposal",
    title: "Proposal",
    hint: "Secure link · manual override",
  },
  {
    id: "contract",
    title: "Contract and eSign",
    hint: "Clicksign or DocuSign · Stripe Checkout",
  },
  {
    id: "active",
    title: "Active case",
    hint: "Satellite contracts · independent payments",
  },
];

const DEMO_LEADS: LeadRow[] = [
  {
    id: "1",
    name: "Mariana Costa",
    stage: "acquisition",
    source: "meta",
    nextAction: "WhatsApp recovery (abandoned cart)",
    tags: ["Exit intent", "No PII stored"],
  },
  {
    id: "2",
    name: "Anonymous lead #4821",
    stage: "qualified",
    source: "triage",
    nextAction: "Schedule eligibility call; CRM received full wizard",
    tags: ["Triage complete", "Hot"],
  },
  {
    id: "3",
    name: "João Pedro",
    stage: "proposal",
    source: "ecommerce",
    nextAction: "120h proposal link · document search upsell",
    tags: ["Standalone SKU"],
  },
  {
    id: "4",
    name: "Souza family (Silvana)",
    stage: "contract",
    source: "referral",
    family: "Primary + 2 minors · 1 adult satellite",
    nextAction: "Dispatch eSign + per-party Stripe sessions",
    tags: ["Satellite", "LGPD split"],
  },
  {
    id: "5",
    name: "Fernanda Lima",
    stage: "active",
    source: "triage",
    nextAction: "Vault audit · EU certificates pending",
    tags: ["Holder", "Timeline"],
  },
];

function sourceBadge(source: LeadRow["source"]) {
  const variant: Record<LeadRow["source"], BadgeVariant> = {
    triage: "default",
    ecommerce: "info",
    meta: "secondary",
    referral: "success",
  };
  const label: Record<LeadRow["source"], string> = {
    triage: "Triage",
    ecommerce: "Online checkout",
    meta: "Meta / chat",
    referral: "Referral",
  };
  return (
    <Badge variant={variant[source]} className="shrink-0 text-[10px] font-bold uppercase">
      {label[source]}
    </Badge>
  );
}

export default function CrmKanban() {
  const [view, setView] = useState<"kanban" | "table">("kanban");

  const byStage = useMemo(() => {
    const m = new Map<PipelineStage, LeadRow[]>();
    for (const s of STAGES) m.set(s.id, []);
    for (const row of DEMO_LEADS) {
      m.get(row.stage)?.push(row);
    }
    return m;
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:gap-4">
      <div className="flex shrink-0 flex-col gap-3 border-b border-border/80 bg-background/95 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">CRM</p>
          <h2 className="truncate text-base font-semibold text-foreground md:text-lg">Lead pipeline</h2>
          <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">
            Kanban for funnel work; table for exports and bulk review. Row level security applies to real data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 pr-2.5 font-medium text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-success" aria-hidden />
            GDPR / LGPD by design
          </Badge>
          <div className="flex rounded-lg border border-border bg-card p-0.5 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setView("kanban")}
              className={cn(
                "gap-1.5 rounded-md px-2.5 text-xs font-semibold",
                view === "kanban"
                  ? "gradient-primary border-0 text-primary-foreground shadow-sm hover:opacity-95"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
              Kanban
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setView("table")}
              className={cn(
                "gap-1.5 rounded-md px-2.5 text-xs font-semibold",
                view === "table"
                  ? "gradient-primary border-0 text-primary-foreground shadow-sm hover:opacity-95"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Table2 className="h-3.5 w-3.5" aria-hidden />
              Table
            </Button>
          </div>
        </div>
      </div>

      {view === "kanban" ? (
        <div className="custom-scroll flex min-h-0 flex-1 gap-3 overflow-x-auto overflow-y-hidden pb-1 md:gap-4">
          {STAGES.map((col) => {
            const rows = byStage.get(col.id) ?? [];
            return (
              <div
                key={col.id}
                className="card-shadow flex h-full min-h-[280px] w-[min(100%,18rem)] shrink-0 flex-col rounded-xl border-0 bg-card sm:w-72 md:w-80"
              >
                <div className="flex shrink-0 flex-col gap-0.5 rounded-t-xl border-b border-border p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-tight text-foreground">{col.title}</h3>
                    <Badge variant="secondary" className="h-6 min-w-6 px-2 py-0 text-[11px] tabular-nums">
                      {rows.length}
                    </Badge>
                  </div>
                  <p className="text-[11px] leading-snug text-muted-foreground">{col.hint}</p>
                </div>
                <div className="custom-scroll flex-1 space-y-3 overflow-y-auto bg-muted/30 p-3 sm:p-4">
                  {rows.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-border bg-card/80 px-3 py-6 text-center text-xs text-muted-foreground">
                      No leads in this stage.
                    </p>
                  ) : (
                    rows.map((row) => (
                      <article
                        key={row.id}
                        className="card-shadow rounded-lg border-0 bg-card p-3 sm:p-4"
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {sourceBadge(row.source)}
                          {row.tags.slice(0, 2).map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px] font-bold uppercase">
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">{row.name}</h4>
                        {row.family ? (
                          <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                            <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                            {row.family}
                          </p>
                        ) : null}
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{row.nextAction}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 py-2 text-xs min-[340px]:flex-none min-[340px]:px-3"
                          >
                            Open record
                          </Button>
                          <Button
                            type="button"
                            className="flex flex-1 gap-1 bg-success py-2 text-xs text-success-foreground hover:opacity-95 min-[340px]:flex-none min-[340px]:px-3"
                          >
                            <GitBranch className="h-3.5 w-3.5" aria-hidden />
                            Move
                          </Button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="card-shadow flex min-h-0 flex-1 flex-col border-0 overflow-hidden">
          <CardContent className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
              <Table>
                <TableHeader className="refer-table-header">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Lead</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="hidden lg:table-cell">Next action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_LEADS.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium text-foreground">
                        <div className="flex flex-col gap-1">
                          <span>{row.name}</span>
                          {row.family ? (
                            <span className="text-xs font-normal text-muted-foreground">{row.family}</span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap capitalize text-muted-foreground">
                        {STAGES.find((s) => s.id === row.stage)?.title ?? row.stage}
                      </TableCell>
                      <TableCell>{sourceBadge(row.source)}</TableCell>
                      <TableCell className="hidden max-w-md text-muted-foreground lg:table-cell">
                        {row.nextAction}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border/80 pt-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          Triage: anonymous steps; PII only on the last step. No partial persistence.
        </span>
        <span className="hidden h-3 w-px bg-border sm:inline" aria-hidden />
        <span className="inline-flex items-center gap-1">
          <Link2 className="h-3.5 w-3.5" aria-hidden />
          Proposals: <code className="rounded bg-muted px-1 py-0.5 text-[10px]">/proposal/[uuid]</code> with expiry.
        </span>
      </div>
    </div>
  );
}
