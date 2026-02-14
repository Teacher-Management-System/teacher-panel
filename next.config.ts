import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    domains: [
      "5oclock-dev.s3.ca-central-1.amazonaws.com",
      "d34slj4rg1xft5.cloudfront.net",
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/:path*`,
      },
    ];
  },

  // ✅ ADD THIS PART
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value:
              "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=*, usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
