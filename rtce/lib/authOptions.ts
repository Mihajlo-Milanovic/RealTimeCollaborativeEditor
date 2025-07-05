import { connectMongoDB } from "../lib/mongodb";
import User from "../models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials !== "object" ||
          !("email" in credentials) ||
          !("password" in credentials)
        ) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials as { email: string; password: string };
        await connectMongoDB();
        const user = await User.findOne({ email });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return user;
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
