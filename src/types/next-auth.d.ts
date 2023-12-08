import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    token?: string;
    user?: User;
  }
  interface User {
    email?: string;
    fname?: string;
    lname?: string;
    phone?: string;
    is_host?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    token: string;
    user?: User;
  }
}