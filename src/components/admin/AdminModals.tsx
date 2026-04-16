"use client";

import { cn } from "@/lib/utils";
import type { ModalId } from "./admin-types";

const whatsappIcon = (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type Props = {
  open: ModalId | null;
  onClose: (id: ModalId) => void;
  onOpen: (id: ModalId) => void;
};

export default function AdminModals({ open, onClose, onOpen }: Props) {
  return (
    <>
      <div
        className={cn(
          "fade-in fixed inset-0 z-50 items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm",
          open === "modal-nova-proposta" ? "flex" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-nova-title"
      >
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b bg-slate-50 p-5">
            <h3 id="modal-nova-title" className="font-bold text-slate-800">
              Generate new proposal
            </h3>
            <button type="button" onClick={() => onClose("modal-nova-proposta")} className="text-slate-400 transition hover:text-slate-700">
              ×
            </button>
          </div>
          <div className="space-y-4 p-6 text-sm">
            <p className="mb-2 text-slate-600">
              This link will start a <strong className="text-blue-600">120-hour</strong> countdown (urgency trigger) as soon as the client opens it.
            </p>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500">Select client / lead</label>
              <select className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>João Pedro (document search)</option>
                <option>Fernanda Lima (citizenship)</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose("modal-nova-proposta");
                onOpen("modal-enviar-proposta");
              }}
              className="mt-2 w-full rounded-lg bg-blue-600 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              Generate dynamic link
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fade-in fixed inset-0 z-50 items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm",
          open === "modal-enviar-proposta" ? "flex" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b bg-slate-50 p-5">
            <h3 className="font-bold text-slate-800">Send generated proposal</h3>
            <button type="button" onClick={() => onClose("modal-enviar-proposta")} className="text-slate-400 transition hover:text-slate-700">
              ×
            </button>
          </div>
          <div className="space-y-4 p-6 text-sm">
            <div className="break-all rounded-lg border border-green-200 bg-green-50 p-3 text-center text-xs font-bold text-green-800">
              https://polonia4u.com/proposal/abc123xyz
            </div>
            <button
              type="button"
              onClick={() => onClose("modal-enviar-proposta")}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 font-bold text-white shadow-sm transition hover:bg-[#1DA851]"
            >
              {whatsappIcon}
              Send link via WhatsApp
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fade-in fixed inset-0 z-50 items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm",
          open === "modal-contrato" ? "flex" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b bg-slate-50 p-5">
            <h3 className="font-bold text-slate-800">Contract engine</h3>
            <button type="button" onClick={() => onClose("modal-contrato")} className="text-slate-400">
              ×
            </button>
          </div>
          <div className="space-y-4 p-6 text-sm">
            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="flex justify-between font-bold">
                Client: <span className="font-medium text-slate-600">Silvana Gomes</span>
              </p>
              <p className="flex justify-between border-t pt-2 font-bold">
                Base amount: <span className="font-bold text-blue-700">R$ 1,250.00</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onClose("modal-contrato")}
              className="mt-2 w-full rounded-lg bg-blue-600 py-3.5 font-bold text-white"
            >
              Merge data and send
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fade-in fixed inset-0 z-50 items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm",
          open === "modal-recusa" ? "flex" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b bg-red-50 p-5">
            <h3 className="font-bold text-red-700">Rejection reason</h3>
            <button type="button" onClick={() => onClose("modal-recusa")} className="text-slate-400">
              ×
            </button>
          </div>
          <div className="p-6">
            <textarea className="w-full rounded-xl border p-4 text-sm" rows={4} defaultValue="The submitted certificate is illegible." />
            <button
              type="button"
              onClick={() => onClose("modal-recusa")}
              className="mt-4 w-full rounded-lg bg-red-600 py-3.5 font-bold text-white"
            >
              Confirm rejection
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
