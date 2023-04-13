export type HighstormEvent = {
  /**
   * Unix timestamp with millisecond precision of when the event happened
   *
   * @default Date.now()
   */
  time?: number;
  /**
   * The title of the event
   */
  event: string;
  /**
   * Optional content
   */
  content?: string;

  /**
   * Optional key-value metadata
   */
  metadata?: Record<string, string | number | boolean | null>;
};

export type HighstormOptions = {
  /**
   * @default https://api.highstorm.app
   */
  baseUrl?: string;

  /**
   * The highstorm api token
   */
  token: string;
};

export class Highstorm {
  public readonly baseUrl: string;
  private readonly token: string;

  constructor(opts: HighstormOptions) {
    this.baseUrl = opts.baseUrl ?? "https://api.highstorm.app";
    /**
     * Even though typescript should prevent this, some people still pass undefined or empty strings
     */
    if (!opts.token) {
      throw new Error("Highstorm token must not be empty");
    }
    this.token = opts.token;
  }

  public async ingest(channel: string, event: HighstormEvent): Promise<{ id: string | null }> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/events/${channel}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(event),
      });
      if (!res.ok) {
        throw new Error(`Unable to ingest event: ${await res.text()}`);
      }
      return await res.json();
    } catch (err) {
      console.error(err);
      return { id: null };
    }
  }
}

export default (channel: string, event: HighstormEvent) =>
  new Highstorm({ token: process.env.HIGHSTORM_TOKEN! }).ingest(channel, event);
