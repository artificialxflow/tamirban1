import { AppShell } from "@/components/layout/app-shell";

const marketers = [
  {
    name: "سارا احمدی",
    region: "تهران",
    customers: 38,
    visitsThisWeek: 12,
    conversion: "42%",
    status: "فعال",
    trend: "+6%",
    avatar: "SA",
  },
  {
    name: "امیرحسین صابری",
    region: "اصفهان",
    customers: 24,
    visitsThisWeek: 8,
    conversion: "35%",
    status: "نیازمند پیگیری",
    trend: "-3%",
    avatar: "AS",
  },
  {
    name: "نیلوفر کرمی",
    region: "تبریز",
    customers: 27,
    visitsThisWeek: 10,
    conversion: "48%",
    status: "فعال",
    trend: "+4%",
    avatar: "NK",
  },
  {
    name: "علیرضا مختاری",
    region: "شیراز",
    customers: 19,
    visitsThisWeek: 5,
    conversion: "29%",
    status: "در آموزش",
    trend: "+1%",
    avatar: "AM",
  },
];

const leaderboard = [
  { rank: 1, name: "سارا احمدی", score: 96, growth: "+12%", trendColor: "text-emerald-500" },
  { rank: 2, name: "نیلوفر کرمی", score: 91, growth: "+8%", trendColor: "text-emerald-500" },
  { rank: 3, name: "امیرحسین صابری", score: 84, growth: "+3%", trendColor: "text-emerald-500" },
  { rank: 4, name: "علیرضا مختاری", score: 77, growth: "-2%", trendColor: "text-orange-500" },
];

const campaigns = [
  {
    title: "کمپین ویزیت ویژه زمستان",
    reach: "۶۸ مشتری هدف",
    cta: "پیگیری بازخورد بازاریاب‌ها تا ۲۰ آبان",
  },
  {
    title: "بسته معرفی قطعات مصرفی ۱۴۰۴",
    reach: "۵۴ مشتری ویژه",
    cta: "ارسال گزارش جمع‌بندی تا ۲۵ آبان",
  },
];

export default function MarketersPreviewPage() {
  return (
    <AppShell
      title="مدیریت بازاریاب‌ها"
      description="بررسی عملکرد تیم بازاریابی، وضعیت ویزیت‌ها و تقسیم منطقه‌ای."
      activeHref="/dashboard/marketers"
      actions={
        <>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
            خروجی عملکرد
          </button>
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-sky-600">
            افزودن بازاریاب جدید
          </button>
        </>
      }
      toolbar={
        <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px] md:max-w-sm">
              <input
                type="search"
                placeholder="جستجو بر اساس نام، شهر یا مهارت..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
              <option value="month">دوره ارزیابی: این ماه</option>
              <option value="quarter">سه ماه اخیر</option>
              <option value="year">سال جاری</option>
            </select>
            <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
              فیلتر وضعیت
            </button>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-4 text-sm text-white">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">میانگین نرخ تبدیل تیم</span>
              <span className="text-2xl font-semibold">۳۸٪</span>
            </div>
            <div className="text-xs text-emerald-400">+۵٪ نسبت به ماه قبل</div>
          </div>
        </div>
      }
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {marketers.map((marketer) => (
          <article
            key={marketer.name}
            className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 transition hover:border-sky-200 hover:shadow-soft"
          >
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-base font-semibold text-white">
                  {marketer.avatar}
                </span>
                <div className="flex flex-col">
                  <h2 className="text-base font-semibold text-slate-900">{marketer.name}</h2>
                  <p className="text-xs text-slate-500">منطقه: {marketer.region}</p>
                </div>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
                {marketer.status}
              </span>
            </header>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-slate-400">تعداد مشتری</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{marketer.customers}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-slate-400">ویزیت این هفته</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{marketer.visitsThisWeek}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-slate-400">نرخ تبدیل</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{marketer.conversion}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-slate-400">روند رشد</p>
                <p className="mt-1 text-lg font-semibold text-emerald-500">{marketer.trend}</p>
              </div>
            </div>

            <footer className="flex items-center justify-between text-xs">
              <button className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
                مشاهده گزارش
              </button>
              <button className="text-sky-500 transition hover:text-sky-600">ارسال پیام</button>
            </footer>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-6">
          <header className="flex items-center justify_between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">نمودار عملکرد تیم</h2>
              <p className="text-xs text-slate-500">نمونه بصری برای تایید ساختار داشبورد</p>
            </div>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
              دانلود گزارش
            </button>
          </header>
          <div className="mt-6 h-48 rounded-2xl bg-gradient-to-br from-sky-100 via-white to-sky-50" />
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6">
          <header className="flex items_center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">تابلوی امتیاز</h2>
              <p className="text-xs text-slate-500">امتیاز ترکیبی براساس KPIهای فاز ۵</p>
            </div>
            <button className="text-xs font-medium text-sky-500 hover:text-sky-600">
              مدیریت شاخص‌ها
            </button>
          </header>
          <ul className="flex flex-col gap-3 text-sm text-slate-600">
            {leaderboard.map((item) => (
              <li
                key={item.rank}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {item.rank}
                  </span>
                  <span className="font-semibold text-slate-900">{item.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-600">
                    امتیاز {item.score}
                  </span>
                  <span className={item.trendColor}>{item.growth}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {campaigns.map((campaign) => (
          <article
            key={campaign.title}
            className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-slate-900 p-6 text-white"
          >
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{campaign.title}</h3>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                کمپین جاری
              </span>
            </header>
            <p className="text-sm text-slate-200">{campaign.reach}</p>
            <p className="text-xs text-slate-400">{campaign.cta}</p>
            <footer className="mt-4 flex items-center gap-3 text-xs text-slate-300">
              <button className="rounded-full bg-white/10 px-4 py-2 transition hover:bg-white/20">
                مشاهده جزئیات
              </button>
              <button className="rounded-full border border-white/20 px-4 py-2 transition hover:bg-white/10">
                ثبت پیشرفت
              </button>
            </footer>
          </article>
        ))}
      </section>
    </AppShell>
  );
}

