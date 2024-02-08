"use server"

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsScheme } from "@/schemes";
import { z } from "zod";

export async function updateSettings(values: z.infer<typeof SettingsScheme>) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: "Unauthorized" };

  if (user.isOAuth) {
    values.email = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use" }
    }

    await db.user.update({
      where: { id: dbUser.id },
      data: { ...values }
    });

    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: "Verification email sent" }
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values }
  })

  return { success: "Settings updated" };
}