import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions, SessionStrategy } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        
        if (
        !credentials ||
        typeof credentials !== 'object' ||
        !('email' in credentials) ||
        !('password' in credentials)
        ) {
            throw new Error("Invalid credentials");
        }
        else {
            try {
            const { email, password } = credentials as { email: string; password: string };
            await connectMongoDB();
            const user = await User.findOne({ email });

            if (!user) {
                return null;
            }

            const passwordsMatch = await bcrypt.compare(password, user.password);

            if (!passwordsMatch) {
                return null;
            }

            return user;
            } catch (error) {
            console.log("Error: ", error);
            }
       }
    },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };