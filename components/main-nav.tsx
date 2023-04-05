import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

export function MainNav() {
  return (
    <div className="hidden md:flex">
      <Link href="/" className="flex items-center mr-6 space-x-2">
        <Icons.logo className="w-6 h-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center text-sm font-medium space-x-6">
        <Link href="/docs">Documentation</Link>
        <Link href="/docs/primitives/accordion">Components</Link>
        <Link href="/figma">Figma</Link>
        <Link href={siteConfig.links.github}>GitHub</Link>
      </nav>
    </div>
  )
}
