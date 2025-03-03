import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string,
      role: string,
    } & DefaultSession["user"];
  }

  
  interface User {
    id: string;
    role: string; // Ensure role is a string, not nullable
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Ensure role is a string, not nullable
  }
}