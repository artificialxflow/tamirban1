# مستندات سیستم دسترسی‌ها (RBAC)

این سند شامل توضیحات کامل سیستم Role-Based Access Control (RBAC) پروژه تعمیربان است.

## نقش‌ها (Roles)

سیستم شامل 4 نقش اصلی است:

### 1. SUPER_ADMIN (مدیر کل)
- **دسترسی کامل** به تمام بخش‌های سیستم
- می‌تواند کاربران، بازاریاب‌ها، مشتریان، ویزیت‌ها و پیش‌فاکتورها را مدیریت کند
- دسترسی به گزارش‌ها و تنظیمات
- **محدودیت**: نمی‌تواند نقش خود را تغییر دهد یا حساب خود را غیرفعال کند

### 2. FINANCE_MANAGER (مدیر مالی)
- **خواندن** اطلاعات مشتریان
- **خواندن و نوشتن** پیش‌فاکتورها
- **خواندن** گزارش‌ها
- **خواندن و نوشتن** محصولات
- **خواندن و نوشتن** تسک‌ها
- **عدم دسترسی** به مدیریت کاربران و بازاریاب‌ها

### 3. MARKETER (بازاریاب)
- **خواندن و نوشتن** مشتریان (فقط مشتری‌های اختصاص یافته به خود)
- **خواندن و نوشتن** ویزیت‌ها
- **خواندن و نوشتن** پیش‌فاکتورها
- **خواندن** محصولات
- **خواندن و نوشتن** تسک‌ها (فقط تسک‌های خود)
- **عدم دسترسی** به گزارش‌ها و تنظیمات
- **محدودیت**: فقط می‌تواند مشتری‌های اختصاص یافته به خود را ببیند

### 4. CUSTOMER (مشتری)
- **فقط خواندن** اطلاعات خود
- **فقط خواندن** پیش‌فاکتورهای خود
- **عدم دسترسی** به سایر بخش‌ها

## دسترسی‌ها (Permissions)

### دسترسی‌های کاربران (Users)
- `users:read` - مشاهده کاربران
- `users:write` - ایجاد/ویرایش کاربران
- `users:delete` - حذف کاربران

### دسترسی‌های مشتریان (Customers)
- `customers:read` - مشاهده مشتریان
- `customers:write` - ایجاد/ویرایش مشتریان
- `customers:delete` - حذف مشتریان

### دسترسی‌های ویزیت‌ها (Visits)
- `visits:read` - مشاهده ویزیت‌ها
- `visits:write` - ایجاد/ویرایش ویزیت‌ها
- `visits:delete` - حذف ویزیت‌ها

### دسترسی‌های پیش‌فاکتورها (Invoices)
- `invoices:read` - مشاهده پیش‌فاکتورها
- `invoices:write` - ایجاد/ویرایش پیش‌فاکتورها
- `invoices:delete` - حذف پیش‌فاکتورها

### دسترسی‌های بازاریاب‌ها (Marketers)
- `marketers:read` - مشاهده بازاریاب‌ها
- `marketers:write` - ایجاد/ویرایش بازاریاب‌ها
- `marketers:delete` - حذف بازاریاب‌ها

### دسترسی‌های محصولات (Products)
- `products:read` - مشاهده محصولات
- `products:write` - ایجاد/ویرایش محصولات
- `products:delete` - حذف محصولات

### دسترسی‌های تسک‌ها (Tasks)
- `tasks:read` - مشاهده تسک‌ها
- `tasks:write` - ایجاد/ویرایش تسک‌ها
- `tasks:delete` - حذف تسک‌ها

### دسترسی‌های گزارش‌ها (Reports)
- `reports:read` - مشاهده گزارش‌ها

### دسترسی‌های تنظیمات (Settings)
- `settings:read` - مشاهده تنظیمات
- `settings:write` - ویرایش تنظیمات

## ماتریس دسترسی‌ها

| Permission | SUPER_ADMIN | FINANCE_MANAGER | MARKETER | CUSTOMER |
|------------|-------------|-----------------|----------|----------|
| users:read | ✅ | ❌ | ❌ | ❌ |
| users:write | ✅ | ❌ | ❌ | ❌ |
| users:delete | ✅ | ❌ | ❌ | ❌ |
| customers:read | ✅ | ✅ | ✅* | ✅* |
| customers:write | ✅ | ❌ | ✅* | ❌ |
| customers:delete | ✅ | ❌ | ❌ | ❌ |
| visits:read | ✅ | ❌ | ✅ | ❌ |
| visits:write | ✅ | ❌ | ✅ | ❌ |
| visits:delete | ✅ | ❌ | ❌ | ❌ |
| invoices:read | ✅ | ✅ | ✅ | ✅* |
| invoices:write | ✅ | ✅ | ✅ | ❌ |
| invoices:delete | ✅ | ❌ | ❌ | ❌ |
| marketers:read | ✅ | ❌ | ❌ | ❌ |
| marketers:write | ✅ | ❌ | ❌ | ❌ |
| marketers:delete | ✅ | ❌ | ❌ | ❌ |
| products:read | ✅ | ✅ | ✅ | ❌ |
| products:write | ✅ | ✅ | ❌ | ❌ |
| products:delete | ✅ | ❌ | ❌ | ❌ |
| tasks:read | ✅ | ✅ | ✅* | ❌ |
| tasks:write | ✅ | ✅ | ✅* | ❌ |
| tasks:delete | ✅ | ❌ | ❌ | ❌ |
| reports:read | ✅ | ✅ | ❌ | ❌ |
| settings:read | ✅ | ❌ | ❌ | ❌ |
| settings:write | ✅ | ❌ | ❌ | ❌ |

**توضیحات:**
- ✅* = دسترسی محدود (فقط به داده‌های خود)
- ✅ = دسترسی کامل
- ❌ = بدون دسترسی

## محدودیت‌های خاص

### 1. محدودیت بازاریاب‌ها
- بازاریاب‌ها فقط می‌توانند مشتری‌های اختصاص یافته به خود را ببینند
- بازاریاب‌ها فقط می‌توانند تسک‌های خود را ببینند و ویرایش کنند
- بازاریاب‌ها نمی‌توانند داده‌های مشتریان را دانلود کنند

### 2. محدودیت مدیر کل
- مدیر کل نمی‌تواند نقش خود را تغییر دهد
- مدیر کل نمی‌تواند حساب خود را غیرفعال کند

### 3. محدودیت مشتریان
- مشتریان فقط می‌توانند اطلاعات و پیش‌فاکتورهای خود را ببینند

## پیاده‌سازی

### Backend
- **Middleware**: `lib/middleware/rbac.ts`
  - `requireRole()` - بررسی نقش
  - `requirePermission()` - بررسی دسترسی
  - `checkPermission()` - بررسی دسترسی کاربر

### Frontend
- **Hook**: `lib/hooks/use-permissions.ts`
  - `hasPermission()` - بررسی دسترسی
  - `hasRole()` - بررسی نقش
- **Component**: `components/common/protected-component.tsx`
  - نمایش شرطی بر اساس دسترسی

## مثال‌های استفاده

### در API Route
```typescript
export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("customers:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }
  // ادامه کد...
}
```

### در Component
```tsx
<ProtectedComponent permission="customers:write">
  <button>ایجاد مشتری</button>
</ProtectedComponent>
```

## به‌روزرسانی‌ها

برای افزودن دسترسی جدید:
1. دسترسی را به `lib/permissions/role-permissions.ts` اضافه کنید
2. نقش‌های مورد نظر را به‌روزرسانی کنید
3. مستندات را به‌روزرسانی کنید

## امنیت

- تمام API endpoints با `requirePermission` محافظت می‌شوند
- دسترسی‌ها در سطح database query نیز اعمال می‌شوند
- Rate limiting برای بازاریاب‌ها فعال است (100 درخواست/ساعت)

