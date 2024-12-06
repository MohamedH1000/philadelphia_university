import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        universityNo: { label: "universityNo", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.universityNo || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { uniNumber: credentials.universityNo },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user; // Make sure to return the user object
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT-based sessions
    maxAge: 60 * 60 * 24 * 7, // Session expiry duration (7 days)
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in your environment
  callbacks: {
    async jwt({ token, user }) {
      // When the user signs in, we add the universityNo to the JWT token
      if (user) {
        token.universityNo = user.uniNumber; // Add universityNo to the JWT token
      }
      return token;
    },
    async session({ session, token }) {
      // Add the universityNo to the session object
      if (token?.universityNo) {
        session.user.universityNo = token.universityNo;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
