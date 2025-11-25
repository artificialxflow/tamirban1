"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { createCustomer, deleteCustomer, updateCustomer } from "@/lib/services/customers.service";

export type CreateCustomerFormState = {
  success: boolean;
  message: string | null;
};

export async function createCustomerAction(
  _prevState: CreateCustomerFormState,
  formData: FormData,
): Promise<CreateCustomerFormState> {
  try {
    const payload = {
      displayName: formData.get("displayName"),
      phone: formData.get("phone"),
      city: formData.get("city") || undefined,
      status: formData.get("status"),
      tags: (formData.get("tags") as string | null)
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: formData.get("notes") || undefined,
    };

    await createCustomer(payload);
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard"); // Also refresh dashboard

    return {
      success: true,
      message: "مشتری با موفقیت ثبت شد.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        message: firstError?.message || "خطا در اعتبارسنجی داده‌ها",
      };
    }
    const message = error instanceof Error ? error.message : "ثبت مشتری با خطا مواجه شد.";
    return {
      success: false,
      message,
    };
  }
}


export async function updateCustomerAction(
  _prevState: CreateCustomerFormState,
  formData: FormData,
): Promise<CreateCustomerFormState> {
  try {
    const customerId = formData.get("customerId") as string;
    if (!customerId) {
      return { success: false, message: "شناسه مشتری الزامی است." };
    }

    const payload = {
      displayName: formData.get("displayName"),
      phone: formData.get("phone"),
      city: formData.get("city") || undefined,
      status: formData.get("status"),
      tags: (formData.get("tags") as string | null)
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: formData.get("notes") || undefined,
    };

    await updateCustomer(customerId, payload);
    revalidatePath("/dashboard/customers");

    return {
      success: true,
      message: "مشتری با موفقیت به‌روزرسانی شد.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        message: firstError?.message || "خطا در اعتبارسنجی داده‌ها",
      };
    }
    const message = error instanceof Error ? error.message : "به‌روزرسانی مشتری با خطا مواجه شد.";
    return {
      success: false,
      message,
    };
  }
}

export async function deleteCustomerAction(customerId: string) {
  try {
    await deleteCustomer(customerId);
    revalidatePath("/dashboard/customers");
    return { success: true, message: "مشتری حذف شد." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "حذف مشتری با خطا مواجه شد.";
    return { success: false, message };
  }
}


