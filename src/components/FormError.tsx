import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

type Props = {
  message?: string;
};

export function FormError({ message }: Props) {
  if (!message) return null;

  return (
    <div className='flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
      <ExclamationTriangleIcon />
      <p>{message}</p>
    </div>
  );
}
