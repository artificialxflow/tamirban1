import { NextRequest } from "next/server";

import { withRateLimit } from "@/lib/middleware/rate-limit";
import { handleApiError, successResponse } from "@/lib/utils/errors";

/**
 * نوع لینک‌های اجتماعی
 */
export type SocialLink = {
  platform: "TELEGRAM" | "WHATSAPP" | "INSTAGRAM" | "FACEBOOK" | "TWITTER" | "LINKEDIN" | "WEBSITE";
  url: string;
  label?: string;
};

/**
 * GET /api/settings/social-links
 * 
 * دریافت لینک‌های اجتماعی (public endpoint)
 * 
 * Rate limiting: 100 درخواست در ساعت برای هر IP
 */
export async function GET(request: NextRequest) {
  // Rate limiting برای جلوگیری از abuse
  const rateLimitMiddleware = withRateLimit({
    maxRequests: 100,
    windowMs: 60 * 60 * 1000, // 1 ساعت
    keyGenerator: (req) => {
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "unknown";
      return `social-links:${ip}`;
    },
  });

  const rateLimitResult = await rateLimitMiddleware(request);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    // TODO: در آینده می‌توانیم این لینک‌ها را از دیتابیس یا environment variables بخوانیم
    // فعلاً از environment variables استفاده می‌کنیم
    const socialLinks: SocialLink[] = [];

    // خواندن از environment variables
    if (process.env.SOCIAL_TELEGRAM_URL) {
      socialLinks.push({
        platform: "TELEGRAM",
        url: process.env.SOCIAL_TELEGRAM_URL,
        label: "تلگرام",
      });
    }

    if (process.env.SOCIAL_WHATSAPP_URL) {
      socialLinks.push({
        platform: "WHATSAPP",
        url: process.env.SOCIAL_WHATSAPP_URL,
        label: "واتساپ",
      });
    }

    if (process.env.SOCIAL_INSTAGRAM_URL) {
      socialLinks.push({
        platform: "INSTAGRAM",
        url: process.env.SOCIAL_INSTAGRAM_URL,
        label: "اینستاگرام",
      });
    }

    if (process.env.SOCIAL_FACEBOOK_URL) {
      socialLinks.push({
        platform: "FACEBOOK",
        url: process.env.SOCIAL_FACEBOOK_URL,
        label: "فیسبوک",
      });
    }

    if (process.env.SOCIAL_WEBSITE_URL) {
      socialLinks.push({
        platform: "WEBSITE",
        url: process.env.SOCIAL_WEBSITE_URL,
        label: "وب‌سایت",
      });
    }

    return successResponse({
      data: socialLinks,
      total: socialLinks.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

