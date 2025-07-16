import { connectMongoDB } from "../lib/mongodb";
import User from "../models/user";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions, User } from "next-auth";

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
        //await connectMongoDB();
        //const user = await User.findOne({ email });

        const userData = await fetch("http://localhost:5000" + "/user/getUserByEmail" + `?email=${email}`);
        const user = await userData.json();
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        if (!user.verified)
          throw new Error("Email is not verified!");

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, 
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
