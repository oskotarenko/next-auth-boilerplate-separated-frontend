import { db } from "@/lib/db";

export async function getAccountByUserId(userId: string) {
  try {
    const account = db.account.findFirst({
      where: { userId }
    });

    return account;
  } catch {
    return null;
  }
}