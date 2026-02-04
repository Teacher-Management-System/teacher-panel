import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/:path*`, // The actual backend API URL
      },
    ];
  },
};

export default nextConfig;
