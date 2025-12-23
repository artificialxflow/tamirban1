import * as XLSX from "xlsx";

/**
 * Export داده‌ها به Excel
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  headers: Record<keyof T, string>,
  _filename: string,
): Buffer {
  // ساخت آرایه برای Excel
  const worksheetData: unknown[][] = [];

  // Header row
  const headerRow = Object.keys(headers).map((key) => headers[key as keyof T]);
  worksheetData.push(headerRow);

  // Data rows
  data.forEach((row) => {
    const dataRow = Object.keys(headers).map((key) => {
      const value = row[key];
      // تبدیل تاریخ به رشته
      if (value instanceof Date) {
        return value.toLocaleDateString("fa-IR");
      }
      // تبدیل آرایه به رشته
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return value ?? "";
    });
    worksheetData.push(dataRow);
  });

  // ایجاد workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // تنظیم عرض ستون‌ها
  const columnWidths = Object.keys(headers).map(() => ({ wch: 20 }));
  worksheet["!cols"] = columnWidths;

  // اضافه کردن worksheet به workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // تبدیل به buffer
  const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return excelBuffer;
}

/**
 * Export گزارش مشتریان به Excel
 */
export function exportCustomersToExcel(customers: Array<{
  code: string;
  name: string;
  phones?: string[];
  primaryPhone?: string;
  city?: string;
  status: string;
  marketer?: string;
  lastVisitAt?: Date | null;
  monthlyRevenue?: number;
  tags?: string[];
}>) {
  const headers = {
    code: "کد مشتری",
    name: "نام مشتری",
    phones: "شماره‌های تماس",
    primaryPhone: "شماره اصلی",
    city: "شهر",
    status: "وضعیت",
    marketer: "بازاریاب",
    lastVisitAt: "آخرین ویزیت",
    monthlyRevenue: "درآمد ماهانه",
    tags: "برچسب‌ها",
  };

  const data = customers.map((customer) => ({
    code: customer.code,
    name: customer.name,
    phones: customer.phones?.join(", ") || customer.primaryPhone || "",
    primaryPhone: customer.primaryPhone || "",
    city: customer.city || "",
    status: customer.status,
    marketer: customer.marketer || "",
    lastVisitAt: customer.lastVisitAt || null,
    monthlyRevenue: customer.monthlyRevenue || 0,
    tags: customer.tags?.join(", ") || "",
  }));

  return exportToExcel(data, headers, "customers");
}

/**
 * Export گزارش فاکتورها به Excel
 */
export function exportInvoicesToExcel(invoices: Array<{
  invoiceNumber: string;
  customerName: string;
  marketerName?: string;
  status: string;
  issuedAt: Date;
  dueAt: Date;
  grandTotal: number;
  currency: string;
  paidAt?: Date;
}>) {
  const headers = {
    invoiceNumber: "شماره فاکتور",
    customerName: "مشتری",
    marketerName: "بازاریاب",
    status: "وضعیت",
    issuedAt: "تاریخ صدور",
    dueAt: "تاریخ سررسید",
    grandTotal: "مبلغ کل",
    currency: "واحد",
    paidAt: "تاریخ پرداخت",
  };

  const statusLabels: Record<string, string> = {
    DRAFT: "پیش‌نویس",
    SENT: "ارسال شده",
    PAID: "پرداخت شد",
    OVERDUE: "معوق",
    CANCELLED: "لغو شد",
  };

  const numberFormatter = new Intl.NumberFormat("fa-IR");

  const data = invoices.map((invoice) => ({
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    marketerName: invoice.marketerName || "",
    status: statusLabels[invoice.status] || invoice.status,
    issuedAt: invoice.issuedAt,
    dueAt: invoice.dueAt,
    grandTotal: numberFormatter.format(invoice.grandTotal),
    currency: invoice.currency === "IRR" ? "تومان" : "دلار",
    paidAt: invoice.paidAt || null,
  }));

  return exportToExcel(data, headers, "invoices");
}

/**
 * Export گزارش ویزیت‌ها به Excel
 */
export function exportVisitsToExcel(visits: Array<{
  customerName?: string;
  marketerName?: string;
  status: string;
  scheduledAt: Date;
  completedAt?: Date | null;
  visitType?: string;
  topics?: string[];
}>) {
  const headers = {
    customerName: "مشتری",
    marketerName: "بازاریاب",
    status: "وضعیت",
    scheduledAt: "تاریخ برنامه‌ریزی",
    completedAt: "تاریخ تکمیل",
    visitType: "نوع ویزیت",
    topics: "موضوعات",
  };

  const statusLabels: Record<string, string> = {
    SCHEDULED: "زمان‌بندی شده",
    IN_PROGRESS: "در حال انجام",
    COMPLETED: "تکمیل شد",
    CANCELLED: "لغو شد",
  };

  const data = visits.map((visit) => ({
    customerName: visit.customerName || "",
    marketerName: visit.marketerName || "",
    status: statusLabels[visit.status] || visit.status,
    scheduledAt: visit.scheduledAt,
    completedAt: visit.completedAt || null,
    visitType: visit.visitType === "IN_PERSON" ? "حضوری" : visit.visitType === "PHONE" ? "تلفنی" : "",
    topics: visit.topics?.join(", ") || "",
  }));

  return exportToExcel(data, headers, "visits");
}

/**
 * Export گزارش عملکرد بازاریاب‌ها به Excel
 */
export function exportMarketerPerformanceToExcel(reports: Array<{
  marketerName: string;
  totalVisits: number;
  completedVisits: number;
  completionRate: number;
  totalInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalCustomers: number;
  newCustomers: number;
}>) {
  const headers = {
    marketerName: "نام بازاریاب",
    totalVisits: "تعداد کل ویزیت‌ها",
    completedVisits: "ویزیت‌های تکمیل شده",
    completionRate: "نرخ تکمیل (%)",
    totalInvoices: "تعداد کل فاکتورها",
    paidInvoices: "فاکتورهای پرداخت شده",
    totalRevenue: "درآمد کل",
    paidRevenue: "درآمد پرداخت شده",
    pendingRevenue: "درآمد در انتظار",
    totalCustomers: "تعداد کل مشتریان",
    newCustomers: "مشتریان جدید",
  };

  const data = reports.map((report) => ({
    marketerName: report.marketerName,
    totalVisits: report.totalVisits,
    completedVisits: report.completedVisits,
    completionRate: `${report.completionRate}%`,
    totalInvoices: report.totalInvoices,
    paidInvoices: report.paidInvoices,
    totalRevenue: report.totalRevenue,
    paidRevenue: report.paidRevenue,
    pendingRevenue: report.pendingRevenue,
    totalCustomers: report.totalCustomers,
    newCustomers: report.newCustomers,
  }));

  return exportToExcel(data, headers, "marketer-performance");
}

