"use client";

import { useState } from "react";

import { ProtectedComponent } from "@/components/common/protected-component";
import { CustomerCreateModal } from "@/components/customers/customer-create-modal";
import { VisitCreateModal } from "@/components/visits/visit-create-modal";

interface CustomerAddButtonProps {
  onClick?: () => void;
}

/**
 * دکمه افزودن مشتری جدید با RBAC
 */
export function CustomerAddButton({ onClick }: CustomerAddButtonProps) {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [newCustomerId, setNewCustomerId] = useState<string | null>(null);

  const handleOpen = () => {
    onClick?.();
    setIsCustomerModalOpen(true);
  };

  const handleClose = () => {
    setIsCustomerModalOpen(false);
  };

  const handleCreateVisit = (customerId: string) => {
    setNewCustomerId(customerId);
    setIsVisitModalOpen(true);
  };

  const handleVisitClose = () => {
    setIsVisitModalOpen(false);
    setNewCustomerId(null);
  };

  return (
    <ProtectedComponent anyPermission={["customers:write"]} role={["MARKETER", "SUPER_ADMIN"]}>
      <>
        <button
          onClick={handleOpen}
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-100 disabled:opacity-50"
        >
          افزودن مشتری جدید
        </button>
        <CustomerCreateModal 
          isOpen={isCustomerModalOpen} 
          onClose={handleClose}
          onCreateVisit={handleCreateVisit}
        />
        <VisitCreateModal
          isOpen={isVisitModalOpen}
          onClose={handleVisitClose}
          initialCustomerId={newCustomerId || undefined}
        />
      </>
    </ProtectedComponent>
  );
}

