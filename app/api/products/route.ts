import { NextRequest } from "next/server";

import {
  listProducts,
  createProduct,
  type ProductListFilters,
} from "@/lib/services/products.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";

export async function GET(request: NextRequest) {
  const permissionResult = await requirePermission("products:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const filters: ProductListFilters = {
      category: searchParams.get("category") || undefined,
      isActive: searchParams.get("isActive") === "true" ? true : searchParams.get("isActive") === "false" ? false : undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
    };

    const products = await listProducts(filters);
    return successResponse(products, "لیست محصولات با موفقیت دریافت شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const permissionResult = await requirePermission("products:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const payload = await request.json();
    const product = await createProduct(payload);
    return successResponse(product, "محصول با موفقیت ایجاد شد.", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

