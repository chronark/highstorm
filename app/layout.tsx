import { Inter } from "@next/font/google"
import LocalFont from "@next/font/local"

import { cn } from "@/lib/utils"
import { Analytics } from "@/components/analytics"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import "tailwindcss/tailwind.css"
import { ToastProvider } from "./toastProvider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
})
interface RootLayoutProps {
  children: React.ReactNode
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
        <body className="min-h-screen bg-white  text-neutral-900 antialiased dark:bg-neutral-900 dark:text-neutral-50">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToastProvider>

              {children}

            </ToastProvider>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
      <Analytics />
    </>
  )
}
