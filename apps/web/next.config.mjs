const _DOCS_URL = process.env.DOCS_URL ?? "https://docs.highstorm.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  rewrites: () => [
    {
      source: "/:path*",
      has: [
        {
          type: "host",
          value: "api.highstorm.app",
        },
      ],
      destination: "/api/:path*",
    },
  ],
  experimental: {
    esmExternals: "loose",
    appDir: true,
  },
};

export default nextConfig;
