import { NextResponse } from "next/server";

import { requestOtp } from "@/lib/services/otp.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = body?.phone as string;

    if (!phone) {
      return NextResponse.json({ success: false, message: "شماره موبایل الزامی است." }, { status: 400 });
    }

    // بررسی متغیرهای محیطی (فقط برای دیباگ)
    console.log("[API Route] بررسی متغیرهای محیطی:", {
      hasBaseUrl: !!process.env.TABAN_SMS_BASE_URL,
      hasApiKey: !!process.env.TABAN_SMS_API_KEY,
      hasSenderNumber: !!process.env.TABAN_SMS_SENDER_NUMBER,
      baseUrl: process.env.TABAN_SMS_BASE_URL,
      senderNumber: process.env.TABAN_SMS_SENDER_NUMBER,
      nodeEnv: process.env.NODE_ENV,
    });

    const result = await requestOtp(phone);

    // اگر کد در نتیجه وجود داشته باشد (حالت تست بدون SMS واقعی)، آن را برمی‌گردانیم
    return NextResponse.json({ 
      success: true, 
      ...(result.code ? { code: result.code } : {}) 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطای غیرمنتظره رخ داد";
    console.error("[API Route] خطا در درخواست OTP:", error);
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

