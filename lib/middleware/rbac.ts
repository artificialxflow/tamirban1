import { NextRequest, NextResponse } from "next/server";

import { authenticateRequest } from "./auth";
import { getUsersCollection } from "@/lib/db/collections";
import type { RoleKey } from "@/lib/types";
import { errorResponse, ApiErrorCode } from "@/lib/utils/errors";
import { ROLE_PERMISSIONS } from "@/lib/permissions/role-permissions";

/**
 * بررسی دسترسی کاربر به یک permission
 */
export async function checkPermission(userId: string, permission: string): Promise<boolean> {
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ _id: userId, isActive: true });

  if (!user) {
    return false;
  }

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Middleware برای بررسی نقش کاربر
 */
export function requireRole(...allowedRoles: RoleKey[]) {
  return async (request: NextRequest): Promise<
    | { success: true; user: { id: string; role: RoleKey } }
    | { success: false; response: NextResponse }
  > => {
    const authResult = await authenticateRequest(request);

    if (!authResult.success) {
      return authResult;
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ _id: authResult.user.sub, isActive: true });

    if (!user) {
      return {
        success: false,
        response: errorResponse("کاربر یافت نشد یا غیرفعال است.", ApiErrorCode.NOT_FOUND, 404),
      };
    }

    if (!allowedRoles.includes(user.role)) {
      const allowedRolesText = allowedRoles.map((r) => {
        const roleNames: Record<RoleKey, string> = {
          SUPER_ADMIN: "مدیر کل",
          FINANCE_MANAGER: "مدیر مالی",
          MARKETER: "بازاریاب",
          CUSTOMER: "مشتری",
        };
        return roleNames[r];
      }).join("، ");
      
      return {
        success: false,
        response: errorResponse(
          `شما دسترسی لازم برای این عملیات را ندارید. نقش‌های مجاز: ${allowedRolesText}`,
          ApiErrorCode.FORBIDDEN,
          403,
        ),
      };
    }

    return {
      success: true,
      user: { id: user._id, role: user.role },
    };
  };
}

/**
 * Middleware برای بررسی permission
 */
export function requirePermission(permission: string) {
  return async (request: NextRequest): Promise<
    | { success: true; user: { id: string; role: RoleKey } }
    | { success: false; response: NextResponse }
  > => {
    const authResult = await authenticateRequest(request);

    if (!authResult.success) {
      return authResult;
    }

    const hasPermission = await checkPermission(authResult.user.sub, permission);

    if (!hasPermission) {
      // دریافت نام permission برای نمایش بهتر
      const permissionNames: Record<string, string> = {
        "users:read": "مشاهده کاربران",
        "users:write": "ایجاد/ویرایش کاربران",
        "users:delete": "حذف کاربران",
        "customers:read": "مشاهده مشتریان",
        "customers:write": "ایجاد/ویرایش مشتریان",
        "customers:delete": "حذف مشتریان",
        "visits:read": "مشاهده ویزیت‌ها",
        "visits:write": "ایجاد/ویرایش ویزیت‌ها",
        "visits:delete": "حذف ویزیت‌ها",
        "invoices:read": "مشاهده پیش‌فاکتورها",
        "invoices:write": "ایجاد/ویرایش پیش‌فاکتورها",
        "invoices:delete": "حذف پیش‌فاکتورها",
        "marketers:read": "مشاهده بازاریاب‌ها",
        "marketers:write": "ایجاد/ویرایش بازاریاب‌ها",
        "marketers:delete": "حذف بازاریاب‌ها",
        "products:read": "مشاهده محصولات",
        "products:write": "ایجاد/ویرایش محصولات",
        "products:delete": "حذف محصولات",
        "tasks:read": "مشاهده تسک‌ها",
        "tasks:write": "ایجاد/ویرایش تسک‌ها",
        "tasks:delete": "حذف تسک‌ها",
        "reports:read": "مشاهده گزارش‌ها",
        "settings:read": "مشاهده تنظیمات",
        "settings:write": "ویرایش تنظیمات",
      };
      
      const permissionLabel = permissionNames[permission] || permission;
      
      return {
        success: false,
        response: errorResponse(
          `شما دسترسی لازم برای این عملیات را ندارید. دسترسی مورد نیاز: ${permissionLabel}`,
          ApiErrorCode.FORBIDDEN,
          403,
        ),
      };
    }

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ _id: authResult.user.sub });

    if (!user) {
      return {
        success: false,
        response: errorResponse("کاربر یافت نشد.", ApiErrorCode.NOT_FOUND, 404),
      };
    }

    return {
      success: true,
      user: { id: user._id, role: user.role },
    };
  };
}

