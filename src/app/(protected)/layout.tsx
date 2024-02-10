import { ReactNode } from 'react';
import NavBar from './settings/_components/NavBar';

type Props = {
  children: ReactNode;
};

export default function ProtectedLayout({ children }: Props) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-y-10'>
      <NavBar />
      {children}
    </div>
  );
}
