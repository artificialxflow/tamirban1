import { ObjectId } from "mongodb";
import type { Filter } from "mongodb";
import { z } from "zod";

import { customersRepository } from "@/lib/repositories";
import type { ContactInfo, Customer, CustomerStatus, GeoLocation } from "@/lib/types";
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
  distance?: number; // فاصله بر حسب متر (فقط در location-based search)
};

export type CustomerDetail = CustomerSummary & {
  phone?: string; // برای backward compatibility
  phones?: string[]; // لیست شماره‌های تلفن
  loyaltyScore?: number;
  notes?: string;
  geoLocation?: GeoLocation;
};

const customerStatusValues = CUSTOMER_STATUSES;

export type CustomerListFilters = {
  status?: CustomerStatus;
  marketerId?: string;
  search?: string;
  city?: string;
  tags?: string[]; // فیلتر بر اساس برچسب‌ها
  nearbyLocation?: {
    latitude: number;
    longitude: number;
    maxDistance?: number; // در متر (پیش‌فرض: 10000 متر = 10 کیلومتر)
  };
  page?: number;
  limit?: number;
};

const geoLocationSchema = z.object({
  latitude: z.coerce.number().refine((value) => !Number.isNaN(value), "عرض جغرافیایی نامعتبر است"),
  longitude: z.coerce.number().refine((value) => !Number.isNaN(value), "طول جغرافیایی نامعتبر است"),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
});

const createCustomerSchema = z.object({
  displayName: z.string().min(3, "نام مشتری باید حداقل سه کاراکتر باشد"),
  legalName: z.string().optional(),
  phone: z.string().min(10, "شماره موبایل معتبر وارد کنید").optional(), // برای backward compatibility
  phones: z.array(z.string().min(10, "شماره موبایل معتبر وارد کنید")).optional(), // لیست شماره‌ها
  primaryPhone: z.string().min(10, "شماره موبایل معتبر وارد کنید").optional(), // شماره اصلی
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
  geoLocation: geoLocationSchema.optional(),
}).refine(
  (data) => {
    // حداقل یکی از phone یا phones باید وجود داشته باشد
    return data.phone || (data.phones && data.phones.length > 0);
  },
  {
    message: "حداقل یک شماره تلفن الزامی است",
  }
);

const updateCustomerSchema = z
  .object({
    displayName: z.string().min(3, "نام مشتری باید حداقل سه کاراکتر باشد").optional(),
    legalName: z.string().optional(),
    phone: z.string().min(10, "شماره موبایل معتبر وارد کنید").optional(), // برای backward compatibility
    phones: z.array(z.string().min(10, "شماره موبایل معتبر وارد کنید")).optional(), // لیست شماره‌ها
    primaryPhone: z.string().min(10, "شماره موبایل معتبر وارد کنید").optional(), // شماره اصلی
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
    geoLocation: z.union([geoLocationSchema, z.null()]).optional(),
  })
  .strict();

export async function listCustomerSummaries(
  filters: CustomerListFilters = {},
): Promise<{ data: CustomerSummary[]; total: number; page: number; limit: number }> {
  const query: Filter<Customer> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.marketerId) {
    query.assignedMarketerId = filters.marketerId;
  }

  if (filters.city) {
    query["contact.city"] = new RegExp(filters.city, "i");
  }

  if (filters.search) {
    const regex = new RegExp(filters.search, "i");
    query.$or = [
      { displayName: regex },
      { code: regex },
      { "contact.phone": regex },
      { "contact.phones": { $in: [regex] } }, // جستجو در لیست شماره‌ها
      { "contact.primaryPhone": regex },
      { "contact.email": regex },
    ];
  }

  // Geospatial query برای جستجوی نزدیک‌ترین مشتری‌ها
  let sortOptions: { [key: string]: 1 | -1 } = { createdAt: -1 };
  let calculateDistance = false;
  let userLocation: { latitude: number; longitude: number } | null = null;
  let maxDistance = Infinity;

  if (filters.nearbyLocation) {
    const { latitude, longitude, maxDistance: maxDist = 10000 } = filters.nearbyLocation;
    userLocation = { latitude, longitude };
    maxDistance = maxDist;
    calculateDistance = true;
    
    // فقط مشتری‌هایی که geoLocation دارند
    (query as any).geoLocation = { $exists: true, $ne: null };
    
    // برای geospatial queries، sort بر اساس فاصله است (در JavaScript محاسبه می‌شود)
    sortOptions = {}; // بعداً بر اساس فاصله sort می‌کنیم
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // شمارش کل رکوردها
  const total = await customersRepository.count(query as never);

  // دریافت داده‌ها با pagination
  const customers = await customersRepository.findMany(query as never, {
    sort: sortOptions,
    skip,
    limit,
  });

  // تابع محاسبه فاصله (Haversine formula)
  const calculateDistanceInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371000; // شعاع زمین بر حسب متر
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // محاسبه فاصله و فیلتر کردن بر اساس maxDistance
  let customersWithDistance = customers.map((customer) => {
    const summary: CustomerSummary = {
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
    };

    // محاسبه فاصله اگر location-based search فعال باشد
    if (calculateDistance && userLocation && customer.geoLocation) {
      summary.distance = calculateDistanceInMeters(
        userLocation.latitude,
        userLocation.longitude,
        customer.geoLocation.latitude,
        customer.geoLocation.longitude,
      );
    }

    return summary;
  });

  // فیلتر کردن بر اساس maxDistance
  if (calculateDistance) {
    customersWithDistance = customersWithDistance.filter(
      (customer) => customer.distance !== undefined && customer.distance <= maxDistance,
    );
  }

  // Sort بر اساس فاصله اگر location-based search فعال باشد
  if (calculateDistance) {
    customersWithDistance.sort((a, b) => {
      const distA = a.distance ?? Infinity;
      const distB = b.distance ?? Infinity;
      return distA - distB;
    });
  }

  return {
    data: customersWithDistance,
    total: calculateDistance ? customersWithDistance.length : total,
    page,
    limit,
  };
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
    phone: customer.contact.primaryPhone || customer.contact.phones?.[0] || customer.contact.phone,
    phones: customer.contact.phones || (customer.contact.phone ? [customer.contact.phone] : []),
    loyaltyScore: customer.loyaltyScore,
    notes: customer.notes,
    geoLocation: customer.geoLocation || undefined,
  };
}

export async function createCustomer(input: unknown) {
  const payload = createCustomerSchema.parse(input);

  const now = new Date();
  
  // پردازش شماره‌های تلفن
  let phones: string[] = [];
  let primaryPhone: string | undefined;
  
  if (payload.phones && payload.phones.length > 0) {
    // استفاده از phones اگر موجود باشد
    phones = payload.phones.map((p) => normalizePhone(p));
    primaryPhone = phones[0];
  } else if (payload.phone) {
    // استفاده از phone برای backward compatibility
    const normalized = normalizePhone(payload.phone);
    phones = [normalized];
    primaryPhone = normalized;
  } else if (payload.primaryPhone) {
    // استفاده از primaryPhone
    primaryPhone = normalizePhone(payload.primaryPhone);
    phones = [primaryPhone];
  }
  
  if (phones.length === 0) {
    throw new Error("حداقل یک شماره تلفن الزامی است");
  }
  
  const contact: ContactInfo = {
    phones,
    primaryPhone,
    phone: primaryPhone, // برای backward compatibility
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
    geoLocation: payload.geoLocation,
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

  // پردازش شماره‌های تلفن
  if (payload.phones !== undefined) {
    // استفاده از phones اگر موجود باشد
    const normalizedPhones = payload.phones.map((p) => normalizePhone(p));
    contactUpdates.phones = normalizedPhones;
    contactUpdates.primaryPhone = normalizedPhones[0];
    contactUpdates.phone = normalizedPhones[0]; // برای backward compatibility
    contactChanged = true;
  } else if (payload.phone !== undefined) {
    // استفاده از phone برای backward compatibility
    const normalized = normalizePhone(payload.phone);
    contactUpdates.phone = normalized;
    contactUpdates.primaryPhone = normalized;
    // اگر phones موجود نیست، آن را از phone بساز
    if (!contactUpdates.phones) {
      contactUpdates.phones = [normalized];
    } else {
      // اگر phones موجود است، اولین را به‌روزرسانی کن
      contactUpdates.phones[0] = normalized;
    }
    contactChanged = true;
  } else if (payload.primaryPhone !== undefined) {
    // استفاده از primaryPhone
    const normalized = normalizePhone(payload.primaryPhone);
    contactUpdates.primaryPhone = normalized;
    contactUpdates.phone = normalized; // برای backward compatibility
    if (!contactUpdates.phones) {
      contactUpdates.phones = [normalized];
    } else {
      contactUpdates.phones[0] = normalized;
    }
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

  if (payload.geoLocation !== undefined) {
    if (payload.geoLocation === null || payload.geoLocation === undefined) {
      delete (updateDoc as Partial<Customer>).geoLocation;
    } else {
      updateDoc.geoLocation = payload.geoLocation;
    }
  }

  if (contactChanged) {
    updateDoc.contact = contactUpdates as ContactInfo;
  }

  const now = new Date();
  const updatePayload: {
    $set: Partial<Customer> & { updatedAt: Date; updatedBy: string };
    $unset?: Record<string, "" | true>;
  } = {
    $set: {
      ...updateDoc,
      updatedAt: now,
      updatedBy: "system",
    },
  };

  if (payload.geoLocation === null || payload.geoLocation === undefined) {
    updatePayload.$unset = {
      ...(updatePayload.$unset ?? {}),
      geoLocation: "",
    };
  }

  await customersRepository.updateById(customerId, updatePayload as never);

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
