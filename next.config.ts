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
      {
        source: "/broadcasting/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcasting/:path*`,
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
              "accelerometer=(), camera=(), gyroscope=(), magnetometer=(), microphone=(), payment=*, usb=()",
          },
        ],
      },
    ];
  },

  typescript: {
    // !! WARNING: This will skip type checking during build !!
    ignoreBuildErrors: true,
  },
  experimental: {
    mcpServer: false,
    webpackBuildWorker: true,
    turbopackFileSystemCacheForBuild: true,
  },
};

export default nextConfig;
