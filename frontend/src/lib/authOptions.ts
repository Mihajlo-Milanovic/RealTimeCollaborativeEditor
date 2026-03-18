import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import { getRequestSingle } from "@/app/api/serverRequests/methods";

const appInstance = process.env.APP_INSTANCE || "3000";
const isProd = process.env.NODE_ENV === "production";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials !== "object" ||
          !("email" in credentials) ||
          !("password" in credentials)
        ) {
          return null;
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const userData = await getRequestSingle(
          `users/email/${encodeURIComponent(email)}`
        );

        if (!userData.ok) {
          console.log("userData status:", userData.status);
          return null;
        }

        const payload = await userData.json();
        const user = payload?.data;
        console.log(user)

        const passwordHash = await getRequestSingle(
            `users/${encodeURIComponent(user.id)}/password`
        );

        const passpayload = await passwordHash.json();
        const pass = passpayload.data;


        if (!pass) return null;

        console.log(pass + " "+ password);
        const passwordsMatch = await bcrypt.compare(password, pass);
        if (!passwordsMatch) return null;

        //if (!user.verified) return null;

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  // cookies: {
  //   sessionToken: {
  //     name: `${isProd ? "__Secure-" : ""}next-auth.session-token.${appInstance}`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: isProd,
  //     },
  //   },
  //   callbackUrl: {
  //     name: `${isProd ? "__Secure-" : ""}next-auth.callback-url.${appInstance}`,
  //     options: {
  //       sameSite: "lax",
  //       path: "/",
  //       secure: isProd,
  //     },
  //   },
  //   csrfToken: {
  //     name: `${isProd ? "__Host-" : ""}next-auth.csrf-token.${appInstance}`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: isProd,
  //     },
  //   },
  // },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id || (user as any).id || token.id;
        token.username = (user as any).username || token.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).username = token.username as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/",
  },
};