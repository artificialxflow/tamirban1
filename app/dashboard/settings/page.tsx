import { AppShell } from "@/components/layout/app-shell";

const tabs = [
  { id: "access", label: "دسترسی‌ها" },
  { id: "notifications", label: "اعلان‌ها" },
  { id: "integrations", label: "یکپارچگی‌ها" },
  { id: "appearance", label: "ظاهر سیستم" },
  { id: "security", label: "امنیت" },
];

const roles = [
  {
    name: "مدیر کل",
    permissions: "مدیریت کامل سیستم، دسترسی به گزارش‌های مالی و تنظیمات امنیتی",
    members: ["رضا توکلی", "سمیرا بهمنی"],
  },
  {
    name: "مدیر مالی",
    permissions: "مشاهده و تایید پیش‌فاکتور، مدیریت پرداخت‌ها، گزارش مالی ماهانه",
    members: ["الهام رضوی"],
  },
  {
    name: "بازاریاب",
    permissions: "مدیریت مشتریان تخصیص‌یافته، ثبت ویزیت، ارسال پیش‌فاکتور آزمایشی",
    members: ["سارا احمدی", "امیرحسین صابری", "نیلوفر کرمی"],
  },
  {
    name: "پشتیبانی",
    permissions: "پیگیری درخواست‌های پس از فروش و مدیریت پیامک‌ها",
    members: ["تیم پشتیبانی CRM"],
  },
];

const notificationChannels = [
  {
    title: "پیامک OTP",
    description: "ارسال کد تایید ورود برای کاربران و مشتریان",
    enabled: true,
  },
  {
    title: "گزارش‌های روزانه ایمیل",
    description: "ارسال خلاصه عملکرد بازاریاب‌ها به مدیر کل",
    enabled: false,
  },
  {
    title: "هشدار فاکتور معوق",
    description: "ارسال اعلان به مدیر مالی در صورت عبور از سررسید",
    enabled: true,
  },
];

const integrationCards = [
  {
    name: "سامانه پیامکی کاوه نگار",
    status: "فعال",
    description: "ارسال OTP و پیامک‌های اطلاع‌رسانی",
    actions: ["تنظیم مجدد کلید", "مشاهده گزارش ارسال"],
  },
  {
    name: "نقشه نشان",
    status: "در حال اتصال",
    description: "نمایش موقعیت تعمیرگاه‌ها و برنامه ویزیت",
    actions: ["تایید API Key", "راهنمای اتصال"],
  },
  {
    name: "درگاه پرداخت زرین‌پال",
    status: "پیشنهاد شده",
    description: "امکان پرداخت آنلاین پیش‌فاکتور توسط مشتری",
    actions: ["شروع فرآیند اتصال"],
  },
];

export default function SettingsPreviewPage() {
  return (
    <AppShell
      title="تنظیمات سیستم"
      description="مدیریت نقش‌ها، اعلان‌ها و یکپارچگی‌ها قبل از اتصال به داده‌های واقعی."
      activeHref="/dashboard/settings"
      actions={
        <>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
            ذخیره تغییرات
          </button>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-slate-800">
            بازگشت به تنظیمات پیش‌فرض
          </button>
        </>
      }
      toolbar={
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          حالت پیش‌نمایش: تغییرات ذخیره نمی‌شوند • تمام موارد بر اساس داده ثابت هستند.
        </div>
      }
      footerNote={<span>آخرین بروزرسانی UI: فاز ۳ — ماژول تنظیمات آزمایشی</span>}
    >
      <section className="rounded-3xl border border-slate-100 bg-white p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={[
                  "rounded-full px-4 py-2 transition",
                  index === 0
                    ? "bg-sky-500 text-white shadow-soft"
                    : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
            مشاهده تاریخچه تغییرات
          </button>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr,1fr]">
          <section className="rounded-3xl border border-slate-100 bg-white">
            <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">مدیریت نقش‌ها</h2>
                <p className="text-xs text-slate-500">تعریف نقش‌ها و کاربرانی که به آنها تخصیص یافته‌اند</p>
              </div>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
                افزودن نقش جدید
              </button>
            </header>
            <ul className="flex flex-col divide-y divide-slate-100">
              {roles.map((role) => (
                <li key={role.name} className="flex flex-col gap-3 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">{role.name}</h3>
                    <button className="text-xs text-sky-500 hover:text-sky-600">ویرایش دسترسی‌ها</button>
                  </div>
                  <p className="text-xs text-slate-500">{role.permissions}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    {role.members.map((member) => (
                      <span key={member} className="rounded-full bg-slate-50 px-3 py-1">
                        {member}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">کانال‌های اعلان</h2>
                <p className="text-xs text-slate-500">بر اساس تصمیم فاز ۵، فعال‌سازی کانال‌ها با داده واقعی انجام می‌شود</p>
              </div>
              <button className="text-xs font-medium text-sky-500 hover:text-sky-600">تنظیمات پیشرفته</button>
            </header>
            <ul className="flex flex-col gap-3 text-sm text-slate-600">
              {notificationChannels.map((channel) => (
                <li
                  key={channel.title}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-900">{channel.title}</span>
                    <span className="text-xs text-slate-500">{channel.description}</span>
                  </div>
                  <button
                    className={[
                      "rounded-full px-4 py-2 text-xs font-medium transition",
                      channel.enabled
                        ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300",
                    ].join(" ")}
                  >
                    {channel.enabled ? "فعال" : "غیرفعال"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-100 bg-white">
          <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">یکپارچگی‌ها</h2>
              <p className="text-xs text-slate-500">لیست سرویس‌های متصل یا در انتظار اتصال برای فازهای بعدی</p>
            </div>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
              افزودن یکپارچگی جدید
            </button>
          </header>
          <div className="grid gap-4 p-6 md:grid-cols-3">
            {integrationCards.map((integration) => (
              <article
                key={integration.name}
                className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-5"
              >
                <header className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{integration.name}</h3>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
                    {integration.status}
                  </span>
                </header>
                <p className="text-xs text-slate-500">{integration.description}</p>
                <footer className="flex flex-wrap gap-2 text-xs">
                  {integration.actions.map((action) => (
                    <button
                      key={action}
                      className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                    >
                      {action}
                    </button>
                  ))}
                </footer>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">حوزه‌های امنیتی</h2>
            <p className="text-xs text-slate-500">
              یادآوری مواردی که باید هنگام پیاده‌سازی واقعی احراز هویت، رمزنگاری و لاگ‌ها در نظر گرفته شود
            </p>
          </div>
          <button className="text-xs font-medium text-sky-500 hover:text-sky-600">بازبینی سیاست‌ها</button>
        </header>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-5 text-xs text-slate-600">
            <h3 className="text-sm font-semibold text-slate-900">احراز هویت</h3>
            <p>OTP رمزنگاری‌شده با bcrypt، صدور JWT و امکان قفل حساب پس از تلاش ناموفق متوالی.</p>
            <button className="text-xs font-semibold text-sky-500 hover:text-sky-600">نمایش سیاست پیشنهادی</button>
          </article>
          <article className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-5 text-xs text-slate-600">
            <h3 className="text-sm font-semibold text-slate-900">ذخیره‌سازی داده</h3>
            <p>عدم ذخیره OTP خام، نگهداری لاگ رویدادها و پاکسازی برنامه‌ریزی‌شده اطلاعات حساس.</p>
            <button className="text-xs font-semibold text-sky-500 hover:text-sky-600">چک‌لیست دیتابیس</button>
          </article>
          <article className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-5 text-xs text-slate-600">
            <h3 className="text-sm font-semibold text-slate-900">انطباق و مانیتورینگ</h3>
            <p>تعریف هشدار برای تلاش‌های مشکوک، ثبت لاگ و هشدار ایمیلی برای مدیر امنیت.</p>
            <button className="text-xs font-semibold text-sky-500 hover:text-sky-600">لیست اقدامات</button>
          </article>
        </div>
      </section>
    </AppShell>
  );
}

