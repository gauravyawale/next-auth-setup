import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any, _req) {
        if (
          credentials.email === "testuser@test.com" &&
          credentials.password === "Testuser@123"
        ) {
          return { name: "Test User", email: credentials.email, id: "1" };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  debug: false,
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
    async signIn({ user, account }: any) {
      //we can fetch api's here to customise the details as per requirement. 
      if (account) return true;
      return false;
    },
    async session({ session, token, user }: any) {
      return session;
    },
  },
};

const Auth = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, options);
};

export default Auth;
