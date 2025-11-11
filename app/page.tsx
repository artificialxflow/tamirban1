const highlights = [
  {
    title: "احراز هویت ایمن",
    description:
      "ورود با OTP رمزنگاری‌شده، مدیریت نشست با JWT و کنترل تعداد تلاش‌ها برای امنیت بیشتر.",
  },
  {
    title: "مدیریت شبکه و مشتریان",
    description:
      "ثبت مشتری، ویزیت، پیش‌فاکتور و پیگیری بازاریاب‌ها در یک داشبورد واحد و ساده.",
  },
  {
    title: "گزارش‌های تعاملی",
    description:
      "تجمیع KPIها، خروجی Excel و PDF برای نظارت دقیق بر عملکرد تیم و شعب تعمیرگاهی.",
  },
];

import Link from "next/link";

export default function Home() {
  return (
    <main className="container flex flex-1 flex-col gap-16 py-16">
      <section className="flex flex-col gap-8 rounded-2xl bg-white p-10 shadow-soft">
        <span className="inline-flex max-w-fit items-center gap-3 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-600">
          تعمیربان | TamirBan CRM
        </span>
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold leading-[1.3] text-slate-900 md:text-5xl">
            کنترل کامل شبکه تعمیرگاه‌ها با یک پلتفرم یکپارچه و فارسی
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
            این مخزن نقطه شروع برای توسعه نسخه وب و PWA تعمیربان است. در اینجا
            فونداسیون UI/UX، ساختار پوشه‌ها و پیش‌نیازهای Tailwind/TypeScript
            فراهم شده تا بتوان فازهای بعدی را سریع‌تر اجرا کرد.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="rounded-full border border-slate-200 px-4 py-2">
            Next.js 14+ App Router
          </span>
          <span className="rounded-full border border-slate-200 px-4 py-2">
            Tailwind + RTL آماده
          </span>
          <span className="rounded-full border border-slate-200 px-4 py-2">
            معماری ماژولار
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-sky-600"
          >
            مشاهده پیش‌نمایش داشبورد
          </Link>
          <Link
            href="/auth"
            className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            مشاهده ماک احراز هویت OTP
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
            <p className="text-sm leading-7 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
