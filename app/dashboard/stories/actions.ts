"use server";

import { revalidatePath } from "next/cache";
import { createStory, updateStory } from "@/lib/services/stories.service";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type CreateStoryFormState = {
  success: boolean;
  message: string | null;
};

async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    
    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return null;
    }

    const decoded = jwt.verify(token, secret) as { sub: string };
    return decoded.sub;
  } catch {
    return null;
  }
}

export async function createStoryAction(
  _prevState: CreateStoryFormState,
  formData: FormData,
): Promise<CreateStoryFormState> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        message: "کاربر یافت نشد. لطفاً دوباره وارد شوید.",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const imageUrl = formData.get("imageUrl") as string | null;
    const videoUrl = formData.get("videoUrl") as string | null;
    const expiresAt = formData.get("expiresAt") as string;
    const isActive = formData.get("isActive") === "true";

    if (!title || !expiresAt) {
      return {
        success: false,
        message: "عنوان و تاریخ انقضا الزامی است.",
      };
    }

    await createStory({
      title,
      description: description || undefined,
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      expiresAt: new Date(expiresAt),
      isActive,
      createdBy: userId,
    });

    revalidatePath("/dashboard/stories");
    return {
      success: true,
      message: "استوری با موفقیت ایجاد شد.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در ایجاد استوری";
    return {
      success: false,
      message,
    };
  }
}

export type UpdateStoryFormState = {
  success: boolean;
  message: string | null;
};

export async function updateStoryAction(
  _prevState: UpdateStoryFormState,
  formData: FormData,
): Promise<UpdateStoryFormState> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        success: false,
        message: "کاربر یافت نشد. لطفاً دوباره وارد شوید.",
      };
    }

    const storyId = formData.get("storyId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const imageUrl = formData.get("imageUrl") as string | null;
    const videoUrl = formData.get("videoUrl") as string | null;
    const expiresAt = formData.get("expiresAt") as string;
    const isActive = formData.get("isActive") === "true";

    if (!storyId || !title || !expiresAt) {
      return {
        success: false,
        message: "شناسه استوری، عنوان و تاریخ انقضا الزامی است.",
      };
    }

    await updateStory(
      storyId,
      {
        title,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
        videoUrl: videoUrl || undefined,
        expiresAt: new Date(expiresAt),
        isActive,
      },
      userId,
    );

    revalidatePath("/dashboard/stories");
    return {
      success: true,
      message: "استوری با موفقیت به‌روزرسانی شد.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطا در به‌روزرسانی استوری";
    return {
      success: false,
      message,
    };
  }
}

