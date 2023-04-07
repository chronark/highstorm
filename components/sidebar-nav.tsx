"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem, SidebarNavItem } from "types/nav"

import { cn } from "@/lib/utils"

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()

  return items.length ? (
    <div className="w-full">
      {items.map((item) => (
        <div key={item.title} className={cn("pb-6")}>
          <h4 className="px-2 py-1 mb-1 text-xs font-semibold rounded-md text-neutral-900 dark:text-white">
            {item.title}
          </h4>

          <DocsSidebarNavItems items={item.items ?? []} />
        </div>
      ))}
    </div>
  ) : null
}

type DocsSidebarNavItemsProps = {
  items: SidebarNavItem[]
}

export const DocsSidebarNavItems: React.FC<DocsSidebarNavItemsProps> = ({ items }) => {

  return <div className="grid grid-flow-row text-sm auto-rows-max">
    {items.map((item) => (
      <div>
        {item.href ? (
          <Link
            key={item.href}
            href={item.href}

            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <Item item={item} />
          </Link>


        ) : (
          <Item key={item.title} item={item} />
        )}
        {item.items?.map((subitem) =>
          item.href ? (
            <Link
              key={subitem.href}
              href={subitem.href!}
            >
              <SubItem item={subitem} />
            </Link>
          ) : (
            <SubItem key={subitem.href} item={subitem} />
          )

        )}
      </div>
    ))}

  </div >

}


const Item: React.FC<{ item: NavItem }> = ({ item }) => {
  const pathname = usePathname()

  return (
    <span className={cn("flex justify-between gap-2 py-1 ml-2 px-3 text-sm transition border-l border-neutral-200 text-zinc-900 dark:text-white", {
      "cursor-not-allowed opacity-60": item.disabled,
      "bg-neutral-100 dark:bg-neutral-800 border-emerald-400": pathname === item.href,
    }
    )}> <span className="truncate">{item.title}</span></ span>
  )


}


const SubItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "border-l border-neutral-200 flex justify-between gap-2 py-1 pl-5 pr-3 text-sm transition ml-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
        item.disabled && "cursor-not-allowed opacity-60",
        {
          "bg-neutral-100 dark:bg-neutral-800 border-emerald-400": pathname === item.href,
        }
      )}
    >
      <span className="truncate">{item.title}</span>
      <span className="font-mono text-[0.625rem] font-semibold leading-6 text-zinc-400 dark:text-zinc-500">{item.label}</span>
    </div>)

}