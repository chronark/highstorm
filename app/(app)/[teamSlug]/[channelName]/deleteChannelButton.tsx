"use client"

import React, { PropsWithRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

import { trpc } from "@/lib/trpc"
import { CopyButton } from "@/components/copy-button"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { FileClock, Trash } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"

type Props = {
  channelId: string

}


// React.forwardRef((props, forwardedRef) => {
//   const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } = props;


export const DeleteChannelButton = React.forwardRef<any, Props>(({ channelId }, ref) => {

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()



  return (


    < Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>

        <DropdownMenuItem ref={ref} onSelect={(e) => {
          // This magically allows multiple dialogs in a dropdown menu, no idea why
          e.preventDefault()

        }}>

          <Trash className="w-4 h-4 mr-2" />
          <span>Delete Channel</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete
            this channel and remove your data from our servers.
          </DialogDescription>

        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              await trpc.channel.delete
                .mutate({ channelId })
                .then(() => {
                  toast({ title: "Channel deleted" })
                  router.refresh()
                })
                .catch((err) => {
                  toast({
                    title: "Error deleting channel",
                    description: err?.message ?? "Unknown error",
                    variant: "destructive",
                  })
                })
                .finally(() => {
                  setLoading(false)
                })
            }}
          >
            {loading ? <Loading /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >

  )
}
)

DeleteChannelButton.displayName="DeleteChannelButton"