import { AppShell } from "@/components/layout/app-shell";

const kpis = [
  { title: "درآمد ماه جاری", value: "186,400,000 ریال", delta: "+14% نسبت به ماه قبل" },
  { title: "نرخ تبدیل پیش‌فاکتور", value: "38%", delta: "+6% رشد" },
  { title: "میانگین زمان پیگیری", value: "1.8 روز", delta: "نیاز به بهبود" },
];

const timeline = [
  { label: "هفته اول", value: "۴۵ پیش‌فاکتور", status: "رشد" },
  { label: "هفته دوم", value: "۳۲ بازدید", status: "پایدار" },
  { label: "هفته سوم", value: "۱۵ مشتری جدید", status: "رشد" },
  { label: "هفته چهارم", value: "۹ قرارداد", status: "در انتظار" },
];

export default function ReportsPage() {
  return (
    <AppShell
      title="گزارش‌ها و تحلیل"
      description="پیش‌نمایش ساختار گزارش‌های مدیریتی برای تایید UI قبل از اتصال داده واقعی."
      activeHref="/dashboard/reports"
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
            خروجی Excel
          </button>
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-sky-600">
            تولید PDF
          </button>
        </div>
      }
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-100 bg-white/95 p-5">
            <h2 className="text-sm font-semibold text-slate-500">{item.title}</h2>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
            <span className="mt-2 inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
              {item.delta}
            </span>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white/95 p-6">
        <header className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-slate-900">روند ماهانه</h2>
            <p className="text-xs text-slate-500">ثابت نگهدارنده برای نمایش دیتای روندی در نسخه نهایی</p>
          </div>
          <button className="text-xs font-medium text-sky-500 hover:text-sky-600">مشاهده جزئیات</button>
        </header>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {timeline.map((item) => (
            <article key={item.label} className="flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
              <span className="text-xs font-medium text-slate-400">{item.label}</span>
              <span className="text-base font-semibold text-slate-900">{item.value}</span>
              <span className="text-xs text-sky-600">{item.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white/95 p-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">TODO اتصال به Data Warehouse</h2>
          <span className="text-xs text-slate-500">این بخش بر اساس تصمیم فاز ۶ به داده واقعی متصل خواهد شد.</span>
        </header>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          این صفحه در حال حاضر صرفاً برای تایید چیدمان و نمایش شاخص‌های کلیدی طراحی شده است. پس از اتصال به سرویس آمار،
          نمودارها و جداول تعاملی جایگزین کارت‌های نمونه خواهند شد.
        </p>
      </section>
    </AppShell>
  );
}
