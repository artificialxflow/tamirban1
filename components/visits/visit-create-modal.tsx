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
      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
      className="inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
  const [modalKey, setModalKey] = useState(0); // Key برای reset کردن component

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal opens
      setSelectedCustomerId("");
      setSelectedMarketerId("");
      setLoading(true);
      
      console.log("[VisitCreateModal] Fetching customers and marketers...");
      
      // Fetch customers and marketers for dropdowns
      Promise.all([
        apiClient.get<{ data: CustomerSummary[]; total: number; page: number; limit: number }>("/customers?limit=100"),
        apiClient.get<{ data: MarketerSummary[]; total: number; page: number; limit: number }>("/marketers?limit=100"),
      ])
        .then(([customersRes, marketersRes]) => {
          console.log("Customers response:", customersRes);
          console.log("Marketers response:", marketersRes);
          
          // ساختار پاسخ: { success: true, data: { data: [...], total, page, limit } }
          console.log("[VisitCreateModal] Full customers response:", JSON.stringify(customersRes, null, 2));
          
          if (customersRes.success && 'data' in customersRes && customersRes.data) {
            const responseData = customersRes.data as { data?: CustomerSummary[]; total?: number; page?: number; limit?: number };
            console.log("[VisitCreateModal] Customers response data:", responseData);
            
            // بررسی چند حالت مختلف برای ساختار پاسخ
            let customersData: CustomerSummary[] = [];
            
            if (responseData && typeof responseData === 'object' && 'data' in responseData) {
              if (Array.isArray(responseData.data)) {
                customersData = responseData.data;
              } else {
                console.warn("[VisitCreateModal] responseData.data is not an array:", responseData.data);
              }
            } else if (Array.isArray(responseData)) {
              customersData = responseData;
            } else {
              console.warn("[VisitCreateModal] Unexpected customers data structure:", responseData);
            }
            
            console.log("[VisitCreateModal] Extracted customers:", customersData.length, customersData);
            if (customersData.length > 0) {
              console.log("[VisitCreateModal] First customer sample:", {
                id: customersData[0].id,
                name: customersData[0].name,
                code: customersData[0].code,
              });
            }
            setCustomers(customersData);
          } else {
            console.error("[VisitCreateModal] Failed to fetch customers:", {
              success: customersRes.success,
              hasData: 'data' in customersRes,
              response: customersRes,
            });
            setCustomers([]);
          }
          
          console.log("[VisitCreateModal] Full marketers response:", JSON.stringify(marketersRes, null, 2));
          
          if (marketersRes.success && 'data' in marketersRes && marketersRes.data) {
            const responseData = marketersRes.data as { data?: MarketerSummary[]; total?: number; page?: number; limit?: number };
            console.log("[VisitCreateModal] Marketers response data:", responseData);
            
            // بررسی چند حالت مختلف برای ساختار پاسخ
            let marketersData: MarketerSummary[] = [];
            
            if (responseData && typeof responseData === 'object' && 'data' in responseData) {
              if (Array.isArray(responseData.data)) {
                marketersData = responseData.data;
              } else {
                console.warn("[VisitCreateModal] responseData.data is not an array:", responseData.data);
              }
            } else if (Array.isArray(responseData)) {
              marketersData = responseData;
            } else {
              console.warn("[VisitCreateModal] Unexpected marketers data structure:", responseData);
            }
            
            console.log("[VisitCreateModal] Extracted marketers:", marketersData.length, marketersData);
            if (marketersData.length > 0) {
              console.log("[VisitCreateModal] First marketer sample:", {
                id: marketersData[0].id,
                fullName: marketersData[0].fullName,
                region: marketersData[0].region,
                isActive: marketersData[0].isActive,
              });
            }
            setMarketers(marketersData);
          } else {
            console.error("[VisitCreateModal] Failed to fetch marketers:", {
              success: marketersRes.success,
              hasData: 'data' in marketersRes,
              response: marketersRes,
            });
            setMarketers([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          setCustomers([]);
          setMarketers([]);
          setLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    // فقط وقتی مودال باز است و state.success true است، مودال را ببند
    if (state.success && isOpen) {
      onSuccess?.();
      // بستن مودال بعد از 500ms برای نمایش پیام موفقیت
      const timer = setTimeout(() => {
        formRef.current?.reset();
        setSelectedCustomerId("");
        setSelectedMarketerId("");
        onClose();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [state.success, isOpen, onClose, onSuccess]);

  // Reset state وقتی مودال باز می‌شود
  useEffect(() => {
    if (isOpen) {
      // Reset form و state وقتی مودال باز می‌شود
      formRef.current?.reset();
      setSelectedCustomerId("");
      setSelectedMarketerId("");
      setModalKey((prev) => prev + 1); // تغییر key برای reset کردن component
    }
  }, [isOpen]);

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
                placeholder={customers.length === 0 ? "هیچ مشتری‌ای ثبت نشده است" : "جستجو و انتخاب مشتری..."}
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
                placeholder={marketers.filter((m) => m.isActive).length === 0 ? "هیچ بازاریابی فعالی ثبت نشده است" : "جستجو و انتخاب بازاریاب..."}
              />
            </label>

            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
              تاریخ و ساعت <span className="text-rose-500">*</span>
              <PersianDateTimePicker
                key={`date-picker-${modalKey}`}
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

