"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateCustomerAction } from "@/app/dashboard/customers/actions";
import type { CreateCustomerFormState } from "@/app/dashboard/customers/actions";
import type { CustomerDetail } from "@/lib/services/customers.service";
import { CUSTOMER_STATUSES, CUSTOMER_TAGS } from "@/lib/types";
import { NeshanMap } from "@/components/visits/neshan-map";
import type { MapMarker } from "@/components/visits/neshan-map";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "فعال",
  INACTIVE: "غیرفعال",
  PENDING: "در انتظار پیگیری",
  AT_RISK: "احتمال ریزش",
  LOYAL: "مشتری وفادار",
  SUSPENDED: "متوقف شده",
};

const createCustomerDefaultState: CreateCustomerFormState = {
  success: false,
  message: null,
};

interface CustomerEditModalProps {
  customer: CustomerDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
      className="inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? "در حال ذخیره..." : "ذخیره تغییرات"}
    </button>
  );
}

export function CustomerEditModal({ customer, isOpen, onClose, onSuccess }: CustomerEditModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(updateCustomerAction, createCustomerDefaultState);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [isLocationCleared, setIsLocationCleared] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([""]);

  useEffect(() => {
    if (customer && isOpen) {
      if (customer.geoLocation?.latitude && customer.geoLocation?.longitude) {
        setSelectedLocation({
          latitude: customer.geoLocation.latitude,
          longitude: customer.geoLocation.longitude,
        });
      } else {
        setSelectedLocation(null);
      }
      setLocationAddress(customer.geoLocation?.addressLine ?? "");
      setIsLocationCleared(false);
      setSelectedTags(customer.tags ?? []);
      setPhones(customer.phones && customer.phones.length > 0 ? customer.phones : (customer.phone ? [customer.phone] : [""]));
    }
  }, [customer, isOpen]);

  // Handle browser back button
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      onClose();
    };

    // Push a state to history when modal opens
    window.history.pushState({ modalOpen: true }, "");

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  const locationMarkers: MapMarker[] = selectedLocation
    ? [
        {
          id: customer?.id ?? "customer-location",
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          title: locationAddress || customer?.city || "موقعیت مشتری",
        },
      ]
    : [];

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      if (customer?.geoLocation?.latitude && customer.geoLocation.longitude) {
        setSelectedLocation({
          latitude: customer.geoLocation.latitude,
          longitude: customer.geoLocation.longitude,
        });
      } else {
        setSelectedLocation(null);
      }
      setLocationAddress(customer?.geoLocation?.addressLine ?? "");
      setIsLocationCleared(false);
      onSuccess?.();
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [state.success, onClose, onSuccess]);

  if (!isOpen || !customer) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/60 bg-white/95 backdrop-blur-sm p-4 sm:p-6 shadow-2xl">
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
          <h2 className="text-xl font-semibold text-slate-800">ویرایش مشتری</h2>
          <p className="mt-1 text-sm text-slate-500">کد مشتری: {customer.code}</p>
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

        <form ref={formRef} className="grid grid-cols-1 gap-4 md:grid-cols-2" action={formAction}>
          <input type="hidden" name="customerId" value={customer.id} />
          <input type="hidden" name="geoLocation.latitude" value={selectedLocation?.latitude ?? ""} />
          <input type="hidden" name="geoLocation.longitude" value={selectedLocation?.longitude ?? ""} />
          <input type="hidden" name="geoLocation.addressLine" value={locationAddress} />
          <input type="hidden" name="geoLocation.clear" value={isLocationCleared ? "true" : "false"} />

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            نام مشتری
            <input
              name="displayName"
              required
              defaultValue={customer.name}
              placeholder="مثال: شرکت آرمان خودرو"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              شماره‌های تماس <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const newPhones = [...phones];
                      newPhones[index] = e.target.value;
                      setPhones(newPhones);
                    }}
                    placeholder="09123456789"
                    required={index === 0}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                  {index === 0 && (
                    <span className="text-xs text-slate-500 whitespace-nowrap">شماره اصلی</span>
                  )}
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = phones.filter((_, i) => i !== index);
                        setPhones(newPhones);
                      }}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setPhones([...phones, ""])}
                className="self-start rounded-xl border border-primary-300 bg-primary-50 px-4 py-2 text-xs font-medium text-primary-700 transition hover:bg-primary-100"
              >
                + افزودن شماره دیگر
              </button>
            </div>
            <input type="hidden" name="phones" value={JSON.stringify(phones.filter((p) => p.trim() !== ""))} />
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            شهر
            <input
              name="city"
              defaultValue={customer.city || ""}
              placeholder="تهران"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            وضعیت
            <select
              name="status"
              defaultValue={customer.status}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              {CUSTOMER_STATUSES.map((status) => {
                const label = STATUS_LABELS[status] ?? status;
                return (
                  <option key={status} value={status}>
                    {label}
                  </option>
                );
              })}
            </select>
          </label>

          <div className="md:col-span-2 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/70 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-slate-800">موقعیت جغرافیایی مشتری (اختیاری)</span>
              <span className="text-xs text-slate-500">برای به‌روزرسانی موقعیت، روی نقشه کلیک کنید.</span>
            </div>
            <NeshanMap
              className="h-72"
              markers={locationMarkers}
              interactive
              center={selectedLocation ?? undefined}
              onLocationSelect={async (coords) => {
                setSelectedLocation(coords);
                setIsLocationCleared(false);
                // Reverse Geocoding برای دریافت آدرس
                try {
                  const response = await fetch(
                    `/api/geocoding/reverse?lat=${coords.latitude}&lng=${coords.longitude}`,
                  );
                  if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data?.formattedAddress) {
                      setLocationAddress(data.data.formattedAddress);
                    }
                  }
                } catch (error) {
                  console.error("Error in reverse geocoding:", error);
                }
              }}
            />
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">عرض جغرافیایی</label>
                <input
                  value={selectedLocation?.latitude?.toFixed(6) ?? ""}
                  readOnly
                  placeholder="---"
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">طول جغرافیایی</label>
                <input
                  value={selectedLocation?.longitude?.toFixed(6) ?? ""}
                  readOnly
                  placeholder="---"
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">توضیح یا آدرس کوتاه</label>
                <input
                  value={locationAddress}
                  onChange={(event) => setLocationAddress(event.target.value)}
                  placeholder="مثال: خیابان ولیعصر، کوچه ۱۲"
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
            {selectedLocation ? (
              <div className="flex justify-end">
                <button
                  type="button"
                    onClick={() => {
                      setSelectedLocation(null);
                      setLocationAddress("");
                      setIsLocationCleared(true);
                    }}
                  className="text-xs font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  حذف موقعیت انتخاب شده
                </button>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">برچسب‌ها</label>
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
              {CUSTOMER_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags([...selectedTags, tag]);
                      } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-slate-700">{tag}</span>
                </label>
              ))}
            </div>
            <input type="hidden" name="tags" value={selectedTags.join(",")} />
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                      className="hover:text-primary-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
            یادداشت
            <textarea
              name="notes"
              rows={3}
              defaultValue={customer.notes || ""}
              placeholder="توضیحات یا نیازهای ویژه مشتری"
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
      </div>
    </div>
  );
}

