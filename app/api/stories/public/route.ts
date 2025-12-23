import { NextRequest } from "next/server";

import { listStories } from "@/lib/services/stories.service";
import { withRateLimit } from "@/lib/middleware/rate-limit";
import { handleApiError, successResponse } from "@/lib/utils/errors";

/**
 * GET /api/stories/public
 * 
 * دریافت لیست استوری‌های فعال (public endpoint)
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
      return `stories-public:${ip}`;
    },
  });

  const rateLimitResult = await rateLimitMiddleware(request);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    // فقط استوری‌های فعال و منقضی نشده را برگردان
    const stories = await listStories({
      isActive: true,
      expired: false,
      limit: 50,
    });

    // فقط اطلاعات عمومی را برگردان
    const publicStories = stories.map((story) => ({
      id: story.id,
      title: story.title,
      description: story.description,
      imageUrl: story.imageUrl,
      videoUrl: story.videoUrl,
      expiresAt: story.expiresAt,
      createdAt: story.createdAt,
    }));

    return successResponse({
      data: publicStories,
      total: publicStories.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

