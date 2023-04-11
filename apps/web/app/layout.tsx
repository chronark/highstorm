import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";

import { Analytics } from "@/components/analytics";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import "tailwindcss/tailwind.css";
import { ToastProvider } from "../toastProvider";
// import { Metadata } from "next";

export const metadata = {
  title: {
    default: "Highstorm",
    template: "%s | Highstorm",
  },
  description: "Open Source Event Monitoring",
  // openGraph: {
  //   title: 'Lee Robinson',
  //   description: 'Developer, writer, and creator.',
  //   url: 'https://leerob.io',
  //   siteName: 'Lee Robinson',
  //   images: [
  //     {
  //       url: 'https://leerob.io/og.jpg',
  //       width: 1920,
  //       height: 1080,
  //     },
  //   ],
  //   locale: 'en-US',
  //   type: 'website',
  // },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     'max-video-preview': -1,
  //     'max-image-preview': 'large',
  //     'max-snippet': -1,
  //   },
  // },
  // twitter: {
  //   title: 'Highstorm',
  //   card: 'summary_large_image',
  // },
  icons: {
    shortcut: "/favicon.svg",
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
        <body className="min-h-screen antialiased bg-neutral-950 text-neutral-900 bg-gradient-to-tl dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 dark:text-neutral-50">
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
