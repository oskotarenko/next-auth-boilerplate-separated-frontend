'use client';

import { CardWrapper } from '@/components/auth/CardWrapper';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState } from 'react';

export default function ClientPage() {
  const user = useCurrentUser();
  const [counter, setCounter] = useState<number>(0);

  return (
    <>
      {user ? (
        <CardWrapper
          headerLabel='This page is a client component'
          backButtonHref='/server'
          backButtonLabel='Visit server page'
        >
          <div className='space-y-2'>
            <div className='flex items-center justify-between gap-x-4'>
              <p className='font-bold'>Counter: {counter}</p>
              <Button onClick={() => setCounter(counter + 1)}>
                Click to increment
              </Button>
            </div>
            <p>Name: {user.name}</p>
            <p>Role: {user.role}</p>
            <p>Email: {user.email}</p>
          </div>
        </CardWrapper>
      ) : (
        <>User not found</>
      )}
    </>
  );
}
