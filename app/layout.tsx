import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "تعمیربان | پلتفرم مدیریت شبکه تعمیرگاه‌ها",
  description:
    "سیستم مدیریت ارتباط با مشتری و شبکه تعمیرگاه‌های تعمیربان با تمرکز بر OTP، مدیریت نقش‌ها و داشبورد مدیریتی.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
