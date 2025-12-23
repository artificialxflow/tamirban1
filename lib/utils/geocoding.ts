/**
 * Reverse Geocoding - تبدیل مختصات به آدرس با استفاده از API نشان
 */

export interface ReverseGeocodeResult {
  formattedAddress: string;
  province?: string;
  city?: string;
  district?: string;
  street?: string;
}

/**
 * تبدیل مختصات به آدرس با استفاده از API نشان
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
  apiKey?: string,
): Promise<ReverseGeocodeResult | null> {
  const key = apiKey || process.env.NEXT_PUBLIC_NESHAN_API_KEY;
  
  if (!key) {
    console.error("[Geocoding] Neshan API key not found");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.neshan.org/v1/reverse?lat=${latitude}&lng=${longitude}`,
      {
        method: "GET",
        headers: {
          "Api-Key": key,
        },
      },
    );

    if (!response.ok) {
      console.error("[Geocoding] Reverse geocoding failed:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.status === "OK" && data.formatted_address) {
      return {
        formattedAddress: data.formatted_address,
        province: data.components?.province,
        city: data.components?.city,
        district: data.components?.district,
        street: data.components?.street,
      };
    }

    return null;
  } catch (error) {
    console.error("[Geocoding] Error in reverse geocoding:", error);
    return null;
  }
}

