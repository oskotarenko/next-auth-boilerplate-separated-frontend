import { CardWrapper } from '@/components/auth/CardWrapper';
import { currentUser } from '@/lib/auth';

export default async function ServerPage() {
  const user = await currentUser();

  return (
    <>
      {user ? (
        <CardWrapper
          headerLabel='This page is a server component'
          backButtonHref='/admin'
          backButtonLabel='Try to visit admin page'
        >
          <div className='space-y-2'>
            <p className='font-bold'>
              No user interaction is allowed on this page
            </p>
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
