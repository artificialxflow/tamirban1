import { ObjectId } from "mongodb";
import { z } from "zod";
import { interactionsRepository } from "@/lib/repositories/interactions.repository";
import type { CustomerInteraction, InteractionType } from "@/lib/types";

const createInteractionSchema = z.object({
  customerId: z.string().min(1, "شناسه مشتری الزامی است"),
  marketerId: z.string().optional(),
  type: z.enum(["CALL", "VISIT", "SMS", "EMAIL", "NOTE"]),
  description: z.string().optional(),
  duration: z.number().optional(),
  relatedVisitId: z.string().optional(),
  relatedInvoiceId: z.string().optional(),
});

export type InteractionSummary = {
  id: string;
  customerId: string;
  marketerId?: string;
  type: InteractionType;
  description?: string;
  duration?: number;
  relatedVisitId?: string;
  relatedInvoiceId?: string;
  createdAt: Date;
};

export async function listCustomerInteractions(
  customerId: string,
): Promise<InteractionSummary[]> {
  const interactions = await interactionsRepository.findByCustomerId(customerId);
  
  return interactions.map((interaction) => ({
    id: interaction._id,
    customerId: interaction.customerId,
    marketerId: interaction.marketerId,
    type: interaction.type,
    description: interaction.description,
    duration: interaction.duration,
    relatedVisitId: interaction.relatedVisitId,
    relatedInvoiceId: interaction.relatedInvoiceId,
    createdAt: interaction.createdAt,
  }));
}

export async function createInteraction(input: unknown): Promise<CustomerInteraction> {
  const payload = createInteractionSchema.parse(input);
  
  const now = new Date();
  const document: CustomerInteraction = {
    _id: new ObjectId().toHexString(),
    customerId: payload.customerId,
    marketerId: payload.marketerId,
    type: payload.type,
    description: payload.description,
    duration: payload.duration,
    relatedVisitId: payload.relatedVisitId,
    relatedInvoiceId: payload.relatedInvoiceId,
    createdAt: now,
    createdBy: "system",
    updatedAt: now,
    updatedBy: "system",
  };

  await interactionsRepository.insertOne(document);
  return document;
}

/**
 * ثبت خودکار interaction برای ویزیت
 */
export async function createVisitInteraction(
  visitId: string,
  customerId: string,
  marketerId: string,
  description?: string,
): Promise<void> {
  await createInteraction({
    customerId,
    marketerId,
    type: "VISIT",
    description: description || "ویزیت انجام شد",
    relatedVisitId: visitId,
  });
}

/**
 * ثبت خودکار interaction برای تماس
 */
export async function createCallInteraction(
  customerId: string,
  marketerId: string,
  duration?: number,
  description?: string,
): Promise<void> {
  await createInteraction({
    customerId,
    marketerId,
    type: "CALL",
    description: description || "تماس تلفنی",
    duration,
  });
}

/**
 * ثبت خودکار interaction برای پیامک
 */
export async function createSmsInteraction(
  customerId: string,
  marketerId: string,
  description?: string,
): Promise<void> {
  await createInteraction({
    customerId,
    marketerId,
    type: "SMS",
    description: description || "ارسال پیامک",
  });
}

/**
 * ثبت یادداشت دستی
 */
export async function createNoteInteraction(
  customerId: string,
  marketerId: string,
  description: string,
): Promise<void> {
  await createInteraction({
    customerId,
    marketerId,
    type: "NOTE",
    description,
  });
}

