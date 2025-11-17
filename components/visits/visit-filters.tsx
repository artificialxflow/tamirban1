"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import type { VisitStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: VisitStatus | ""; label: string }[] = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "SCHEDULED", label: "زمان‌بندی شده" },
  { value: "IN_PROGRESS", label: "در حال انجام" },
  { value: "COMPLETED", label: "تکمیل شد" },
  { value: "CANCELLED", label: "لغو شد" },
];

export function VisitFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customerId, setCustomerId] = useState(searchParams.get("customerId") || "");
  const [marketerId, setMarketerId] = useState(searchParams.get("marketerId") || "");
  const [status, setStatus] = useState<VisitStatus | "">((searchParams.get("status") as VisitStatus) || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (customerId) params.set("customerId", customerId);
    if (marketerId) params.set("marketerId", marketerId);
    if (status) params.set("status", status);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    router.push(`/dashboard/visits?${params.toString()}`);
  };

  const handleClear = () => {
    setCustomerId("");
    setMarketerId("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    router.push("/dashboard/visits");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px] md:max-w-sm">
        <input
          type="text"
          placeholder="شناسه مشتری"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>
      <div className="relative flex-1 min-w-[220px] md:max-w-sm">
        <input
          type="text"
          placeholder="شناسه بازاریاب"
          value={marketerId}
          onChange={(e) => setMarketerId(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as VisitStatus | "")}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input
        type="date"
        placeholder="از تاریخ"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      />
      <input
        type="date"
        placeholder="تا تاریخ"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      />
      <button
        onClick={handleFilter}
        className="rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-medium text-white shadow-soft-primary transition hover:opacity-90"
      >
        اعمال فیلتر
      </button>
      <button
        onClick={handleClear}
        className="rounded-2xl border-2 border-primary-300 bg-primary-100 px-4 py-3 text-sm font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200 hover:text-primary-900 shadow-md"
      >
        پاک کردن
      </button>
    </div>
  );
}

