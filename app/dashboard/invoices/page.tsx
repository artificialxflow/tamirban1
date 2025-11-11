import { AppShell } from "@/components/layout/app-shell";

const invoices = [
  {
    id: "INV-3245",
    customer: "نمایندگی سایپا پارس",
    marketer: "سارا احمدی",
    amount: "48,500,000",
    status: "در انتظار پرداخت",
    issueDate: "۱۴۰۴/۰۸/۱۲",
    dueDate: "۱۴۰۴/۰۸/۱۹",
  },
  {
    id: "INV-3244",
    customer: "تعمیرگاه آریا موتور",
    marketer: "علیرضا مختاری",
    amount: "18,750,000",
    status: "پرداخت شد",
    issueDate: "۱۴۰۴/۰۸/۰۸",
    dueDate: "۱۴۰۴/۰۸/۱۰",
  },
  {
    id: "INV-3243",
    customer: "گاراژ مرکزی ایران خودرو",
    marketer: "نیلوفر کرمی",
    amount: "32,100,000",
    status: "ارسال شده",
    issueDate: "۱۴۰۴/۰۸/۰۵",
    dueDate: "۱۴۰۴/۰۸/۱۲",
  },
  {
    id: "INV-3242",
    customer: "تعمیرگاه تویوتا سعادت",
    marketer: "امیرحسین صابری",
    amount: "25,800,000",
    status: "لغو شد",
    issueDate: "۱۴۰۴/۰۸/۰۱",
    dueDate: "۱۴۰۴/۰۸/۰۳",
  },
];

const stats = [
  {
    title: "پیش‌فاکتورهای صادر شده این ماه",
    value: "58",
    helper: "+۱۲٪ نسبت به ماه قبل",
    helperColor: "text-emerald-500",
  },
  {
    title: "مجموع مبلغ در انتظار پرداخت",
    value: "128,500,000 ریال",
    helper: "۵ فاکتور در وضعیت پیگیری",
    helperColor: "text-orange-500",
  },
  {
    title: "میانگین زمان پرداخت",
    value: "۴ روز",
    helper: "بهبود ۲ روز نسبت به ماه قبل",
    helperColor: "text-emerald-500",
  },
  {
    title: "نرخ تبدیل از پیش‌فاکتور به قرارداد",
    value: "۷۲٪",
    helper: "هدف تعیین‌شده: ۷۵٪",
    helperColor: "text-slate-500",
  },
];

const pdfPreviewLines = [
  { label: "عنوان فاکتور", value: "پیش‌فاکتور خدمات تعمیرات دوره‌ای" },
  { label: "شناسه", value: "INV-3245" },
  { label: "تاریخ صدور", value: "۱۴۰۴/۰۸/۱۲" },
  { label: "تاریخ سررسید", value: "۱۴۰۴/۰۸/۱۹" },
  { label: "مشتری", value: "نمایندگی سایپا پارس" },
  { label: "مسئول بازاریابی", value: "سارا احمدی" },
  { label: "وضعیت پرداخت", value: "در انتظار پرداخت" },
];

const lineItems = [
  { title: "سرویس دوره‌ای تجهیزات", qty: 1, unit: "بسته", price: "18,000,000", total: "18,000,000" },
  { title: "قطعات مصرفی ماهانه", qty: 6, unit: "عدد", price: "2,500,000", total: "15,000,000" },
  { title: "هزینه حمل و لجستیک", qty: 1, unit: "فاکتور", price: "6,500,000", total: "6,500,000" },
];

export default function InvoicesPreviewPage() {
  return (
    <AppShell
      title="مدیریت پیش‌فاکتورها"
      description="لیست پیش‌فاکتورهای صادر شده، وضعیت پرداخت و پیش‌نمایش PDF."
      activeHref="/dashboard/invoices"
      actions={
        <>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
            خروجی PDF
          </button>
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-sky-600">
            ایجاد پیش‌فاکتور جدید
          </button>
        </>
      }
      toolbar={
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] md:max-w-sm">
              <input
                type="search"
                placeholder="جستجو بر اساس مشتری، شناسه یا وضعیت..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
              <option value="month">دوره زمانی: این ماه</option>
              <option value="quarter">سه ماه اخیر</option>
              <option value="year">سال جاری</option>
            </select>
            <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
              وضعیت پرداخت
            </button>
            <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
              بر اساس بازاریاب
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {stats.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{card.title}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{card.value}</p>
                <p className={`mt-1 text-[11px] ${card.helperColor}`}>{card.helper}</p>
              </article>
            ))}
          </div>
        </div>
      }
      footerNote={<span>آخرین بروزرسانی UI: فاز ۳ — پیش‌فاکتورهای آزمایشی</span>}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr,1fr]">
        <section className="rounded-3xl border border-slate-100 bg-white">
          <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">لیست پیش‌فاکتورها</h2>
              <p className="text-xs text-slate-500">۴ مورد نمونه برای تایید UI (داده‌ها پویا نیستند)</p>
            </div>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
              خروجی Excel
            </button>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] divide-y divide-slate-100 text-right text-sm text-slate-600">
              <thead className="bg-white text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-6 py-4">شناسه</th>
                  <th className="px-6 py-4">مشتری</th>
                  <th className="px-6 py-4">مسئول</th>
                  <th className="px-6 py-4">مبلغ (ریال)</th>
                  <th className="px-6 py-4">وضعیت</th>
                  <th className="px-6 py-4">تاریخ صدور</th>
                  <th className="px-6 py-4">سررسید</th>
                  <th className="px-6 py-4">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 text-xs text-slate-400">{invoice.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{invoice.customer}</td>
                    <td className="px-6 py-4">{invoice.marketer}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-900">{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{invoice.issueDate}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{invoice.dueDate}</td>
                    <td className="px-6 py-4">
                      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
                        باز کردن
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 text-xs text-slate-400">
            <span>نمایش ۱ تا ۴ از ۵۸ پیش‌فاکتور</span>
            <div className="flex items-center gap-2">
              <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-slate-300 hover:text-slate-700">
                قبلی
              </button>
              <div className="flex items-center gap-1">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white">۱</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200">
                  ۲
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200">
                  ۳
                </span>
              </div>
              <button className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-slate-300 hover:text-slate-700">
                بعدی
              </button>
            </div>
          </footer>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6">
          <header className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-slate-900">پیش‌نمایش PDF</h2>
              <p className="text-xs text-slate-500">
                ساختار پیشنهادی برای تولید PDF در فازهای بعدی (نمایش خلاصه اطلاعات و آیتم‌ها)
              </p>
            </div>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
              دانلود نسخه نمونه
            </button>
          </header>

          <section className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
            {pdfPreviewLines.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-slate-400">{item.label}</span>
                <span className="font-medium text-slate-900">{item.value}</span>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 text-xs text-slate-600">
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">آیتم‌های فاکتور</h3>
              <span className="text-xs text-slate-400">۳ مورد</span>
            </header>
            <table className="w-full text-right text-xs">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-2">شرح</th>
                  <th className="py-2">تعداد</th>
                  <th className="py-2">واحد</th>
                  <th className="py-2">قیمت واحد</th>
                  <th className="py-2">مبلغ</th>
                </tr>
              </thead>
              <tbody className="text-slate-500">
                {lineItems.map((item) => (
                  <tr key={item.title} className="border-b border-slate-100">
                    <td className="py-2 text-slate-900">{item.title}</td>
                    <td className="py-2">{item.qty}</td>
                    <td className="py-2">{item.unit}</td>
                    <td className="py-2">{item.price}</td>
                    <td className="py-2 font-semibold text-slate-900">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>جمع کل</span>
              <span className="font-semibold text-slate-900">39,500,000 ریال</span>
            </div>
            <div className="flex items-center justify-between">
              <span>مالیات (۹٪)</span>
              <span className="font-semibold text-slate-900">3,555,000 ریال</span>
            </div>
            <div className="flex items-center justify-between text-sky-600">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-base font-semibold">43,055,000 ریال</span>
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>روش پرداخت: انتقال بانکی</span>
            <span>قوانین و شرایط: مهلت پرداخت ۷ روز، امکان تمدید با تایید مالی</span>
          </footer>
        </section>
      </div>
    </AppShell>
  );
}

