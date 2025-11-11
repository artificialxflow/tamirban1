import { getCustomersCollection, getUsersCollection, getVisitsCollection } from "@/lib/db";
import type { VisitStatus } from "@/lib/types";

const timeFormatter = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" });
const dateFormatter = new Intl.DateTimeFormat("fa-IR", { month: "2-digit", day: "2-digit" });

const STATUS_LABEL: Record<VisitStatus, string> = {
  SCHEDULED: "زمان‌بندی شده",
  IN_PROGRESS: "در حال انجام",
  COMPLETED: "تکمیل شد",
  CANCELLED: "لغو شد",
};

const STATUS_TONE: Record<VisitStatus, "info" | "success" | "warning"> = {
  SCHEDULED: "info",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  CANCELLED: "warning",
};

export type VisitSummaryCard = {
  title: string;
  value: string;
  helper: string;
  helperColor: string;
};

export type VisitReminder = {
  id: string;
  title: string;
  deadlineLabel: string;
  owner?: string;
};

export type VisitScheduleItem = {
  id: string;
  timeLabel: string;
  customer: string;
  marketer?: string;
  category?: string;
  statusLabel: string;
  statusTone: "info" | "success" | "warning";
  notes?: string;
  followUpLabel?: string;
};

export type VisitsOverview = {
  summaryCards: VisitSummaryCard[];
  reminders: VisitReminder[];
  schedule: VisitScheduleItem[];
};

function resolveHelperColor(tone: "info" | "success" | "warning" | "neutral") {
  switch (tone) {
    case "success":
      return "text-emerald-500";
    case "warning":
      return "text-orange-500";
    case "info":
      return "text-slate-500";
    default:
      return "text-slate-500";
  }
}

function minutesBetween(start?: Date | null, end?: Date | null) {
  if (!start || !end) return null;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}

export async function getVisitsOverview(): Promise<VisitsOverview> {
  const visitsCollection = await getVisitsCollection();
  const customersCollection = await getCustomersCollection();
  const usersCollection = await getUsersCollection();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const [todayVisits, completedTodayCount, cancelledTodayCount, allTodayVisitsCount, averageDurations] = await Promise.all([
    visitsCollection
      .find({ scheduledAt: { $gte: startOfDay, $lt: endOfDay } })
      .sort({ scheduledAt: 1 })
      .limit(20)
      .toArray(),
    visitsCollection.countDocuments({ status: "COMPLETED", completedAt: { $gte: startOfDay, $lt: endOfDay } }),
    visitsCollection.countDocuments({ status: "CANCELLED", scheduledAt: { $gte: startOfDay, $lt: endOfDay } }),
    visitsCollection.countDocuments({ scheduledAt: { $gte: startOfDay, $lt: endOfDay } }),
    visitsCollection
      .aggregate([
        { $match: { status: "COMPLETED", completedAt: { $exists: true }, scheduledAt: { $exists: true } } },
        {
          $project: {
            duration: {
              $divide: [{ $subtract: ["$completedAt", "$scheduledAt"] }, 60000],
            },
          },
        },
        { $group: { _id: null, avg: { $avg: "$duration" } } },
      ])
      .toArray(),
  ]);

  const customerIds = Array.from(new Set(todayVisits.map((visit) => visit.customerId).filter(Boolean)));
  const marketerIds = Array.from(new Set(todayVisits.map((visit) => visit.marketerId).filter(Boolean)));

  const [customerDocs, marketerDocs] = await Promise.all([
    customerIds.length
      ? customersCollection.find({ _id: { $in: customerIds } }).project({ displayName: 1 }).toArray()
      : Promise.resolve([]),
    marketerIds.length
      ? usersCollection.find({ _id: { $in: marketerIds } }).project({ fullName: 1 }).toArray()
      : Promise.resolve([]),
  ]);

  const customerNameMap = new Map(customerDocs.map((doc) => [doc._id, doc.displayName]));
  const marketerNameMap = new Map(marketerDocs.map((doc) => [doc._id, doc.fullName]));

  const averageDurationMinutes = averageDurations[0]?.avg ?? null;

  const summaryCards: VisitSummaryCard[] = [
    {
      title: "ویزیت‌های امروز",
      value: allTodayVisitsCount ? allTodayVisitsCount.toString() : "۰",
      helper: allTodayVisitsCount ? `${allTodayVisitsCount} ویزیت در تقویم امروز ثبت شده است.` : "برای امروز ویزیتی ثبت نشده است.",
      helperColor: resolveHelperColor(allTodayVisitsCount > 0 ? "info" : "neutral"),
    },
    {
      title: "ویزیت‌های تکمیل‌شده",
      value: completedTodayCount ? completedTodayCount.toString() : "۰",
      helper: completedTodayCount ? "گزارش‌ها به‌صورت خودکار در CRM ثبت شد." : "برای امروز گزارشی ثبت نشده است.",
      helperColor: resolveHelperColor(completedTodayCount > 0 ? "success" : "neutral"),
    },
    {
      title: "ویزیت‌های لغوشده",
      value: cancelledTodayCount ? cancelledTodayCount.toString() : "۰",
      helper: cancelledTodayCount ? "نیازمند پیگیری تیم بازاریابی." : "لغوی گزارش نشده است.",
      helperColor: resolveHelperColor(cancelledTodayCount > 0 ? "warning" : "neutral"),
    },
    {
      title: "میانگین زمان ویزیت",
      value: averageDurationMinutes ? `${Math.round(averageDurationMinutes)} دقیقه` : "نامشخص",
      helper: averageDurationMinutes ? "بر اساس ویزیت‌های تکمیل‌شده.": "برای محاسبه نیاز به ویزیت تکمیل‌شده است.",
      helperColor: resolveHelperColor(averageDurationMinutes ? "success" : "neutral"),
    },
  ];

  const schedule: VisitScheduleItem[] = todayVisits.map((visit) => ({
    id: visit._id,
    timeLabel: timeFormatter.format(visit.scheduledAt),
    customer: customerNameMap.get(visit.customerId) ?? "مشتری ناشناس",
    marketer: visit.marketerId ? marketerNameMap.get(visit.marketerId) ?? "بازاریاب نامشخص" : undefined,
    category: visit.topics?.[0],
    statusLabel: STATUS_LABEL[visit.status],
    statusTone: STATUS_TONE[visit.status],
    notes: visit.notes,
    followUpLabel: visit.followUpAction,
  }));

  const futureVisits = await visitsCollection
    .find({ scheduledAt: { $gte: endOfDay } })
    .sort({ scheduledAt: 1 })
    .limit(5)
    .toArray();

  const reminders: VisitReminder[] = futureVisits.map((visit) => ({
    id: visit._id,
    title: `پیگیری ویزیت ${customerNameMap.get(visit.customerId) ?? "مشتری"}`,
    deadlineLabel: `سررسید ${dateFormatter.format(visit.scheduledAt)}`,
    owner: visit.marketerId ? marketerNameMap.get(visit.marketerId) : undefined,
  }));

  if (!reminders.length) {
    reminders.push({
      id: "reminder-empty",
      title: "ثبت یادآوری جدید",
      deadlineLabel: "برای مدیریت بهتر برنامه، یادآوری ایجاد کنید.",
    });
  }

  return { summaryCards, reminders, schedule };
}
