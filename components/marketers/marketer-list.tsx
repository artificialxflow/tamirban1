"use client";

import type { MarketerSummary } from "@/lib/services/marketers.service";
import { MarketerDeleteButton } from "./marketer-delete-button";

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

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] || "") + (parts[1][0] || "");
  }
  return name.substring(0, 2).toUpperCase();
}

function getStatusBadgeClass(isActive: boolean) {
  return isActive
    ? "bg-primary-100 text-primary-700 border border-primary-200"
    : "bg-slate-200 text-slate-700 border border-slate-300";
}

function getStatusLabel(isActive: boolean) {
  return isActive ? "فعال" : "غیرفعال";
}

interface MarketerListProps {
  marketers: MarketerSummary[];
  onEdit?: (marketer: MarketerSummary) => void;
  onDelete?: (marketerId: string) => void;
}

export function MarketerList({ marketers, onEdit, onDelete }: MarketerListProps) {
  return (
    <>
      {marketers.map((marketer) => (
        <article
          key={marketer.id}
          className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6 transition hover:border-primary-300 hover:shadow-soft hover:bg-slate-50"
        >
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-base font-semibold text-white shadow-soft-primary">
                {getInitials(marketer.fullName)}
              </span>
              <div className="flex flex-col">
                <h2 className="text-base font-semibold text-slate-800">{marketer.fullName}</h2>
                <p className="text-xs text-slate-500">منطقه: {marketer.region}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(marketer.isActive)}`}>
              {getStatusLabel(marketer.isActive)}
            </span>
          </header>

          <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-slate-400">تعداد مشتری</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {numberFormatter.format(marketer.assignedCustomersCount)}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-slate-400">امتیاز عملکرد</p>
              <p className="mt-1 text-lg font-semibold text-slate-800">
                {marketer.performanceScore ? numberFormatter.format(marketer.performanceScore) : "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-slate-400">آخرین ویزیت</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(marketer.lastVisitAt)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-slate-400">نقش</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{marketer.role}</p>
            </div>
          </div>

          <footer className="flex items-center justify-between gap-2 text-xs">
            <button
              onClick={() => onEdit?.(marketer)}
              className="rounded-full bg-gradient-primary px-4 py-2 text-white shadow-soft-primary transition hover:opacity-90"
            >
              ویرایش
            </button>
            <button className="text-primary-600 transition hover:text-primary-700">ارسال پیام</button>
            <MarketerDeleteButton marketerId={marketer.id} marketerName={marketer.fullName} onDelete={onDelete} />
          </footer>
        </article>
      ))}
    </>
  );
}
