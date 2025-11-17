"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { VisitFilters } from "./visit-filters";
import { VisitList } from "./visit-list";
import { VisitPagination } from "./visit-pagination";
import { VisitCreateModal } from "./visit-create-modal";
import type { VisitSummary } from "@/lib/services/visits.service";
import type { VisitSummaryCard, VisitReminder } from "@/lib/services/visits.service";

const numberFormatter = new Intl.NumberFormat("fa-IR");

interface VisitsPageClientProps {
  initialVisits: VisitSummary[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
  overview: {
    summaryCards: VisitSummaryCard[];
    reminders: VisitReminder[];
  };
}

export function VisitsPageClient({
  initialVisits,
  initialTotal,
  initialPage,
  initialLimit,
  overview,
}: VisitsPageClientProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <AppShell
        title="برنامه ویزیت‌ها"
        description="مدیریت و ردیابی ویزیت‌های حضوری، وضعیت‌ها و یادداشت‌های تیم بازاریابی."
        activeHref="/dashboard/visits"
        actions={
          <>
            <button className="rounded-full border-2 border-primary-300 bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-800 transition hover:border-primary-400 hover:bg-primary-200 hover:text-primary-900 shadow-md">
              خروجی برنامه
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-soft-primary transition hover:opacity-90"
            >
              ثبت ویزیت جدید
            </button>
          </>
        }
        toolbar={
          <div className="flex flex-col gap-3">
            <VisitFilters />
            <div className="grid gap-3 md:grid-cols-4">
              {overview.summaryCards.map((card) => (
                <article key={card.title} className="rounded-2xl border border-slate-200/60 bg-slate-50/50 px-5 py-4 transition hover:bg-slate-50 hover:shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-800">{card.value}</p>
                  <p className={`mt-2 text-[11px] ${card.helperColor}`}>{card.helper}</p>
                </article>
              ))}
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr,1fr]">
          <section className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">برنامه زمانی ویزیت‌ها</h2>
                <p className="text-xs text-slate-500">
                  {numberFormatter.format(initialVisits.length)} از {numberFormatter.format(initialTotal)} مورد
                </p>
              </div>
            </header>
            {initialVisits.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                <h3 className="text-lg font-semibold text-slate-800">هیچ ویزیتی ثبت نشده است</h3>
                <p className="mt-2 text-sm text-slate-500">برای شروع، یک ویزیت جدید ثبت کنید.</p>
              </div>
            ) : (
              <>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] divide-y divide-slate-100 text-right text-sm text-slate-600">
                    <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <tr>
                        <th className="px-5 py-3">تاریخ و ساعت</th>
                        <th className="px-5 py-3">مشتری</th>
                        <th className="px-5 py-3">بازاریاب</th>
                        <th className="px-5 py-3">موضوع</th>
                        <th className="px-5 py-3">وضعیت</th>
                        <th className="px-5 py-3">یادداشت</th>
                        <th className="px-5 py-3 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <VisitList visits={initialVisits} />
                  </table>
                </div>
                <VisitPagination total={initialTotal} page={initialPage} limit={initialLimit} />
              </>
            )}
          </section>

          <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">یادآوری‌ها و پیگیری‌ها</h2>
                <p className="text-xs text-slate-500">ویزیت‌های آینده و وظایف مرتبط</p>
              </div>
              <button className="text-xs font-medium text-primary-600 hover:text-primary-700">افزودن مورد</button>
            </header>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              {overview.reminders.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-800">{item.title}</span>
                    {item.owner && <span className="text-xs text-slate-500">مسئول: {item.owner}</span>}
                  </div>
                  <span className="text-xs text-orange-500">{item.deadlineLabel}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </AppShell>
      <VisitCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}

