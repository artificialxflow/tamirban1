import { NextResponse } from "next/server";

import { verifyOtp } from "@/lib/services/otp.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const phone = body?.phone as string;
    const code = body?.code as string;

    const result = await verifyOtp(phone, code);

    return NextResponse.json({ success: true, token: result.token, user: result.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "خطای غیرمنتظره رخ داد";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
