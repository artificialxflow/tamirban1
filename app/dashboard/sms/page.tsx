import { AppShell } from "@/components/layout/app-shell";

const smsStats = [
  { label: "پیامک‌های ارسال شده", value: "1,245", helper: "+8% نسبت به هفته قبل" },
  { label: "نرخ تحویل", value: "92%", helper: "۵ پیامک در انتظار" },
  { label: "هزینه ماه جاری", value: "48,750,000 ریال", helper: "در محدوده بودجه" },
];

const smsCampaigns = [
  { title: "کمپین خوش‌آمدگویی", status: "فعال", sent: "320 پیامک", date: "12 مهر" },
  { title: "یادآوری سرویس دوره‌ای", status: "زمان‌بندی شده", sent: "210 پیامک", date: "15 مهر" },
  { title: "پیگیری تسویه حساب", status: "اتمام", sent: "156 پیامک", date: "9 مهر" },
];

export default function SmsPage() {
  return (
    <AppShell
      title="مرکز پیامک‌ها"
      description="مرکز مدیریت کمپین‌های پیامکی، وضعیت ارسال و آمار تحویل."
      activeHref="/dashboard/sms"
      actions={
        <button className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-soft-primary transition hover:opacity-90">
          ایجاد کمپین جدید
        </button>
      }
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {smsStats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-5 transition hover:bg-slate-50 hover:shadow-sm">
            <p className="text-xs font-semibold text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-800">{item.value}</p>
            <p className="mt-2 text-xs text-slate-500">{item.helper}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6">
        <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-slate-800">کمپین‌های اخیر</h2>
            <p className="text-xs text-slate-500">نمونه داده برای تایید ساختار UI مرکز پیامک</p>
          </div>
          <button className="text-xs font-medium text-primary-600 hover:text-primary-700">مشاهده گزارش کامل</button>
        </header>
        <ul className="mt-4 flex flex-col gap-3">
          {smsCampaigns.map((campaign) => (
            <li
              key={campaign.title}
              className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-slate-800">{campaign.title}</span>
                <span className="text-xs text-slate-500">{campaign.sent} · آخرین آپدیت {campaign.date}</span>
              </div>
              <span className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {campaign.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
