


export class InMemoryCache<TValue> {
    public readonly ttl: number
    private readonly map: Map<string, { exp: number, value: TValue }>
    constructor(opts: { ttl: number }) {
        this.ttl = opts.ttl
        this.map = new Map()

        setInterval(() => {
            const now = Date.now()
            this.map.forEach(({ exp }, key) => {
                if (exp < now) {
                    this.map.delete(key)
                }
            })
        }, 60_000)
    }


    public set(key: string, value: TValue) {
        this.map.set(key, { exp: Date.now() + this.ttl, value })
    }

    public get(key: string): TValue | null {
        const data = this.map.get(key)
        if (!data) {
            return null
        }
        if (data.exp < Date.now()) {
            this.map.delete(key)
            return null
        }
        return data.value
    }



}