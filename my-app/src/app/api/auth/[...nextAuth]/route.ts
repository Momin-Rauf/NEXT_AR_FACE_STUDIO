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
      async authorize(credentials: any,req): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            email: credentials.identifier,
          });
          console.log(user);
          
          console.log(credentials);
          if (!user) {
            throw new Error("No user found");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
 


          console.log("password",passwordMatch);
          if (passwordMatch) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error) {
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("call1",user);
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        console.log("call2",token);
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
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};

// Create the authentication handler
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST methods
export { handler as GET, handler as POST };
