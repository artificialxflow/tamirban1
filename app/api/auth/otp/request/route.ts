import { NextResponse } from "next/server";

import { requestOtp } from "@/lib/services/otp.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = body?.phone as string;

    const result = await requestOtp(phone);

    return NextResponse.json({ success: true, code: result.code });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطای غیرمنتظره رخ داد";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

