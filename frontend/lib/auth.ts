import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            email: credentials.email,
            tenantId: "tenant_123",
          };
        }
        return null;
      },
    }),
  ],

  session: { strategy: "jwt" },

  // 👇 This is the missing piece in most cases
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.tenantId = (user as any).tenantId;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).tenantId = token.tenantId;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};
