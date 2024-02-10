import * as z from 'zod';
import { MIN_PASSWORD_LENGTH } from '@/schemes/constants';
import { UserRole } from '@prisma/client';

export const LoginScheme = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' }),
  code: z.optional(z.string()),
});

export const RegisterScheme = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: 'Password must contains at least 6 characters',
    }),
  name: z.string().min(1, { message: 'Name is required' }),
});

export const ResetScheme = z.object({
  email: z.string().email({ message: 'Email is required' }),
});

export const NewPasswordScheme = z.object({
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: 'Password must contains at least 6 characters',
    }),
  confirmPassword: z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: 'Password must contains at least 6 characters',
    }),
});

export const UpdateSettingsScheme = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string().email()),
  emailVerified: z.optional(z.string()),
  image: z.optional(z.string().url()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
});
UpdateSettingsScheme;
