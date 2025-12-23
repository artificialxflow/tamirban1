import { BaseRepository } from "./base-repository";
import type { Story } from "../types";
import { getStoriesCollection } from "../db/collections";

class StoriesRepository extends BaseRepository<Story> {
  protected collectionPromise = getStoriesCollection();

  /**
   * دریافت استوری‌های فعال
   */
  async findActive(): Promise<Story[]> {
    const collection = await this.collection();
    const now = new Date();
    return collection
      .find({
        isActive: true,
        expiresAt: { $gt: now },
      })
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * دریافت استوری‌های یک کاربر
   */
  async findByCreator(createdBy: string): Promise<Story[]> {
    const collection = await this.collection();
    return collection
      .find({ createdBy })
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * دریافت استوری‌های منقضی شده
   */
  async findExpired(): Promise<Story[]> {
    const collection = await this.collection();
    const now = new Date();
    return collection
      .find({
        expiresAt: { $lte: now },
      })
      .sort({ createdAt: -1 })
      .toArray();
  }
}

export const storiesRepository = new StoriesRepository();

