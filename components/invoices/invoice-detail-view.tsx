"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import type { InvoiceDetail } from "@/lib/services/invoices.service";

const numberFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "پیش‌نویس",
  SENT: "ارسال شده",
  PAID: "پرداخت شد",
  OVERDUE: "معوق",
  CANCELLED: "لغو شد",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 border border-slate-200",
  SENT: "bg-primary-100 text-primary-700 border border-primary-200",
  PAID: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  OVERDUE: "bg-orange-100 text-orange-700 border border-orange-200",
  CANCELLED: "bg-rose-100 text-rose-700 border border-rose-200",
};

function formatDate(value: Date) {
  return dateFormatter.format(value);
}

function formatAmount(value: number) {
  return numberFormatter.format(value);
}

interface InvoiceDetailViewProps {
  invoice: InvoiceDetail;
}

export function InvoiceDetailView({ invoice }: InvoiceDetailViewProps) {
  const router = useRouter();

  const handleDownloadPDF = async () => {
    const stored = localStorage.getItem("auth_tokens");
    if (!stored) {
      alert("لطفا دوباره وارد شوید");
      return;
    }

    let token: string | null = null;
    try {
      const tokens = JSON.parse(stored);
      token = tokens.accessToken || null;
    } catch {
      alert("لطفا دوباره وارد شوید");
      return;
    }

    if (!token) {
      alert("لطفا دوباره وارد شوید");
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${invoice._id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "خطا در دانلود PDF");
      }

      const blob = await response.blob();
      
      // دریافت نام فایل از header یا استفاده از invoiceNumber
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `invoice-${(invoice.meta?.invoiceNumber as string) || invoice._id}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert("خطا در دانلود PDF: " + (error instanceof Error ? error.message : "خطای ناشناخته"));
    }
  };

  return (
    <AppShell
      title="جزئیات پیش‌فاکتور"
      description={`شماره پیش‌فاکتور: ${(invoice.meta?.invoiceNumber as string) || invoice._id}`}
      activeHref="/dashboard/invoices"
      actions={
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
          style={{
            background: "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%)",
          }}
        >
          دانلود PDF
        </button>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              پیش‌فاکتور شماره {(invoice.meta?.invoiceNumber as string) || invoice._id}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              تاریخ صدور: {formatDate(invoice.issuedAt)} | تاریخ سررسید: {formatDate(invoice.dueAt)}
            </p>
          </div>
          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
              STATUS_BADGE_CLASS[invoice.status] || STATUS_BADGE_CLASS.DRAFT
            }`}
          >
            {STATUS_LABELS[invoice.status] || invoice.status}
          </span>
        </div>

        {/* Customer and Marketer Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">اطلاعات مشتری</h2>
            <div className="space-y-2">
              <p className="text-base font-medium text-slate-900">
                {invoice.customerName || "مشتری ناشناس"}
              </p>
              {invoice.customerPhone && (
                <p className="text-sm text-slate-600">
                  <span className="font-medium">تلفن:</span> {invoice.customerPhone}
                </p>
              )}
              {invoice.customerCity && (
                <p className="text-sm text-slate-600">
                  <span className="font-medium">شهر:</span> {invoice.customerCity}
                </p>
              )}
              {invoice.customerAddress && (
                <p className="text-sm text-slate-600">
                  <span className="font-medium">آدرس:</span> {invoice.customerAddress}
                </p>
              )}
            </div>
          </div>
          {invoice.marketerName && (
            <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">بازاریاب</h2>
              <p className="text-base font-medium text-slate-700">{invoice.marketerName}</p>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="rounded-3xl border-2 border-slate-300 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">عنوان</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">تعداد</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">واحد</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">قیمت واحد</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">تخفیف</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">مالیات</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">جمع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm text-slate-700">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{formatAmount(item.quantity)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{item.unit}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{formatAmount(item.unitPrice)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {item.discount ? formatAmount(item.discount) : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {item.taxRate ? `${item.taxRate}%` : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatAmount(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">جمع کل:</span>
              <span className="text-lg font-semibold text-slate-900">{formatAmount(invoice.subtotal)}</span>
            </div>
            {invoice.discountTotal && invoice.discountTotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">تخفیف:</span>
                <span className="text-lg font-semibold text-emerald-600">
                  -{formatAmount(invoice.discountTotal)}
                </span>
              </div>
            )}
            {invoice.taxTotal && invoice.taxTotal > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">مالیات:</span>
                <span className="text-lg font-semibold text-slate-900">{formatAmount(invoice.taxTotal)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-900">مبلغ نهایی:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatAmount(invoice.grandTotal)} {invoice.currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/dashboard/invoices")}
            className="rounded-full border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 shadow-md"
          >
            بازگشت به لیست
          </button>
        </div>
      </div>
    </AppShell>
  );
}

