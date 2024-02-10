'use server';

import { fetchService } from '@/lib/fetch.service';
import { UpdateSettingsScheme } from '@/schemes';
import { ApiMessageResponse } from '@/types/actions/api.response';
import { User } from '@prisma/client';
import { z } from 'zod';

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await fetchService.post<User | null>(
      '/user/get-user-by-email',
      { email }
    );
    return user;
  } catch {
    return null;
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await fetchService.post<User | null>('/user/get-user-by-id', {
      userId,
    });
    return user;
  } catch {
    return null;
  }
}

export async function updateSettings(
  userId: string,
  values: z.infer<typeof UpdateSettingsScheme>
): Promise<ApiMessageResponse> {
  const response = await fetchService.post<ApiMessageResponse>(
    '/user/update-settings',
    { userId, ...values }
  );
  return response;
}
