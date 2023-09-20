import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
// import { User } from "@prisma/client";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "promptopia",
          value: "promptopia",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "promptopia",
          value: "promptopia",
        },
      },
      async authorize(credentials, req) {
        try {
          if (
            credentials?.password === "promptopia" &&
            credentials.username === "promptopia"
          ) {
            const user = await db.user.findFirst({
              where: {
                name: "promptopia",
              },
            });

            if (!user) {
              await db.user.create({
                data: {
                  name: "promptopia",
                  email: "promptopia@example.com",
                  accounts: {
                    create: [
                      {
                        type: "credentials",
                        provider: "promptopia",
                        providerAccountId: "99999",
                      },
                    ],
                  },
                },
              });
            }
            return user;
          }

          return null;
        } catch (error) {
          throw new Error(error as string);
        }
      },
    }),

    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // console.log("[user]", user);
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  // debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
