import type { Metadata } from "next";
import "./globals.css";
import { PWAInstaller } from "@/components/pwa/pwa-installer";
import { PWAHead } from "@/components/pwa/pwa-head";

export const metadata: Metadata = {
  title: "سام‌تعمیر | پلتفرم مدیریت شبکه تعمیرگاه‌ها",
  description:
    "سام‌تعمیر، سیستم مدیریت ارتباط با مشتری و شبکه تعمیرگاه‌ها با تمرکز بر OTP، مدیریت نقش‌ها و داشبورد مدیریتی.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "سام‌تعمیر",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
        <PWAHead />
        <div className="min-h-screen">
          {children}
        </div>
        <PWAInstaller />
      </body>
    </html>
  );
}
