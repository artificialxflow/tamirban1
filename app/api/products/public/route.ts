import { NextRequest } from "next/server";

import { listProducts } from "@/lib/services/products.service";
import { withRateLimit } from "@/lib/middleware/rate-limit";
import { handleApiError, successResponse } from "@/lib/utils/errors";

/**
 * GET /api/products/public
 * 
 * دریافت لیست محصولات فعال (public endpoint)
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
      return `products-public:${ip}`;
    },
  });

  const rateLimitResult = await rateLimitMiddleware(request);
  if (!rateLimitResult.success) {
    return rateLimitResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 100;

    // فقط محصولات فعال را برگردان
    const products = await listProducts({
      isActive: true,
      search,
      category,
      limit: limit || 100,
    });

    // دریافت جزئیات کامل برای mediaUrls
    const { getProductById } = await import("@/lib/services/products.service");
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const detail = await getProductById(product.id);
        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category,
          unitPrice: product.unitPrice,
          currency: product.currency,
          taxRate: product.taxRate,
          mediaUrls: detail?.mediaUrls,
        };
      }),
    );

    return successResponse({
      data: productsWithDetails,
      total: productsWithDetails.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

