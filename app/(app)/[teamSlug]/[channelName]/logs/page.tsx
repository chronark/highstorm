import {  redirect } from "next/navigation"
import {  db } from "@/prisma/db"

import { getSession } from "@/lib/auth"
import { Feed } from "@/components/feed";

export default async function IndexPage(props: {
    params: { teamSlug: string; channelName: string }
}) {
    const { session } = await getSession()

    if (!session) {
        return redirect("/auth/sign-in")
    }

    const channel = await db.channel.findFirst({
        where: {
            AND: {
                team: {
                    slug: props.params.teamSlug,
                },
                name: props.params.channelName,
            },
        },
        include: {
            events: true,
            team: true,
        },
    })
    if (!channel) {
        return redirect(`/${props.params.teamSlug}`)
    }


    return (
        <div>

           
            <div className="mt-8">

                <Feed events={channel.events} />
            </div>
        </div>
    )
}
