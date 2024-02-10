import { LoginButton } from '@/components/auth/LoginButton';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className='flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,__var(--tw-gradient-stops))] from-sky-300 to-blue-800'>
      <div className='space-y-6 text-center'>
        <h1 className='text-6xl font-semibold text-white drop-shadow-md'>
          Auth
        </h1>
        <p className='text-lg text-white'>Simple authentification service</p>
        <div>
          <LoginButton>
            <Button variant='secondary' size='lg'>
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
