import { ReactNode } from "react"
import NavBar from "./settings/_components/NavBar"

type Props = {
  children: ReactNode
}

export default function ProtectedLayout({ children }: Props) {
  return (
    <div className="flex flex-col gap-y-10 items-center justify-center h-full w-full">
      <NavBar />
      {children}
    </div>
  )
}