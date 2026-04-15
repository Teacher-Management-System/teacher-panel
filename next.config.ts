import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

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
