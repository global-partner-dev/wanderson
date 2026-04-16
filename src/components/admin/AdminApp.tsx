"use client";

import { useCallback, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminModals from "./AdminModals";
import AdminSidebar from "./AdminSidebar";
import BackofficePanels from "./BackofficePanels";
import type { DetailModule, FinViewId, ModalId, TabId } from "./admin-types";
import { cn } from "@/lib/utils";

const initialDetail: Record<DetailModule, boolean> = {
  analise: false,
  cidadania: false,
  busca: false,
  traducao: false,
  transcricao: false,
};

export default function AdminApp() {
  const [activeTab, setActiveTab] = useState<TabId>("tab-crm");
  const [pageTitle, setPageTitle] = useState("Lead funnel");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<Record<DetailModule, boolean>>(initialDetail);
  const [finTab, setFinTab] = useState<FinViewId>("fin-geral");
  const [modalOpen, setModalOpen] = useState<ModalId | null>(null);

  const setDetail = useCallback((m: DetailModule, open: boolean) => {
    setDetailOpen((prev) => ({ ...prev, [m]: open }));
  }, []);

  const handleSelectTab = useCallback((id: TabId, title: string) => {
    setActiveTab(id);
    setPageTitle(title);
    setMobileOpen(false);
    setDetailOpen({ ...initialDetail });
  }, []);

  const openModal = useCallback((id: ModalId) => setModalOpen(id), []);
  const closeModal = useCallback((id: ModalId) => setModalOpen((m) => (m === id ? null : m)), []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 antialiased">
      <button
        type="button"
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-blue-900/50 md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
        onClick={() => setMobileOpen(false)}
      />

      <AdminSidebar
        activeTab={activeTab}
        onSelect={handleSelectTab}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen(false)}
      />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <AdminHeader title={pageTitle} onMenuClick={() => setMobileOpen(true)} />
        <BackofficePanels
          activeTab={activeTab}
          detailOpen={detailOpen}
          setDetail={setDetail}
          finTab={finTab}
          setFinTab={setFinTab}
          openModal={openModal}
        />
      </main>

      <AdminModals open={modalOpen} onClose={closeModal} onOpen={openModal} />
    </div>
  );
}
