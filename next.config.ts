import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // پشتیبانی از Service Worker
  async rewrites() {
    return [
      {
        source: "/sw.js",
        destination: "/sw.js",
      },
    ];
  },
  async headers() {
    return [
      {
        // اعمال CORS برای همه API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NODE_ENV === "production"
              ? process.env.NEXT_PUBLIC_SITE_URL || "https://tamirban1.ir"
              : "*", // در development همه دامنه‌ها مجاز هستند
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Request-ID",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
