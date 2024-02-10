'use server';

import { signIn, signOut } from '../auth';
import { DEFAULT_LOGGED_IN_REDIRECT } from '@/routes';
import {
  LoginScheme,
  NewPasswordScheme,
  RegisterScheme,
  ResetScheme,
} from '@/schemes';
import { AuthError } from 'next-auth';
import { fetchService } from '@/lib/fetch.service';
import {
  LoginResponse,
  NewPasswordResponse,
  NewVerificationResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from '@/types/actions/auth.response';
import { Account, TwoFactorConfirmation } from '@prisma/client';
import { ApiMessageResponse } from '@/types/actions/api.response';
import { z } from 'zod';

export async function login(
  values: z.infer<typeof LoginScheme>,
  callbackUrl: string | null
) {
  const validatedField = LoginScheme.safeParse(values);
  if (!validatedField.success) return { error: 'invalid fields' };

  const { email, password, code } = validatedField.data;

  const response = await fetchService.post<LoginResponse>('/auth/login', {
    email,
    code,
  });
  if (response.success) {
    return { success: response.success };
  }

  if (response.error) {
    return { error: response.error };
  }

  if (response.twoFactor) {
    return { twoFactor: response.twoFactor };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGGED_IN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentails' };
        case 'AuthorizedCallbackError':
          return { error: 'Account verification error occured' };
        default:
          return { error: 'Something went wrong' };
      }
    } else {
      throw error;
    }
  }
}

export async function register(
  values: z.infer<typeof RegisterScheme>
): Promise<RegisterResponse> {
  const validatedFields = RegisterScheme.safeParse(values);
  if (!validatedFields.success) return { error: 'invalid fields' };

  const response = await fetchService.post<RegisterResponse>(
    '/auth/register',
    validatedFields.data
  );
  return response;
}

// Allows to do something on user logout and also can be use in client components
export async function logout(): Promise<void> {
  await signOut();
}

export async function newVerification(
  token: string
): Promise<NewVerificationResponse> {
  const response = await fetchService.post<NewVerificationResponse>(
    '/auth/new-verification',
    { token }
  );
  return response;
}

export async function resetPassword(
  values: z.infer<typeof ResetScheme>
): Promise<ResetPasswordResponse> {
  const validatedFields = ResetScheme.safeParse(values);
  if (!validatedFields.success) return { error: 'invalid email' };

  const response = await fetchService.post<ResetPasswordResponse>(
    '/auth/reset-password',
    validatedFields.data
  );
  return response;
}

export async function newPassword(
  values: z.infer<typeof NewPasswordScheme>,
  token: string
): Promise<NewPasswordResponse> {
  const verifiedFields = NewPasswordScheme.safeParse(values);
  if (!verifiedFields.success) return { error: 'Invalid data provided' };

  const { password, confirmPassword } = verifiedFields.data;
  if (password !== confirmPassword) return { error: 'Passwords must be equal' };

  const response = await fetchService.post<NewPasswordResponse>(
    '/auth/new-password',
    { token, password }
  );
  return response;
}

export async function getTwoFactorConfirmation(
  userId: string
): Promise<TwoFactorConfirmation | null> {
  try {
    const twoFactorConfirmation =
      await fetchService.get<TwoFactorConfirmation | null>(
        `/auth/two-factor-confirmation/${userId}`
      );
    return twoFactorConfirmation;
  } catch {
    return null;
  }
}

export async function deleteTwoFactorConfirmation(
  confirmationId: string
): Promise<ApiMessageResponse> {
  return await fetchService.delete<ApiMessageResponse>(
    `/auth/two-factor-confirmation/${confirmationId}`
  );
}

export async function getAccount(userId: string): Promise<Account | null> {
  try {
    const account = await fetchService.get<Account | null>(
      `/auth/account/${userId}`
    );
    return account;
  } catch {
    return null;
  }
}
