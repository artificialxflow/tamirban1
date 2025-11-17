import type { VisitSummary } from "@/lib/services/visits.service";
import type { VisitStatus } from "@/lib/types";

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
}

export function VisitList({ visits }: VisitListProps) {
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
          <td className="px-5 py-3 text-center">
            <button className="rounded-full border-2 border-primary-300 bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200 hover:text-primary-900 shadow-md">
              جزئیات
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

