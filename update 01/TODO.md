# TODO - چک‌لیست کارهای پروژه تعمیربان

این فایل شامل چک‌لیست کامل تمام کارهای مورد نیاز برای پیاده‌سازی نیازمندی‌های پروژه است.

---

## 🔴 P0: باگ‌ها و اصلاحات فوری

### 1. رفع خطای دانلود PDF پیش‌فاکتور
- [ ] بررسی خطاهای PDF generation در `app/api/invoices/[invoiceId]/pdf/route.ts`
- [ ] بررسی `lib/utils/pdf-generator.ts` برای مشکلات فونت یا فرمت
- [ ] تست دانلود PDF در محیط production
- [ ] بهبود error handling و نمایش پیام خطا به کاربر
- [ ] تست در `components/invoices/invoice-detail-view.tsx`

**برآورد زمان:** 2-3 ساعت

---

### 2. رفع مشکل Placeholder قیمت‌ها
- [ ] حذف `value={0}` یا `defaultValue={0}` از input های قیمت در `components/invoices/invoice-create-modal.tsx`
- [ ] حذف `value={0}` از input های قیمت در `components/invoices/invoice-edit-modal.tsx`
- [ ] تغییر placeholder به "مثال: 18000000" یا خالی گذاشتن
- [ ] تست UX برای وارد کردن قیمت

**برآورد زمان:** 30 دقیقه

---

### 3. رفع مشکل Back Button در ویرایش مشتری
- [ ] بررسی navigation در `components/customers/customer-edit-modal.tsx`
- [ ] بررسی routing در `app/dashboard/customers/page.tsx`
- [ ] تست Back button در تمام صفحات
- [ ] رفع مشکل navigation

**برآورد زمان:** 1 ساعت

---

### 4. رفع مشکل دکمه ذخیره تغییرات ویزیت
- [ ] بررسی `components/visits/visit-edit-modal.tsx` برای مشکل submit
- [ ] بررسی `app/dashboard/visits/actions.ts` برای `updateVisitAction`
- [ ] تست ذخیره تغییرات
- [ ] بررسی error handling

**برآورد زمان:** 1-2 ساعت

---

### 5. بهبود مودال‌ها در موبایل
- [ ] بررسی تمام فایل‌های `components/*/*-modal.tsx`
- [ ] افزودن `max-height` برای مودال‌ها در موبایل
- [ ] بهبود `overflow-y-auto` برای اسکرول داخلی
- [ ] تست در دستگاه‌های موبایل مختلف
- [ ] بهبود responsive design

**فایل‌های مورد نیاز:**
- `components/customers/customer-create-modal.tsx`
- `components/customers/customer-edit-modal.tsx`
- `components/marketers/marketer-edit-modal.tsx`
- `components/visits/visit-create-modal.tsx`
- `components/visits/visit-edit-modal.tsx`
- `components/invoices/invoice-create-modal.tsx`
- `components/invoices/invoice-edit-modal.tsx`

**برآورد زمان:** 3-4 ساعت

---

### 6. افزودن واحد قیمت (تومان)
- [ ] نمایش "تومان" در `components/invoices/invoice-create-modal.tsx`
- [ ] نمایش "تومان" در `components/invoices/invoice-edit-modal.tsx`
- [ ] نمایش "تومان" در `components/invoices/invoice-list.tsx`
- [ ] افزودن واحد به PDF در `lib/utils/pdf-generator.ts`
- [ ] تست نمایش واحد در تمام صفحات

**برآورد زمان:** 1 ساعت

---

## 🟠 P1: قابلیت‌های جدید - اولویت بالا

### 7. ویرایش نقش بازاریاب
- [ ] بررسی دسترسی کاربر فعلی در `components/marketers/marketer-edit-modal.tsx`
- [ ] افزودن check برای `SUPER_ADMIN` role
- [ ] نمایش/مخفی کردن فیلد نقش بر اساس نقش کاربر
- [ ] افزودن validation در `lib/services/marketers.service.ts`
- [ ] تست تغییر نقش توسط مدیر کل
- [ ] تست عدم دسترسی بازاریاب به تغییر نقش

**فایل‌های مورد نیاز:**
- `components/marketers/marketer-edit-modal.tsx`
- `lib/services/marketers.service.ts`
- `app/dashboard/marketers/actions.ts`

**برآورد زمان:** 2-3 ساعت

---

### 8. نقشه کلیک برای شناسایی لوکیشن
- [ ] فعال کردن `interactive={true}` در تمام استفاده‌های `NeshanMap`
- [ ] پیاده‌سازی Reverse Geocoding با API نشان
- [ ] ایجاد utility function برای Reverse Geocoding
- [ ] پر کردن خودکار فیلد آدرس پس از کلیک
- [ ] تست در `components/customers/customer-create-modal.tsx`
- [ ] تست در `components/customers/customer-edit-modal.tsx`
- [ ] تست در `components/visits/visit-create-modal.tsx`
- [ ] تست در `components/visits/visit-edit-modal.tsx`

**فایل‌های مورد نیاز:**
- `components/visits/neshan-map.tsx` - بهبود component
- `lib/utils/geocoding.ts` - ایجاد utility جدید
- `components/customers/customer-create-modal.tsx`
- `components/customers/customer-edit-modal.tsx`
- `components/visits/visit-create-modal.tsx`
- `components/visits/visit-edit-modal.tsx`

**برآورد زمان:** 4-6 ساعت

---

### 9. دکمه ویزیت در ثبت مشتری
- [ ] افزودن دکمه "ثبت ویزیت" در `components/customers/customer-create-modal.tsx`
- [ ] باز کردن `visit-create-modal` با مشتری انتخاب شده
- [ ] تست flow ثبت مشتری → ثبت ویزیت

**فایل‌های مورد نیاز:**
- `components/customers/customer-create-modal.tsx`
- `components/visits/visit-create-modal.tsx`

**برآورد زمان:** 1-2 ساعت

---

### 10. جستجو با استفاده از لوکیشن
- [ ] افزودن فیلتر `nearbyLocation` به `CustomerListFilters` در `lib/services/customers.service.ts`
- [ ] پیاده‌سازی MongoDB geospatial query با `$near`
- [ ] افزودن parameter به API endpoint `/api/customers`
- [ ] افزودن UI برای انتخاب لوکیشن در `components/customers/customer-filters.tsx`
- [ ] نمایش فاصله از کاربر در نتایج
- [ ] تست جستجوی location-based

**فایل‌های مورد نیاز:**
- `lib/services/customers.service.ts`
- `app/api/customers/route.ts`
- `components/customers/customer-filters.tsx`
- `components/customers/customer-list.tsx`

**برآورد زمان:** 4-5 ساعت

---

### 11. نوتیفیکیشن ویزیت‌ها
- [ ] طراحی سیستم نوتیفیکیشن (Push Notifications یا SMS)
- [ ] ایجاد service برای مدیریت نوتیفیکیشن‌های برنامه‌ریزی شده
- [ ] افزودن cron job یا scheduled task برای بررسی ویزیت‌های آینده
- [ ] ارسال نوتیفیکیشن 1 ساعت قبل از ویزیت
- [ ] تست نوتیفیکیشن

**فایل‌های مورد نیاز:**
- `lib/services/notifications.service.ts` - ایجاد جدید
- `lib/services/visits.service.ts` - افزودن logic
- نیاز به سرویس Push Notifications یا SMS

**برآورد زمان:** 6-8 ساعت

---

### 12. برچسب‌های از پیش تعریف شده
- [ ] ایجاد constant برای برچسب‌ها در `lib/types/domain.ts`:
  ```typescript
  export const CUSTOMER_TAGS = [
    "مکانیک",
    "برق کار",
    "تنظیم موتور",
    "جلوبندی ساز",
    "آپاراتی",
    "تعویض روغن",
    "کارواش",
    "صافکار",
    "کلیدساز"
  ] as const;
  ```
- [ ] تبدیل input text به multi-select در `components/customers/customer-create-modal.tsx`
- [ ] تبدیل input text به multi-select در `components/customers/customer-edit-modal.tsx`
- [ ] افزودن فیلتر بر اساس برچسب در `lib/services/customers.service.ts`
- [ ] افزودن UI فیلتر در `components/customers/customer-filters.tsx`
- [ ] تست انتخاب و جستجوی برچسب

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `components/customers/customer-create-modal.tsx`
- `components/customers/customer-edit-modal.tsx`
- `lib/services/customers.service.ts`
- `components/customers/customer-filters.tsx`

**برآورد زمان:** 3-4 ساعت

---

### 13. چند شماره تلفن برای مشتری
- [ ] تغییر `ContactInfo` در `lib/types/domain.ts`:
  ```typescript
  contact: {
    phones: string[]; // تغییر از phone: string
    primaryPhone: string; // شماره اصلی
    // ...
  }
  ```
- [ ] Migration script برای تبدیل داده‌های موجود
- [ ] افزودن UI برای افزودن/حذف شماره‌ها در `components/customers/customer-create-modal.tsx`
- [ ] افزودن UI در `components/customers/customer-edit-modal.tsx`
- [ ] به‌روزرسانی `lib/services/customers.service.ts`
- [ ] به‌روزرسانی نمایش شماره‌ها در `components/customers/customer-list.tsx`
- [ ] تست افزودن/حذف چند شماره

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `components/customers/customer-create-modal.tsx`
- `components/customers/customer-edit-modal.tsx`
- `lib/services/customers.service.ts`
- `components/customers/customer-list.tsx`
- `scripts/migrations/add-multiple-phones.js` - ایجاد migration

**برآورد زمان:** 4-5 ساعت

---

### 14. تاریخچه ارتباط با مشتری
- [ ] طراحی مدل `CustomerInteraction` در `lib/types/domain.ts`:
  ```typescript
  export interface CustomerInteraction extends AuditTrail {
    _id: string;
    customerId: string;
    type: "CALL" | "VISIT" | "SMS" | "EMAIL" | "NOTE";
    description?: string;
    duration?: number; // برای تماس
    createdAt: Date;
  }
  ```
- [ ] ایجاد repository در `lib/repositories/interactions.repository.ts`
- [ ] ایجاد service در `lib/services/interactions.service.ts`
- [ ] ایجاد API endpoint `/api/customers/[id]/interactions`
- [ ] ثبت خودکار ارتباطات (تماس، ویزیت، پیامک)
- [ ] ایجاد UI برای نمایش تاریخچه در `components/customers/customer-detail-view.tsx`
- [ ] تست ثبت و نمایش تاریخچه

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `lib/repositories/interactions.repository.ts` - ایجاد جدید
- `lib/services/interactions.service.ts` - ایجاد جدید
- `app/api/customers/[id]/interactions/route.ts` - ایجاد جدید
- `components/customers/customer-detail-view.tsx` - ایجاد جدید یا بهبود موجود

**برآورد زمان:** 6-8 ساعت

---

### 15. تنظیم تاریخ جلسه بعدی
- [ ] افزودن فیلد `nextMeetingAt?: Date` به `Visit` در `lib/types/domain.ts`
- [ ] افزودن input در `components/visits/visit-create-modal.tsx`
- [ ] افزودن input در `components/visits/visit-edit-modal.tsx`
- [ ] برنامه‌ریزی نوتیفیکیشن برای جلسه بعدی
- [ ] نمایش جلسات آینده در داشبورد

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `components/visits/visit-create-modal.tsx`
- `components/visits/visit-edit-modal.tsx`
- `lib/services/visits.service.ts`
- `app/dashboard/page.tsx` - نمایش جلسات آینده

**برآورد زمان:** 3-4 ساعت

---

### 16. نوع ویزیت (حضوری/تلفنی)
- [ ] افزودن `visitType: "IN_PERSON" | "PHONE"` به `Visit` در `lib/types/domain.ts`
- [ ] افزودن select در `components/visits/visit-create-modal.tsx`
- [ ] افزودن select در `components/visits/visit-edit-modal.tsx`
- [ ] افزودن فیلتر بر اساس نوع در `components/visits/visit-filters.tsx`
- [ ] به‌روزرسانی `lib/services/visits.service.ts`
- [ ] تست انتخاب و فیلتر نوع ویزیت

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `components/visits/visit-create-modal.tsx`
- `components/visits/visit-edit-modal.tsx`
- `components/visits/visit-filters.tsx`
- `lib/services/visits.service.ts`

**برآورد زمان:** 2-3 ساعت

---

### 17. نمایش پیش‌فاکتور در ویزیت
- [ ] افزودن `relatedInvoiceIds: string[]` به `Visit` در `lib/types/domain.ts` (یا ایجاد رابطه)
- [ ] ایجاد ارتباط بین ویزیت و پیش‌فاکتور
- [ ] نمایش لیست پیش‌فاکتورها در `components/visits/visit-detail-modal.tsx`
- [ ] لینک به جزئیات پیش‌فاکتور
- [ ] تست نمایش پیش‌فاکتور در ویزیت

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `components/visits/visit-detail-modal.tsx`
- `lib/services/visits.service.ts`
- `lib/services/invoices.service.ts`

**برآورد زمان:** 3-4 ساعت

---

### 18. محدودیت دانلود شماره‌ها برای بازاریاب
- [ ] بررسی نقش کاربر در `app/api/customers/route.ts`
- [ ] فیلتر کردن نتایج برای بازاریاب‌ها (فقط `assignedMarketerId`)
- [ ] حذف دکمه Export از UI برای بازاریاب‌ها
- [ ] افزودن Rate Limiting در `lib/middleware/rate-limit.ts`
- [ ] ایجاد logging برای دسترسی‌ها
- [ ] تست محدودیت دسترسی

**فایل‌های مورد نیاز:**
- `app/api/customers/route.ts`
- `lib/middleware/rbac.ts`
- `lib/services/customers.service.ts`
- `components/customers/customer-list.tsx` - حذف دکمه Export
- `lib/middleware/rate-limit.ts` - بهبود

**برآورد زمان:** 4-5 ساعت

---

## 🟡 P2: قابلیت‌های جدید - اولویت متوسط

### 19. تبدیل پیش‌فاکتور به فاکتور
- [ ] طراحی مدل داده برای اطلاعات چک:
  ```typescript
  paymentInfo?: {
    method: "CASH" | "CHECK" | "TRANSFER";
    checkAmount?: number;
    checkDate?: Date;
    checkOwner?: string;
    checkNumber?: string;
    status: "PENDING" | "SETTLED" | "BOUNCED";
  }
  ```
- [ ] افزودن فیلدها به `Invoice` در `lib/types/domain.ts`
- [ ] ایجاد UI برای ثبت اطلاعات چک در `components/invoices/invoice-status-change-modal.tsx`
- [ ] به‌روزرسانی `lib/services/invoices.service.ts`
- [ ] مدیریت وضعیت‌های پرداخت
- [ ] تست تبدیل و ثبت اطلاعات چک

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `components/invoices/invoice-status-change-modal.tsx`
- `lib/services/invoices.service.ts`
- `app/dashboard/invoices/actions.ts`

**برآورد زمان:** 5-6 ساعت

---

### 20. مدیریت محصولات
- [ ] بررسی مدل `Product` موجود در `lib/types/domain.ts`
- [ ] ایجاد repository در `lib/repositories/products.repository.ts`
- [ ] ایجاد service در `lib/services/products.service.ts`
- [ ] ایجاد API endpoints در `app/api/products/route.ts`
- [ ] ایجاد صفحه مدیریت محصولات `app/dashboard/products/page.tsx`
- [ ] ایجاد کامپوننت‌های محصولات:
  - [ ] `components/products/product-list.tsx`
  - [ ] `components/products/product-create-modal.tsx`
  - [ ] `components/products/product-edit-modal.tsx`
  - [ ] `components/products/product-delete-button.tsx`
- [ ] افزودن select محصولات در `components/invoices/invoice-create-modal.tsx`
- [ ] قیمت‌گذاری خودکار از محصولات
- [ ] تست CRUD محصولات
- [ ] تست استفاده در پیش‌فاکتور

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts` - مدل موجود است
- `lib/repositories/products.repository.ts` - ایجاد جدید
- `lib/services/products.service.ts` - ایجاد جدید
- `app/api/products/route.ts` - ایجاد جدید
- `app/dashboard/products/page.tsx` - ایجاد جدید
- `components/products/` - ایجاد فولدر و کامپوننت‌ها
- `components/invoices/invoice-create-modal.tsx` - بهبود

**برآورد زمان:** 8-10 ساعت

---

### 21. مدیریت تسک
- [ ] طراحی مدل `Task` در `lib/types/domain.ts`:
  ```typescript
  export interface Task extends AuditTrail {
    _id: string;
    title: string;
    description?: string;
    assignedTo: string; // userId
    assignedBy: string; // userId
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    dueAt?: Date;
    priority: "LOW" | "MEDIUM" | "HIGH";
  }
  ```
- [ ] ایجاد repository در `lib/repositories/tasks.repository.ts`
- [ ] ایجاد service در `lib/services/tasks.service.ts`
- [ ] ایجاد API endpoints در `app/api/tasks/route.ts`
- [ ] ایجاد صفحه مدیریت تسک `app/dashboard/tasks/page.tsx`
- [ ] ایجاد کامپوننت‌های تسک:
  - [ ] `components/tasks/task-list.tsx`
  - [ ] `components/tasks/task-create-modal.tsx`
  - [ ] `components/tasks/task-edit-modal.tsx`
  - [ ] `components/tasks/task-status-change-button.tsx`
- [ ] اختصاص تسک به کاربران
- [ ] نوتیفیکیشن برای تسک‌ها
- [ ] تست CRUD تسک

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `lib/repositories/tasks.repository.ts` - ایجاد جدید
- `lib/services/tasks.service.ts` - ایجاد جدید
- `app/api/tasks/route.ts` - ایجاد جدید
- `app/dashboard/tasks/page.tsx` - ایجاد جدید
- `components/tasks/` - ایجاد فولدر و کامپوننت‌ها

**برآورد زمان:** 8-10 ساعت

---

### 22. گزارش‌های اختصاصی برای مدیر
- [ ] بررسی `app/dashboard/reports/page.tsx` موجود
- [ ] ایجاد service در `lib/services/reports.service.ts`
- [ ] ایجاد API endpoint `/api/reports/members/[memberId]`
- [ ] گزارش برای هر بازاریاب (ویزیت‌ها، فاکتورها، درآمد)
- [ ] گزارش فاکتورها
- [ ] Export به Excel
- [ ] Export به PDF
- [ ] تست گزارش‌ها

**فایل‌های مورد نیاز:**
- `app/dashboard/reports/page.tsx` - بهبود
- `lib/services/reports.service.ts` - ایجاد یا بهبود
- `app/api/reports/route.ts` - بهبود
- `app/api/reports/members/[memberId]/route.ts` - ایجاد جدید

**برآورد زمان:** 6-8 ساعت

---

## 🔵 P3: بهبودهای UX/UI

### 23. بهبود نقش‌ها و دسترسی‌ها
- [ ] بررسی `lib/permissions/role-permissions.ts`
- [ ] بررسی `lib/middleware/rbac.ts`
- [ ] تست دسترسی‌های هر نقش
- [ ] مستندسازی دسترسی‌ها
- [ ] بهبود پیام‌های خطای دسترسی

**فایل‌های مورد نیاز:**
- `lib/permissions/role-permissions.ts`
- `lib/middleware/rbac.ts`

**برآورد زمان:** 2-3 ساعت

---

## 📱 اپلیکیشن مشتری (Flutter) - فاز بعدی

### 24. ثبت اطلاعات مشتری در اپ
- [ ] طراحی UI ثبت اطلاعات
- [ ] ایجاد API endpoint `/api/customers/register` (public)
- [ ] Validation و error handling
- [ ] تست ثبت اطلاعات

**برآورد زمان:** 4-6 ساعت

---

### 25. ارتباط با ما
- [ ] طراحی صفحه ارتباط با ما
- [ ] پیاده‌سازی تماس تلفنی
- [ ] فرم پیام داخلی
- [ ] ایجاد API endpoint `/api/contact/message`
- [ ] لینک به شبکه‌های اجتماعی
- [ ] تست تمام قابلیت‌ها

**فایل‌های مورد نیاز:**
- پروژه Flutter
- `app/api/contact/message/route.ts` - ایجاد جدید

**برآورد زمان:** 4-6 ساعت

---

### 26. نمایش لیست محصولات در اپ
- [ ] ایجاد API public endpoint `/api/products/public`
- [ ] طراحی UI لیست محصولات
- [ ] فیلتر و جستجو
- [ ] نمایش جزئیات محصول
- [ ] تست

**فایل‌های مورد نیاز:**
- پروژه Flutter
- `app/api/products/public/route.ts` - ایجاد جدید

**برآورد زمان:** 3-4 ساعت

---

### 27. استوری‌های مدیر
- [ ] طراحی مدل `Story` در `lib/types/domain.ts`:
  ```typescript
  export interface Story extends AuditTrail {
    _id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    videoUrl?: string;
    createdBy: string;
    expiresAt: Date;
    isActive: boolean;
  }
  ```
- [ ] ایجاد repository در `lib/repositories/stories.repository.ts`
- [ ] ایجاد service در `lib/services/stories.service.ts`
- [ ] ایجاد API endpoints در `app/api/stories/route.ts`
- [ ] ایجاد صفحه مدیریت استوری `app/dashboard/stories/page.tsx`
- [ ] ایجاد کامپوننت‌های استوری
- [ ] API public برای دریافت استوری‌ها
- [ ] UI در Flutter برای نمایش استوری
- [ ] تست

**فایل‌های مورد نیاز:**
- `lib/types/domain.ts`
- `lib/repositories/stories.repository.ts` - ایجاد جدید
- `lib/services/stories.service.ts` - ایجاد جدید
- `app/api/stories/route.ts` - ایجاد جدید
- `app/dashboard/stories/page.tsx` - ایجاد جدید
- پروژه Flutter

**برآورد زمان:** 8-10 ساعت

---

### 28. لینک شبکه‌های اجتماعی
- [ ] طراحی مدل برای لینک‌های اجتماعی
- [ ] ایجاد API برای مدیریت لینک‌ها `/api/settings/social-links`
- [ ] UI در Flutter برای نمایش لینک‌ها
- [ ] باز کردن لینک‌ها در اپلیکیشن خارجی
- [ ] تست

**فایل‌های مورد نیاز:**
- پروژه Flutter
- `app/api/settings/social-links/route.ts` - ایجاد جدید

**برآورد زمان:** 2-3 ساعت

---

## خلاصه برآورد زمان

- **P0 (باگ‌ها):** ~10-12 ساعت
- **P1 (اولویت بالا):** ~40-50 ساعت
- **P2 (اولویت متوسط):** ~27-34 ساعت
- **P3 (بهبودها):** ~2-3 ساعت
- **Flutter (فاز بعدی):** ~21-29 ساعت

**جمع کل:** ~100-128 ساعت (حدود 12-16 روز کاری)

---

## یادداشت‌ها

- تمام کارها با چک‌لیست مشخص شده‌اند
- فایل‌های مورد نیاز برای هر کار ذکر شده است
- برآورد زمان تقریبی است و ممکن است تغییر کند
- کارهای Flutter در فاز بعدی قرار دارند

