export type RoleKey = "SUPER_ADMIN" | "FINANCE_MANAGER" | "MARKETER" | "CUSTOMER";

export type OTPChannel = "SMS" | "WHATSAPP" | "VOICE_CALL";

export interface AuditTrail {
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  addressLine?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

export interface ContactInfo {
  phone?: string; // برای backward compatibility - استفاده از primaryPhone یا phones[0]
  phones?: string[]; // لیست شماره‌های تلفن
  primaryPhone?: string; // شماره اصلی (اولین شماره در phones یا phone قدیمی)
  email?: string;
  telegramId?: string;
  whatsappNumber?: string;
  city?: string;
  address?: string;
}

export interface UserRole {
  key: RoleKey;
  label: string;
  permissions: string[];
}

export interface User extends AuditTrail {
  _id: string;
  fullName: string;
  mobile: string;
  email?: string;
  role: RoleKey;
  isActive: boolean;
  lastLoginAt?: Date;
  otpSecret?: string;
  otpExpiresAt?: Date;
}

export interface MarketerProfile extends AuditTrail {
  userId: string;
  region: string;
  assignedCustomers: string[];
  performanceScore?: number;
  lastVisitAt?: Date;
}

export const CUSTOMER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "PENDING",
  "AT_RISK",
  "LOYAL",
  "SUSPENDED",
] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const CUSTOMER_TAGS = [
  "مکانیک",
  "برق کار",
  "تنظیم موتور",
  "جلوبندی ساز",
  "آپاراتی",
  "تعویض روغن",
  "کارواش",
  "صافکار",
  "کلیدساز",
] as const;

export type CustomerTag = (typeof CUSTOMER_TAGS)[number];

export interface Customer extends AuditTrail {
  _id: string;
  code: string;
  displayName: string;
  legalName?: string;
  contact: ContactInfo;
  assignedMarketerId?: string;
  assignedMarketerName?: string;
  status: CustomerStatus;
  tags: string[];
  lastVisitAt?: Date;
  revenueMonthly?: number;
  loyaltyScore?: number;
  grade?: "A" | "B" | "C" | "D";
  geoLocation?: GeoLocation;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface Product extends AuditTrail {
  _id: string;
  name: string;
  sku?: string;
  category?: string;
  unitPrice: number;
  currency: "IRR" | "USD";
  taxRate?: number;
  isActive: boolean;
  mediaUrls?: string[];
}

export type VisitStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type VisitType = "IN_PERSON" | "PHONE";

export interface Visit extends AuditTrail {
  _id: string;
  customerId: string;
  marketerId: string;
  scheduledAt: Date;
  completedAt?: Date;
  status: VisitStatus;
  visitType?: VisitType; // نوع ویزیت: حضوری یا تلفنی
  topics: string[];
  notes?: string;
  locationSnapshot?: GeoLocation;
  followUpAction?: string;
  nextMeetingAt?: Date; // تاریخ جلسه بعدی
  relatedInvoiceIds?: string[]; // لیست شناسه‌های پیش‌فاکتورهای مرتبط
}

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

export interface InvoiceLineItem {
  productId?: string;
  title: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate?: number;
  discount?: number;
  total: number;
}

export interface PaymentInfo {
  method: "CASH" | "CHECK" | "TRANSFER";
  checkAmount?: number;
  checkDate?: Date;
  checkOwner?: string;
  checkNumber?: string;
  status: "PENDING" | "SETTLED" | "BOUNCED";
  transferReference?: string; // برای پرداخت بانکی
  cashAmount?: number; // برای پرداخت نقدی
}

export interface Invoice extends AuditTrail {
  _id: string;
  customerId: string;
  marketerId?: string;
  status: InvoiceStatus;
  issuedAt: Date;
  dueAt: Date;
  currency: "IRR" | "USD";
  items: InvoiceLineItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal?: number;
  grandTotal: number;
  paymentReference?: string;
  paidAt?: Date;
  paymentInfo?: PaymentInfo; // اطلاعات پرداخت (چک، نقدی، انتقال)
  meta?: Record<string, unknown>;
}

export type SMSStatus = "QUEUED" | "DELIVERED" | "FAILED";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task extends AuditTrail {
  _id: string;
  title: string;
  description?: string;
  assignedTo: string; // userId
  assignedBy: string; // userId
  status: TaskStatus;
  dueAt?: Date;
  priority: TaskPriority;
  completedAt?: Date;
  relatedCustomerId?: string;
  relatedVisitId?: string;
  relatedInvoiceId?: string;
}

export type InteractionType = "CALL" | "VISIT" | "SMS" | "EMAIL" | "NOTE";

export interface CustomerInteraction extends AuditTrail {
  _id: string;
  customerId: string;
  marketerId?: string; // بازاریابی که این ارتباط را انجام داده
  type: InteractionType;
  description?: string;
  duration?: number; // برای تماس (به ثانیه)
  relatedVisitId?: string; // اگر از نوع VISIT باشد
  relatedInvoiceId?: string; // اگر مرتبط با پیش‌فاکتور باشد
  createdAt: Date;
}

export interface SMSLog extends AuditTrail {
  _id: string;
  phoneNumber: string;
  channel: OTPChannel;
  template: string;
  payload: Record<string, unknown>;
  status: SMSStatus;
  sentAt: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  requestId?: string;
}

export interface OTPAttempt extends AuditTrail {
  _id?: string;
  phoneNumber: string;
  hashedCode: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

export type OtpAttempt = {
  id: string;
  phone: string;
  codeHash: string;
  expiresAt: Date;
  createdAt: Date;
  attempts: number;
};

export type AuthTokenPayload = {
  sub: string;
  phone: string;
  type: "access";
};

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Story extends AuditTrail {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdBy: string; // userId
  expiresAt: Date;
  isActive: boolean;
}

