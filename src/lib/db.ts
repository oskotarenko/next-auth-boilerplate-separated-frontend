import { PrismaClient } from "@prisma/client";

// ? cause to using this instead of const db = new PrismaClient() is to avoid creating PrismaClient multiple times during devmode dur to hot-reload
// ? (global is not affected by hot-reload)
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;