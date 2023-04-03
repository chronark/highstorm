"use client"

import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type Props = {
    channelId: string
}
export const DeleteChannelButton: React.FC<Props> = ({ channelId }) => {
    const [loading, setLoading] = useState(false)

    const { toast } = useToast()
    const router = useRouter()



    return (
        <Button variant="destructive" disabled={loading} onClick={async () => {


            setLoading(true)
            await trpc.channel.delete.mutate({ channelId }).then(() => {
                toast({ title: "Channel deleted" })
                router.refresh()
            }).catch(err => {
                toast({ title: "Error deleting channel", description: err?.message ?? "Unknown error", variant: "destructive" })
            }).finally(() => {
                setLoading(false)
            })

        }}>{loading ? <Loading /> : "Delete"}</Button>
    )
}