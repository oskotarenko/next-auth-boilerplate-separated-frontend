import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.scss';
import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

const popins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Auth App',
  description: 'Builded on Next-Auth@beta5',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang='en'>
      <body
        className={cn(
          popins.className,
          'bg-[radial-gradient(ellipse_at_top,__var(--tw-gradient-stops))] from-sky-300 to-blue-200'
        )}
      >
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
