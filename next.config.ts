import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f003.backblazeb2.com",
      },
    ],
    domains: [
      'www.google.com',
      'images.unsplash.com',
      'plus.unsplash.com'
    ],
  },
}

export default nextConfig
