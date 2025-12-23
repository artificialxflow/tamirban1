import { z } from "zod";

import { storiesRepository } from "@/lib/repositories/stories.repository";
import type { Story } from "@/lib/types";

export type StorySummary = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdBy: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
};

export type StoryListFilters = {
  isActive?: boolean;
  createdBy?: string;
  expired?: boolean;
  page?: number;
  limit?: number;
};

const createStorySchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().optional(),
  imageUrl: z.string().url("آدرس تصویر معتبر نیست").optional(),
  videoUrl: z.string().url("آدرس ویدیو معتبر نیست").optional(),
  createdBy: z.string().min(1, "شناسه ایجادکننده الزامی است"),
  expiresAt: z.coerce.date({ message: "تاریخ انقضا الزامی است" }),
  isActive: z.boolean().default(true),
});

const updateStorySchema = createStorySchema.partial().extend({
  _id: z.string().min(1),
});

/**
 * دریافت لیست استوری‌ها
 */
export async function listStories(filters: StoryListFilters = {}): Promise<StorySummary[]> {
  let query: Record<string, unknown> = {};

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  if (filters.createdBy) {
    query.createdBy = filters.createdBy;
  }

  if (filters.expired !== undefined) {
    const now = new Date();
    if (filters.expired) {
      query.expiresAt = { $lte: now };
    } else {
      query.expiresAt = { $gt: now };
    }
  }

  const stories = await storiesRepository.findMany(query);
  return stories.map((story) => ({
    id: story._id,
    title: story.title,
    description: story.description,
    imageUrl: story.imageUrl,
    videoUrl: story.videoUrl,
    createdBy: story.createdBy,
    expiresAt: story.expiresAt,
    isActive: story.isActive,
    createdAt: story.createdAt,
  }));
}

/**
 * دریافت استوری بر اساس ID
 */
export async function getStoryById(storyId: string): Promise<StorySummary | null> {
  const story = await storiesRepository.findById(storyId);
  if (!story) {
    return null;
  }

  return {
    id: story._id,
    title: story.title,
    description: story.description,
    imageUrl: story.imageUrl,
    videoUrl: story.videoUrl,
    createdBy: story.createdBy,
    expiresAt: story.expiresAt,
    isActive: story.isActive,
    createdAt: story.createdAt,
  };
}

/**
 * ایجاد استوری جدید
 */
export async function createStory(input: unknown): Promise<StorySummary> {
  const payload = createStorySchema.parse(input);

  const now = new Date();
  const document: Omit<Story, "_id"> = {
    title: payload.title,
    description: payload.description,
    imageUrl: payload.imageUrl,
    videoUrl: payload.videoUrl,
    expiresAt: payload.expiresAt,
    isActive: payload.isActive,
    createdAt: now,
    createdBy: payload.createdBy,
    updatedAt: now,
    updatedBy: payload.createdBy,
  };

  const created = await storiesRepository.insertOne(document as never);
  return {
    id: created._id,
    title: created.title,
    description: created.description,
    imageUrl: created.imageUrl,
    videoUrl: created.videoUrl,
    createdBy: created.createdBy,
    expiresAt: created.expiresAt,
    isActive: created.isActive,
    createdAt: created.createdAt,
  };
}

/**
 * به‌روزرسانی استوری
 */
export async function updateStory(storyId: string, input: unknown, updatedBy: string): Promise<StorySummary> {
  const payload = updateStorySchema.parse(input);

  const existing = await storiesRepository.findById(storyId);
  if (!existing) {
    throw new Error("استوری یافت نشد");
  }

  const updates: Partial<Story> = {
    updatedAt: new Date(),
    updatedBy,
  };

  if (payload.title !== undefined) updates.title = payload.title;
  if (payload.description !== undefined) updates.description = payload.description;
  if (payload.imageUrl !== undefined) updates.imageUrl = payload.imageUrl;
  if (payload.videoUrl !== undefined) updates.videoUrl = payload.videoUrl;
  if (payload.expiresAt !== undefined) updates.expiresAt = payload.expiresAt;
  if (payload.isActive !== undefined) updates.isActive = payload.isActive;

  await storiesRepository.updateById(storyId, updates as never);
  const updated = await getStoryById(storyId);
  if (!updated) {
    throw new Error("خطا در به‌روزرسانی استوری");
  }
  return updated;
}

/**
 * حذف استوری
 */
export async function deleteStory(storyId: string): Promise<void> {
  const existing = await storiesRepository.findById(storyId);
  if (!existing) {
    throw new Error("استوری یافت نشد");
  }

  await storiesRepository.deleteById(storyId);
}

/**
 * فعال/غیرفعال کردن استوری
 */
export async function toggleStoryStatus(storyId: string, isActive: boolean, updatedBy: string): Promise<StorySummary> {
  return updateStory(storyId, { isActive }, updatedBy);
}

