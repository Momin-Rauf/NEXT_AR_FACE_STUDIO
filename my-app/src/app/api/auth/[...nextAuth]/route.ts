import NextAuth from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";

// NextAuth options setup
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            email: credentials.identifier,
          });

          if (!user) {
            throw new Error("No user found");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (passwordMatch) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error: any) {
          throw new Error(`Authorization failed: ${error.message}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          isVerified: token.isVerified,
          username: token.username,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/SignIn",
  },
  session: {
    strategy: "jwt", // Ensure it's "jwt"
  },
  secret: process.env.NEXT_AUTH_SECRET,
};

// Create the authentication handler
const handler = NextAuth(authOptions);

// Export the handler as default for both GET and POST methods
export { handler as GET, handler as POST };
