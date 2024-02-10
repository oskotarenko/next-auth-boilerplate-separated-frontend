import {
  ResetPasswordToken,
  TwoFactorToken,
  VerificationToken,
} from '@prisma/client';
import { fetchService } from '@/lib/fetch.service';

export async function generateVerificationToken(
  email: string
): Promise<VerificationToken> {
  const verificationToken = await fetchService.post<VerificationToken>(
    '/token/generate/verification-token',
    { email }
  );
  return verificationToken;
}

export async function generateResetPasswordToken(
  email: string
): Promise<ResetPasswordToken> {
  const passwordResetToken = await fetchService.post<ResetPasswordToken>(
    '/token/generate/reset-password-token',
    { email }
  );
  return passwordResetToken;
}

export async function generateTwoFactorToken(
  email: string
): Promise<TwoFactorToken> {
  const twoFactorToken = await fetchService.post<TwoFactorToken>(
    '/token/generate/two-factor-token',
    { email }
  );
  return twoFactorToken;
}

export async function getVerificationTokenByEmail(
  email: string
): Promise<VerificationToken | null> {
  const verificationToken = await fetchService.get<VerificationToken | null>(
    '/token/get/verification-token-by-email',
    { email }
  );
  return verificationToken;
}
export async function getVerificationTokenByToken(
  token: string
): Promise<VerificationToken | null> {
  const verificationToken = await fetchService.get<VerificationToken | null>(
    '/token/get/verification-token-by-token',
    { token }
  );
  return verificationToken;
}

export async function getResetPasswordTokenByEmail(
  email: string
): Promise<ResetPasswordToken | null> {
  const verificationToken = await fetchService.get<ResetPasswordToken | null>(
    '/token/get/reset-password-token-by-email',
    { email }
  );
  return verificationToken;
}
export async function getResetPasswordTokenByToken(
  token: string
): Promise<ResetPasswordToken | null> {
  const verificationToken = await fetchService.get<ResetPasswordToken | null>(
    '/token/get/reset-password-token-by-token',
    { token }
  );
  return verificationToken;
}

export async function getTwoFactorTokenByEmail(
  email: string
): Promise<TwoFactorToken | null> {
  const verificationToken = await fetchService.get<TwoFactorToken | null>(
    '/token/get/two-factor-token-by-email',
    { email }
  );
  return verificationToken;
}
export async function getTwoFactorTokenByToken(
  token: string
): Promise<TwoFactorToken | null> {
  const verificationToken = await fetchService.get<TwoFactorToken | null>(
    '/token/get/two-factor-token-by-token',
    { token }
  );
  return verificationToken;
}
