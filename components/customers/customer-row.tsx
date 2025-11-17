"use client";

import { useState } from "react";

import { CustomerDeleteButton } from "./customer-delete-button";
import { CustomerEditModal } from "./customer-edit-modal";
import type { CustomerSummary, CustomerDetail } from "@/lib/services/customers.service";
import type { CustomerStatus } from "@/lib/types";
import { ProtectedComponent } from "@/components/common/protected-component";

const STATUS_LABELS: Record<CustomerStatus, string> = {
  ACTIVE: "فعال",
  INACTIVE: "غیرفعال",
  PENDING: "در انتظار پیگیری",
  AT_RISK: "احتمال ریزش",
  LOYAL: "مشتری وفادار",
  SUSPENDED: "متوقف شده",
};

const STATUS_BADGE_CLASS: Partial<Record<CustomerStatus, string>> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  LOYAL: "bg-primary-100 text-primary-700 border border-primary-200",
  AT_RISK: "bg-amber-100 text-amber-700 border border-amber-200",
  PENDING: "bg-slate-100 text-slate-700 border border-slate-200",
  INACTIVE: "bg-slate-200 text-slate-700 border border-slate-300",
  SUSPENDED: "bg-rose-100 text-rose-700 border border-rose-200",
};

const numberFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatDate(value?: Date | null) {
  if (!value) {
    return "نامشخص";
  }
  return dateFormatter.format(value);
}

function formatRevenue(value?: number) {
  if (!value) {
    return "۰";
  }
  return numberFormatter.format(value);
}

function resolveBadgeClass(status: CustomerStatus) {
  return STATUS_BADGE_CLASS[status] ?? "bg-slate-100 text-slate-600";
}

interface CustomerRowProps {
  customer: CustomerSummary;
  isSelected?: boolean;
  onSelect?: (customerId: string) => void;
}

export function CustomerRow({ customer, isSelected = false, onSelect }: CustomerRowProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<CustomerDetail | null>(null);

  const handleRowClick = (e: React.MouseEvent) => {
    // اگر روی دکمه‌ها کلیک شده، row را انتخاب نکن
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    onSelect?.(customer.id);
  };

  const handleEditClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // دریافت جزئیات کامل مشتری برای ویرایش
    try {
      const tokens = localStorage.getItem("auth_tokens");
      if (!tokens) {
        return;
      }
      const { accessToken } = JSON.parse(tokens);
      
      const response = await fetch(`/api/customers/${customer.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCustomerDetail(data.data);
          setIsEditModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error fetching customer detail:", error);
    }
  };

  return (
    <>
      <tr
        className={`transition cursor-pointer ${isSelected ? "bg-primary-50" : "hover:bg-primary-50/30"}`}
        onClick={handleRowClick}
      >
        <td className="px-6 py-4 text-xs text-slate-500">{customer.code}</td>
        <td className="px-6 py-4 font-semibold text-slate-800">{customer.name}</td>
        <td className="px-6 py-4">{customer.marketer ?? "نامشخص"}</td>
        <td className="px-6 py-4">{customer.city ?? "-"}</td>
        <td className="px-6 py-4 text-xs text-slate-600">{formatDate(customer.lastVisitAt)}</td>
        <td className="px-6 py-4">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${resolveBadgeClass(customer.status)}`}>
            {STATUS_LABELS[customer.status]}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="inline-flex items-center justify-center rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
            {customer.grade ?? "-"}
          </span>
        </td>
        <td className="px-6 py-4 text-xs font-semibold text-slate-800">{formatRevenue(customer.monthlyRevenue)}</td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleEditClick}
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 active:scale-100"
            >
              ویرایش
            </button>
            <ProtectedComponent role="SUPER_ADMIN">
              <div onClick={(e) => e.stopPropagation()}>
                <CustomerDeleteButton customerId={customer.id} />
              </div>
            </ProtectedComponent>
          </div>
        </td>
      </tr>
      {customerDetail && (
        <CustomerEditModal
          customer={customerDetail}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCustomerDetail(null);
          }}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      )}
    </>
  );
}

