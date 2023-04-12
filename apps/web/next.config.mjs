const DOCS_URL = process.env.DOCS_URL ?? "https://docs.highstorm.app"


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
    {
      source: '/docs',
      destination: `${DOCS_URL}/docs`,
    },
    {
      source: '/docs/:path*',
      destination: `${DOCS_URL}/docs/:path*`,
    },
  ],
  experimental: {
    esmExternals: "loose",
    appDir: true,
  },
};

export default nextConfig;
