import type React from "react"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "next-themes"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AuthModals from "@/components/auth-modals"
import { AuthModalProvider } from "@/context/auth-modal-context"

export const metadata = {
  title: "BrainForgeQuiz",
  description: "Create and take quizzes on various topics",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider>
            <AuthModalProvider>
              <div className="min-h-screen bg-gradient-to-b dark:from-slate-950 dark:to-slate-900">
                <Header />
                {children}
                <Toaster position="top-center" />
                <Footer />
                <AuthModals />
              </div>
            </AuthModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
