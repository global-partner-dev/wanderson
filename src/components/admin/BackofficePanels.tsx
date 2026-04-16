"use client";

import { cn } from "@/lib/utils";
import type { DetailModule, FinViewId, ModalId, TabId } from "./admin-types";

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
      {/* CRM */}
      <div
        className={cn(
          "view-tab custom-scroll flex-1 overflow-x-auto overflow-y-hidden bg-background p-3 fade-in md:p-6",
          hidden("tab-crm") && "hidden",
        )}
      >
        <div className="flex h-full min-w-max gap-4 pb-2 md:gap-6">
          {/* Kanban columns — card shell + inner cards like refer Tasks */}
          <div className="card-shadow flex h-full w-72 flex-col rounded-xl border-0 bg-card md:w-80">
            <div className="flex shrink-0 items-center justify-between rounded-t-xl border-b border-border p-3 sm:p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" /> Queue / pop-up
              </h3>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                1
              </span>
            </div>
            <div className="custom-scroll flex-1 space-y-3 overflow-y-auto bg-muted/30 p-3 sm:p-4">
              <div className="card-shadow cursor-pointer rounded-lg border-0 border-l-4 border-l-destructive bg-card p-3 sm:p-4">
                <div className="mb-2 flex items-start justify-between">
                  <span className="rounded bg-destructive/15 px-2 py-1 text-[10px] font-bold uppercase text-destructive">Abandoned</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">Mariana Costa</h4>
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg bg-success py-2 text-xs font-semibold text-success-foreground transition hover:opacity-95"
                >
                  Message on WhatsApp
                </button>
              </div>
            </div>
          </div>

          <div className="card-shadow flex h-full w-72 flex-col rounded-xl border-0 bg-card md:w-80">
            <div className="flex shrink-0 items-center justify-between rounded-t-xl border-b border-border p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-foreground">Eligible (no documents)</h3>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                1
              </span>
            </div>
            <div className="custom-scroll flex-1 space-y-3 overflow-y-auto bg-muted/30 p-3 sm:p-4">
              <div className="card-shadow rounded-lg border-0 bg-card p-3 sm:p-4">
                <h4 className="text-sm font-semibold text-foreground">Carlos Almeida</h4>
                <p className="mt-1 text-xs text-muted-foreground">Knows the grandfather line; no certificates yet.</p>
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg border border-warning/40 bg-warning/10 py-2 text-xs font-semibold text-warning transition hover:bg-warning/15"
                >
                  Sell document search
                </button>
              </div>
            </div>
          </div>

          <div className="card-shadow flex h-full w-72 flex-col rounded-xl border-0 bg-card md:w-80">
            <div className="flex shrink-0 items-center justify-between rounded-t-xl border-b border-border p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-foreground">Eligible (with documents)</h3>
              <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                1
              </span>
            </div>
            <div className="custom-scroll flex-1 space-y-3 overflow-y-auto bg-muted/30 p-3 sm:p-4">
              <div className="card-shadow rounded-lg border-0 bg-card p-3 sm:p-4">
                <div className="mb-2 flex items-start justify-between">
                  <span className="rounded bg-success/15 px-2 py-1 text-[10px] font-bold uppercase text-success">Hot lead</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">Fernanda Lima</h4>
                <p className="mt-1 text-xs text-muted-foreground">Has full transcript certificate.</p>
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg border-0 bg-gradient-to-br from-[hsl(222_100%_64%)] to-[hsl(252_90%_65%)] py-2 text-xs font-semibold text-primary-foreground shadow-sm"
                >
                  Schedule call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preliminary analysis */}
      <div className={cn("view-tab flex flex-1 flex-col overflow-hidden bg-white fade-in", hidden("tab-analise") && "hidden")}>
        <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen.analise && "hidden")} id="analise-lista">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Preliminary analysis vault</h3>
            <p className="text-sm text-slate-500">Documents submitted in the eligibility test for review.</p>
          </div>
          <div className="custom-scroll flex-1 overflow-y-auto rounded-xl border bg-white shadow-sm">
            <table className="min-w-[600px] w-full text-left text-sm text-slate-600">
              <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4">Internal status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-amber-50/20">
                  <td className="px-6 py-4 font-bold text-slate-800">Roberto Carlos</td>
                  <td className="px-6 py-4">
                    <span className="rounded border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                      Awaiting review
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setDetail("analise", true)}
                      className="rounded border bg-white px-3 py-1.5 text-xs font-bold"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={cn("flex flex-1 flex-col overflow-hidden bg-white fade-in md:flex-row", !detailOpen.analise && "hidden")} id="analise-detalhe">
          <div className="custom-scroll flex w-full flex-col overflow-y-auto border-r bg-slate-50/50 p-6 md:w-1/3">
            <button type="button" onClick={() => setDetail("analise", false)} className="mb-6 w-max text-sm font-bold text-slate-500">
              ← Back
            </button>
            <h3 className="text-xl font-bold">Roberto Carlos</h3>
            <div className="mt-8 space-y-3">
              <button type="button" className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-bold text-white">
                Viable! Schedule call
              </button>
              <button type="button" className="w-full rounded-lg bg-amber-500 py-3 text-sm font-bold text-slate-900">
                Sell search
              </button>
              <button type="button" className="w-full rounded-lg border border-red-200 bg-white py-3 text-sm font-bold text-red-600">
                Not viable
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col overflow-y-auto p-6 md:w-2/3">
            <h3 className="mb-4 border-b pb-4 font-bold">Documents submitted</h3>
            <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-4">
              <span className="text-sm font-bold">Passaporte_Velho.jpg</span>
              <button type="button" className="rounded border bg-white px-3 py-1.5 text-xs font-bold text-blue-600">
                View image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agenda */}
      <div className={cn("view-tab custom-scroll flex-1 overflow-y-auto bg-slate-50 p-4 fade-in md:p-6", hidden("tab-agenda") && "hidden")}>
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Today&apos;s agenda</h3>
            <p className="mt-1 text-sm text-slate-500">Friday, April 24</p>
          </div>
          <div className="mt-4 flex w-full gap-3 md:mt-0 md:w-auto">
            <button type="button" className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 md:flex-none">
              View calendar
            </button>
            <button type="button" className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 md:flex-none">
              + New meeting
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 border-l-4 border-l-blue-500 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">14:00 - 14:30</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> In 10 min
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-800">Souza family (Silvana)</h4>
                <p className="mt-1 text-sm text-slate-500">Citizenship closing (holder + 2 minors)</p>
              </div>
              <div className="mt-2 flex w-full gap-2 md:mt-0 md:w-auto">
                <button type="button" className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 md:flex-none">
                  View record
                </button>
                <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 md:flex-none">
                  Join room
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-800">Week summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Meetings today</span>
                  <span className="font-bold text-slate-800">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Pending</span>
                  <span className="font-bold text-slate-800">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">No-shows</span>
                  <span className="font-bold text-red-500">0</span>
                </div>
              </div>
              <button type="button" className="mt-6 w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
                Connect Google Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sales proposals */}
      <div className={cn("view-tab flex-1 overflow-auto bg-white p-6", hidden("tab-prop-vendas") && "hidden")}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Active sales proposals</h3>
          <button
            type="button"
            onClick={() => openModal("modal-nova-proposta")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Generate new proposal (120h link)
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
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
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">In negotiation</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openModal("modal-enviar-proposta")}
                      className="flex items-center gap-1 rounded border border-green-500 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-100"
                    >
                      {waSmall} WhatsApp
                    </button>
                    <button type="button" className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
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
      <div className={cn("view-tab flex-1 overflow-auto bg-white p-6", hidden("tab-prop-aguardando") && "hidden")}>
        <h3 className="mb-6 text-lg font-bold text-slate-800">Awaiting signature / payment</h3>
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Contract status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-amber-50/20">
                <td className="px-6 py-4 font-bold">Marcos Silva</td>
                <td className="px-6 py-4 font-bold">€ 200.00</td>
                <td className="px-6 py-4">
                  <span className="rounded border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                    Awaiting PIX
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" className="rounded border bg-white px-4 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                    Request payment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contracts */}
      <div className={cn("view-tab flex-1 overflow-auto bg-white p-6", hidden("tab-contratos") && "hidden")}>
        <h3 className="mb-6 text-lg font-bold">Active contract database</h3>
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
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
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-white fade-in">
      <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen && "hidden")}>
        <div className="mb-6 flex shrink-0 flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h3 className="text-lg font-bold text-slate-800">Citizenship cases</h3>
          <div className="flex w-full gap-2 md:w-auto">
            <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
              + Import legacy case
            </button>
            <button type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">
              + New case
            </button>
          </div>
        </div>
        <div className="custom-scroll flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[700px] w-full text-left text-sm text-slate-600">
            <thead className="sticky top-0 border-b bg-slate-50 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Holder / family</th>
                <th className="px-6 py-4">Status / timeline</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-amber-50/40">
                <td className="px-6 py-4 font-bold text-slate-800">Silvana Gomes</td>
                <td className="px-6 py-4">
                  <span className="flex w-max items-center gap-1 rounded-md border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                    Validate documents
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => setDetail("cidadania", true)}
                    className="rounded border bg-white px-3 py-1.5 text-xs font-bold transition hover:bg-slate-50"
                  >
                    Open vault
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-white fade-in md:flex-row", !detailOpen && "hidden")}>
        <div className="custom-scroll flex h-full w-full shrink-0 flex-col overflow-y-auto border-r bg-slate-50/50 p-6 md:w-1/3">
          <button
            type="button"
            onClick={() => setDetail("cidadania", false)}
            className="mb-6 flex w-max items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm font-bold text-slate-500 transition hover:text-slate-800"
          >
            ← Back
          </button>
          <h3 className="text-xl font-bold">Silvana Gomes</h3>
          <div className="mt-8 space-y-4">
            <label className="mb-3 block text-xs font-bold uppercase text-slate-600">Timeline status</label>
            <select className="w-full rounded-lg border p-3 text-sm font-bold" defaultValue="sworn">
              <option value="analysis">Document analysis</option>
              <option value="sworn">Sworn translation</option>
            </select>
            <button type="button" className="w-full rounded-lg bg-slate-900 py-3 text-sm font-bold text-white shadow-md">
              Save update
            </button>
          </div>
        </div>
        <div className="flex w-full flex-col overflow-y-auto p-6 md:w-2/3">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
            <h3 className="text-lg font-bold text-slate-800">Document audit</h3>
            <button
              type="button"
              onClick={() => openModal("modal-contrato")}
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
            >
              Generate contract PDF
            </button>
          </div>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-5 text-center">
            <span className="text-sm font-bold text-blue-800">Share document with client</span>
            <p className="mb-3 mt-1 text-xs text-blue-600">The file uploaded here will appear in the client portal.</p>
            <button type="button" className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
              Attach and send
            </button>
          </div>
          <div className="flex flex-col rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
            <h4 className="text-sm font-bold">Certidao_Nascimento_Joao.pdf</h4>
            <p className="mb-2 mt-0.5 text-[11px] font-bold text-amber-800">Awaiting audit</p>
            <div className="mt-2 flex gap-2 border-t border-amber-200/60 pt-4">
              <button type="button" className="flex-1 rounded-lg bg-blue-500 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-600">
                View
              </button>
              <button type="button" className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-600">
                Approve
              </button>
              <button
                type="button"
                onClick={() => openModal("modal-recusa")}
                className="flex-1 rounded-lg border border-red-300 bg-white py-2.5 text-xs font-bold text-red-600 shadow-sm transition hover:bg-red-50"
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
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-white fade-in">
      <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen && "hidden")}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Document search</h3>
        </div>
        <div className="custom-scroll flex-1 overflow-y-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="sticky top-0 border-b bg-slate-50 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Status / timeline</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-800">Carlos Almeida</td>
                <td className="px-6 py-4">
                  <span className="rounded border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                    National archive research
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" onClick={() => setDetail("busca", true)} className="rounded border bg-white px-3 py-1.5 text-xs font-bold">
                    Open vault
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-white fade-in md:flex-row", !detailOpen && "hidden")}>
        <div className="custom-scroll w-full shrink-0 overflow-y-auto border-r bg-amber-50/20 p-6 md:w-1/3">
          <button
            type="button"
            onClick={() => setDetail("busca", false)}
            className="mb-6 w-max rounded-lg border bg-white px-3 py-1.5 text-sm font-bold text-slate-500"
          >
            ← Back
          </button>
          <h3 className="text-xl font-bold">Carlos Almeida</h3>
          <div className="mt-8">
            <label className="mb-3 block text-xs font-bold uppercase text-slate-600">Timeline</label>
            <select className="w-full rounded-lg border p-3 text-sm font-bold">
              <option>National archive research</option>
              <option>Report issuance</option>
            </select>
            <button type="button" className="mt-4 w-full rounded-lg bg-amber-500 py-3 text-sm font-bold text-slate-900 shadow-sm">
              Update client
            </button>
          </div>
        </div>
        <div className="custom-scroll flex w-full flex-col p-6 md:w-2/3">
          <h3 className="mb-4 border-b pb-4 text-lg font-bold">Search vault</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-5 text-center">
            <span className="text-sm font-bold text-blue-800">Share document with client</span>
            <p className="mb-3 mt-1 text-xs text-blue-600">The file uploaded here will appear in the client portal.</p>
            <button type="button" className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
              Attach and send
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-white p-4">
            <span className="text-sm font-bold">Passaporte_Antigo.jpg</span>
            <button type="button" className="rounded border bg-slate-50 px-2 py-1 text-xs font-bold text-blue-600">
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
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-white fade-in">
      <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen && "hidden")}>
        <h3 className="mb-6 text-lg font-bold">Quotes and translations</h3>
        <div className="custom-scroll flex-1 overflow-y-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b bg-slate-50 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Internal status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50/20">
                <td className="px-6 py-4 font-bold text-slate-800">Roberto Pereira</td>
                <td className="px-6 py-4">
                  <span className="rounded border border-blue-200 bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800">
                    Awaiting quote
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" onClick={() => setDetail("traducao", true)} className="rounded border bg-white px-3 py-1.5 text-xs font-bold">
                    Open request
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-white fade-in md:flex-row", !detailOpen && "hidden")}>
        <div className="custom-scroll w-full shrink-0 border-r bg-slate-50/50 p-6 md:w-1/3">
          <button type="button" onClick={() => setDetail("traducao", false)} className="mb-6 rounded-lg border bg-white px-3 py-1.5 text-sm font-bold">
            ← Back
          </button>
          <h3 className="text-xl font-bold">Roberto Pereira</h3>
          <div className="mt-8 space-y-4 rounded-xl border bg-white p-4 shadow-sm">
            <h4 className="border-b pb-2 text-sm font-bold">Generate quote</h4>
            <input type="text" placeholder="Amount (BRL)" className="w-full rounded-lg border p-3 text-sm" />
            <button type="button" className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white transition">
              Send quote
            </button>
          </div>
        </div>
        <div className="overflow-y-auto p-6 md:w-2/3">
          <h3 className="mb-4 border-b pb-4 font-bold">Translation files</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-5 text-center">
            <span className="text-sm font-bold text-blue-800">Share document with client</span>
            <p className="mb-3 mt-1 text-xs text-blue-600">The file uploaded here will appear in the client portal.</p>
            <button type="button" className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
              Attach and send
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-4">
            <span className="text-sm font-bold">Historico_Escolar.pdf</span>
            <button type="button" className="rounded border bg-white px-3 py-1.5 text-xs font-bold text-blue-600">
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
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-white fade-in">
      <div className={cn("flex flex-1 flex-col overflow-hidden p-6", detailOpen && "hidden")}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Civil status transcriptions (USC)</h3>
        </div>
        <div className="custom-scroll flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-[700px] w-full text-left text-sm text-slate-600">
            <thead className="sticky top-0 border-b bg-slate-50 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status / timeline</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="transition hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">Amanda Silva</td>
                <td className="px-6 py-4">
                  <span className="rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Awaiting physical originals
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" onClick={() => setDetail("transcricao", true)} className="rounded border bg-white px-3 py-1.5 text-xs font-bold">
                    Open vault
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col overflow-hidden bg-white fade-in md:flex-row", !detailOpen && "hidden")}>
        <div className="custom-scroll w-full shrink-0 overflow-y-auto border-r bg-emerald-50/20 p-6 md:w-1/3">
          <button
            type="button"
            onClick={() => setDetail("transcricao", false)}
            className="mb-6 rounded-lg border bg-white px-3 py-1.5 text-sm font-bold text-slate-500 shadow-sm transition hover:text-slate-800"
          >
            ← Back
          </button>
          <h3 className="text-xl font-bold text-slate-800">Amanda Silva</h3>
          <div className="mt-8 space-y-4">
            <select className="w-full rounded-lg border p-3 text-sm font-bold">
              <option>Awaiting physical shipment</option>
              <option>Filed in Poland</option>
            </select>
            <button type="button" className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm">
              Update client
            </button>
          </div>
        </div>
        <div className="overflow-y-auto bg-white p-6 md:w-2/3">
          <h3 className="mb-4 border-b pb-4 text-lg font-bold">Transcription vault</h3>
          <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-5 text-center">
            <span className="text-sm font-bold text-blue-800">Share document with client</span>
            <p className="mb-3 mt-1 text-xs text-blue-600">The file uploaded here will appear in the client portal.</p>
            <button type="button" className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
              Attach and send
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-white p-4">
            <span className="text-sm font-bold">Cert_Casamento.pdf (digital)</span>
            <button type="button" className="rounded border bg-white px-3 py-1.5 text-xs font-bold">
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
        "fin-btn whitespace-nowrap border-b-2 py-3 text-sm font-bold transition",
        finTab === id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="view-tab flex flex-1 flex-col overflow-hidden bg-slate-50 fade-in">
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-2">
        <div className="custom-scroll flex space-x-6 overflow-x-auto">
          {finBtn("fin-geral", "Overview (P&L)")}
          {finBtn("fin-cidadania", "Citizenship")}
          {finBtn("fin-busca", "Document search")}
          {finBtn("fin-traducao", "Document translation")}
          {finBtn("fin-transcricao", "USC transcription")}
        </div>
      </div>

      <div className="custom-scroll flex-1 overflow-auto p-6">
        <div className={cn("fin-view fade-in", finTab !== "fin-geral" && "hidden")}>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase text-slate-500">Total revenue</p>
              <h3 className="text-xl font-bold">R$ 42,500.00</h3>
            </div>
            <div className="rounded-xl border-l-4 border-blue-500 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase text-blue-600">Citizenship</p>
              <h3 className="text-xl font-bold">R$ 38,000.00</h3>
            </div>
            <div className="rounded-xl border-l-4 border-amber-500 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase text-amber-600">Document search</p>
              <h3 className="text-xl font-bold">R$ 3,000.00</h3>
            </div>
            <div className="rounded-xl border-l-4 border-emerald-500 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase text-emerald-600">Trans. / transcription</p>
              <h3 className="text-xl font-bold">R$ 1,500.00</h3>
            </div>
          </div>
          <div className="custom-scroll overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 font-bold text-slate-800">Amount paid</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">Silvana Gomes</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">CITIZENSHIP</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">+ R$ 1,250.00</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">Amanda Silva</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">TRANSCR.</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">+ R$ 2,400.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={cn("fin-view fade-in", finTab !== "fin-cidadania" && "hidden")}>
          <div className="mb-6 w-max rounded-xl border border-l-4 border-blue-500 bg-white p-5">
            <p className="text-[10px] font-bold uppercase text-blue-600">Citizenship total</p>
            <h3 className="text-xl font-bold">R$ 38,000.00</h3>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Installment</th>
                  <th className="px-6 py-4 font-bold text-emerald-600">Amount paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 font-bold">Silvana Gomes</td>
                  <td className="px-6 py-4">01/12</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">+ R$ 1,250.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={cn("fin-view fade-in", finTab !== "fin-busca" && "hidden")}>
          <div className="mb-6 w-max rounded-xl border border-l-4 border-amber-500 bg-white p-5">
            <p className="text-[10px] font-bold uppercase text-amber-600">Search total</p>
            <h3 className="text-xl font-bold">R$ 3,000.00</h3>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4 font-bold text-emerald-600">Amount paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 font-bold">Carlos Almeida</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">+ € 200.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={cn("fin-view fade-in", finTab !== "fin-traducao" && "hidden")}>
          <div className="mb-6 w-max rounded-xl border border-l-4 border-purple-500 bg-white p-5">
            <p className="text-[10px] font-bold uppercase text-purple-600">Translations total</p>
            <h3 className="text-xl font-bold">R$ 1,500.00</h3>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4 font-bold text-emerald-600">Amount paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 font-bold">Roberto Pereira</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">+ R$ 850.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={cn("fin-view fade-in", finTab !== "fin-transcricao" && "hidden")}>
          <div className="mb-6 w-max rounded-xl border border-l-4 border-emerald-500 bg-white p-5">
            <p className="text-[10px] font-bold uppercase text-emerald-600">Transcriptions total</p>
            <h3 className="text-xl font-bold">R$ 2,400.00</h3>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4 font-bold text-emerald-600">Amount paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-4 font-bold">Amanda Silva</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">+ R$ 2,400.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
