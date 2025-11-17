"use server";

import { revalidatePath } from "next/cache";

import { createMarketer, updateMarketer } from "@/lib/services/marketers.service";

export type CreateMarketerFormState = {
  success: boolean;
  message: string | null;
};

export type UpdateMarketerFormState = {
  success: boolean;
  message: string | null;
};

export async function createMarketerAction(
  _prevState: CreateMarketerFormState,
  formData: FormData,
): Promise<CreateMarketerFormState> {
  try {
    const payload = {
      fullName: formData.get("fullName"),
      mobile: formData.get("mobile"),
      email: formData.get("email") || undefined,
      role: formData.get("role") || "MARKETER",
      region: formData.get("region"),
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    };

    await createMarketer(payload);
    revalidatePath("/dashboard/marketers");

    return {
      success: true,
      message: "بازاریاب با موفقیت ثبت شد.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "ثبت بازاریاب با خطا مواجه شد.";
    return {
      success: false,
      message,
    };
  }
}

export async function updateMarketerAction(
  _prevState: UpdateMarketerFormState,
  formData: FormData,
): Promise<UpdateMarketerFormState> {
  try {
    const marketerId = formData.get("marketerId") as string;
    if (!marketerId) {
      return { success: false, message: "شناسه بازاریاب الزامی است." };
    }

    const payload = {
      fullName: formData.get("fullName"),
      mobile: formData.get("mobile"),
      email: formData.get("email") || undefined,
      role: formData.get("role") || "MARKETER",
      region: formData.get("region"),
      isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    };

    await updateMarketer(marketerId, payload);
    revalidatePath("/dashboard/marketers");

    return {
      success: true,
      message: "بازاریاب با موفقیت به‌روزرسانی شد.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "به‌روزرسانی بازاریاب با خطا مواجه شد.";
    return {
      success: false,
      message,
    };
  }
}

