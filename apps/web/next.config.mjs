/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  rewrites: () => [
    {
      source: "/:path*",
      destination: "/:path*",
    },
    {
      source: "/docs",
      destination: "https://highstorm-docs.vercel.app/docs",
    },
    {
      source: "/docs/:match*",
      destination: "https://highstorm-docs.vercel.app/docs/:match*",
    },
  ],
  experimental: {
    esmExternals: "loose",
    appDir: true,
  },
};

export default nextConfig;
