import { z } from "zod";

import { productsRepository } from "@/lib/repositories";
import type { Product } from "@/lib/types";

export type ProductSummary = {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  unitPrice: number;
  currency: "IRR" | "USD";
  taxRate?: number;
  isActive: boolean;
};

export type ProductDetail = ProductSummary & {
  mediaUrls?: string[];
};

export type ProductListFilters = {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

const createProductSchema = z.object({
  name: z.string().min(1, "نام محصول الزامی است"),
  sku: z.string().optional(),
  category: z.string().optional(),
  unitPrice: z.coerce.number().min(0, "قیمت باید مثبت باشد"),
  currency: z.enum(["IRR", "USD"]).default("IRR"),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  isActive: z.boolean().default(true),
  mediaUrls: z.array(z.string().url()).optional(),
  createdBy: z.string().optional(),
});

const updateProductSchema = z
  .object({
    name: z.string().min(1).optional(),
    sku: z.string().optional(),
    category: z.string().optional(),
    unitPrice: z.coerce.number().min(0).optional(),
    currency: z.enum(["IRR", "USD"]).optional(),
    taxRate: z.coerce.number().min(0).max(100).optional(),
    isActive: z.boolean().optional(),
    mediaUrls: z.array(z.string().url()).optional(),
  })
  .strict();

/**
 * لیست محصولات با فیلتر
 */
export async function listProducts(filters: ProductListFilters = {}): Promise<ProductSummary[]> {
  const query: Record<string, unknown> = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { sku: { $regex: filters.search, $options: "i" } },
      { category: { $regex: filters.search, $options: "i" } },
    ];
  }

  const products = await productsRepository.findMany(query);
  return products.map((product) => ({
    id: product._id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    unitPrice: product.unitPrice,
    currency: product.currency,
    taxRate: product.taxRate,
    isActive: product.isActive,
  }));
}

/**
 * دریافت محصول بر اساس ID
 */
export async function getProductById(productId: string): Promise<ProductDetail | null> {
  const product = await productsRepository.findById(productId);
  if (!product) {
    return null;
  }

  return {
    id: product._id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    unitPrice: product.unitPrice,
    currency: product.currency,
    taxRate: product.taxRate,
    isActive: product.isActive,
    mediaUrls: product.mediaUrls,
  };
}

/**
 * ایجاد محصول جدید
 */
export async function createProduct(payload: unknown): Promise<Product> {
  const validated = createProductSchema.parse(payload);

  const product: Omit<Product, "_id"> = {
    name: validated.name,
    sku: validated.sku,
    category: validated.category,
    unitPrice: validated.unitPrice,
    currency: validated.currency,
    taxRate: validated.taxRate,
    isActive: validated.isActive,
    mediaUrls: validated.mediaUrls,
    createdAt: new Date(),
    createdBy: validated.createdBy || "system",
    updatedAt: new Date(),
  };

  const created = await productsRepository.insertOne(product as never);
  return created as Product;
}

/**
 * به‌روزرسانی محصول
 */
export async function updateProduct(productId: string, payload: unknown): Promise<Product> {
  const validated = updateProductSchema.parse(payload);

  const existing = await productsRepository.findById(productId);
  if (!existing) {
    throw new Error("محصول یافت نشد.");
  }

  const updateData: Partial<Product> = {
    updatedAt: new Date(),
  };

  if (validated.name !== undefined) {
    updateData.name = validated.name;
  }

  if (validated.sku !== undefined) {
    updateData.sku = validated.sku;
  }

  if (validated.category !== undefined) {
    updateData.category = validated.category;
  }

  if (validated.unitPrice !== undefined) {
    updateData.unitPrice = validated.unitPrice;
  }

  if (validated.currency !== undefined) {
    updateData.currency = validated.currency;
  }

  if (validated.taxRate !== undefined) {
    updateData.taxRate = validated.taxRate;
  }

  if (validated.isActive !== undefined) {
    updateData.isActive = validated.isActive;
  }

  if (validated.mediaUrls !== undefined) {
    updateData.mediaUrls = validated.mediaUrls;
  }

  const updated = await productsRepository.updateById(productId, updateData);
  if (!updated) {
    throw new Error("خطا در به‌روزرسانی محصول.");
  }

  const result = await productsRepository.findById(productId);
  if (!result) {
    throw new Error("محصول یافت نشد.");
  }

  return result as Product;
}

/**
 * حذف محصول
 */
export async function deleteProduct(productId: string): Promise<boolean> {
  const deleted = await productsRepository.deleteById(productId);
  return deleted;
}

