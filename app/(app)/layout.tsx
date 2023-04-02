import { Inter as FontSans } from "@next/font/google"

import "@/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

interface RootLayoutProps {
    children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {

    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>

    )
}