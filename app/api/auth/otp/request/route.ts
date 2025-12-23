import { NextRequest, NextResponse } from "next/server";

import { requestOtp } from "@/lib/services/otp.service";
import { rateLimitOTP } from "@/lib/middleware/rate-limit";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import { normalizePhone } from "@/lib/utils/phone";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body?.phone as string;

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "شماره موبایل الزامی است.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    const normalizedPhone = normalizePhone(phone);

    // Rate Limiting برای OTP
    const rateLimitResult = await rateLimitOTP(normalizedPhone);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `تعداد درخواست‌های OTP بیش از حد مجاز است. لطفاً بعد از ${new Date(rateLimitResult.resetAt).toLocaleTimeString("fa-IR")} دوباره تلاش کنید.`,
          code: "RATE_LIMIT_EXCEEDED",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetAt.getTime().toString(),
          },
        },
      );
    }

    await requestOtp(phone);

    // فقط اطلاعات مربوط به Rate Limit را برمی‌گردانیم؛ کد OTP هرگز در پاسخ API نمایش داده نمی‌شود
    return successResponse(
      {
        rateLimit: {
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.resetAt,
        },
      },
      "کد تایید با موفقیت ارسال شد.",
    );
  } catch (error) {
    return handleApiError(error);
  }
}

