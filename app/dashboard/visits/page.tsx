import { AppShell } from "@/components/layout/app-shell";

const visits = [
  {
    time: "08:30",
    customer: "نمایندگی سایپا پارس",
    marketer: "سارا احمدی",
    status: "در مسیر",
    type: "ویزیت حضوری",
    notes: "بررسی موجودی قطعات قبل از کمپین زمستانه",
  },
  {
    time: "10:00",
    customer: "تعمیرگاه تویوتا سعادت",
    marketer: "امیرحسین صابری",
    status: "تکمیل شد",
    type: "پیگیری مالی",
    notes: "تاییدیه پرداخت پیش‌فاکتور 1248",
  },
  {
    time: "13:15",
    customer: "گاراژ مرکزی ایران خودرو",
    marketer: "نیلوفر کرمی",
    status: "در انتظار",
    type: "ارائه پیشنهاد",
    notes: "جلسه معرفی بسته خدمات طلایی ۱۴۰۴",
  },
  {
    time: "15:45",
    customer: "تعمیرگاه آریا موتور",
    marketer: "علیرضا مختاری",
    status: "لغو شد",
    type: "بازدید دوره‌ای",
    notes: "به درخواست مشتری به تاریخ ۱۷ آبان انتقال یافت",
  },
];

const upcomingReminders = [
  {
    title: "ارسال گزارش ویزیت‌های امروز",
    deadline: "ساعت ۱۸:۰۰",
    owner: "سارا احمدی",
  },
  {
    title: "ثبت درخواست پشتیبانی برای تویوتا سعادت",
    deadline: "تا فردا ۱۰ صبح",
    owner: "واحد فنی",
  },
  {
    title: "تایید برنامه ویزیت هفته آینده منطقه جنوب",
    deadline: "۱۹ آبان",
    owner: "امیرحسین صابری",
  },
];

const summaryCards = [
  {
    title: "ویزیت‌های امروز",
    value: "۱۸",
    helper: "+۴ نسبت به میانگین روزانه",
    helperColor: "text-emerald-500",
  },
  {
    title: "ویزیت‌های موفق",
    value: "۱۲",
    helper: "نرخ تبدیل ۶۷٪",
    helperColor: "text-slate-500",
  },
  {
    title: "ویزیت‌های لغوشده",
    value: "۳",
    helper: "۲ مورد با درخواست مشتری",
    helperColor: "text-orange-500",
  },
  {
    title: "میانگین زمان ویزیت",
    value: "۴۵ دقیقه",
    helper: "بهینه‌سازی +۵٪ نسبت به ماه قبل",
    helperColor: "text-emerald-500",
  },
];

export default function VisitsPreviewPage() {
  return (
    <AppShell
      title="برنامه ویزیت‌ها"
      description="مدیریت و ردیابی ویزیت‌های حضوری، وضعیت‌ها و یادداشت‌های تیم بازاریابی."
      activeHref="/dashboard/visits"
      actions={
        <>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
            خروجی برنامه
          </button>
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-sky-600">
            ثبت ویزیت جدید
          </button>
        </>
      }
      toolbar={
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] md:max-w-sm">
              <input
                type="search"
                placeholder="جستجو بر اساس مشتری، بازاریاب یا وضعیت..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
              <option value="today">برنامه امروز</option>
              <option value="week">این هفته</option>
              <option value="month">این ماه</option>
            </select>
            <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
              فیلتر بازاریاب
            </button>
            <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
              وضعیت ویزیت
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {summaryCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{card.title}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                <p className={`mt-2 text-[11px] ${card.helperColor}`}>{card.helper}</p>
              </article>
            ))}
          </div>
        </div>
      }
      footerNote={<span>آخرین بروزرسانی UI: فاز ۳ — برنامه ویزیت آزمایشی</span>}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr,1fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">نقشه ویزیت‌ها</h2>
              <p className="text-xs text-slate-500">
                جای‌نمایی کلی ویزیت‌های امروز بر اساس موقعیت مشتریان (نمونه‌ای برای تایید UI)
              </p>
            </div>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
              مشاهده در نقشه نشان
            </button>
          </header>
          <div className="mt-6 h-72 rounded-3xl border border-dashed border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50" />
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">یادآوری‌ها و پیگیری‌ها</h2>
              <p className="text-xs text-slate-500">همگام با ماژول وظایف در فازهای بعدی</p>
            </div>
            <button className="text-xs font-medium text-sky-500 hover:text-sky-600">افزودن مورد</button>
          </header>
          <ul className="flex flex-col gap-3 text-sm text-slate-600">
            {upcomingReminders.map((item) => (
              <li
                key={item.title}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-slate-900">{item.title}</span>
                  <span className="text-xs text-slate-500">مسئول: {item.owner}</span>
                </div>
                <span className="text-xs text-orange-500">{item.deadline}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-100 bg-white p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">برنامه زمانی ویزیت‌ها</h2>
            <p className="text-xs text-slate-500">
              نمایش نمونه‌ای از ردیف‌های ویزیت برای تایید ساختار (داده‌ها ثابت هستند)
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            وضعیت لحظه‌ای: بدون تاخیر بحرانی
          </div>
        </header>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] divide-y divide-slate-100 text-right text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-5 py-3">ساعت</th>
                <th className="px-5 py-3">مشتری</th>
                <th className="px-5 py-3">بازاریاب</th>
                <th className="px-5 py-3">نوع ویزیت</th>
                <th className="px-5 py-3">وضعیت</th>
                <th className="px-5 py-3">یادداشت</th>
                <th className="px-5 py-3">اقدام بعدی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {visits.map((visit) => (
                <tr key={`${visit.customer}-${visit.time}`} className="transition hover:bg-slate-50">
                  <td className="px-5 py-3 text-xs text-slate-500">{visit.time}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">{visit.customer}</td>
                  <td className="px-5 py-3">{visit.marketer}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{visit.type}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{visit.notes}</td>
                  <td className="px-5 py-3">
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
                      ثبت یادداشت
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

