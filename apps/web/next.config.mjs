/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  rewrites: () => [
    {
      source: "/docs/:path*",
      destination: "https://highstorm-docs.vercel.app/docs/:path*",
      basePath: false,
    },
    {
      source: "/:path*",
      has: [
        {
          type: "host",
          value: "api.highstorm.vercel.app",
        },
      ],
      destination: "/api/:path*",
    },
  ],
  experimental: {
    esmExternals: "loose",
    appDir: true,
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
};

export default nextConfig;
