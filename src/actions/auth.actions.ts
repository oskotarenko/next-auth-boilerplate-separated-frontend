"use server";

import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { signIn, signOut } from "../auth";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { generatePasswordResetToken, generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGGED_IN_REDIRECT } from "@/routes";
import { LoginScheme, NewPasswordScheme, RegisterScheme, ResetScheme } from "@/schemes";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import * as z from "zod";
import { sendPasswordResetEmail, sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export async function login(values: z.infer<typeof LoginScheme>, callbackUrl: string | null) {
  const validatedField = LoginScheme.safeParse(values);

  if (!validatedField.success) return { error: "invalid fields" };

  const { email, password, code } = validatedField.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials" }
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid code" };
      }

      const isExpired = new Date() > new Date(twoFactorToken.expires);
      if (isExpired) {
        return { error: "Code expired" };
      }

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials",
      {
        email,
        password,
        redirectTo: callbackUrl || DEFAULT_LOGGED_IN_REDIRECT
      },
    )
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentails" };
        case "AuthorizedCallbackError":
          return { error: "Account verification error occured" }
        default:
          return { error: "Something went wrong" };
      }
    } else {
      throw error;
    }
  }
}

export async function register(values: z.infer<typeof RegisterScheme>) {
  const validatedFields = RegisterScheme.safeParse(values);

  if (!validatedFields.success) return { error: "invalid fields" };

  const { email, password, name } = validatedFields.data;

  const isEmailTaken = !!await getUserByEmail(email);
  if (isEmailTaken) return { error: "Email already in use" };

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      name,
      password: hashPassword
    }
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent" };
}

export async function newVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken)
    return { error: "Token does not exist" }

  const isExpired = new Date() > new Date(existingToken.expires);
  if (isExpired) return { error: "Token has expired" }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "User does not exist" }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      email: existingUser.email,
      emailVerified: new Date(),
    }
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });

  return { success: "Email verified" };
}

export async function reset(values: z.infer<typeof ResetScheme>) {
  const validatedFields = ResetScheme.safeParse(values);

  if (!validatedFields.success) return { error: "invalid email" };

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "Email not found" };

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset email sent" };
}

export async function newPassword(values: z.infer<typeof NewPasswordScheme>, token: string) {
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken)
    return { error: "Token does not exist" }

  const isExpired = new Date() > new Date(existingToken.expires);
  if (isExpired) return { error: "Token has expired" }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "User does not exist" }

  const verifiedFields = NewPasswordScheme.safeParse(values);
  if (!verifiedFields.success) return { error: "Invalid password" };

  const { password, confirmPassword } = verifiedFields.data;
  if (password !== confirmPassword) return { error: "Passwords must be equal" };

  const hashPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashPassword }
  });

  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Password updated" };
}

// Allows to do something on user logout and also can be use in client components
export async function logout() {
  await signOut()
}

