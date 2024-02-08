"use client"

import { useRouter } from "next/navigation"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
}

export function LoginButton({ children, mode, asChild }: Props) {
  const router = useRouter()

  const onClick = () => {
    router.push('/auth/login')
  }

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  )
}