import { NextRequest, NextResponse } from "next/server";

import { getProductById, updateProduct, deleteProduct } from "@/lib/services/products.service";
import { requirePermission } from "@/lib/middleware/rbac";
import { handleApiError, successResponse } from "@/lib/utils/errors";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("products:read")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "محصول یافت نشد.",
          code: "NOT_FOUND",
        },
        { status: 404 },
      );
    }

    return successResponse(product, "محصول با موفقیت دریافت شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("products:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    const payload = await request.json();
    const product = await updateProduct(id, payload);
    return successResponse(product, "محصول با موفقیت به‌روزرسانی شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const permissionResult = await requirePermission("products:write")(request);
  if (!permissionResult.success) {
    return permissionResult.response;
  }

  try {
    const { id } = await params;
    await deleteProduct(id);
    return successResponse(null, "محصول با موفقیت حذف شد.");
  } catch (error) {
    return handleApiError(error);
  }
}

