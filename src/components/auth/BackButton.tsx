import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
  label: string
  href: string
}

export function BackButton({ label, href }: Props) {

  return (
    <Button
      variant="link"
      className="font-norma; w-full">
      <Link href={href}>{label}</Link>
    </Button>
  )
}