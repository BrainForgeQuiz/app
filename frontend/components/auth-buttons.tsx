"use client"

import { Button } from "@/components/ui/button"
import { useAuthModal } from "@/context/auth-modal-context"

export function AuthButtons() {
  const { openLogin, openRegister } = useAuthModal()
  return (
    <>
      <div className="flex gap-4">
        <Button
          variant="default"
          onClick={openLogin}
        >
          Login
        </Button>
        <Button
          variant="outline"
          onClick={openRegister}
        >
          Register
        </Button>
      </div>
    </>
  )
}
