"use client"

import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { useAuthModal } from "@/context/auth-modal-context"

export default function AuthModals() {
  const {
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
  } = useAuthModal()
  return (
    <>
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