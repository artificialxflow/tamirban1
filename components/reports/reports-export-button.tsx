"use client";

import { useState } from "react";
import { ProtectedComponent } from "@/components/common/protected-component";

interface ReportsExportButtonProps {
  type: "marketers" | "invoices" | "visits" | "customers";
  filters?: {
    startDate?: string;
    endDate?: string;
    marketerId?: string;
    customerId?: string;
    status?: string;
  };
}

export function ReportsExportButton({ type, filters = {} }: ReportsExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("لطفاً ابتدا وارد شوید.");
        return;
      }

      // ساخت URL با فیلترها
      const params = new URLSearchParams({ type });
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.marketerId) params.append("marketerId", filters.marketerId);
      if (filters.customerId) params.append("customerId", filters.customerId);
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(`/api/reports/export?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "خطا در export");
      }

      // دریافت فایل
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert(error instanceof Error ? error.message : "خطا در export");
    } finally {
      setLoading(false);
    }
  };

  const typeLabels: Record<string, string> = {
    marketers: "عملکرد بازاریاب‌ها",
    invoices: "فاکتورها",
    visits: "ویزیت‌ها",
    customers: "مشتریان",
  };

  return (
    <ProtectedComponent permission="reports:read">
      <button
        onClick={handleExport}
        disabled={loading}
        className="rounded-full border-2 border-primary-300 bg-primary-100 px-4 py-2 text-xs font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200 hover:text-primary-900 shadow-md disabled:opacity-50"
      >
        {loading ? "در حال export..." : `خروجی Excel - ${typeLabels[type]}`}
      </button>
    </ProtectedComponent>
  );
}

