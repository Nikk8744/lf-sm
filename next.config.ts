import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "www.pexels.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "js.stripe.com/v3/",
        pathname: "/**"
      }
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  
};

export default nextConfig;
