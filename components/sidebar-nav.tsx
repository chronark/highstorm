"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarNavItem } from "types/nav"

import { cn } from "@/lib/utils"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-6")}>
          <h4 className="px-2 py-1 mb-1 text-sm font-semibold rounded-md">
            {item.title}
          </h4>
          {item?.items?.length && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="text-sm grid grid-flow-row auto-rows-max">
      {items.map((item, index) =>
        item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex w-full items-center rounded-md py-1.5 px-2 hover:bg-neutral-50 dark:hover:bg-neutral-800",
              item.disabled && "cursor-not-allowed opacity-60",
              {
                "bg-neutral-100 dark:bg-neutral-800": pathname === item.href,
              }
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:text-neutral-900">
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className="flex items-center w-full p-2 cursor-not-allowed rounded-md opacity-60 hover:underline"
          >
            {item.title}
          </span>
        )
      )}
    </div>
  ) : null
}
