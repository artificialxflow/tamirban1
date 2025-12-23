#!/bin/bash

# اسکریپت رفع مشکل PM2 برای samtamir.ir
# این اسکریپت PM2 را stop می‌کند و دوباره با تنظیمات صحیح start می‌کند

set -e

echo "🔧 رفع مشکل PM2 برای samtamir.ir..."

# بررسی وجود PM2
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 یافت نشد. لطفاً PM2 را نصب کنید: npm install -g pm2"
    exit 1
fi

# متوقف کردن و حذف process قدیمی
echo "🛑 متوقف کردن process قدیمی..."
pm2 stop samtamir.ir 2>/dev/null || true
pm2 delete samtamir.ir 2>/dev/null || true

# بررسی وجود build
if [ ! -d ".next" ]; then
    echo "⚠️  Build وجود ندارد. در حال ساخت build..."
    export NODE_ENV=production
    npm run build
fi

# راه‌اندازی مجدد با PM2
echo "🚀 راه‌اندازی مجدد با PM2..."

# استفاده از ecosystem.config.js اگر وجود دارد
if [ -f "ecosystem.config.js" ]; then
    echo "   استفاده از ecosystem.config.js..."
    pm2 start ecosystem.config.js
else
    # استفاده از دستور مستقیم
    echo "   استفاده از دستور مستقیم..."
    pm2 start server.js \
        --name samtamir.ir \
        --env production \
        --update-env \
        -- NODE_ENV=production PORT=8729
fi

echo ""
echo "✅ PM2 با موفقیت راه‌اندازی شد!"
echo ""
echo "📊 وضعیت PM2:"
pm2 status

echo ""
echo "📝 برای مشاهده لاگ‌ها:"
echo "   pm2 logs samtamir.ir --lines 50"

