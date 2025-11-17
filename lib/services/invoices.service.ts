import { ObjectId } from "mongodb";
import type { Filter } from "mongodb";
import { z } from "zod";

import { invoicesRepository } from "@/lib/repositories";
import type { Invoice, InvoiceStatus, InvoiceLineItem } from "@/lib/types";

export type InvoiceSummary = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  marketerId?: string;
  marketerName?: string;
  status: InvoiceStatus;
  issuedAt: Date;
  dueAt: Date;
  grandTotal: number;
  currency: "IRR" | "USD";
  paidAt?: Date;
};

export type InvoiceDetail = Invoice & {
  customerName?: string;
  marketerName?: string;
};

export type InvoiceListFilters = {
  status?: InvoiceStatus;
  customerId?: string;
  marketerId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
};

const invoiceLineItemSchema = z.object({
  productId: z.string().optional(),
  title: z.string().min(1, "عنوان آیتم الزامی است"),
  quantity: z.coerce.number().min(0.01, "تعداد باید بیشتر از صفر باشد"),
  unit: z.string().min(1, "واحد الزامی است"),
  unitPrice: z.coerce.number().min(0, "قیمت واحد باید مثبت باشد"),
  taxRate: z.coerce.number().min(0).max(100).optional(),
  discount: z.coerce.number().min(0).optional(),
});

const createInvoiceSchema = z.object({
  customerId: z.string().min(1, "مشتری الزامی است"),
  marketerId: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]).default("DRAFT"),
  issuedAt: z.coerce.date().default(new Date()),
  dueAt: z.coerce.date(),
  currency: z.enum(["IRR", "USD"]).default("IRR"),
  items: z.array(invoiceLineItemSchema).min(1, "حداقل یک آیتم لازم است"),
  paymentReference: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

const updateInvoiceSchema = z
  .object({
    customerId: z.string().optional(),
    marketerId: z.string().optional().nullable(),
    status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]).optional(),
    issuedAt: z.coerce.date().optional(),
    dueAt: z.coerce.date().optional(),
    currency: z.enum(["IRR", "USD"]).optional(),
    items: z.array(invoiceLineItemSchema).optional(),
    paymentReference: z.string().optional().nullable(),
    meta: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

/**
 * محاسبه خودکار مبالغ پیش‌فاکتور
 */
export function calculateInvoiceTotal(items: Array<{
  unitPrice: number;
  quantity: number;
  discount?: number;
  taxRate?: number;
}>): {
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
} {
  let subtotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;

  for (const item of items) {
    const itemSubtotal = item.unitPrice * item.quantity;
    const itemDiscount = item.discount || 0;
    const itemAfterDiscount = itemSubtotal - itemDiscount;
    const itemTax = itemAfterDiscount * ((item.taxRate || 0) / 100);

    subtotal += itemSubtotal;
    discountTotal += itemDiscount;
    taxTotal += itemTax;
  }

  const grandTotal = subtotal - discountTotal + taxTotal;

  return {
    subtotal: Math.round(subtotal),
    taxTotal: Math.round(taxTotal),
    discountTotal: Math.round(discountTotal),
    grandTotal: Math.round(grandTotal),
  };
}

/**
 * تولید شماره پیش‌فاکتور
 */
function generateInvoiceNumber(): string {
  const prefix = "INV";
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${year}${month}-${random}`;
}

/**
 * لیست پیش‌فاکتورها با فیلتر و Pagination
 */
export async function listInvoices(
  filters: InvoiceListFilters = {},
): Promise<{ data: InvoiceSummary[]; total: number; page: number; limit: number }> {
  const query: Filter<Invoice> = {};
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.customerId) {
    query.customerId = filters.customerId;
  }

  if (filters.marketerId) {
    query.marketerId = filters.marketerId;
  }

  if (filters.startDate || filters.endDate) {
    query.issuedAt = {};
    if (filters.startDate) {
      query.issuedAt.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.issuedAt.$lte = filters.endDate;
    }
  }

  const [invoices, total] = await Promise.all([
    invoicesRepository.findMany(query, { sort: { issuedAt: -1 }, skip, limit }),
    invoicesRepository.count(query),
  ]);

  // برای نمایش نام مشتری و بازاریاب، باید از جداول مربوطه fetch کنیم
  const customerIds = Array.from(new Set(invoices.map((inv) => inv.customerId)));
  const marketerIds = Array.from(
    new Set(invoices.map((inv) => inv.marketerId).filter(Boolean) as string[]),
  );

  const { getCustomersCollection } = await import("@/lib/db");
  const { getUsersCollection } = await import("@/lib/db");
  const customersCollection = await getCustomersCollection();
  const usersCollection = await getUsersCollection();

  const [customers, marketers] = await Promise.all([
    customersCollection
      .find({ _id: { $in: customerIds.map((id) => new ObjectId(id)) } as any })
      .toArray(),
    marketerIds.length > 0
      ? usersCollection
          .find({ _id: { $in: marketerIds.map((id) => new ObjectId(id)) } as any })
          .toArray()
      : Promise.resolve([]),
  ]);

  const customerMap = new Map(customers.map((c) => [c._id.toString(), c.displayName]));
  const marketerMap = new Map(
    marketers.map((m) => [m._id.toString(), m.fullName || "بازاریاب ناشناس"]),
  );

  const data: InvoiceSummary[] = invoices.map((invoice) => ({
    id: invoice._id.toString(),
    invoiceNumber: (invoice.meta?.invoiceNumber as string) || invoice._id.toString(),
    customerId: invoice.customerId,
    customerName: customerMap.get(invoice.customerId) || "مشتری ناشناس",
    marketerId: invoice.marketerId,
    marketerName: invoice.marketerId ? marketerMap.get(invoice.marketerId) : undefined,
    status: invoice.status,
    issuedAt: invoice.issuedAt,
    dueAt: invoice.dueAt,
    grandTotal: invoice.grandTotal,
    currency: invoice.currency,
    paidAt: invoice.paidAt,
  }));

  return { data, total, page, limit };
}

/**
 * دریافت جزئیات یک پیش‌فاکتور
 */
export async function getInvoiceById(invoiceId: string): Promise<InvoiceDetail | null> {
  const invoice = await invoicesRepository.findById(invoiceId);
  if (!invoice) {
    return null;
  }

  // دریافت نام مشتری و بازاریاب
  const { getCustomersCollection } = await import("@/lib/db");
  const { getUsersCollection } = await import("@/lib/db");
  const customersCollection = await getCustomersCollection();
  const usersCollection = await getUsersCollection();

  const [customer, marketer] = await Promise.all([
    customersCollection.findOne({ _id: new ObjectId(invoice.customerId) } as any),
    invoice.marketerId
      ? usersCollection.findOne({ _id: new ObjectId(invoice.marketerId) } as any)
      : Promise.resolve(null),
  ]);

  return {
    ...invoice,
    customerName: customer?.displayName,
    marketerName: marketer?.fullName || undefined,
  };
}

/**
 * ایجاد پیش‌فاکتور جدید
 */
export async function createInvoice(payload: unknown): Promise<Invoice> {
  const validated = createInvoiceSchema.parse(payload);

  // محاسبه مبالغ
  const totals = calculateInvoiceTotal(validated.items);

  // تولید شماره پیش‌فاکتور
  const invoiceNumber = generateInvoiceNumber();

  const now = new Date();
  const invoice: Invoice = {
    _id: new ObjectId().toHexString(),
    customerId: validated.customerId,
    marketerId: validated.marketerId,
    status: validated.status,
    issuedAt: validated.issuedAt,
    dueAt: validated.dueAt,
    currency: validated.currency,
    items: validated.items.map((item) => ({
      ...item,
      total: item.unitPrice * item.quantity - (item.discount || 0),
    })),
    subtotal: totals.subtotal,
    taxTotal: totals.taxTotal,
    discountTotal: totals.discountTotal,
    grandTotal: totals.grandTotal,
    paymentReference: validated.paymentReference,
    paidAt: undefined,
    createdAt: now,
    createdBy: "system",
    updatedAt: now,
    updatedBy: "system",
    meta: {
      ...validated.meta,
      invoiceNumber,
    },
  };

  const created = await invoicesRepository.insertOne(invoice as never);
  return created as Invoice;
}

/**
 * به‌روزرسانی پیش‌فاکتور
 */
export async function updateInvoice(invoiceId: string, payload: unknown): Promise<Invoice> {
  const validated = updateInvoiceSchema.parse(payload);

  const existing = await invoicesRepository.findById(invoiceId);
  if (!existing) {
    throw new Error("پیش‌فاکتور یافت نشد.");
  }

  const updateData: Partial<Invoice> = {
    updatedAt: new Date(),
  };

  if (validated.customerId !== undefined) {
    updateData.customerId = validated.customerId;
  }

  if (validated.marketerId !== undefined) {
    updateData.marketerId = validated.marketerId || undefined;
  }

  if (validated.status !== undefined) {
    updateData.status = validated.status;
  }

  if (validated.issuedAt !== undefined) {
    updateData.issuedAt = validated.issuedAt;
  }

  if (validated.dueAt !== undefined) {
    updateData.dueAt = validated.dueAt;
  }

  if (validated.currency !== undefined) {
    updateData.currency = validated.currency;
  }

  if (validated.items !== undefined) {
    // محاسبه مجدد مبالغ
    const totals = calculateInvoiceTotal(validated.items);
    updateData.items = validated.items.map((item) => ({
      ...item,
      total: item.unitPrice * item.quantity - (item.discount || 0),
    }));
    updateData.subtotal = totals.subtotal;
    updateData.taxTotal = totals.taxTotal;
    updateData.discountTotal = totals.discountTotal;
    updateData.grandTotal = totals.grandTotal;
  }

  if (validated.paymentReference !== undefined) {
    updateData.paymentReference = validated.paymentReference || undefined;
  }

  if (validated.meta !== undefined) {
    updateData.meta = { ...existing.meta, ...validated.meta };
  }

  const updated = await invoicesRepository.updateById(invoiceId, updateData);
  if (!updated) {
    throw new Error("خطا در به‌روزرسانی پیش‌فاکتور.");
  }

  const result = await getInvoiceById(invoiceId);
  if (!result) {
    throw new Error("پیش‌فاکتور یافت نشد.");
  }

  return result;
}

/**
 * تغییر وضعیت پیش‌فاکتور
 */
export async function changeInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus,
  paidAt?: Date,
): Promise<Invoice> {
  const updateData: Partial<Invoice> = {
    status,
    updatedAt: new Date(),
  };

  if (status === "PAID" && paidAt) {
    updateData.paidAt = paidAt;
  } else if (status !== "PAID") {
    updateData.paidAt = undefined;
  }

  const updated = await invoicesRepository.updateById(invoiceId, updateData);
  if (!updated) {
    throw new Error("خطا در تغییر وضعیت پیش‌فاکتور.");
  }

  const result = await getInvoiceById(invoiceId);
  if (!result) {
    throw new Error("پیش‌فاکتور یافت نشد.");
  }

  return result;
}

/**
 * علامت‌گذاری به عنوان پرداخت شده
 */
export async function markInvoiceAsPaid(invoiceId: string, paidAt = new Date()): Promise<Invoice> {
  return changeInvoiceStatus(invoiceId, "PAID", paidAt);
}

/**
 * حذف پیش‌فاکتور
 */
export async function deleteInvoice(invoiceId: string): Promise<boolean> {
  return invoicesRepository.deleteById(invoiceId);
}

