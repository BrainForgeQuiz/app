"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"

export function AuthButtons() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  return (
    <>
      <div className="flex gap-4">
        <Button
          variant="default"
          onClick={() => setShowLoginModal(true)}
        >
          Login
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowRegisterModal(true)}
        >
          Register
        </Button>
      </div>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onRegisterClick={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />

      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        onLoginClick={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </>
  )
}
