import { db } from "@/prisma/db"
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import slugify from "slugify"

import { env } from "@/lib/env"
import { newId } from "@/lib/id"
import { highstorm } from "@/lib/client"

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_OAUTH_ID,
      clientSecret: env.GITHUB_OAUTH_SECRET,
    }),
  ],

  adapter: {
    createUser: async (data) => {
      const name = data.name || data.email.split("@")[0]
      const slug = slugify(name, { lower: true, strict: true })
      const user = await db.user.create({
        data: {
          id: newId("user"),
          email: data.email,
          image: data.image,
          name,
          teams: {
            create: {
              role: "OWNER",
              team: {
                create: {
                  id: newId("team"),
                  name,
                  slug,
                  plan: "FREE",
                  apikeys: {
                    create: {
                      id: newId("apiKey"),
                      name: "default",
                      keyHash: newId("apiKey"),
                    },
                  },
                },
              },
            },
          },
        },
      })
      return user
    },
    getUser: (id) => db.user.findUnique({ where: { id } }),
    getUserByEmail: (email) => db.user.findUnique({ where: { email } }),
    async getUserByAccount(provider_providerAccountId) {
      const account = await db.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      })
      return account?.user ?? null
    },
    updateUser: ({ id, ...data }) =>
      db.user.update({
        where: { id },
        data: {
          ...data,
          name: data.name || undefined,
          email: data.email || undefined,
        },
      }),
    deleteUser: (id) => db.user.delete({ where: { id } }),
    linkAccount: async (data) => {
      await db.account.create({ data })
    },
    unlinkAccount: async (provider_providerAccountId) => {
      db.account.delete({
        where: { provider_providerAccountId },
      })
    },
    async getSessionAndUser(sessionToken) {
      const session = await db.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      if (!session) {
        return null
      }
      return {
        user: session.user,
        session,
      }
    },
    createSession: async (data) => {
      return await db.session.create({
        data,
      })
    },
    updateSession: (data) =>
      db.session.update({ where: { sessionToken: data.sessionToken }, data }),
    deleteSession: async (sessionToken) => {
      await db.session.delete({ where: { sessionToken } })
    },
    async createVerificationToken(data) {
      return await db.verificationToken.create({ data })
    },
    async useVerificationToken(identifier_token) {
      return await db.verificationToken.delete({
        where: { identifier_token },
      })
    },
  },
  session: {
    strategy: "jwt",
    generateSessionToken: () => newId("session"),
  },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT ? "highstorm.vercel.app" : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (!token.sub) {
        throw new Error("unable to enrich user session, sub is undefined")
      }
      // @ts-ignore
      session.user.id = token.sub

      return session
    },
  },
  events: {
    createUser: async ({ user }) => {
      await highstorm("user.signup", {
        event: `${user.name} has signed up`,
        metadata: {
          userId: user.id
        }
      })
    },

    signIn: async ({ user }) => {
      await highstorm("user.signin", {
        event: `${user.name} has signed in`,
        metadata: {
          userId: user.id
        }
      })
    },
    signOut: async ({ token }) => {
      highstorm("user.signout", {
        event: `${token.name} has signed out`,
        metadata: {
          userId: token.sub ?? null
        }
      })
    },
    updateUser: async ({ user }) => {
      highstorm("user.update", {
        event: `${user.name} has changed their email`,
        metadata: {
          userId: user.id
        }
      })
    },
  }
}

export default NextAuth(authOptions)
