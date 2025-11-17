# چک‌لیست بهبودهای استایل و UI

این سند شامل تمام تغییرات مورد نیاز برای بهبود استایل، کنتراست و یکنواختی تم در پروژه TamirBan است.

## ✅ تغییرات انجام شده

### بهبود کنتراست متن (انجام شده)
- ✅ OTP card description text: `text-slate-500` → `text-slate-600`
- ✅ OTP card footer: `text-slate-400` → `text-slate-500`
- ✅ Customer row code: `text-slate-400` → `text-slate-500`
- ✅ Customer row date: `text-slate-500` → `text-slate-600`
- ✅ App shell footer: `text-slate-400` → `text-slate-500`
- ✅ App shell sidebar header: `text-slate-400` → `text-slate-500`
- ✅ Dashboard search placeholder: بهبود کنتراست با `placeholder:text-slate-500`

### بهبود دکمه‌ها (انجام شده - نمونه)
- ✅ دکمه "مشاهده پیش‌نمایش داشبورد" در `app/page.tsx` بهبود یافت

## 🔴 اولویت 1: بهبود دکمه‌های Primary (فوری)

### الگوی استاندارد برای دکمه‌های Primary با Gradient

تمام دکمه‌هایی که از `bg-gradient-primary` استفاده می‌کنند باید به این الگو تبدیل شوند:

**قبل:**
```tsx
<Link
  href="/dashboard"
  className="rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-soft-primary transition hover:opacity-90"
>
  مشاهده پیش‌نمایش داشبورد
</Link>
```

**بعد:**
```tsx
<Link
  href="/dashboard"
  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
  className="group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <span>مشاهده پیش‌نمایش داشبورد</span>
  <svg
    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
</Link>
```

### ویژگی‌های بهبود یافته:
1. **Inline style برای gradient**: استفاده از `style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}` به جای کلاس سفارشی برای اطمینان از نمایش
2. **سایه بهتر**: `shadow-lg shadow-blue-500/25` برای سایه واضح‌تر
3. **Hover effects**: `hover:scale-105` و `hover:shadow-xl` برای تعامل بهتر
4. **Focus states**: `focus:ring-2 focus:ring-blue-400` برای accessibility
5. **آیکون فلش**: آیکون فلش که در hover حرکت می‌کند (اختیاری برای لینک‌ها)

### فایل‌هایی که نیاز به اصلاح دارند:

- [ ] **`app/dashboard/page.tsx:41`** - دکمه "ثبت مشتری جدید"
  ```tsx
  // قبل:
  className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-soft-primary transition hover:opacity-90"
  
  // بعد:
  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-100 disabled:opacity-50"
  ```

- [ ] **`components/auth/otp-card.tsx:199`** - دکمه "دریافت کد تایید" / "ورود به داشبورد"
  ```tsx
  // قبل:
  className="mt-2 rounded-2xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-soft-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
  
  // بعد:
  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
  className="mt-2 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
  ```

- [ ] **`components/customers/customer-row.tsx:126`** - دکمه "ویرایش"
  ```tsx
  // قبل:
  className="rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-medium text-white shadow-soft-primary transition hover:opacity-90"
  
  // بعد:
  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 active:scale-100"
  ```

- [ ] **`components/layout/app-shell.tsx:86`** - لینک‌های فعال در سایدبار (نیاز به بررسی)
  - این مورد از gradient استفاده می‌کند اما در سایدبار است، ممکن است نیاز به تغییر نداشته باشد

### الگوی استاندارد برای دکمه‌های Secondary

دکمه‌های secondary (با border) نیز باید بهبود یابند:

**قبل:**
```tsx
className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
```

**بعد:**
```tsx
className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 active:scale-95"
```

## 🟡 اولویت 2: پیاده‌سازی Dark Mode (اولویت بالا)

### Dark Mode - در حال حاضر پیاده‌سازی نشده

- [ ] **تنظیم Dark mode toggle**: افزودن دکمه/سوئیچ برای تغییر تم در app shell
- [ ] **مدیریت کلاس dark در layout**: افزودن مدیریت `data-theme="dark"` در `app/layout.tsx`
- [ ] **پس‌زمینه‌های dark**: پیاده‌سازی پس‌زمینه‌های dark برای تمام کامپوننت‌ها
  - پس‌زمینه اصلی: `dark:bg-slate-900`
  - پس‌زمینه کارت‌ها: `dark:bg-slate-800`
  - سایدبار: `dark:bg-slate-800/95`
  - فیلدهای ورودی: `dark:bg-slate-700`
- [ ] **رنگ‌های متن dark**: پیاده‌سازی رنگ‌های متن برای dark mode
  - متن اصلی: `dark:text-slate-100`
  - متن ثانویه: `dark:text-slate-300`
  - متن muted: `dark:text-slate-400`
- [ ] **Border های dark**: پیاده‌سازی رنگ‌های border برای dark mode
  - Border پیش‌فرض: `dark:border-slate-700`
  - Border focus: `dark:border-primary-500`

## 🟢 اولویت 3: بهبود Accessibility

### Focus States

- [ ] **یکنواختی focus ring**: اطمینان از وجود focus indicator برای تمام عناصر تعاملی
  - فعلی: بیشتر input ها `focus:ring-2 focus:ring-primary-100` دارند
  - باید: تمام دکمه‌ها، لینک‌ها و عناصر تعاملی focus state داشته باشند
- [ ] **رنگ focus ring**: اطمینان از قابل مشاهده بودن focus ring در هر دو تم
  ```tsx
  // فعلی: focus:ring-primary-100
  // بهتر: focus:ring-primary-300 برای دید بهتر
  ```
- [ ] **Navigation با کیبورد**: تست ترتیب tab و اطمینان از دسترسی‌پذیری تمام عناصر با کیبورد
- [ ] **ARIA labels**: افزودن ARIA labels برای دکمه‌های فقط آیکون

### کنتراست رنگ - رعایت WCAG

- [ ] **بررسی تمام ترکیبات متن/پس‌زمینه** برای رعایت استاندارد WCAG 2.1 AA (4.5:1 برای متن عادی، 3:1 برای متن بزرگ)
- [ ] **تست با ابزارهای بررسی کنتراست** (WebAIM, axe DevTools)
- [ ] **کنتراست badge ها**: بررسی تمام ترکیبات متن/پس‌زمینه badge های وضعیت
- [ ] **کنتراست دکمه‌ها**: بررسی تمام ترکیبات متن/پس‌زمینه دکمه‌ها

## 🔵 اولویت 4: یکنواختی استایل کامپوننت‌ها

### یکنواختی رنگ متن

- [ ] **سلسله‌مراتب رنگ متن استاندارد**:
  - متن اصلی: `text-slate-800` (عنوان‌ها، متن مهم)
  - متن ثانویه: `text-slate-600` (متن بدنه، توضیحات)
  - متن muted: `text-slate-500` (متن راهنما، برچسب‌ها)
  - متن غیرفعال: `text-slate-400` (فقط برای حالت disabled)

### یکنواختی استایل Input

- [ ] **استایل یکنواخت برای تمام input ها**:
  ```tsx
  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-500 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
  ```

### یکنواختی استایل Card

- [ ] **استایل یکنواخت برای تمام کارت‌ها**: اطمینان از padding، border و shadow یکنواخت
  - Padding: `p-6`
  - Border: `border border-slate-200/60`
  - Background: `bg-slate-50/50` یا `bg-white`
  - Shadow: `shadow-soft` یا `shadow-sm`

## 📋 خلاصه اقدامات

### اقدامات فوری (این هفته)
1. ✅ بهبود کنتراست متن (انجام شده)
2. ✅ بهبود دکمه اصلی در صفحه اصلی (انجام شده)
3. [ ] بهبود تمام دکمه‌های primary دیگر
4. [ ] افزودن dark mode toggle

### کوتاه‌مدت (2 هفته آینده)
5. [ ] تکمیل پیاده‌سازی dark theme
6. [ ] بهبود accessibility (focus states, ARIA labels)
7. [ ] یکنواخت‌سازی استفاده از رنگ در تمام کامپوننت‌ها

### میان‌مدت (ماه آینده)
8. [ ] یکنواختی typography
9. [ ] یکنواختی spacing و layout
10. [ ] بهینه‌سازی کامپوننت Image (در صورت نیاز)

## 🧪 نیازمندی‌های تست

- [ ] **تست کنتراست**: استفاده از WebAIM Contrast Checker یا axe DevTools
- [ ] **تست dark mode**: تست تمام کامپوننت‌ها در dark mode
- [ ] **تست navigation با کیبورد**: تست فقط با کیبورد
- [ ] **تست screen reader**: تست با NVDA یا JAWS
- [ ] **تست responsive**: تست روی موبایل، تبلت، دسکتاپ
- [ ] **تست مرورگر**: تست روی Chrome, Firefox, Safari, Edge
