/**
 * کلاینت تابان اس‌ام‌اس (IPPanel Edge API)
 * مستندات: https://ippanelcom.github.io/Edge-Document/docs/send/webservice
 */

interface SendSmsParams {
  phone: string; // شماره گیرنده (فرمت: 09123456789)
  message?: string; // متن پیامک (اختیاری - در صورت استفاده از Pattern نیاز نیست)
  patternCode?: string; // کد پترن SMS (اختیاری)
  patternValues?: Record<string, string>; // متغیرهای پترن (مثلاً {code: "1234"})
}

interface TabaanSmsResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  errorCode?: string;
}

interface TabaanApiResponse {
  data: {
    message_outbox_ids?: number[];
  } | null;
  meta: {
    status: boolean;
    message: string;
    message_code?: string;
    errors?: Record<string, string[]>;
  };
}

/**
 * تبدیل شماره موبایل به فرمت E.164 (مثلاً: +989123456789)
 * برای Pattern API باید به فرمت E.164 باشد
 */
function formatRecipientToE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("+98")) {
    return `+${digits.slice(1)}`;
  }

  if (digits.startsWith("98")) {
    return `+${digits}`;
  }

  if (digits.startsWith("09")) {
    return `+98${digits.slice(1)}`;
  }

  if (digits.startsWith("9") && digits.length === 10) {
    return `+98${digits}`;
  }

  // اگر قبلاً E.164 است، برگردان
  if (phone.startsWith("+")) {
    return phone;
  }

  // پیش‌فرض: فرض می‌کنیم شماره ایرانی است
  return `+98${digits}`;
}

/**
 * تبدیل شماره خط خدماتی به فرمت E.164 (مثلاً: +983000505)
 * برای Pattern API باید به فرمت E.164 باشد
 */
function formatSenderToE164(sender: string): string {
  const digits = sender.replace(/\D/g, "");

  if (digits.startsWith("+98")) {
    return `+${digits.slice(1)}`;
  }

  if (digits.startsWith("98")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+98${digits.slice(1)}`;
  }

  // اگر قبلاً E.164 است، برگردان
  if (sender.startsWith("+")) {
    return sender;
  }

  // پیش‌فرض: فرض می‌کنیم شماره ایرانی است
  return `+98${digits}`;
}

/**
 * تبدیل شماره موبایل به فرمت مورد قبول تابان (مثلاً: 09123456789)
 * برای webservice API (روش قدیمی)
 */
function formatRecipient(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("09")) {
    return digits;
  }

  if (digits.startsWith("+98")) {
    return `0${digits.slice(3)}`;
  }

  if (digits.startsWith("98")) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith("9") && digits.length === 10) {
    return `0${digits}`;
  }

  return digits;
}

/**
 * تبدیل شماره خط خدماتی به فرمت مورد قبول تابان (بدون پیشوند کشور)
 * برای webservice API (روش قدیمی)
 */
function formatSender(sender: string): string {
  const digits = sender.replace(/\D/g, "");

  if (digits.startsWith("+98")) {
    return digits.slice(3);
  }

  if (digits.startsWith("98")) {
    return digits.slice(2);
  }

  if (digits.startsWith("0")) {
    return digits.slice(1);
  }

  return digits;
}

/**
 * ارسال پیامک از طریق تابان اس‌ام‌اس
 */
export async function sendSms(params: SendSmsParams): Promise<TabaanSmsResponse> {
  const baseUrl = process.env.TABAN_SMS_BASE_URL;
  const apiKey = process.env.TABAN_SMS_API_KEY;
  const senderNumber = process.env.TABAN_SMS_SENDER_NUMBER;

  console.log("[Tabaan SMS] بررسی متغیرهای محیطی:", {
    hasBaseUrl: !!baseUrl,
    hasApiKey: !!apiKey,
    hasSenderNumber: !!senderNumber,
    baseUrl,
    senderNumber,
  });

  if (!baseUrl || !apiKey || !senderNumber) {
    const missing = [];
    if (!baseUrl) missing.push("TABAN_SMS_BASE_URL");
    if (!apiKey) missing.push("TABAN_SMS_API_KEY");
    if (!senderNumber) missing.push("TABAN_SMS_SENDER_NUMBER");
    throw new Error(`تنظیمات تابان اس‌ام‌اس کامل نیست. متغیرهای زیر موجود نیستند: ${missing.join(", ")}`);
  }

  // ساخت body درخواست - استفاده از Pattern یا Message
  let requestBody: Record<string, any>;
  
  if (params.patternCode && params.patternValues) {
    // استفاده از Pattern API
    // طبق مستندات IPPanel Edge API:
    // - sending_type باید "pattern" باشد
    // - فیلد "code" برای pattern_code استفاده می‌شود
    // - فیلد "params" برای pattern_values استفاده می‌شود
    // - فیلد "recipients" در سطح اصلی است (نه داخل params)
    // - فیلد "message" نباید ارسال شود
    // - شماره‌ها باید به فرمت E.164 باشند (مثلاً +989120000000)
    const recipient = formatRecipientToE164(params.phone);
    const fromNumber = formatSenderToE164(senderNumber);
    
    requestBody = {
      sending_type: "pattern",
      from_number: fromNumber,
      code: params.patternCode, // نام فیلد در API: "code" نه "pattern_code"
      recipients: [recipient], // recipients در سطح اصلی است و باید E.164 باشد
      params: params.patternValues, // pattern_values به عنوان "params" ارسال می‌شود
    };
    
    console.log("[Tabaan SMS] درخواست ارسال با Pattern:", {
      url: `${baseUrl}/api/send`,
      from: fromNumber,
      to: recipient,
      patternCode: params.patternCode,
      patternValues: params.patternValues,
      requestBody: JSON.stringify(requestBody, null, 2),
    });
  } else if (params.message) {
    // استفاده از Message مستقیم (روش قدیمی - webservice API)
    const recipient = formatRecipient(params.phone);
    const fromNumber = formatSender(senderNumber);
    
    requestBody = {
      sending_type: "webservice",
      from_number: fromNumber,
      message: params.message,
      params: {
        recipients: [recipient],
      },
    };
    
    console.log("[Tabaan SMS] درخواست ارسال با Message:", {
      url: `${baseUrl}/api/send`,
      from: fromNumber,
      to: recipient,
      messageLength: params.message.length,
    });
  } else {
    throw new Error("برای ارسال SMS باید یا message یا patternCode+patternValues مشخص شود.");
  }

  try {
    const response = await fetch(`${baseUrl}/api/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[Tabaan SMS] وضعیت پاسخ:", response.status, response.statusText);

    const data: TabaanApiResponse = await response.json();
    console.log("[Tabaan SMS] پاسخ API:", JSON.stringify(data, null, 2));

    // بررسی پاسخ موفق
    if (response.ok && data.meta?.status === true && data.data?.message_outbox_ids) {
      const messageId = data.data.message_outbox_ids[0]?.toString();
      return {
        success: true,
        messageId,
      };
    }

    // بررسی خطا
    const errorMessage = data.meta?.message || "خطا در ارسال پیامک";
    const errorCode = data.meta?.message_code || response.status.toString();

    return {
      success: false,
      error: errorMessage,
      errorCode,
    };
  } catch (error) {
    // خطاهای شبکه یا timeout
    const errorMessage = error instanceof Error ? error.message : "خطای شبکه در ارسال پیامک";
    console.error("[Tabaan SMS] ارسال ناموفق:", error);
    
    return {
      success: false,
      error: errorMessage,
      errorCode: "NETWORK_ERROR",
    };
  }
}

/**
 * ارسال پیامک OTP
 * از Pattern استفاده می‌کند اگر TABAN_SMS_PATTERN_CODE موجود باشد، در غیر این صورت از متن مستقیم
 */
export async function sendOtpSms(phone: string, code: string): Promise<TabaanSmsResponse> {
  const patternCode = process.env.TABAN_SMS_PATTERN_CODE;
  
  if (patternCode) {
    // استفاده از Pattern API
    // نام متغیر Pattern را از متغیر محیطی می‌خوانیم (پیش‌فرض: "verification-code")
    // اگر در پنل تابان متغیر دیگری است، باید TABAN_SMS_PATTERN_VAR را تنظیم کنید
    const patternVarName = process.env.TABAN_SMS_PATTERN_VAR || "verification-code";

    // برای جلوگیری از خطاهایی مثل «تکمیل گزینه params.OTP الزامی است»
    // همیشه کلید OTP را هم در params ست می‌کنیم، علاوه بر متغیر اصلی
    const patternValues: Record<string, string> = {
      [patternVarName]: code,
    };

    // اطمینان از وجود کلید OTP (برای Patternهایی که نام متغیرشان OTP است)
    if (patternVarName !== "OTP") {
      patternValues.OTP = code;
    }

    // برای سازگاری عقب‌رو، اگر نام دیگری است، کلید پیش‌فرض "verification-code" را هم ست می‌کنیم
    if (patternVarName !== "verification-code") {
      patternValues["verification-code"] = code;
    }

    console.log("[Tabaan SMS] استفاده از Pattern:", {
      patternCode,
      patternVarName,
      code,
      patternValues,
    });

    return sendSms({
      phone,
      patternCode,
      patternValues,
    });
  } else {
    // Fallback به روش قدیمی (متن مستقیم)
    const message = `کد ورود شما: ${code}\n\nاین کد تا 5 دقیقه معتبر است.`;
    
    return sendSms({
      phone,
      message,
    });
  }
}

