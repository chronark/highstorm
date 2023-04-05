import { getEventCount } from "@/lib/tinybird";
import { db } from "@/prisma/db";
import { verifySignature } from "@upstash/qstash/nextjs"
import { NextApiRequest, NextApiResponse } from "next";



async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const reportId = req.query.reportId as string



        const report = await db.report.findUnique({
            where: {
                id: reportId,
            },
            include: {
                channel: {
                    include: {
                        team: true
                    }
                },
                slackDestinations: true
            }

        })
        if (!report) {
            console.error(`Incoming qstash trigger for ${reportId}, but it does not exist`)
            return res.status(404)
        }
        const now = Date.now()
        const currentWindowStart = now - report.timeframe * 60 * 60 * 1000
        const lastWindowStart = currentWindowStart - report.timeframe * 60 * 60 * 1000

        const [currentWindow, previousWindow] = await Promise.all([
            getEventCount({ channelId: report.channel.id, start: currentWindowStart, end: now }),
            getEventCount({ channelId: report.channel.id, start: lastWindowStart, end: currentWindowStart }),
        ])


        const current = currentWindow.data.at(0)?.count ?? 0
        const previous = previousWindow.data.at(0)?.count ?? 0
        const change = current - previous


        await Promise.all(report.slackDestinations.map(({ url }) => fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "blocks": [
                        {
                            "type": "header",
                            "text": {
                                "type": "plain_text",
                                "text": `${report.channel.name} - Summary`,
                                "emoji": false
                            }
                        },
                        {
                            "type": "section",
                            "fields": [
                                {
                                    "type": "mrkdwn",
                                    "text": `*New Events:*\n${Intl.NumberFormat("en-US", { notation: "compact" }).format(current)}`
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": `*Change:*\n${Intl.NumberFormat("en-US", { notation: "compact", signDisplay: "exceptZero" }).format(change)}`
                                }
                            ]
                        },
                        {
                            "type": "section",
                            "fields": [
                                {
                                    "type": "mrkdwn",
                                    "text": `*Covered:*\n${report.timeframe}h`
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": `<https://highstorm.vercel.app/${report.channel.team.slug}/${report.channel.name}/reports|Settings>`
                                }
                            ]
                        },

                    ]
                }
            )
        })
        ))


        return res.json({ report })


    } catch (err) {
        console.error(err)
        return res.status(500)
    } finally {
        res.end()
    }
}





export default process.env.NODE_ENV === "production" ? verifySignature(handler) : handler