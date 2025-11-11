import { ObjectId } from "mongodb";
import type { Filter } from "mongodb";
import { z } from "zod";

import { customersRepository } from "@/lib/repositories";
import type { ContactInfo, Customer, CustomerStatus } from "@/lib/types";
import { CUSTOMER_STATUSES } from "@/lib/types";
import { normalizePhone } from "@/lib/utils/phone";

export type CustomerSummary = {
  id: string;
  code: string;
  name: string;
  marketer?: string;
  city?: string;
  lastVisitAt?: Date | null;
  status: CustomerStatus;
  grade?: "A" | "B" | "C" | "D";
  monthlyRevenue?: number;
  tags: string[];
};

export type CustomerDetail = CustomerSummary & {
  phone?: string;
  loyaltyScore?: number;
  notes?: string;
};

const customerStatusValues = CUSTOMER_STATUSES;

export type CustomerListFilters = {
  status?: CustomerStatus;
  marketerId?: string;
  search?: string;
};

const createCustomerSchema = z.object({
  displayName: z.string().min(3, "نام مشتری باید حداقل سه کاراکتر باشد"),
  legalName: z.string().optional(),
  phone: z.string().min(10, "شماره موبایل معتبر وارد کنید"),
  city: z.string().optional(),
  status: z.enum(customerStatusValues),
  tags: z.array(z.string()).default([]),
  lastVisitAt: z.coerce.date().optional(),
  revenueMonthly: z.coerce.number().optional(),
  grade: z.enum(["A", "B", "C", "D"]).optional(),
  loyaltyScore: z.coerce.number().optional(),
  assignedMarketerId: z.string().optional(),
  assignedMarketerName: z.string().optional(),
  notes: z.string().optional(),
});

const updateCustomerSchema = z
  .object({
    displayName: z.string().min(3, "نام مشتری باید حداقل سه کاراکتر باشد").optional(),
    legalName: z.string().optional(),
    phone: z.string().min(10, "شماره موبایل معتبر وارد کنید").optional(),
    city: z.string().optional().nullable(),
    status: z.enum(customerStatusValues).optional(),
    tags: z.array(z.string()).optional(),
    lastVisitAt: z.union([z.coerce.date(), z.null()]).optional(),
    revenueMonthly: z.union([z.coerce.number(), z.null()]).optional(),
    grade: z.enum(["A", "B", "C", "D"]).optional(),
    loyaltyScore: z.union([z.coerce.number(), z.null()]).optional(),
    assignedMarketerId: z.string().optional().nullable(),
    assignedMarketerName: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  })
  .strict();

export async function listCustomerSummaries(filters: CustomerListFilters = {}): Promise<CustomerSummary[]> {
  const query: Filter<Customer> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.marketerId) {
    query.assignedMarketerId = filters.marketerId;
  }

  if (filters.search) {
    const regex = new RegExp(filters.search, "i");
    query.$or = [
      { displayName: regex },
      { code: regex },
      { "contact.phone": regex },
      { "contact.email": regex },
    ];
  }

  const customers = await customersRepository.findMany(query as never, { sort: { createdAt: -1 } });

  return customers.map((customer) => ({
    id: customer._id,
    code: customer.code,
    name: customer.displayName,
    marketer: customer.assignedMarketerName,
    city: customer.contact.city,
    lastVisitAt: customer.lastVisitAt ?? null,
    status: customer.status,
    grade: customer.grade,
    monthlyRevenue: customer.revenueMonthly,
    tags: customer.tags ?? [],
  }));
}

export async function getCustomerDetail(customerId: string): Promise<CustomerDetail | null> {
  const customer = await customersRepository.findById(customerId);
  if (!customer) {
    return null;
  }

  return {
    id: customer._id,
    code: customer.code,
    name: customer.displayName,
    marketer: customer.assignedMarketerName,
    city: customer.contact.city,
    lastVisitAt: customer.lastVisitAt ?? null,
    status: customer.status,
    grade: customer.grade,
    monthlyRevenue: customer.revenueMonthly,
    tags: customer.tags ?? [],
    phone: customer.contact.phone,
    loyaltyScore: customer.loyaltyScore,
    notes: customer.notes,
  };
}

export async function createCustomer(input: unknown) {
  const payload = createCustomerSchema.parse(input);

  const now = new Date();
  const normalizedPhone = normalizePhone(payload.phone);
  const contact: ContactInfo = {
    phone: normalizedPhone,
  };

  if (payload.city) {
    contact.city = payload.city;
  }

  const document: Customer = {
    _id: new ObjectId().toHexString(),
    code: generateCustomerCode(now),
    displayName: payload.displayName,
    legalName: payload.legalName,
    contact,
    assignedMarketerId: payload.assignedMarketerId,
    assignedMarketerName: payload.assignedMarketerName,
    status: payload.status,
    tags: payload.tags,
    lastVisitAt: payload.lastVisitAt,
    revenueMonthly: payload.revenueMonthly,
    loyaltyScore: payload.loyaltyScore,
    grade: payload.grade,
    notes: payload.notes,
    createdAt: now,
    createdBy: "system",
    updatedAt: now,
    updatedBy: "system",
  };

  await customersRepository.insertOne(document as never);
  return getCustomerDetail(document._id);
}

export async function updateCustomer(customerId: string, input: unknown) {
  const payload = updateCustomerSchema.parse(input);
  const customer = await customersRepository.findById(customerId);

  if (!customer) {
    throw new Error("مشتری یافت نشد.");
  }

  const updateDoc: Partial<Customer> = {};
  let contactChanged = false;
  const contactUpdates: Partial<ContactInfo> = { ...customer.contact };

  if (payload.displayName !== undefined) {
    updateDoc.displayName = payload.displayName;
  }

  if (payload.legalName !== undefined) {
    updateDoc.legalName = payload.legalName;
  }

  if (payload.phone !== undefined) {
    contactUpdates.phone = normalizePhone(payload.phone);
    contactChanged = true;
  }

  if (payload.city !== undefined) {
    contactUpdates.city = payload.city ?? undefined;
    contactChanged = true;
  }

  if (payload.status !== undefined) {
    updateDoc.status = payload.status;
  }

  if (payload.tags !== undefined) {
    updateDoc.tags = payload.tags ?? [];
  }

  if (payload.lastVisitAt !== undefined) {
    updateDoc.lastVisitAt = payload.lastVisitAt ?? undefined;
  }

  if (payload.revenueMonthly !== undefined) {
    updateDoc.revenueMonthly = payload.revenueMonthly ?? undefined;
  }

  if (payload.loyaltyScore !== undefined) {
    updateDoc.loyaltyScore = payload.loyaltyScore ?? undefined;
  }

  if (payload.grade !== undefined) {
    updateDoc.grade = payload.grade;
  }

  if (payload.assignedMarketerId !== undefined) {
    updateDoc.assignedMarketerId = payload.assignedMarketerId ?? undefined;
  }

  if (payload.assignedMarketerName !== undefined) {
    updateDoc.assignedMarketerName = payload.assignedMarketerName ?? undefined;
  }

  if (payload.notes !== undefined) {
    updateDoc.notes = payload.notes ?? undefined;
  }

  if (contactChanged) {
    updateDoc.contact = contactUpdates as ContactInfo;
  }

  const now = new Date();
  await customersRepository.updateById(customerId, {
    $set: {
      ...updateDoc,
      updatedAt: now,
      updatedBy: "system",
    },
  } as never);

  return getCustomerDetail(customerId);
}

export async function deleteCustomer(customerId: string) {
  const deleted = await customersRepository.deleteById(customerId);
  if (!deleted) {
    throw new Error("مشتری یافت نشد.");
  }
}

function generateCustomerCode(date: Date) {
  const year = date.getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 900 + 100);
  return `C-${year}${random}`;
}
