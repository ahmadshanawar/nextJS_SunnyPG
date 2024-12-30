import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eujcvmmqfezfvgbomlpo.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
    // depricated
    // domains: ["skerufgdotqrnhnezgxo.supabase.co"], // Add your Supabase domain here
  },
};

export default nextConfig;
