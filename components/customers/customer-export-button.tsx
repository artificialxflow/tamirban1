"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePermissions } from "@/lib/hooks/use-permissions";

export function CustomerExportButton() {
  const { hasRole } = usePermissions();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const isMarketer = hasRole("MARKETER");

  if (isMarketer) {
    return null;
  }

  const handleExport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("لطفاً ابتدا وارد شوید.");
        return;
      }

      // ساخت URL با فیلترهای فعلی
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        params.append(key, value);
      });

      const response = await fetch(`/api/customers/export?${params.toString()}`, {
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
      a.download = `customers-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
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

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="rounded-full border-2 border-primary-300 bg-primary-100 px-4 py-2 text-xs font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200 hover:text-primary-900 shadow-md disabled:opacity-50"
    >
      {loading ? "در حال export..." : "خروجی Excel"}
    </button>
  );
}

