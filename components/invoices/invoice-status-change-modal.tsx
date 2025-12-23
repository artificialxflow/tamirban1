"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PersianDateTimePicker } from "@/components/visits/persian-date-time-picker";
import { ProtectedComponent } from "@/components/common/protected-component";
import type { InvoiceStatus } from "@/lib/types";
import type { InvoiceDetail } from "@/lib/services/invoices.service";

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "پیش‌نویس",
  SENT: "ارسال شده",
  PAID: "پرداخت شد",
  OVERDUE: "معوق",
  CANCELLED: "لغو شد",
};

const STATUS_OPTIONS: InvoiceStatus[] = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

interface InvoiceStatusChangeModalProps {
  invoice: InvoiceDetail;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InvoiceStatusChangeModal({
  invoice,
  isOpen,
  onClose,
  onSuccess,
}: InvoiceStatusChangeModalProps) {
  const router = useRouter();
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status);
  const [paidAt, setPaidAt] = useState<string>("");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CHECK" | "TRANSFER">("CASH");
  const [checkAmount, setCheckAmount] = useState<string>("");
  const [checkDate, setCheckDate] = useState<string>("");
  const [checkOwner, setCheckOwner] = useState<string>("");
  const [checkNumber, setCheckNumber] = useState<string>("");
  const [checkStatus, setCheckStatus] = useState<"PENDING" | "SETTLED" | "BOUNCED">("PENDING");
  const [transferReference, setTransferReference] = useState<string>("");
  const [cashAmount, setCashAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(invoice.status);
      setPaidAt("");
      setPaymentReference(invoice.paymentReference || "");
      setError(null);
      setShowConfirm(false);
      
      // بارگذاری اطلاعات پرداخت موجود
      if (invoice.paymentInfo) {
        setPaymentMethod(invoice.paymentInfo.method);
        setCheckAmount(invoice.paymentInfo.checkAmount?.toString() || "");
        setCheckDate(invoice.paymentInfo.checkDate ? new Date(invoice.paymentInfo.checkDate).toISOString().slice(0, 16) : "");
        setCheckOwner(invoice.paymentInfo.checkOwner || "");
        setCheckNumber(invoice.paymentInfo.checkNumber || "");
        setCheckStatus(invoice.paymentInfo.status || "PENDING");
        setTransferReference(invoice.paymentInfo.transferReference || "");
        setCashAmount(invoice.paymentInfo.cashAmount?.toString() || "");
      } else {
        // Reset to defaults
        setPaymentMethod("CASH");
        setCheckAmount("");
        setCheckDate("");
        setCheckOwner("");
        setCheckNumber("");
        setCheckStatus("PENDING");
        setTransferReference("");
        setCashAmount("");
      }
    }
  }, [isOpen, invoice]);

  const handleSubmit = async () => {
    if (status === invoice.status) {
      onClose();
      return;
    }

    // برای تغییرات مهم، نمایش Confirmation
    if ((status === "PAID" || status === "CANCELLED") && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("لطفاً ابتدا وارد شوید.");
        setLoading(false);
        return;
      }

      const payload: { status: InvoiceStatus; paidAt?: string; paymentReference?: string } = {
        status,
      };

      if (status === "PAID") {
        if (paidAt) {
          payload.paidAt = new Date(paidAt).toISOString();
        } else {
          payload.paidAt = new Date().toISOString();
        }
        if (paymentReference) {
          payload.paymentReference = paymentReference;
        } else {
          payload.paymentReference = "";
        }
      }

      const response = await fetch(`/api/invoices/${invoice._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "خطا در تغییر وضعیت");
      }

      const data = await response.json();
      if (data.success) {
        router.refresh();
        onSuccess?.();
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        throw new Error(data.message || "خطا در تغییر وضعیت");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در تغییر وضعیت");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ProtectedComponent permission="invoices:write" showMessage>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl rounded-3xl border-2 border-slate-300 bg-white shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-300 bg-slate-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">تغییر وضعیت پیش‌فاکتور</h2>
              <p className="text-xs text-slate-600">
                شماره: {(invoice.meta?.invoiceNumber as string) || invoice._id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-600 hover:bg-slate-200 transition"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {showConfirm ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <strong>توجه:</strong> آیا مطمئن هستید که می‌خواهید وضعیت پیش‌فاکتور را به{" "}
                  <strong>{STATUS_LABELS[status]}</strong> تغییر دهید؟
                  {status === "CANCELLED" && (
                    <p className="mt-2">این عملیات غیرقابل برگشت است.</p>
                  )}
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="rounded-full border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-full border-2 border-red-300 bg-red-100 px-5 py-2.5 text-sm font-semibold text-red-800 transition hover:border-red-400 hover:bg-red-200 disabled:opacity-50"
                  >
                    {loading ? "در حال تغییر..." : "تایید تغییر"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    وضعیت فعلی
                  </label>
                  <div className="rounded-2xl border-2 border-slate-300 bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-700">{STATUS_LABELS[invoice.status]}</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    وضعیت جدید <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                    className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {STATUS_LABELS[opt]}
                      </option>
                    ))}
                  </select>
                </div>

                {status === "PAID" && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        تاریخ پرداخت
                      </label>
                      <PersianDateTimePicker
                        name="paidAt"
                        defaultValue={paidAt || ""}
                        onChange={(value) => setPaidAt(value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        شماره مرجع پرداخت
                      </label>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="مثال: REF-123456"
                        className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        روش پرداخت <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as "CASH" | "CHECK" | "TRANSFER")}
                        className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                      >
                        <option value="CASH">نقدی</option>
                        <option value="CHECK">چک</option>
                        <option value="TRANSFER">انتقال بانکی</option>
                      </select>
                    </div>

                    {paymentMethod === "CASH" && (
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                          مبلغ نقدی (تومان)
                        </label>
                        <input
                          type="number"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          placeholder="مثال: 10000000"
                          className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {paymentMethod === "CHECK" && (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-800">
                            مبلغ چک (تومان)
                          </label>
                          <input
                            type="number"
                            value={checkAmount}
                            onChange={(e) => setCheckAmount(e.target.value)}
                            placeholder="مثال: 10000000"
                            className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-800">
                            تاریخ چک
                          </label>
                          <PersianDateTimePicker
                            name="checkDate"
                            defaultValue={checkDate || ""}
                            onChange={(value) => setCheckDate(value)}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-800">
                            صاحب چک
                          </label>
                          <input
                            type="text"
                            value={checkOwner}
                            onChange={(e) => setCheckOwner(e.target.value)}
                            placeholder="نام صاحب چک"
                            className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-800">
                            شماره چک
                          </label>
                          <input
                            type="text"
                            value={checkNumber}
                            onChange={(e) => setCheckNumber(e.target.value)}
                            placeholder="شماره چک"
                            className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-800">
                            وضعیت چک
                          </label>
                          <select
                            value={checkStatus}
                            onChange={(e) => setCheckStatus(e.target.value as "PENDING" | "SETTLED" | "BOUNCED")}
                            className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                          >
                            <option value="PENDING">در انتظار</option>
                            <option value="SETTLED">تسویه شده</option>
                            <option value="BOUNCED">برگشت خورده</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "TRANSFER" && (
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                          شماره مرجع انتقال
                        </label>
                        <input
                          type="text"
                          value={transferReference}
                          onChange={(e) => setTransferReference(e.target.value)}
                          placeholder="شماره مرجع انتقال بانکی"
                          className="w-full rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!showConfirm && (
            <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-slate-50 px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-full border-2 border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                انصراف
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || status === invoice.status}
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "در حال تغییر..." : "ذخیره تغییرات"}
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedComponent>
  );
}

