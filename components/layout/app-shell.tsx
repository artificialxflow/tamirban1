'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/hooks/use-auth";

type NavItem = {
  name: string;
  href: string;
  badge?: string;
};

const NAV_ITEMS: NavItem[] = [
  { name: "داشبورد", href: "/dashboard", badge: "جدید" },
  { name: "مشتریان", href: "/dashboard/customers", badge: "112" },
  { name: "بازاریاب‌ها", href: "/dashboard/marketers", badge: "12" },
  { name: "ویزیت‌ها", href: "/dashboard/visits" },
  { name: "پیش‌فاکتورها", href: "/dashboard/invoices", badge: "5 جدید" },
  { name: "پیامک‌ها", href: "/dashboard/sms" },
  { name: "گزارش‌ها", href: "/dashboard/reports" },
  { name: "تنظیمات", href: "/dashboard/settings" },
];

type AppShellProps = {
  title: string;
  children: ReactNode;
  description?: string;
  activeHref?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  footerNote?: ReactNode;
};

export function AppShell({
  title,
  description,
  children,
  activeHref = "/dashboard",
  actions,
  toolbar,
  footerNote,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  const resolvedFooter = useMemo(
    () => footerNote ?? <span>آخرین بروزرسانی UI: فاز ۳ — نمونه اولیه داشبورد</span>,
    [footerNote],
  );

  const sidebar = (
    <aside className="flex w-full flex-col gap-6 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/60 p-6 shadow-soft lg:w-64">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">TamirBan CRM</span>
          <span className="text-lg font-semibold text-slate-800">تعمیربان</span>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-soft-primary">
          v0.1
        </span>
      </header>

      <nav className="flex flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={[
                "flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-gradient-primary text-white shadow-soft-primary" 
                  : "text-slate-800 hover:bg-primary-100/60 focus:bg-primary-100/60 font-medium",
              ].join(" ")}
            >
              <span>{item.name}</span>
              {item.badge ? (
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    isActive ? "bg-white/20 text-white" : "bg-primary-200 text-primary-800 font-bold",
                  ].join(" ")}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3 rounded-2xl bg-primary-50 border border-primary-100 p-5">
        {user ? (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-primary-600 font-medium">کاربر فعلی</p>
              <p className="text-sm font-semibold text-slate-800">{user.mobile}</p>
              <p className="text-xs text-slate-600">نقش: {user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full bg-primary-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-primary-600 shadow-sm"
            >
              خروج از حساب
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-800">در حالت پیش‌نمایش</p>
            <p className="text-xs leading-6 text-slate-600">
              این نسخه تنها برای تایید ساختار UI آماده شده و هنوز به داده‌های واقعی متصل نیست.
            </p>
            <button className="rounded-full bg-primary-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-primary-600 shadow-sm">
              دیدن سناریو نمونه
            </button>
          </>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 text-slate-800">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:flex-row">
        <div className="flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-800"
            aria-expanded={isMenuOpen}
            aria-controls="tamirban-sidebar"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-primary-500" />
            {isMenuOpen ? "بستن منو" : "باز کردن منو"}
          </button>
        </div>

        <div className="hidden w-full max-w-[260px] lg:flex lg:flex-shrink-0" id="tamirban-sidebar">
          {sidebar}
        </div>

        <main className="flex w-full flex-1 flex-col gap-6 rounded-3xl bg-white/95 backdrop-blur-sm p-6 shadow-soft md:p-8 border border-slate-200/60">
          <header className="flex flex-col gap-4 border-b border-slate-200/60 pb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold leading-tight md:text-3xl text-slate-800">{title}</h1>
                {description ? <p className="text-sm text-slate-600">{description}</p> : null}
              </div>
              {actions ? (
                <div className="flex flex-wrap items-center gap-3">{actions}</div>
              ) : null}
            </div>
            {toolbar ? <div className="flex flex-col gap-3">{toolbar}</div> : null}
          </header>

          <div className="flex flex-col gap-6">{children}</div>

          <footer className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} TamirBan CRM, تمامی حقوق محفوظ است.</span>
            {resolvedFooter}
          </footer>
        </main>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-end lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-label="بستن منو"
          />
          <div className="relative z-10 m-4 w-full max-w-xs" id="tamirban-sidebar">
            {sidebar}
          </div>
        </div>
      ) : null}
    </div>
  );
}

