import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { getDashboardOverview } from "@/lib/services/dashboard.service";

const STAT_TONE_CLASS: Record<string, string> = {
  positive: "text-emerald-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
  info: "text-sky-500",
  neutral: "text-slate-500",
};

const TASK_TONE_CLASS: Record<string, string> = {
  warning: "text-amber-500",
  info: "text-sky-500",
  success: "text-emerald-500",
  positive: "text-emerald-500",
  neutral: "text-slate-500",
};

const SYSTEM_STATUS_LABEL: Record<"stable" | "attention", { label: string; dotClass: string; textClass: string }> = {
  stable: { label: "وضعیت سیستم: پایدار", dotClass: "bg-emerald-400", textClass: "text-emerald-600" },
  attention: { label: "وضعیت سیستم: نیاز به پیگیری", dotClass: "bg-amber-500", textClass: "text-amber-600" },
};

export default async function DashboardPage() {
  const overview = await getDashboardOverview();
  const systemStatus = SYSTEM_STATUS_LABEL[overview.systemStatus];

  return (
    <AppShell
      title="داشبورد مدیریتی"
      description="نمای کلی عملکرد روزانه شامل مشتریان فعال، برنامه ویزیت و پیش‌فاکتورهای معوق."
      activeHref="/dashboard"
      actions={
        <>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
            گزارش لحظه‌ای
          </button>
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-sky-600">
            ثبت مشتری جدید
          </button>
        </>
      }
      toolbar={
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] md:max-w-sm">
            <input
              type="search"
              placeholder="جستجو در مشتریان، ویزیت‌ها یا پیش‌فاکتور..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className={`flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-xs ${systemStatus.textClass}`}>
            <span className={`inline-flex h-2 w-2 rounded-full ${systemStatus.dotClass}`} />
            {systemStatus.label}
          </div>
        </div>
      }
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overview.stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-100 p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
            <p className={`mt-2 text-xs ${STAT_TONE_CLASS[item.tone] ?? "text-slate-500"}`}>{item.helper}</p>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-slate-100 p-6">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">ویزیت‌های امروز</h2>
            <Link href="#" className="text-xs font-medium text-sky-500 hover:text-sky-600">
              مشاهده همه
            </Link>
          </header>
          {overview.todayVisits.length ? (
            <ul className="mt-4 flex flex-col gap-3">
              {overview.todayVisits.map((visit) => (
                <li
                  key={visit.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-900">{visit.customer}</span>
                    {visit.marketer ? <span className="text-xs text-slate-500">{visit.marketer}</span> : null}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-500">ساعت {visit.timeLabel}</span>
                    <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-600">{visit.statusLabel}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center text-sm text-slate-500">
              <span>برای امروز ویزیت برنامه‌ریزی نشده است.</span>
              <span>با ثبت ویزیت جدید، این بخش به‌صورت خودکار بروز خواهد شد.</span>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-6">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">چک‌لیست فوری</h2>
            <button className="text-xs font-medium text-sky-500 hover:text-sky-600">افزودن وظیفه</button>
          </header>
          <ul className="flex flex-col gap-3 text-sm text-slate-600">
            {overview.quickTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <span>{task.title}</span>
                <span className={`text-xs ${TASK_TONE_CLASS[task.tone] ?? "text-slate-500"}`}>{task.statusLabel}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
