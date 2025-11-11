import bcrypt from "bcryptjs";

import { incrementAttempt, upsertOtpAttempt, getOtpAttempt, clearOtpAttempt } from "@/lib/repositories/otp-attempts.repository";
import { createUserWithPhone, findUserByPhone } from "@/lib/repositories/users.repository";
import { issueJwt } from "@/lib/utils/jwt";
import { normalizePhone } from "@/lib/utils/phone";

const SALT_ROUNDS = 8;
const FIXED_CODE = "0000";

export async function requestOtp(phone: string) {
  const normalizedPhone = normalizePhone(phone);

  const code = FIXED_CODE;
  const codeHash = await bcrypt.hash(code, SALT_ROUNDS);
  await upsertOtpAttempt(normalizedPhone, codeHash);

  return { success: true, code }; // فقط برای تست برگردانده می‌شود
}

export async function verifyOtp(phone: string, code: string) {
  if (!phone || !code) {
    throw new Error("شماره موبایل و کد الزامی است.");
  }

  const normalizedPhone = normalizePhone(phone);

  const attemptRecord = await getOtpAttempt(normalizedPhone);
  if (!attemptRecord) {
    throw new Error("کدی برای این شماره ارسال نشده است.");
  }

  if (attemptRecord.expiresAt && attemptRecord.expiresAt < new Date()) {
    throw new Error("کد منقضی شده است.");
  }

  await incrementAttempt(normalizedPhone);

  const isValid = await bcrypt.compare(code, attemptRecord.codeHash);
  if (!isValid) {
    throw new Error("کد وارد شده صحیح نیست.");
  }

  let user = await findUserByPhone(normalizedPhone);
  if (!user) {
    user = await createUserWithPhone(normalizedPhone);
  }

  await clearOtpAttempt(normalizedPhone);

  const token = await issueJwt({ sub: user._id, phone: user.mobile, type: "access" });

  return { token, user };
}

