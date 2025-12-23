# راهنمای تنظیمات cPanel Node.js Application Manager

این راهنما برای رفع مشکل 503 Service Unavailable در cPanel تنظیم شده است.

## مشکل: 503 Service Unavailable

اگر اپلیکیشن از طریق cPanel Node.js Application Manager اجرا می‌شود ولی 503 می‌دهد، این راهنما را دنبال کنید.

## مراحل تنظیم در cPanel

### 1. تنظیم Environment Variables

در cPanel → **Node.js Applications** → **Edit** برای `samtamir.ir`:

**Environment Variables** را اضافه کنید:

```
NODE_ENV=production
PORT=8729
NEXT_PUBLIC_SITE_URL=https://samtamir.ir
MONGODB_URI=mongodb://tamirban_tamirban1:Ronak123Ronak@178.239.147.121:27017/tamirban_tamirban1
MONGODB_DB_NAME=tamirban_tamirban1
OTP_EXPIRATION_MINUTES=5
OTP_MAX_ATTEMPTS=5
JWT_SECRET=ey-name-to-behtarin-saraghaz-ey-name-to-behtarin-saraghaz
JWT_REFRESH_SECRET=ey-name-to-behtarin-saraghaz-ey-name-to-behtarin-saraghaz
BCRYPT_SALT_ROUNDS=10
TABAN_SMS_BASE_URL=https://edge.ippanel.com/v1
TABAN_SMS_API_KEY=YTA1Njg1ZjQtOTQ5ZC00MjJmLWI4NWUtOTUwMjQ3MTU1MTA5YzkwZTk1YmRiNGNmMmVlZDkwNzMyMjgzN2I5NDgyNjU=
TABAN_SMS_SENDER_NUMBER=3000505
TABAN_SMS_PATTERN_CODE=e850lcvfpmfluuu
TABAN_SMS_PATTERN_VAR=verification-code
TABAN_SMS_PATTERN_MESSAGE=کد تایید اپلیکیشن سام‌تعمیر %verification-code%
NEXT_PUBLIC_PWA_NAME=SamTamir
NEXT_PUBLIC_PWA_SHORT_NAME=SamTamir
NEXT_PUBLIC_PWA_DESCRIPTION=SamTamir CRM Progressive Web App
NESHAN_API_KEY=web.eaba70d1a1b34fb2a2ad25306e8e58c7
NEXT_PUBLIC_NESHAN_API_KEY=web.eaba70d1a1b34fb2a2ad25306e8e58c7
```

### 2. تنظیم Startup File

در همان صفحه Edit:

- **Application Root**: `samtamir.ir` (یا مسیر کامل پروژه)
- **Application URL**: `samtamir.ir`
- **Application Startup File**: `server.js`
- **Application Mode**: `production`

### 3. تنظیم Script (اختیاری)

اگر cPanel از npm scripts استفاده می‌کند:

- **Startup Command**: `npm start` یا `node server.js`

> **نکته مهم**: `package.json` به‌روزرسانی شده و `start` script فقط `node server.js` را اجرا می‌کند. Environment variables باید در cPanel تنظیم شوند.

### 4. بررسی Build

قبل از Start، مطمئن شوید که build وجود دارد:

```bash
cd ~/samtamir.ir
npm run build
```

### 5. Restart Application

در cPanel:
1. **Stop** را بزنید
2. چند ثانیه صبر کنید
3. **Start** را بزنید

### 6. بررسی Logs

در cPanel → **Node.js Applications** → **Logs** برای `samtamir.ir`:

باید این لاگ‌ها را ببینید:

```
🔍 [DEBUG] Server Environment Variables:
   PORT: 8729
   NODE_ENV: production
   Resolved port: 8729
   Resolved dev: false
🚀 TamirBan Next.js server ready on http://0.0.0.0:8729 (production)
```

اگر این لاگ‌ها را نمی‌بینید، مشکل از environment variables یا startup file است.

## عیب‌یابی

### مشکل 1: لاگ‌ها نشان می‌دهند `PORT: undefined`

**راه حل**: Environment variable `PORT=8729` را در cPanel اضافه کنید.

### مشکل 2: لاگ‌ها نشان می‌دهند `NODE_ENV: undefined`

**راه حل**: Environment variable `NODE_ENV=production` را در cPanel اضافه کنید.

### مشکل 3: خطای "Production build not found"

**راه حل**: 
```bash
cd ~/samtamir.ir
npm run build
```

### مشکل 4: PM2 از `app.js` استفاده می‌کند (نه `server.js`)

**علائم**: در لاگ‌های PM2 می‌بینید:
```
> hello@1.0.0 start
> node app.js
```

**راه حل**: PM2 را stop و delete کنید و دوباره با `server.js` start کنید:

```bash
cd ~/samtamir.ir

# متوقف کردن و حذف process قدیمی
pm2 stop samtamir.ir
pm2 delete samtamir.ir

# راه‌اندازی مجدد با server.js و environment variables
pm2 start server.js \
    --name samtamir.ir \
    --update-env \
    -- NODE_ENV=production PORT=8729

# یا استفاده از اسکریپت خودکار
bash scripts/fix-pm2.sh
```

**یا استفاده از ecosystem.config.js**:
```bash
cd ~/samtamir.ir
pm2 start ecosystem.config.js
```

### مشکل 5: اپلیکیشن Start می‌شود ولی باز هم 503 می‌دهد

**راه حل**: 
1. بررسی کنید که پورت 8729 در cPanel تنظیم شده باشد
2. بررسی کنید که دامنه به درستی به اپلیکیشن متصل شده باشد
3. بررسی کنید که Reverse Proxy یا Application Manager به درستی پیکربندی شده باشد
4. بررسی کنید که PM2 از `server.js` استفاده می‌کند، نه `app.js`

## رفع مشکل PM2 (اگر از PM2 استفاده می‌کنید)

اگر PM2 از `app.js` استفاده می‌کند یا environment variables تنظیم نشده‌اند:

### روش 1: استفاده از اسکریپت خودکار

```bash
cd ~/samtamir.ir
bash scripts/fix-pm2.sh
```

### روش 2: دستی

```bash
cd ~/samtamir.ir

# متوقف کردن و حذف process قدیمی
pm2 stop samtamir.ir
pm2 delete samtamir.ir

# بررسی وجود build
npm run build

# راه‌اندازی مجدد با environment variables
pm2 start server.js \
    --name samtamir.ir \
    --update-env \
    -- NODE_ENV=production PORT=8729

# بررسی لاگ‌ها
pm2 logs samtamir.ir --lines 50
```

### روش 3: استفاده از ecosystem.config.js

```bash
cd ~/samtamir.ir
pm2 start ecosystem.config.js
pm2 save  # برای ذخیره configuration
```

## تست دستی روی سرور

اگر از طریق cPanel کار نمی‌کند، می‌توانید دستی تست کنید:

```bash
cd ~/samtamir.ir
export NODE_ENV=production
export PORT=8729
node server.js
```

اگر دستی کار می‌کند ولی از cPanel کار نمی‌کند، مشکل از تنظیمات cPanel است.

## نکات مهم

1. **همیشه قبل از Start، Build کنید**: `npm run build`
2. **Environment variables را در cPanel تنظیم کنید**: نه در `package.json`
3. **Startup File را `server.js` قرار دهید**: نه `npm start`
4. **Logs را بررسی کنید**: برای تشخیص مشکل

## فایل‌های مفید

- `ecosystem.config.js` - پیکربندی PM2
- `scripts/fix-pm2.sh` - اسکریپت رفع مشکل PM2
- `server.js` - فایل سرور سفارشی
- `package.json` - اسکریپت‌های npm

## مرجع

- `docs/deployment-cpanel.md` - راهنمای کامل استقرار
- `server.js` - فایل سرور سفارشی
- `package.json` - اسکریپت‌های npm

