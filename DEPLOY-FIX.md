# 🔧 رفع مشکل Production Build

## مشکل فعلی
```
Error: Could not find a production build in the '.next' directory. 
Try building your app with 'next build' before starting the production server.
```

## ✅ راه حل سریع (3 دستور)

در SSH/Terminal سرور، این دستورات را به ترتیب اجرا کنید:

```bash
cd ~/tamirban1.ir
export NODE_ENV=production
npm run build
pm2 restart tamirban1.ir
```

## 📋 راه حل کامل (گام به گام)

### 1. رفتن به مسیر پروژه
```bash
cd ~/tamirban1.ir
```

### 2. تنظیم متغیر محیطی
```bash
export NODE_ENV=production
```

### 3. ساخت Build
```bash
npm run build
```

این دستور ممکن است 2-5 دقیقه طول بکشد. منتظر بمانید تا کامل شود.

### 4. بررسی وجود Build
```bash
ls -la .next
```

باید فایل `BUILD_ID` را ببینید.

### 5. Restart PM2
```bash
pm2 restart tamirban1.ir
```

یا اگر process وجود ندارد:
```bash
pm2 start server.js --name tamirban1.ir --env production
```

### 6. بررسی وضعیت
```bash
pm2 status
pm2 logs tamirban1.ir --lines 20
```

## 🚀 استفاده از اسکریپت خودکار (توصیه می‌شود)

```bash
cd ~/tamirban1.ir
bash scripts/quick-deploy.sh
```

یا برای استقرار کامل:
```bash
bash scripts/deploy.sh
```

## ⚠️ نکات مهم

1. **همیشه قبل از restart، build کنید:**
   ```bash
   npm run build && pm2 restart tamirban1.ir
   ```

2. **بررسی متغیرهای محیطی:**
   - مطمئن شوید `.env` در مسیر پروژه وجود دارد
   - متغیر `NODE_ENV=production` تنظیم شده باشد

3. **در صورت خطا در build:**
   ```bash
   # پاک کردن build قبلی
   rm -rf .next
   
   # ساخت مجدد
   npm run build
   ```

## 📊 دستورات مفید PM2

```bash
# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs tamirban1.ir

# مشاهده لاگ‌های خطا
pm2 logs tamirban1.ir --err

# مشاهده اطلاعات
pm2 info tamirban1.ir

# Stop
pm2 stop tamirban1.ir

# Delete
pm2 delete tamirban1.ir
```

## 🔍 بررسی مشکل Customer Not Found

این یک **warning** است نه خطا. یعنی برخی پیش‌فاکتورها به مشتری‌هایی اشاره می‌کنند که حذف شده‌اند.

برای رفع:
1. بررسی کنید که آیا مشتری‌ها حذف شده‌اند
2. یا پیش‌فاکتورهای مربوطه را حذف/ویرایش کنید

این warning باعث خطا نمی‌شود و برنامه به درستی کار می‌کند.

