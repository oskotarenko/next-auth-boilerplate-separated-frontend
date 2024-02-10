import NextAuth from 'next-auth';
import { UserRole } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { db } from '@/lib/db';
import authConfig from './auth.config';
import { getUserById, updateSettings } from './actions/user.actions';
import {
  deleteTwoFactorConfirmation,
  getAccount,
  getTwoFactorConfirmation,
} from './actions/auth.actions';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await updateSettings(user.id, {
        emailVerified: new Date().toISOString(),
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email werification
      if (account?.type !== 'credentials') return true;

      // Prevent sign in without email verification for credentials provider
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmation(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false;

        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccount(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.picture = existingUser.image;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        // ? The operator "as" is used there because auth.js currently does not allow to typificate token clearly
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isOAuth = !!token.isOAuth;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
  },
  ...authConfig,
});
