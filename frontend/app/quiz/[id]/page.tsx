"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { fetchQuizById } from "@/lib/quiz_api"

export default function QuizPage() {
  const params = useParams()
  const [quiz, setQuiz] = useState<{ id: string; name: string; questions: Array<{ id: string; question: string; options: Array<string>; correctAnswer: string }> }>({} as any)
  const { user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true)
    }
  }, [isLoading, isAuthenticated])

  useEffect(() => {
      const getQuiz = async () => {
        try {
          const quizId = Array.isArray(params.id) ? params.id[0] : params.id
          if (!quizId) {
            setError("Quiz ID is required")
            return
          }
          const data = await fetchQuizById(quizId)
          setQuiz(data)
        } catch (err) {
          setError("Failed to load quiz")
        } finally {
          setIsLoading(false)
        }
      }

      getQuiz()
    }, [])

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we load your quiz</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Error</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Header />
        {isAuthenticated && user ? (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{quiz?.name}</h1>
            <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">Not Implemented</h2>
                <p className="text-muted-foreground">
                  Quiz ID: {params.id}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Unauthorized</h2>
              <p className="text-muted-foreground">
                You must be logged in to take a quiz.
              </p>
            </div>
          </div>
        )}

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
      </div>
  )
}
