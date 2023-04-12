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
    {
      source: '/docs',
      destination: 'https://highstorm.mintlify.com/docs',
    },
    {
      source: '/docs/:match*',
      destination: 'https://highstorm.mintlify.com/docs/:match*',
    },
  ],
  experimental: {
    esmExternals: "loose",
    appDir: true,
  },
};

export default nextConfig;
