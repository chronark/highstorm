import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";

import { Analytics } from "@/components/analytics";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import "tailwindcss/tailwind.css";
import { ToastProvider } from "../toastProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Highstorm",
    template: "%s | Highstorm",
  },
  description: "Open Source Event Monitoring",
  openGraph: {
    title: "Highstorm",
    description: "Open Source Event Monitoring",
    url: "https://highstorm.app",
    siteName: "highstorm.app",
    images: [
      {
        url: "https://highstorm.app/og.png",
        width: 2322,
        height: 1306,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Highstorm",
    card: "summary_large_image",
    description: "Open Source Event Monitoring",
    image: "https://highstorm.app/og.png",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});
interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
        className={[inter.variable, calSans.variable].join(" ")}
      >
        <head />
        <body className="min-h-screen antialiased">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ToastProvider>{children}</ToastProvider>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
      <Analytics />
    </>
  );
}
