"use client";

import { useEffect, useRef, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { createVisitAction, type CreateVisitFormState } from "@/app/dashboard/visits/actions";
import { apiClient } from "@/lib/utils/api-client";
import type { CustomerSummary } from "@/lib/services/customers.service";
import type { MarketerSummary } from "@/lib/services/marketers.service";
import { SearchableSelect } from "./searchable-select";
import { PersianDateTimePicker } from "./persian-date-time-picker";

const createVisitDefaultState: CreateVisitFormState = {
  success: false,
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded-2xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-soft-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
    >
      {pending ? "در حال ثبت..." : "ثبت ویزیت"}
    </button>
  );
}

interface VisitCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function VisitCreateModal({ isOpen, onClose, onSuccess }: VisitCreateModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createVisitAction, createVisitDefaultState);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [marketers, setMarketers] = useState<MarketerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedMarketerId, setSelectedMarketerId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal opens
      setSelectedCustomerId("");
      setSelectedMarketerId("");
      
      // Fetch customers and marketers for dropdowns
      Promise.all([
        apiClient.get<{ data: CustomerSummary[]; total: number; page: number; limit: number }>("/api/customers?limit=100"),
        apiClient.get<{ data: MarketerSummary[]; total: number; page: number; limit: number }>("/api/marketers?limit=100"),
      ])
        .then(([customersRes, marketersRes]) => {
          console.log("Customers response:", customersRes);
          console.log("Marketers response:", marketersRes);
          
          if (customersRes.success && customersRes.data) {
            const customersData = customersRes.data.data || [];
            console.log("Setting customers:", customersData.length, customersData);
            setCustomers(customersData);
          } else {
            console.error("Failed to fetch customers:", customersRes);
            setCustomers([]);
          }
          if (marketersRes.success && marketersRes.data) {
            const marketersData = marketersRes.data.data || [];
            console.log("Setting marketers:", marketersData.length, marketersData);
            setMarketers(marketersData);
          } else {
            console.error("Failed to fetch marketers:", marketersRes);
            setMarketers([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setCustomers([]);
          setMarketers([]);
          setLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
      setTimeout(() => {
        formRef.current?.reset();
        setSelectedCustomerId("");
        setSelectedMarketerId("");
        onClose();
      }, 1000);
    }
  }, [state.success, onClose, onSuccess]);

  if (!isOpen) {
    return null;
  }

  // Get current date/time for default value
  const now = new Date();
  const defaultDateTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
  const defaultDateTimeString = defaultDateTime.toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200/60 bg-white/95 backdrop-blur-sm p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute left-6 top-6 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="بستن"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <header className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-semibold text-slate-800">ثبت ویزیت جدید</h2>
          <p className="mt-1 text-sm text-slate-500">اطلاعات ویزیت را وارد کنید</p>
        </header>

        {state.message ? (
          <div
            className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-600"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
          </div>
        ) : (
          <form ref={formRef} className="grid grid-cols-1 gap-4 md:grid-cols-2" action={formAction}>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              مشتری <span className="text-rose-500">*</span>
              <SearchableSelect
                name="customerId"
                required
                options={customers.map((customer) => ({
                  id: customer.id,
                  label: `${customer.name} (${customer.code})`,
                }))}
                value={selectedCustomerId}
                onChange={(value) => {
                  setSelectedCustomerId(value);
                  const input = formRef.current?.querySelector<HTMLInputElement>('input[name="customerId"]');
                  if (input) input.value = value;
                }}
                placeholder="جستجو و انتخاب مشتری..."
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              بازاریاب <span className="text-rose-500">*</span>
              <SearchableSelect
                name="marketerId"
                required
                options={marketers
                  .filter((m) => m.isActive)
                  .map((marketer) => ({
                    id: marketer.id,
                    label: `${marketer.fullName} (${marketer.region})`,
                  }))}
                value={selectedMarketerId}
                onChange={(value) => {
                  setSelectedMarketerId(value);
                  const input = formRef.current?.querySelector<HTMLInputElement>('input[name="marketerId"]');
                  if (input) input.value = value;
                }}
                placeholder="جستجو و انتخاب بازاریاب..."
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
              تاریخ و ساعت <span className="text-rose-500">*</span>
              <PersianDateTimePicker
                name="scheduledAt"
                required
                defaultValue={defaultDateTimeString}
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
              موضوعات (با کاما جدا کنید)
              <input
                name="topics"
                placeholder="مثال: معرفی محصول، پیگیری سفارش، خدمات پس از فروش"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
              یادداشت
              <textarea
                name="notes"
                rows={4}
                placeholder="یادداشت‌های مربوط به ویزیت..."
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
              اقدام پیگیری (اختیاری)
              <input
                name="followUpAction"
                placeholder="مثال: ارسال کاتالوگ، تماس تلفنی، ارسال پیش‌فاکتور"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              >
                انصراف
              </button>
              <SubmitButton />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

