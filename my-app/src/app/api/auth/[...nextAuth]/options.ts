// import type { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "../../../model/User";


// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "Credentials",
//       name: "Credentials",
//       credentials: {
//         identifier: { label: "Email", type: "text", placeholder: "jsmith" }, // Use identifier instead of username
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any): Promise<any> { // Specify the type for credentials
//         await dbConnect();
//         console.log('hellooo')
//         try {
//           const user = await UserModel.findOne({
//             $or: [
//               { email: credentials.identifier },
//               { username: credentials.identifier },
//             ],
//           });

//           if (!user) {
//             throw new Error("No user found");
//           }
//           if (!user.isVerified) {
//             throw new Error("Please verify your account");
//           }

//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );
//           if (isPasswordCorrect) {
//             console.log(user);
//             return user;
//           } else {
//             throw new Error("Incorrect password");
//           }
//         } catch {
//           // You may want to log or handle the error here
//           throw new Error("Authorization failed");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString();
//         token.isVerified = user.isVerified;
//         token.username = user.username;
//       }
//       return token;
//     },
//     async session({ session, token }) { // Remove user if not used
//       if (token) {
//         session.user._id = token._id;
//         session.user.isVerified = token.isVerified;
//         session.user.username = token.username;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/SignIn",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXT_AUTH_SECRET,
// };
