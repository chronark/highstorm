"use client"

import React, { PropsWithRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

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
import { FileClock } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { z } from "zod"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type Props = {
  teamSlug: string
  channelName: string
  channelId: string


}


const formValidation = z.object({
  cron: z.string(),
  slackUrl: z.string().url(),
  timeframe: z.number().positive()

})

export const CreateReportButton = React.forwardRef<any, Props>(({ channelId, channelName, teamSlug }, ref) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()


  const {
    register, handleSubmit, formState, watch } = useForm<z.infer<typeof formValidation>>({
      resolver: zodResolver(formValidation),
      defaultValues: {
        cron: "0 0 * * *",
        slackUrl: "",
        timeframe: 24
      }
    })



  const onSubmit = handleSubmit(async (data) => {
    setLoading(true)
    await trpc.report.createSlack.mutate({
      channelId,
      cron: data.cron,
      slackUrl: data.slackUrl,
      timeframe: data.timeframe
    }).then(() => {
      setOpen(false)
      router.push(`/${teamSlug}/${channelName}/reports`)
    }).catch(err => {
      console.error(err)
      toast({ title: "Error", description: "Unable to create report", variant: "destructive" })

    })
    setLoading(false)
  })

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

          <FileClock className="w-4 h-4 mr-2" />
          <span>Create Report</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create Report</DialogTitle>
            <DialogDescription>
              Create an automated report that will be sent to your Slack channel
            </DialogDescription>
            <div className="py-2">

              <Label htmlFor="cron">CRON</Label>
              <Input
                type="text"
                {...register("cron")}
              />
              {formState.errors.cron ? <p className="text-red-500">{formState.errors.cron.message}</p> : null}

            </div>
            <div className="py-2">

              <Label htmlFor="slackUrl">Slack Webhook URL</Label>

              <Input type="url" {...register("slackUrl")} />
              {formState.errors.slackUrl ? <p className="text-red-500">{formState.errors.slackUrl.message}</p> : null}
            </div>
            <div className="py-2">
              <Label htmlFor="timeframe">Include data from the last {watch("cron")} hours</Label>

              <Input type="number" {...register("timeframe")} />
              {formState.errors.timeframe ? <p className="text-red-500">{formState.errors.timeframe.message}</p> : null}

            </div>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit">{loading ? <Loading /> : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >

  )
}
)

CreateReportButton.displayName = "CreateReportButton"