"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useAuthModal } from "@/context/auth-modal-context"
import { TextAnswerQuestion } from "@/components/text-answer-question"
import { fetchQuizById } from "@/lib/quiz_api"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Undo2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Quiz, Question } from "@/types"
import toast from "react-hot-toast"

export default function TextQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  const { isAuthenticated, isLoading } = useAuth()
  const { openLogin } = useAuthModal()
  
  const [isQuizLoading, setIsQuizLoading] = useState(false)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLogin()
    }
  }, [isLoading, isAuthenticated])

  useEffect(() => {
    if (isLoading || !isAuthenticated) return
    setIsQuizLoading(true)
    fetchQuizById(quizId)
      .then((data) => {
        setQuiz(data)
        setQuestions([{ id: "1", question: "Template question" }])
        toast.success("Imagine the quiz is starting now!")
      })
      .catch(() => setError("Failed to load quiz. It might not exist or has been removed."))
      .finally(() => setIsQuizLoading(false))
  }, [quizId, isAuthenticated, isLoading])

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  const handleCompleteQuiz = () => {
    toast.success("Quiz completed! Thank you for your answers.")
    setCurrentQuestionIndex(questions.length) // Move index out of range to trigger completed view
  }

  const quizCompleted = currentQuestionIndex >= questions.length
  const currentQuestion = questions[currentQuestionIndex]

  if (isLoading || isQuizLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#2563eb]" />
          <h2 className="text-2xl font-semibold">Loading Quiz...</h2>
          <p className="text-muted-foreground mt-2">Please wait while we prepare your quiz</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Please log in to access the quiz</h2>
          <Button onClick={openLogin} className="mt-4">
            Log In
          </Button>
        </div>
      </div>
    )
  }
  
  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Quiz Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "This quiz doesn't exist or has been removed."}</p>
          <Button onClick={handleBackToHome} className="mx-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Quiz Completed</h1>
            <p className="text-muted-foreground">Thank you for completing the quiz!</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 blue-gradient-text">Your Answers</h2>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-[#dbeafe] dark:bg-[#1e3a8a]/30 text-[#1e40af] dark:text-[#93c5fd] p-2 rounded-full h-8 w-8 flex items-center justify-center text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium">{question.question}</h3>
                  </div>
                  <div className="ml-11">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Your Answer:</h4>
                      <div className="p-3 bg-[#eff6ff] dark:bg-[#1e3a8a]/20 rounded-md border border-[#bfdbfe] dark:border-[#1e40af]">
                        <p className="whitespace-pre-wrap">{userAnswers[question.id] || "No answer provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <Button onClick={() => window.location.reload()} className="blue-gradient blue-gradient-hover text-white">
                <Undo2 className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button onClick={handleBackToHome} className="blue-gradient blue-gradient-hover text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{quiz.name}</h1>
            <Badge className="blue-gradient">{quiz.topic}</Badge>
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        {currentQuestion && (
          <TextAnswerQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            onNext={currentQuestionIndex === questions.length - 1 ? handleCompleteQuiz : handleNextQuestion}
            isLast={currentQuestionIndex === questions.length - 1}
            onAnswerChange={(answer) =>
              setUserAnswers((prev) => ({
                ...prev,
                [currentQuestion.id]: answer,
              }))
            }
          />
        )}
      </div>
    </div>
  )
}

