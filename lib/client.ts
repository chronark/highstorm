export type HighstormEvent = {
    /**
     * Unix timestamp with millisecond precision of when the event happened
     *
     * @default Date.now()
     */
    time?: number
    /**
     * The title of the event
     */
    event: string
    /**
     * Optional content
     */
    content?: string

    /**
     * Optional key-value metadata
     */
    metadata?: Record<string, string | number | boolean | null>
}

export async function highstorm(
    channel: string,
    event: HighstormEvent,
    opts?: {
        /**
         * Highstorm base url
         * 
         * @default `https://highstorm.vercel.app/api`
         */
        url?: string


        /**
         * Highstorm api token
         * 
         * @default HIGHSTORM_TOKEN from the environment 
         */
        token?: string
    }
): Promise<{ id: string | null }> {
    const token = opts?.token ?? process.env.HIGHSTORM_TOKEN
    if (!token) {
        throw new Error(
            "Either provide a token, or set the `HIGHSTORM_TOKEN` env variable"
        )
    }
    try {

        const baseUrl = opts?.url ?? "https://highstorm.vercel.app/api"
        const res = await fetch(
            `${baseUrl}/v1/events/${channel}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(event),
            }
        )
        if (!res.ok) {
            throw new Error(`Unable to ingest event: ${await res.text()}`)
        }
        return await res.json()

    } catch (err) {
        console.error(err)
        return { id: null }
    }

}
