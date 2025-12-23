import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/utils/geocoding";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json(
        {
          success: false,
          message: "مختصات (lat و lng) الزامی است.",
          code: "MISSING_PARAMS",
        },
        { status: 400 },
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        {
          success: false,
          message: "مختصات نامعتبر است.",
          code: "INVALID_COORDS",
        },
        { status: 400 },
      );
    }

    const result = await reverseGeocode(latitude, longitude);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "امکان دریافت آدرس برای این مختصات وجود ندارد.",
          code: "GEOCODING_FAILED",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[Geocoding API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "خطا در دریافت آدرس",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

