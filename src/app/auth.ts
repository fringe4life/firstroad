import { PrismaAdapter } from "@auth/prisma-adapter";
import { verify } from "@node-rs/argon2";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(191),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Add retry mechanism for database connection issues
          let user = null;
          let retries = 3;
          
          while (retries > 0) {
            try {
              user = await prisma.user.findUnique({
                where: { email },
              });
              break; // Success, exit retry loop
            } catch (dbError) {
              retries--;
              if (retries === 0) {
                throw dbError;
              }
              // Wait a bit before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          if (!user || !user.password) {
            return null;
          }

          const validPassword = await verify(user.password, password);

          if (!validPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
