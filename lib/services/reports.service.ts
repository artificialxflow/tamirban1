import { listVisits } from "./visits.service";
import { listInvoices } from "./invoices.service";
import { listCustomerSummaries } from "./customers.service";
import { listMarketers } from "./marketers.service";
import type { VisitStatus, InvoiceStatus } from "@/lib/types";

export type MarketerPerformanceReport = {
  marketerId: string;
  marketerName: string;
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  completionRate: number;
  totalInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalCustomers: number;
  newCustomers: number;
};

export type InvoiceReport = {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  byStatus: Record<InvoiceStatus, { count: number; amount: number }>;
  byMonth: Array<{ month: string; count: number; amount: number }>;
};

export type VisitReport = {
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  inProgressVisits: number;
  scheduledVisits: number;
  completionRate: number;
  byStatus: Record<VisitStatus, number>;
  byMonth: Array<{ month: string; count: number }>;
};

export type CustomerReport = {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  byStatus: Record<string, number>;
  byCity: Array<{ city: string; count: number }>;
};

export type ReportFilters = {
  startDate?: Date;
  endDate?: Date;
  marketerId?: string;
  customerId?: string;
  status?: string;
};

/**
 * گزارش عملکرد بازاریاب‌ها
 */
export async function getMarketerPerformanceReport(
  filters: ReportFilters = {},
): Promise<MarketerPerformanceReport[]> {
  const marketers = await listMarketers({});
  const marketersData = marketers.data;

  const reports: MarketerPerformanceReport[] = [];

  for (const marketer of marketersData) {
    // دریافت ویزیت‌های بازاریاب
    const visits = await listVisits({
      marketerId: marketer.id,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    const totalVisits = visits.total;
    const completedVisits = visits.data.filter((v) => v.status === "COMPLETED").length;
    const cancelledVisits = visits.data.filter((v) => v.status === "CANCELLED").length;
    const completionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;

    // دریافت فاکتورهای بازاریاب
    const invoicesResult = await listInvoices({
      marketerId: marketer.id,
      startDate: filters.startDate,
      endDate: filters.endDate,
      limit: 1000, // برای گزارش، همه را می‌خواهیم
    });

    const totalInvoices = invoicesResult.total;
    const paidInvoices = invoicesResult.data.filter((i) => i.status === "PAID").length;
    const totalRevenue = invoicesResult.data.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const paidRevenue = invoicesResult.data
      .filter((i) => i.status === "PAID")
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
    const pendingRevenue = invoicesResult.data
      .filter((i) => i.status === "SENT" || i.status === "DRAFT")
      .reduce((sum, inv) => sum + inv.grandTotal, 0);

    // دریافت مشتری‌های بازاریاب
    const customers = await listCustomerSummaries({
      marketerId: marketer.id,
    });

    const totalCustomers = customers.total;
    const newCustomers = customers.data.filter((c) => {
      if (!filters.startDate) return false;
      return c.lastVisitAt && new Date(c.lastVisitAt) >= filters.startDate;
    }).length;

    reports.push({
      marketerId: marketer.id,
      marketerName: marketer.fullName,
      totalVisits,
      completedVisits,
      cancelledVisits,
      completionRate: Math.round(completionRate * 100) / 100,
      totalInvoices,
      paidInvoices,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      totalCustomers,
      newCustomers,
    });
  }

  return reports;
}

/**
 * گزارش عملکرد یک بازاریاب خاص
 */
export async function getMarketerPerformanceById(
  marketerId: string,
  filters: ReportFilters = {},
): Promise<MarketerPerformanceReport | null> {
  const reports = await getMarketerPerformanceReport({
    ...filters,
    marketerId,
  });

  return reports.find((r) => r.marketerId === marketerId) || null;
}

/**
 * گزارش فاکتورها
 */
export async function getInvoiceReport(filters: ReportFilters = {}): Promise<InvoiceReport> {
  const invoicesResult = await listInvoices({
    marketerId: filters.marketerId,
    customerId: filters.customerId,
    startDate: filters.startDate,
    endDate: filters.endDate,
    limit: 1000, // برای گزارش، همه را می‌خواهیم
  });
  
  const invoices = invoicesResult.data;

  const totalInvoices = invoicesResult.total;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const paidAmount = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, inv) => sum + inv.grandTotal, 0);
  const pendingAmount = invoices
    .filter((i) => i.status === "SENT" || i.status === "DRAFT")
    .reduce((sum, inv) => sum + inv.grandTotal, 0);
  const overdueAmount = invoices
    .filter((i) => i.status === "OVERDUE")
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const byStatus: Record<InvoiceStatus, { count: number; amount: number }> = {
    DRAFT: { count: 0, amount: 0 },
    SENT: { count: 0, amount: 0 },
    PAID: { count: 0, amount: 0 },
    OVERDUE: { count: 0, amount: 0 },
    CANCELLED: { count: 0, amount: 0 },
  };

  invoices.forEach((inv) => {
    byStatus[inv.status].count++;
    byStatus[inv.status].amount += inv.grandTotal;
  });

  // گروه‌بندی بر اساس ماه
  const byMonthMap = new Map<string, { count: number; amount: number }>();
  invoices.forEach((inv) => {
    const month = new Date(inv.issuedAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long" });
    const existing = byMonthMap.get(month) || { count: 0, amount: 0 };
    byMonthMap.set(month, {
      count: existing.count + 1,
      amount: existing.amount + inv.grandTotal,
    });
  });

  const byMonth = Array.from(byMonthMap.entries()).map(([month, data]) => ({
    month,
    ...data,
  }));

  return {
    totalInvoices,
    totalAmount,
    paidAmount,
    pendingAmount,
    overdueAmount,
    byStatus,
    byMonth,
  };
}

/**
 * گزارش ویزیت‌ها
 */
export async function getVisitReport(filters: ReportFilters = {}): Promise<VisitReport> {
  const visits = await listVisits({
    marketerId: filters.marketerId,
    customerId: filters.customerId,
    status: filters.status as VisitStatus | undefined,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const totalVisits = visits.total;
  const completedVisits = visits.data.filter((v) => v.status === "COMPLETED").length;
  const cancelledVisits = visits.data.filter((v) => v.status === "CANCELLED").length;
  const inProgressVisits = visits.data.filter((v) => v.status === "IN_PROGRESS").length;
  const scheduledVisits = visits.data.filter((v) => v.status === "SCHEDULED").length;
  const completionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;

  const byStatus: Record<VisitStatus, number> = {
    SCHEDULED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  visits.data.forEach((v) => {
    byStatus[v.status]++;
  });

  // گروه‌بندی بر اساس ماه
  const byMonthMap = new Map<string, number>();
  visits.data.forEach((v) => {
    const month = new Date(v.scheduledAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long" });
    const existing = byMonthMap.get(month) || 0;
    byMonthMap.set(month, existing + 1);
  });

  const byMonth = Array.from(byMonthMap.entries()).map(([month, count]) => ({
    month,
    count,
  }));

  return {
    totalVisits,
    completedVisits,
    cancelledVisits,
    inProgressVisits,
    scheduledVisits,
    completionRate: Math.round(completionRate * 100) / 100,
    byStatus,
    byMonth,
  };
}

/**
 * گزارش مشتریان
 */
export async function getCustomerReport(filters: ReportFilters = {}): Promise<CustomerReport> {
  const customers = await listCustomerSummaries({
    marketerId: filters.marketerId,
    status: filters.status as any,
  });

  const totalCustomers = customers.total;
  const activeCustomers = customers.data.filter((c) => c.status === "ACTIVE").length;
  const inactiveCustomers = customers.data.filter((c) => c.status === "INACTIVE").length;

  const byStatus: Record<string, number> = {};
  customers.data.forEach((c) => {
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
  });

  // گروه‌بندی بر اساس شهر
  const byCityMap = new Map<string, number>();
  customers.data.forEach((c) => {
    const city = c.city || "نامشخص";
    const existing = byCityMap.get(city) || 0;
    byCityMap.set(city, existing + 1);
  });

  const byCity = Array.from(byCityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    byStatus,
    byCity,
  };
}

