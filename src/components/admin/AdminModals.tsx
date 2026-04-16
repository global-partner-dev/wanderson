"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ModalId } from "./admin-types";

function ModalChrome({
  title,
  titleId,
  description,
  onClose,
  children,
  footer,
}: {
  title: string;
  titleId?: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h3 id={titleId} className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onClose} className="shrink-0" aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
      {footer ? <div className="border-t border-border bg-muted/30 px-5 py-4 sm:px-6">{footer}</div> : null}
    </div>
  );
}

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
        <ModalChrome
          title="Generate new proposal"
          titleId="modal-nova-title"
          description="Creates a timed link your team can send to the client."
          onClose={() => onClose("modal-nova-proposta")}
        >
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              The link starts a <span className="font-medium text-primary">120 hour</span> countdown when first opened.
            </p>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Client / lead</Label>
              <Select defaultValue="joao">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="joao">João Pedro (document search)</SelectItem>
                  <SelectItem value="fernanda">Fernanda Lima (citizenship)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={() => {
                onClose("modal-nova-proposta");
                onOpen("modal-enviar-proposta");
              }}
              className="gradient-primary w-full border-0 py-3 text-primary-foreground shadow-sm hover:opacity-95"
            >
              Generate dynamic link
            </Button>
          </div>
        </ModalChrome>
      </div>

      <div
        className={cn(
          "fade-in fixed inset-0 z-50 items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm",
          open === "modal-enviar-proposta" ? "flex" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
      >
        <ModalChrome title="Send proposal" description="Copy or share the generated URL." onClose={() => onClose("modal-enviar-proposta")}>
          <div className="space-y-4 text-sm">
            <div className="break-all rounded-lg border border-border bg-muted/50 px-3 py-3 text-center font-mono text-xs text-foreground">
              https://polonia4u.com/proposal/abc123xyz
            </div>
            <Button
              type="button"
              onClick={() => onClose("modal-enviar-proposta")}
              className="flex w-full gap-2 bg-[#25D366] py-3 text-white shadow-sm hover:bg-[#1ebe57]"
            >
              {whatsappIcon}
              Send via WhatsApp
            </Button>
          </div>
        </ModalChrome>
      </div>

      <div
        className={cn(
          "fade-in fixed inset-0 z-50 items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm",
          open === "modal-contrato" ? "flex" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
      >
        <ModalChrome title="Contract preview" description="Review values before merging the PDF." onClose={() => onClose("modal-contrato")}>
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="flex justify-between gap-4 font-medium text-foreground">
                <span className="text-muted-foreground">Client</span>
                <span>Silvana Gomes</span>
              </p>
              <p className="mt-3 flex justify-between gap-4 border-t border-border pt-3 font-medium">
                <span className="text-muted-foreground">Base amount</span>
                <span className="tabular-nums text-primary">R$ 1,250.00</span>
              </p>
            </div>
            <Button
              type="button"
              onClick={() => onClose("modal-contrato")}
              className="gradient-primary w-full border-0 py-3 text-primary-foreground shadow-sm hover:opacity-95"
            >
              Merge and send
            </Button>
          </div>
        </ModalChrome>
      </div>

      <div
        className={cn(
          "fade-in fixed inset-0 z-50 items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm",
          open === "modal-recusa" ? "flex" : "hidden",
        )}
        role="dialog"
        aria-modal="true"
      >
        <ModalChrome
          title="Reject document"
          description="This note is stored on the case for your team and the client timeline."
          onClose={() => onClose("modal-recusa")}
        >
          <div className="space-y-4">
            <Textarea
              className="min-h-[120px] resize-y"
              rows={4}
              defaultValue="The submitted certificate is illegible."
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onClose("modal-recusa")}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={() => onClose("modal-recusa")}>
                Confirm rejection
              </Button>
            </div>
          </div>
        </ModalChrome>
      </div>
    </>
  );
}
