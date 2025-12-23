import { NextRequest, NextResponse } from "next/server";

import { createCustomer } from "@/lib/services/customers.service";
import { withRateLimit } from "@/lib/middleware/rate-limit";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import { z } from "zod";

/**
 * Schema برای ثبت مشتری از اپ (ساده‌تر از schema داخلی)
 */
const registerCustomerSchema = z.object({
  displayName: z.string().min(1, "نام مشتری الزامی است"),
  phone: z.string().min(10, "شماره تلفن معتبر نیست"),
  city: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  // برای جلوگیری از spam، می‌توانیم CAPTCHA یا rate limiting استفاده کنیم
});

/**
 * POST /api/customers/register
 * 
 * ثبت مشتری جدید از اپ Flutter (public endpoint)
 * 
 * Rate limiting: 10 درخواست در ساعت برای هر IP
 */
export async function POST(request: NextRequest) {
  // Rate limiting برای جلوگیری از spam
  const rateLimitMiddleware = withRateLimit({
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 ساعت
    keyGenerator: (req) => {
      // استفاده از IP address برای rate limiting
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "unknown";
      return `customer-register:${ip}`;
    },
  });

  const rateLimitResult = await rateLimitMiddleware(request);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const body = await request.json();
    
    // Validation
    const validated = registerCustomerSchema.parse(body);

    // تبدیل به فرمت مورد نیاز createCustomer
    const payload = {
      displayName: validated.displayName,
      phones: [validated.phone],
      primaryPhone: validated.phone,
      city: validated.city,
      address: validated.address,
      notes: validated.notes,
      status: "NEW" as const, // وضعیت پیش‌فرض برای ثبت از اپ
    };

    const customer = await createCustomer(payload);

    // فقط اطلاعات ضروری را برگردان (بدون اطلاعات حساس)
    return successResponse(
      {
        id: customer?.id,
        code: customer?.code,
        name: customer?.name,
        message: "اطلاعات شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.",
      },
      "ثبت اطلاعات با موفقیت انجام شد.",
      201,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0]?.message || "خطا در اعتبارسنجی داده‌ها",
          errors: error.issues,
          code: "VALIDATION_ERROR",
        },
        { status: 422 },
      );
    }
    return handleApiError(error);
  }
}

