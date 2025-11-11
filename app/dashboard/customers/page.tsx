import type { CustomerStatus } from "@/lib/types";
import { getCustomerDetail, listCustomerSummaries } from "@/lib/services/customers.service";
import { AppShell } from "@/components/layout/app-shell";
import { CustomerCreateForm } from "@/components/customers/customer-create-form";
import { CustomerDeleteButton } from "@/components/customers/customer-delete-button";

const STATUS_LABELS: Record<CustomerStatus, string> = {
  ACTIVE: "فعال",
  INACTIVE: "غیرفعال",
  PENDING: "در انتظار پیگیری",
  AT_RISK: "احتمال ریزش",
  LOYAL: "مشتری وفادار",
  SUSPENDED: "متوقف شده",
};

const STATUS_BADGE_CLASS: Partial<Record<CustomerStatus, string>> = {
  ACTIVE: "bg-emerald-100 text-emerald-600",
  LOYAL: "bg-sky-100 text-sky-600",
  AT_RISK: "bg-amber-100 text-amber-600",
  PENDING: "bg-slate-100 text-slate-600",
  INACTIVE: "bg-slate-200 text-slate-600",
  SUSPENDED: "bg-rose-100 text-rose-600",
};

const numberFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatDate(value?: Date | null) {
  if (!value) {
    return "نامشخص";
  }
  return dateFormatter.format(value);
}

function formatRevenue(value?: number) {
  if (!value) {
    return "۰";
  }
  return numberFormatter.format(value);
}

function resolveBadgeClass(status: CustomerStatus) {
  return STATUS_BADGE_CLASS[status] ?? "bg-slate-100 text-slate-600";
}

export default async function CustomersPage() {
  const customers = await listCustomerSummaries();
  const selectedCustomerId = customers[0]?.id;
  const selectedCustomer = selectedCustomerId ? await getCustomerDetail(selectedCustomerId) : null;

  return (
    <AppShell
      title="مدیریت مشتریان"
      description="لیست مشتریان ثبت شده با امکان فیلتر، جستجو و مشاهده خلاصه تعاملات."
      activeHref="/dashboard/customers"
      actions={
        <>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800">
            ورود از Excel
          </button>
          <button className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-sky-600">
            افزودن مشتری جدید
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <CustomerCreateForm />

        {customers.length === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/70 p-16 text-center text-slate-500">
          <h2 className="text-xl font-semibold text-slate-900">هیچ مشتری ثبت نشده است</h2>
          <p className="mt-2 max-w-md text-sm leading-7">
            برای شروع، از مسیر «افزودن مشتری جدید» یا API `/api/customers` استفاده کنید تا مشتریان به‌صورت زنده در این لیست نمایش داده شوند.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
          <section className="overflow-hidden rounded-3xl border border-slate-100">
            <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">لیست مشتریان</h2>
                <p className="text-xs text-slate-500">{numberFormatter.format(customers.length)} مورد نمایش داده می‌شود</p>
              </div>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700">
                خروجی Excel
              </button>
            </header>
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[720px] divide-y divide-slate-100 text-right text-sm text-slate-600">
                <thead className="bg-white text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="px-6 py-4">شناسه</th>
                    <th className="px-6 py-4">نام مشتری</th>
                    <th className="px-6 py-4">بازاریاب مسئول</th>
                    <th className="px-6 py-4">شهر</th>
                    <th className="px-6 py-4">آخرین ویزیت</th>
                    <th className="px-6 py-4">وضعیت</th>
                    <th className="px-6 py-4">امتیاز</th>
                    <th className="px-6 py-4">درآمد ماه جاری (ریال)</th>
                    <th className="px-6 py-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 text-xs text-slate-400">{customer.code}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{customer.name}</td>
                      <td className="px-6 py-4">{customer.marketer ?? "نامشخص"}</td>
                      <td className="px-6 py-4">{customer.city ?? "-"}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{formatDate(customer.lastVisitAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${resolveBadgeClass(customer.status)}`}>
                          {STATUS_LABELS[customer.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                          {customer.grade ?? "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-900">{formatRevenue(customer.monthlyRevenue)}</td>
                      <td className="px-6 py-4 text-center">
                        <CustomerDeleteButton customerId={customer.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6">
            {selectedCustomer ? (
              <>
                <header className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold text-slate-900">{selectedCustomer.name}</h2>
                    <p className="text-xs text-slate-500">
                      کد مشتری: {selectedCustomer.code} • شهر: {selectedCustomer.city ?? "نامشخص"}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${resolveBadgeClass(selectedCustomer.status)}`}>
                    {STATUS_LABELS[selectedCustomer.status]}
                  </span>
                </header>

                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-slate-400">میانگین خرید ماهانه</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{formatRevenue(selectedCustomer.monthlyRevenue)} ریال</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-slate-400">احتمال تمدید قرارداد</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {selectedCustomer.loyaltyScore ? `${selectedCustomer.loyaltyScore}%` : "نامشخص"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-slate-400">درجه مشتری</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{selectedCustomer.grade ?? "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-slate-400">بازاریاب مسئول</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{selectedCustomer.marketer ?? "تعیین نشده"}</p>
                  </div>
                </div>

                <section className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4">
                  <header className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">اطلاعات تماس</h3>
                    <span className="text-xs text-slate-400">آخرین ویزیت: {formatDate(selectedCustomer.lastVisitAt)}</span>
                  </header>
                  <div className="flex flex-col gap-2 text-xs text-slate-500">
                    <span>شماره تماس: {selectedCustomer.phone ?? "ثبت نشده"}</span>
                    {selectedCustomer.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>

                {selectedCustomer.notes ? (
                  <section className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-slate-500">
                    <h3 className="text-sm font-semibold text-slate-900">یادداشت‌های اخیر</h3>
                    <p className="leading-6 text-slate-600">{selectedCustomer.notes}</p>
                  </section>
                ) : null}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-slate-500">
                <span>برای مشاهده جزئیات، ابتدا یک مشتری ثبت کنید.</span>
              </div>
            )}
          </section>
        </div>
        )}
      </div>
    </AppShell>
  );
}

