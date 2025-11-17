"use client";

import { useState, useEffect } from "react";
import { toGregorian, toJalaali } from "jalaali-js";

interface PersianDateTimePickerProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

function formatPersianDate(year: number, month: number, day: number): string {
  return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
}

function parsePersianDate(dateString: string): { year: number; month: number; day: number } | null {
  const parts = dateString.split("/").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { year: parts[0], month: parts[1], day: parts[2] };
}

export function PersianDateTimePicker({
  name,
  required = false,
  defaultValue,
  onChange,
}: PersianDateTimePickerProps) {
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("12:00");
  const [gregorianValue, setGregorianValue] = useState("");

  useEffect(() => {
    // Initialize date value on mount
    if (defaultValue) {
      // Convert ISO datetime to Persian
      const date = new Date(defaultValue);
      const gregorian = {
        gy: date.getFullYear(),
        gm: date.getMonth() + 1,
        gd: date.getDate(),
      };
      const jalali = toJalaali(gregorian.gy, gregorian.gm, gregorian.gd);
      const persianDate = formatPersianDate(jalali.jy, jalali.jm, jalali.jd);
      const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      setDateValue(persianDate);
      setTimeValue(time);
      updateGregorianValue(persianDate, time);
    } else {
      // Default to tomorrow at 12:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const gregorian = {
        gy: tomorrow.getFullYear(),
        gm: tomorrow.getMonth() + 1,
        gd: tomorrow.getDate(),
      };
      const jalali = toJalaali(gregorian.gy, gregorian.gm, gregorian.gd);
      const persianDate = formatPersianDate(jalali.jy, jalali.jm, jalali.jd);
      setDateValue(persianDate);
      setTimeValue("12:00");
      updateGregorianValue(persianDate, "12:00");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateGregorianValue = (persianDate: string, time: string) => {
    try {
      if (!persianDate || !time) return;
      
      const parsed = parsePersianDate(persianDate);
      if (!parsed) {
        console.warn("Invalid Persian date format:", persianDate);
        return;
      }

      const gregorian = toGregorian(parsed.year, parsed.month, parsed.day);
      const [hours, minutes] = time.split(":").map(Number);
      
      if (isNaN(hours) || isNaN(minutes)) {
        console.warn("Invalid time format:", time);
        return;
      }

      const date = new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd, hours, minutes);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", { gregorian, hours, minutes });
        return;
      }
      
      const isoString = date.toISOString();
      setGregorianValue(isoString);
      onChange?.(isoString);
    } catch (error) {
      console.error("Error converting Persian date:", error);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateValue(value);
    updateGregorianValue(value, timeValue);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeValue(value);
    updateGregorianValue(dateValue, value);
  };

  return (
    <div className="flex gap-2">
      <input type="hidden" name={name} value={gregorianValue} required={required} />
      <div className="flex-1">
        <input
          type="text"
          value={dateValue}
          onChange={handleDateChange}
          placeholder="۱۴۰۴/۰۸/۱۵"
          pattern="[0-9]{4}/[0-9]{2}/[0-9]{2}"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          dir="ltr"
        />
        <p className="mt-1 text-xs text-slate-400">فرمت: ۱۴۰۴/۰۸/۱۵</p>
      </div>
      <div className="w-32">
        <input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>
    </div>
  );
}
