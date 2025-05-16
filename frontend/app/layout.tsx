import type React from "react"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "next-themes"


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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
