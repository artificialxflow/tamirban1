"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import type { CustomerStatus } from "@/lib/types";
import { CUSTOMER_STATUSES, CUSTOMER_TAGS } from "@/lib/types";
import { NeshanMap } from "@/components/visits/neshan-map";

const STATUS_LABELS: Record<CustomerStatus, string> = {
  ACTIVE: "فعال",
  INACTIVE: "غیرفعال",
  PENDING: "در انتظار پیگیری",
  AT_RISK: "احتمال ریزش",
  LOYAL: "مشتری وفادار",
  SUSPENDED: "متوقف شده",
};

export function CustomerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState<CustomerStatus | "all">(
    (searchParams.get("status") as CustomerStatus) || "all"
  );
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [marketerId, setMarketerId] = useState(searchParams.get("marketerId") || "");
  const [useLocation, setUseLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [maxDistance, setMaxDistance] = useState(10); // کیلومتر
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );

  // دریافت موقعیت کاربر
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setUseLocation(true);
          setShowLocationPicker(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("امکان دریافت موقعیت شما وجود ندارد. لطفاً دسترسی به موقعیت را فعال کنید.");
        },
      );
    } else {
      alert("مرورگر شما از Geolocation API پشتیبانی نمی‌کند.");
    }
  };

  // به‌روزرسانی URL با تغییر فیلترها
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (search) params.set("search", search);
    if (status && status !== "all") params.set("status", status);
    if (city) params.set("city", city);
    if (marketerId) params.set("marketerId", marketerId);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    
    // افزودن location parameters
    if (useLocation && selectedLocation) {
      params.set("lat", selectedLocation.latitude.toString());
      params.set("lng", selectedLocation.longitude.toString());
      params.set("maxDistance", (maxDistance * 1000).toString()); // تبدیل به متر
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/dashboard/customers${newUrl}`, { scroll: false });
  }, [search, status, city, marketerId, selectedTags, useLocation, selectedLocation, maxDistance, router]);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-slate-50/50 p-6">
      <header className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-sm font-semibold text-slate-800">فیلترها و جستجو</h3>
        <button
          onClick={() => {
            setSearch("");
            setStatus("all");
            setCity("");
            setMarketerId("");
            setUseLocation(false);
            setSelectedLocation(null);
            setShowLocationPicker(false);
            setSelectedTags([]);
          }}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          پاک کردن همه
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* جستجو */}
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          جستجو
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="نام، شماره تماس، کد..."
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        {/* فیلتر وضعیت */}
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          وضعیت
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CustomerStatus | "all")}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">همه</option>
            {CUSTOMER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        {/* فیلتر شهر */}
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          شهر
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="مثال: تهران"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </label>

        {/* فیلتر بازاریاب */}
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          بازاریاب
          <input
            type="text"
            value={marketerId}
            onChange={(e) => setMarketerId(e.target.value)}
            placeholder="شناسه بازاریاب"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </label>
      </div>

      {/* فیلتر برچسب‌ها */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="text-sm font-medium text-slate-700">فیلتر بر اساس برچسب</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
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
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500">برچسب‌های انتخاب شده:</span>
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700"
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

      {/* Location-based search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={useLocation}
              onChange={(e) => {
                setUseLocation(e.target.checked);
                if (!e.target.checked) {
                  setSelectedLocation(null);
                  setShowLocationPicker(false);
                }
              }}
              className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            جستجو بر اساس موقعیت
          </label>
          {useLocation && selectedLocation && (
            <button
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              {showLocationPicker ? "بستن نقشه" : "تغییر موقعیت"}
            </button>
          )}
        </div>

        {useLocation && (
          <div className="flex flex-col gap-3">
            {!selectedLocation ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleGetCurrentLocation}
                  className="rounded-2xl border border-primary-300 bg-primary-50 px-4 py-2.5 text-sm font-medium text-primary-700 transition hover:bg-primary-100"
                >
                  استفاده از موقعیت من
                </button>
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  انتخاب از نقشه
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-xs text-slate-600">
                  موقعیت: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </div>
                <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                  حداکثر فاصله (کیلومتر)
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value) || 10)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
              </div>
            )}

            {showLocationPicker && (
              <div className="flex flex-col gap-2">
                <NeshanMap
                  className="h-64"
                  interactive
                  center={selectedLocation ?? undefined}
                  markers={
                    selectedLocation
                      ? [
                          {
                            id: "selected-location",
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude,
                          },
                        ]
                      : []
                  }
                  onLocationSelect={(coords) => {
                    setSelectedLocation(coords);
                    setUseLocation(true);
                  }}
                />
                <button
                  onClick={() => setShowLocationPicker(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  تایید موقعیت
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

