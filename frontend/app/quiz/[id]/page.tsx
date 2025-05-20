"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useAuthModal } from "@/context/auth-modal-context"
import { TextAnswerQuestion } from "@/components/quiz-view"
import { fetchQuizById } from "@/lib/quiz_api"
import { startGame, getQuestion, checkAnswer } from "@/lib/game_api"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Undo2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Quiz, Question } from "@/types"
import toast from "react-hot-toast"
import { AnimatePresence } from "framer-motion"
import { QuizLeaderboard } from "@/components/quiz-leaderboard"

export default function TextQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string
  const { isAuthenticated, isLoading } = useAuth()
  const { openLogin } = useAuthModal()

  const [isQuizLoading, setIsQuizLoading] = useState(false)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [gameToken, setGameToken] = useState<string | null>(null)
  const [qLength, setQLength] = useState<number>(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question>()
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const hasFetched = useRef(false)
  const [questions, setQuestions] = useState({} as Record<string, { question: string; right: number; wrong: number }>)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLogin()
    }
  }, [isLoading, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated || hasFetched.current) return
    hasFetched.current = true
    setIsQuizLoading(true)
    const fetchQuiz = async () => {
      try {
        const quizData = await fetchQuizById(quizId)
        if (!quizData) {
          setError("Quiz not found")
          return
        }
        setQuiz(quizData)
        const token = await startGame(quizId)
        setGameToken(token.data)
        setQLength(token.tries)
        const questionData = await getQuestion(token.data)
        if (!questionData) {
          setError("Failed to retrieve questions")
          return
        }
        setCurrentQuestion({ id: questionData.id, question: questionData.question })
      } catch (err) {
        setError("Failed to fetch quiz or start game")
      } finally {
        setIsQuizLoading(false)
      }
    }
    fetchQuiz()
  }, [isAuthenticated, quizId])

  useEffect(() => {
    if (quizCompleted) {
      toast.success("Quiz completed!")
    }
  }, [quizCompleted])

  const handleBackToHome = () => {
    router.push("/")
  }

  const handleCompleteQuiz = () => {
    setQuizCompleted(true)
    setGameToken(null)
  }

  const handleSubmitAnswer = async (answer: string) => {
    if (!gameToken) return
    try {
      const response = await checkAnswer(currentQuestion?.id as string, gameToken, answer)
      setGameToken(response.data)
      if(response && response.gameStatus !== null) {
        toast.success("xd")
        setQuestions((prev) => {
          const prevEntry = prev[currentQuestion?.id as string] || { question: currentQuestion?.question ?? "", right: 0, wrong: 0 }
          return {
            ...prev,
            [currentQuestion?.id as string]: {
              question: currentQuestion?.question ?? "",
              right: response.gameStatus === 0 || response.gameStatus === 1 ? prevEntry.right + 1 : prevEntry.right,
              wrong: response.gameStatus === 2 ? prevEntry.wrong + 1 : prevEntry.wrong,
            },
          }
        })
      }
      if (response.gameStatus !== 1) {
        setQLength(response.tries + currentQuestionIndex + 1)
        const questionData = await getQuestion(response.data)
        if (!questionData) {
          setError("Failed to retrieve next question")
          return
        }
        setCurrentQuestion({ id: questionData.id, question: questionData.question })
      } else if (response.gameStatus === 1) {
        handleCompleteQuiz()
      }
      setCurrentQuestionIndex((prev) => prev + 1)
    } catch (err) {
      setError("Failed to check answer")
      console.error(err)
    }
  }

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
        <div className="max-w-2xl mx-auto text-center p-8 dark:bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold dark:text-red-400 mb-4">Quiz Not Found</h2>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Quiz Completed</h1>
            <p className="text-muted-foreground">Thank you for completing the quiz!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="col-span-1">
              <h2 className="text-2xl font-bold mb-6 blue-gradient-text">Your Answers</h2>
              <div className="space-y-6">
                {Object.entries(questions).map(([id, question], index) => (
                  <div key={`${id}-${index}`} className="border dark:border-slate-700 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="dark:bg-[#1e3a8a]/30 dark:text-[#93c5fd] p-2 rounded-full h-8 w-8 flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-medium">{question.question}</h3>
                    </div>
                    <div className="ml-11">
                      <div className="mb-2 flex gap-4">
                        <span className="dark:text-green-400 font-semibold">
                          Right: {question.right}
                        </span>
                        <span className="dark:text-red-400 font-semibold">
                          Wrong: {question.wrong}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
            <div className="col-span-1">
              <QuizLeaderboard limit={10} />
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={handleBackToHome} className="blue-gradient blue-gradient-hover text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button onClick={() => window.location.reload()} className="blue-gradient blue-gradient-hover text-white">
              <Undo2 className="mr-2 h-4 w-4" />
              Retake
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">{quiz.name}</h1>
            <Badge className="blue-gradient">{quiz.topic}</Badge>
          </div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {qLength}
            </p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <TextAnswerQuestion
              key={currentQuestionIndex}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              isLast={currentQuestionIndex === qLength - 1}
              onSubmitAnswer={handleSubmitAnswer}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

