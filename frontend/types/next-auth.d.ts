import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      tenantId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    tenantId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email?: string;
    tenantId: string;
  }
}
