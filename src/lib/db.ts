import { PrismaClient } from '@prisma/client';

// ! The database and Prisma ORM are used only for processing OAuth authorization

// ? Global var declared for using this instead of const db = new PrismaClient() is to avoid creating PrismaClient multiple times during dev mode
// ? (global is not affected by hot-reload)
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
