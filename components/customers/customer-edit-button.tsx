"use client";

import { useState } from "react";

import { CustomerEditModal } from "./customer-edit-modal";
import type { CustomerDetail } from "@/lib/services/customers.service";

interface CustomerEditButtonProps {
  customer: CustomerDetail;
  onSuccess?: () => void;
}

export function CustomerEditButton({ customer, onSuccess }: CustomerEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-medium text-white shadow-soft-primary transition hover:opacity-90"
      >
        ویرایش
      </button>
      <CustomerEditModal
        customer={customer}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}

