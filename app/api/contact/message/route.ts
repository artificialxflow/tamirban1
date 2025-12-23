import { NextRequest, NextResponse } from "next/server";

import { withRateLimit } from "@/lib/middleware/rate-limit";
import { handleApiError, successResponse } from "@/lib/utils/errors";
import { z } from "zod";
import { getContactMessagesCollection } from "@/lib/db/collections";
import { ObjectId } from "mongodb";

/**
 * Schema برای پیام تماس
 */
const contactMessageSchema = z.object({
  name: z.string().min(1, "نام الزامی است"),
  phone: z.string().min(10, "شماره تلفن معتبر نیست"),
  email: z.string().email("ایمیل معتبر نیست").optional(),
  subject: z.string().min(1, "موضوع الزامی است"),
  message: z.string().min(10, "پیام باید حداقل 10 کاراکتر باشد"),
});

/**
 * POST /api/contact/message
 * 
 * ارسال پیام تماس از اپ (public endpoint)
 * 
 * Rate limiting: 5 درخواست در ساعت برای هر IP
 */
export async function POST(request: NextRequest) {
  // Rate limiting برای جلوگیری از spam
  const rateLimitMiddleware = withRateLimit({
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 ساعت
    keyGenerator: (req) => {
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "unknown";
      return `contact-message:${ip}`;
    },
  });

  const rateLimitResult = await rateLimitMiddleware(request);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const body = await request.json();
    
    // Validation
    const validated = contactMessageSchema.parse(body);

    // ذخیره پیام در دیتابیس
    const now = new Date();
    const contactMessage = {
      _id: new ObjectId().toHexString(),
      name: validated.name,
      phone: validated.phone,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
      status: "PENDING", // PENDING, READ, REPLIED
      createdAt: now,
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    };

    const contactMessagesCollection = await getContactMessagesCollection();
    await contactMessagesCollection.insertOne(contactMessage);

    return successResponse(
      {
        messageId: contactMessage._id,
        message: "پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.",
      },
      "پیام با موفقیت ارسال شد.",
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

