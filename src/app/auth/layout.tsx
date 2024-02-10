import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className='bg- flex h-full items-center justify-center'>
      {children}
    </div>
  );
}
