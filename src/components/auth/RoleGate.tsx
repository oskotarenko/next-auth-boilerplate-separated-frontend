'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserRole } from '@prisma/client';
import { ReactNode } from 'react';
import { FormError } from '../FormError';

type Props = {
  children: ReactNode;
  allowedRole: UserRole;
};

export function RoleGate({ children, allowedRole }: Props) {
  const user = useCurrentUser();

  if (user?.role !== allowedRole) {
    return (
      <div className='flex w-[600px] justify-center rounded-xl bg-white p-6'>
        <FormError message='Access Denied' />
      </div>
    );
  }

  return (
    <div className='flex w-[600px] justify-center rounded-xl bg-white p-6'>
      {children}
    </div>
  );
}
