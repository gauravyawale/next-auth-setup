import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

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
        /*
          Here we can fetch details from backend and check the user details, based on that we can allow user to sign in
         */
        try {
          const { data } = await axios.post(
            "http://localhost:3000/api/userauth",
            { email: credentials.email, password: credentials.password },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (data?.success) {
            return {
              name: data.data.name,
              email: data.data.email,
              id: data.data.id,
              token: data.data.token,
              expires_in: data.data.expiresIn,
            };
          } else {
            return null;
          }
        } catch (error) {
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
    async jwt({ token, user, account }) {
      //account and user object will be there for the first time when user will sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          expiresIn: account.expires_in,
          user,
        };
      }
      //check the token is valid or not
      // @ts-ignore
      const expiresIn = Date.parse(token.expiresIn);
      if (Date.now() < expiresIn) {
        return token;
      }
      return {
        ...token,
        error: "The token has expired",
      };
    },
    async signIn({ user, account }: any) {
      /*
      On successful response from providers, this callback method will execute first.
      1. if user performing noraml log in we can just set the details and proceed
      2. If user loggin in using other providers such as google, linkedin etc, and we want to customize those details as per our requirement, then we need to perform backend call as we will receive user information from these providers, so will take it forward it to backend and in response will get customized token.
      */

      let customizedToken: string = "";
      let expiresIn: string = "";
      if (account.provider === "credentials") {
        customizedToken = user.token;
        expiresIn = user?.expires_in;
      } else {
        const response: any = await axios.post("your api", "data", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        customizedToken = response.data.token;
        expiresIn = response.data.expires_in;
      }
      if (customizedToken && expiresIn) {
        account.access_token = customizedToken;
        account.expires_in = expiresIn;
        return true;
      }
      return false;
    },
    async session({ session, token, user }: any) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};
const Auth = async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, options);
};
export default Auth;
