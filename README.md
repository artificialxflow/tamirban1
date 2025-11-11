## TamirBan CRM Starter

این مخزن نقطهٔ شروع توسعه وب‌اپ تعمیربان است؛ همهٔ فازهای پروژه بر اساس مستندات `explaination.md` و `todo.md` در اینجا پیاده‌سازی می‌شوند.

### پشتهٔ فعلی
- Next.js (App Router + TypeScript)
- Tailwind CSS با تنظیمات RTL و فونت ایران یکان
- ESLint با پیکربندی Core Web Vitals

### شروع توسعه
1. وابستگی‌ها را نصب کنید:
   ```bash
   npm install
   ```
2. سرور توسعه را اجرا کنید:
   ```bash
   npm run dev
   ```
3. اپلیکیشن روی آدرس `http://localhost:3000` در دسترس است.

### ساختار پوشه‌ها
- `app/` صفحات و layout اصلی
- `lib/` توابع و utilهای اشتراکی
- `modules/` ماژول‌های دامنه (Auth, CRM و ...)
- `docs/` مستندات تکمیلی (deployment، architecture و ...)
- `postman/` کالکشن و محیط‌های Postman
- `public/fonts/` فایل‌های فونت ایران یکان (اضافه کنید: `IRANYekan-Regular.woff2` و `IRANYekan-SemiBold.woff2`)

### فونت
برای نمایش صحیح تایپوگرافی، فونت‌های ایران یکان را در مسیر `public/fonts/iranyekan/` با نام‌های زیر قرار دهید:
- `IRANYekan-Regular.woff2`
- `IRANYekan-SemiBold.woff2`

در محیط توسعه می‌توانید موقتاً از CDN یا فونت‌های جایگزین بهره ببرید؛ اما برای استقرار نهایی لازم است فایل‌های فونت واقعی استفاده شوند.

### اسکریپت‌ها
- `npm run dev` اجرای محیط توسعه
- `npm run build` ساخت خروجی production
- `npm run start` اجرای خروجی production
- `npm run lint` بررسی استانداردهای کد

### مسیر بعدی
پیش از شروع هر فاز، لیست وظایف `todo.md` را بررسی و به‌روزرسانی کنید. پس از تکمیل فاز 1، پیاده‌سازی ماژول احراز هویت و اتصال به MongoDB در فازهای بعدی ادامه خواهد داشت.
