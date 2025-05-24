"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchQuizzes } from "@/lib/quiz_api"
import type { Quiz } from "@/types"
import Link from "next/link"
import { motion } from "framer-motion"

export function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchQuizzes()
        setQuizzes(Array.isArray(data.data) ? data.data : [])
      } catch (err) {
        setError("Failed to load quizzes")
      } finally {
        setIsLoading(false)
      }
    }

    getQuizzes()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center p-8 dark:bg-slate-800/50 rounded-lg">
        <p className="text-muted-foreground my-4 text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 dark:bg-red-900/20 rounded-lg">
        <p className="dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center p-8 dark:bg-slate-800/50 rounded-lg">
        <p className="text-muted-foreground my-4">No quizzes available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz, index) => (
        <motion.div
          key={quiz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden h-full flex flex-col dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{quiz.name}</h3>
                <Badge>{quiz.topic}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                A quiz about {quiz.topic.toLowerCase()} topics. Test your knowledge and challenge your friends!
              </p>
            </CardContent>
            <CardFooter className="pt-4 border-t dark:border-slate-800">
              <Button
                className="w-full"
                asChild
              >
                <Link href={`/quiz/${quiz.id}`}>Take Quiz</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
