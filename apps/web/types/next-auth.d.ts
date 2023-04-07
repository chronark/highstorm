import { Session } from "next-auth";

declare module "next-auth" {
  interface JWT {
    jti: string;
  }
  interface Session {
    id: string;
    apiToken: string;
    user: {
      id: string;
    };
  }
}
