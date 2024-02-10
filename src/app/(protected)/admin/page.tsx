import { RoleGate } from '@/components/auth/RoleGate';

export default function AdminPage() {
  return (
    <RoleGate allowedRole='ADMIN'>
      <h1 className='font-bold'>
        If you can see this page, you are chosen by God
      </h1>
    </RoleGate>
  );
}
