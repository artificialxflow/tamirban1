import PDFDocument from "pdfkit";
import type { Invoice, InvoiceLineItem } from "@/lib/types";

/**
 * تبدیل عدد به فرمت فارسی (با جداکننده هزارگان)
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat("fa-IR").format(num);
}

/**
 * تبدیل تاریخ به فرمت شمسی
 */
function formatJalaliDate(date: Date): string {
  const { toJalali } = require("jalaali-js");
  const jalali = toJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${jalali.jy}/${String(jalali.jm).padStart(2, "0")}/${String(jalali.jd).padStart(2, "0")}`;
}

/**
 * تولید PDF پیش‌فاکتور
 */
export async function generateInvoicePDF(invoice: Invoice, customerName?: string, marketerName?: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on("error", reject);

      // هدر پیش‌فاکتور
      doc.fontSize(24).font("Helvetica-Bold").text("پیش‌فاکتور", { align: "right" });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica").text(`شماره: ${invoice.meta?.invoiceNumber || invoice._id}`, { align: "right" });
      doc.moveDown(0.3);
      doc.text(`تاریخ صدور: ${formatJalaliDate(invoice.issuedAt)}`, { align: "right" });
      doc.text(`تاریخ سررسید: ${formatJalaliDate(invoice.dueAt)}`, { align: "right" });
      doc.moveDown(1);

      // اطلاعات مشتری
      doc.fontSize(14).font("Helvetica-Bold").text("مشتری:", { align: "right" });
      doc.moveDown(0.3);
      doc.fontSize(12).font("Helvetica").text(customerName || "مشتری ناشناس", { align: "right" });
      if (marketerName) {
        doc.moveDown(0.3);
        doc.text(`مسئول بازاریابی: ${marketerName}`, { align: "right" });
      }
      doc.moveDown(1);

      // جدول آیتم‌ها
      doc.fontSize(12).font("Helvetica-Bold");
      const tableTop = doc.y;
      const itemHeight = 20;
      const colWidths = {
        title: 200,
        quantity: 60,
        unit: 60,
        unitPrice: 80,
        discount: 70,
        tax: 70,
        total: 80,
      };

      // هدر جدول
      doc.text("شرح", 50, tableTop);
      doc.text("تعداد", 50 + colWidths.title, tableTop);
      doc.text("واحد", 50 + colWidths.title + colWidths.quantity, tableTop);
      doc.text("قیمت واحد", 50 + colWidths.title + colWidths.quantity + colWidths.unit, tableTop);
      doc.text("تخفیف", 50 + colWidths.title + colWidths.quantity + colWidths.unit + colWidths.unitPrice, tableTop);
      doc.text("مالیات", 50 + colWidths.title + colWidths.quantity + colWidths.unit + colWidths.unitPrice + colWidths.discount, tableTop);
      doc.text("جمع", 50 + colWidths.title + colWidths.quantity + colWidths.unit + colWidths.unitPrice + colWidths.discount + colWidths.tax, tableTop);

      // خط جداکننده
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      doc.moveDown(0.5);

      // آیتم‌ها
      doc.fontSize(10).font("Helvetica");
      let currentY = doc.y;
      invoice.items.forEach((item, index) => {
        if (currentY > 700) {
          // صفحه جدید
          doc.addPage();
          currentY = 50;
        }

        const itemTotal = item.unitPrice * item.quantity - (item.discount || 0);
        const itemTax = itemTotal * ((item.taxRate || 0) / 100);
        const itemFinalTotal = itemTotal + itemTax;

        doc.text(item.title.substring(0, 30), 50, currentY);
        doc.text(String(item.quantity), 50 + colWidths.title, currentY);
        doc.text(item.unit, 50 + colWidths.title + colWidths.quantity, currentY);
        doc.text(formatNumber(item.unitPrice), 50 + colWidths.title + colWidths.quantity + colWidths.unit, currentY);
        doc.text(formatNumber(item.discount || 0), 50 + colWidths.title + colWidths.quantity + colWidths.unit + colWidths.unitPrice, currentY);
        doc.text(formatNumber(itemTax), 50 + colWidths.title + colWidths.quantity + colWidths.unit + colWidths.unitPrice + colWidths.discount, currentY);
        doc.text(formatNumber(itemFinalTotal), 50 + colWidths.title + colWidths.quantity + colWidths.unit + colWidths.unitPrice + colWidths.discount + colWidths.tax, currentY);

        currentY += itemHeight;
        doc.y = currentY;
      });

      doc.moveDown(1);

      // خلاصه مبالغ
      const summaryY = doc.y;
      doc.fontSize(12).font("Helvetica");
      doc.text("جمع کل:", 400, summaryY);
      doc.text(formatNumber(invoice.subtotal), 500, summaryY);
      doc.moveDown(0.5);

      if (invoice.discountTotal && invoice.discountTotal > 0) {
        doc.text("تخفیف:", 400, doc.y);
        doc.text(formatNumber(invoice.discountTotal), 500, doc.y);
        doc.moveDown(0.5);
      }

      doc.text("مالیات:", 400, doc.y);
      doc.text(formatNumber(invoice.taxTotal), 500, doc.y);
      doc.moveDown(0.5);

      doc.fontSize(14).font("Helvetica-Bold");
      doc.text("مبلغ قابل پرداخت:", 400, doc.y);
      doc.text(formatNumber(invoice.grandTotal), 500, doc.y);
      doc.moveDown(1);

      // وضعیت پرداخت
      const statusLabels: Record<string, string> = {
        DRAFT: "پیش‌نویس",
        SENT: "ارسال شده",
        PAID: "پرداخت شد",
        OVERDUE: "معوق",
        CANCELLED: "لغو شد",
      };
      doc.fontSize(12).font("Helvetica");
      doc.text(`وضعیت: ${statusLabels[invoice.status] || invoice.status}`, { align: "right" });
      if (invoice.paidAt) {
        doc.text(`تاریخ پرداخت: ${formatJalaliDate(invoice.paidAt)}`, { align: "right" });
      }
      if (invoice.paymentReference) {
        doc.text(`شماره مرجع پرداخت: ${invoice.paymentReference}`, { align: "right" });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

