"use client"

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { UserRole } from "@prisma/client"
import { ReactNode } from "react"
import { FormError } from "../FormError"

type Props = {
  children: ReactNode,
  allowedRole: UserRole
}

export function RoleGate({ children, allowedRole }: Props) {
  const user = useCurrentUser()

  if (user?.role !== allowedRole) {
    return (
      <div className="bg-white w-[600px] p-6 rounded-xl flex justify-center">
        <FormError message="Access Denied" />
      </div>
    )
  }

  return (
    <div className="bg-white w-[600px] p-6 rounded-xl flex justify-center">
      {children}
    </div>
  )
}