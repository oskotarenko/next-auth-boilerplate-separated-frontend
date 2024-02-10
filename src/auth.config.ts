import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { LoginScheme } from './schemes';
import { getUserByEmail } from './actions/user.actions';

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFiels = LoginScheme.safeParse(credentials);
        if (!validatedFiels.success) return null;

        const { email, password } = validatedFiels.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const isPasswordsMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordsMatch) return null;

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
