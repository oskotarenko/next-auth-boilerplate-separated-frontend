'use client';

import { ReactNode } from 'react';
import { Button } from '../ui/button';
import { logout } from '@/actions/auth.actions';

type Props = {
  children?: ReactNode;
};

export default function LogoutButton({ children }: Props) {
  const onClick = () => {
    logout();
  };

  return (
    <Button onClick={onClick} variant='outline' className='w-full'>
      {children}
    </Button>
  );
}
