"use client"

import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { Hash } from "lucide-react"

import { Button } from "@/components/ui/button"

type Props = {
  href: string
  channelName: string | null
}

export const ChannelLink: React.FC<Props> = ({ href, channelName }) => {
  const isActive = channelName === useSelectedLayoutSegment()

  return (
    <Link href={href}>
      <Button
        variant={isActive ? "subtle" : "ghost"}
        size="sm"
        className="justify-start w-full font-normal"
      >
        <Hash className="w-4 h-4 mr-2" />
        {channelName}
      </Button>
    </Link>
  )
}
