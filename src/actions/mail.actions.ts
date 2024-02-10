import { fetchService } from '@/lib/fetch.service';

export async function sendVerificationEmail(email: string, token: string) {
  await fetchService.post<void>('/mail/send-verification-email', {
    email,
    token,
  });
  return;
}

export async function sendResetPasswordEmail(email: string, token: string) {
  await fetchService.post<void>('/mail/send-verification-email', {
    email,
    token,
  });
  return;
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
  await fetchService.post<void>('/mail/send-verification-email', {
    email,
    token,
  });
  return;
}
