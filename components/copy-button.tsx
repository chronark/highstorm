"use client"

import * as React from "react"
import { DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu"

// import { NpmCommands } from "types/unist"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  src?: string
}

async function copyToClipboardWithMeta(
  value: string,
  meta?: Record<string, unknown>
) {
  navigator.clipboard.writeText(value)
}

export function CopyButton({
  value,
  className,
  src,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <button
      className={cn(
        "relative z-20 inline-flex h-8 items-center justify-center rounded-md border-neutral-200 p-2 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-100 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-800",
        className
      )}
      onClick={() => {
        copyToClipboardWithMeta(value, {
          component: src,
        })
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <Icons.check className="w-4 h-4" />
      ) : (
        <Icons.copy className="w-4 h-4" />
      )}
    </button>
  )
}

interface CopyWithClassNamesProps extends DropdownMenuTriggerProps {
  value: string
  classNames: string
  className: string
}

export function CopyWithClassNames({
  value,
  classNames,
  className,
  ...props
}: CopyWithClassNamesProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const copyToClipboard = React.useCallback((value: string) => {
    copyToClipboardWithMeta(value)
    setHasCopied(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "relative z-20 inline-flex h-8 items-center justify-center rounded-md p-2 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-100 focus:outline-none dark:text-neutral-100 dark:hover:bg-neutral-800",
          className
        )}
        {...props}
      >
        {hasCopied ? (
          <Icons.check className="w-4 h-4" />
        ) : (
          <Icons.copy className="w-4 h-4" />
        )}
        <span className="sr-only">Copy</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => copyToClipboard(value)}>
          <Icons.react className="w-4 h-4 mr-2" />
          <span>Component</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyToClipboard(classNames)}>
          <Icons.tailwind className="w-4 h-4 mr-2" />
          <span>Classname</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
