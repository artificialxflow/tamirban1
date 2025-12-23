"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/utils/api-client";
import type { InteractionSummary } from "@/lib/services/interactions.service";

const TYPE_LABELS: Record<string, string> = {
  CALL: "تماس",
  VISIT: "ویزیت",
  SMS: "پیامک",
  EMAIL: "ایمیل",
  NOTE: "یادداشت",
};

const TYPE_COLORS: Record<string, string> = {
  CALL: "bg-blue-100 text-blue-700 border-blue-200",
  VISIT: "bg-primary-100 text-primary-700 border-primary-200",
  SMS: "bg-emerald-100 text-emerald-700 border-emerald-200",
  EMAIL: "bg-purple-100 text-purple-700 border-purple-200",
  NOTE: "bg-amber-100 text-amber-700 border-amber-200",
};

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "نامشخص";
  return dateFormatter.format(date);
}

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes} دقیقه ${remainingSeconds > 0 ? `${remainingSeconds} ثانیه` : ""}`;
  }
  return `${remainingSeconds} ثانیه`;
}

interface CustomerInteractionsProps {
  customerId: string;
}

export function CustomerInteractions({ customerId }: CustomerInteractionsProps) {
  const [interactions, setInteractions] = useState<InteractionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    apiClient
      .get<InteractionSummary[]>(`/customers/${customerId}/interactions`)
      .then((response) => {
        if (response.success && response.data) {
          setInteractions(response.data);
        } else {
          setError("خطا در بارگذاری تاریخچه ارتباطات");
        }
      })
      .catch((err) => {
        console.error("Error loading interactions:", err);
        setError("خطا در بارگذاری تاریخچه ارتباطات");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [customerId]);

  if (loading) {
    return (
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4">
        <h3 className="text-sm font-semibold text-slate-800">تاریخچه ارتباطات</h3>
        <div className="text-center py-4 text-sm text-slate-500">در حال بارگذاری...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4">
        <h3 className="text-sm font-semibold text-slate-800">تاریخچه ارتباطات</h3>
        <div className="text-center py-4 text-sm text-rose-500">{error}</div>
      </section>
    );
  }

  if (interactions.length === 0) {
    return (
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4">
        <h3 className="text-sm font-semibold text-slate-800">تاریخچه ارتباطات</h3>
        <div className="text-center py-4 text-sm text-slate-500">هیچ ارتباطی ثبت نشده است</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4">
      <h3 className="text-sm font-semibold text-slate-800">تاریخچه ارتباطات</h3>
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {interactions.map((interaction) => (
          <div
            key={interaction.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
          >
            <div className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${TYPE_COLORS[interaction.type] || "bg-slate-100 text-slate-700"}`}>
              {TYPE_LABELS[interaction.type] || interaction.type}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800">{formatDate(interaction.createdAt)}</span>
                {interaction.duration && (
                  <span className="text-slate-500">{formatDuration(interaction.duration)}</span>
                )}
              </div>
              {interaction.description && (
                <p className="mt-1 text-slate-600">{interaction.description}</p>
              )}
              {interaction.relatedVisitId && (
                <p className="mt-1 text-[10px] text-slate-400">
                  مرتبط با ویزیت: {interaction.relatedVisitId.slice(0, 8)}...
                </p>
              )}
              {interaction.relatedInvoiceId && (
                <p className="mt-1 text-[10px] text-slate-400">
                  مرتبط با پیش‌فاکتور: {interaction.relatedInvoiceId.slice(0, 8)}...
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

