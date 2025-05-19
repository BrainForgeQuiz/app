"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthButtons } from "@/components/auth-buttons"
import { useAuth } from "@/context/auth-context"
import { UserNav } from "@/components/user-nav"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export function Header() {
  const { isAuthenticated } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-9xl items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text">
              BrainForgeQuiz
            </span>
          </Link>

          {isMobile ? (
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    {isAuthenticated ? (
                      <>
                        <Link href="/profile">
                          <Button variant="ghost" className="w-full justify-start">
                            Profile
                          </Button>
                        </Link>
                        <Link href="/profile?tab=create-quiz">
                          <Button variant="ghost" className="w-full justify-start">
                            Create Quiz
                          </Button>
                        </Link>
                      </>
                    ) : null}
                    <div className="mt-4">{isAuthenticated ? <UserNav /> : <AuthButtons />}</div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                      Profile
                    </Link>
                    <Link href="/profile?tab=create-quiz" className="text-sm font-medium transition-colors hover:text-primary">
                      Create Quiz
                    </Link>
                  </>
                ) : null}
              </nav>
              <div className="flex items-center gap-4">
                {isAuthenticated ? <UserNav /> : <AuthButtons />}
              </div>
            </div>
          )}
        </div>
      </header>
  )
}
