"use client";

import type { VisitSummary } from "@/lib/services/visits.service";
import type { VisitStatus } from "@/lib/types";
import { ProtectedComponent } from "@/components/common/protected-component";

const STATUS_LABELS: Record<VisitStatus, string> = {
  SCHEDULED: "زمان‌بندی شده",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "تکمیل شد",
  CANCELLED: "لغو شد",
};

const STATUS_BADGE_CLASS: Record<VisitStatus, string> = {
  SCHEDULED: "bg-primary-100 text-primary-700 border border-primary-200",
  IN_PROGRESS: "bg-amber-100 text-amber-700 border border-amber-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-rose-100 text-rose-700 border border-rose-200",
};

const timeFormatter = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" });
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatDateTime(value: Date) {
  return `${dateFormatter.format(value)} ${timeFormatter.format(value)}`;
}

interface VisitListProps {
  visits: VisitSummary[];
  onVisitClick?: (visitId: string) => void;
  onEdit?: (visit: VisitSummary) => void;
  onDelete?: (visitId: string) => void;
  deletingVisitId?: string | null;
}

export function VisitList({ visits, onVisitClick, onEdit, onDelete, deletingVisitId }: VisitListProps) {
  return (
    <tbody className="divide-y divide-slate-100 bg-white">
      {visits.map((visit) => (
        <tr key={visit.id} className="transition hover:bg-primary-50/30">
          <td className="px-5 py-3 text-xs text-slate-500">{formatDateTime(visit.scheduledAt)}</td>
          <td className="px-5 py-3 font-semibold text-slate-800">{visit.customerName}</td>
          <td className="px-5 py-3">{visit.marketerName ?? "نامشخص"}</td>
          <td className="px-5 py-3 text-xs text-slate-500">
            {visit.topics.length > 0 ? visit.topics.join(", ") : "-"}
          </td>
          <td className="px-5 py-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASS[visit.status]}`}>
              {STATUS_LABELS[visit.status]}
            </span>
          </td>
          <td className="px-5 py-3 text-xs text-slate-500 max-w-xs truncate">{visit.notes || "-"}</td>
          <td className="px-5 py-3">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onVisitClick?.(visit.id)}
                className="rounded-full border-2 border-primary-300 bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200 hover:text-primary-900 shadow-md"
              >
                جزئیات
              </button>
              <ProtectedComponent permission="visits:write">
                <button
                  onClick={() => onEdit?.(visit)}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-primary-300 bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200 hover:text-primary-900 shadow-md"
                  title="ویرایش"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  ویرایش
                </button>
              </ProtectedComponent>
              <ProtectedComponent permission="visits:delete">
                <button
                  onClick={() => {
                    if (confirm("آیا مطمئن هستید که می‌خواهید این ویزیت را حذف کنید؟")) {
                      onDelete?.(visit.id);
                    }
                  }}
                  disabled={deletingVisitId === visit.id}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-red-300 bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 transition hover:border-red-400 hover:bg-red-200 hover:text-red-900 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="حذف"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {deletingVisitId === visit.id ? "در حال حذف..." : "حذف"}
                </button>
              </ProtectedComponent>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

