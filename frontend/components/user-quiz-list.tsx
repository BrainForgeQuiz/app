"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchUserQuizzes, deleteQuiz } from "@/lib/quiz_api"
import type { Quiz } from "@/types"
import { Trash2, Calendar, AlertCircle, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import toast from "react-hot-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function UserQuizList({ setTab }: { setTab: (tab: string) => void }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const fetchRef = useRef(false)

  useEffect(() => {
    const didFetch = fetchRef.current;
    if (didFetch) return;
    fetchRef.current = true;
    const getQuizzes = async () => {
      try {
        setIsLoading(true)
        const data = await fetchUserQuizzes()
        if (!data.data) {
          setQuizzes([])
          return
        }
        setQuizzes(data.data)
      } catch (err) {
        toast.error("Failed to load quizzes")
      } finally {
        setIsLoading(false)
      }
    }

    getQuizzes()
  }, [toast])

  const handleDelete = (quiz: Quiz) => {
    setQuizToDelete(quiz)
  }

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return

    try {
      setIsDeleting(true)
      await deleteQuiz(quizToDelete.id)
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizToDelete.id))
      toast.success("Quiz deleted successfully")
    } catch (error) {
      toast.error("Failed to delete quiz")
    } finally {
      setIsDeleting(false)
      setQuizToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setQuizToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center p-8 dark:bg-slate-800/50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className="text-muted-foreground mb-4">You haven't created any quizzes yet.</p>
        <Button
          variant="outline"
          onClick={() => setTab("create-quiz")}
          className="border-[#2563eb] text-[#2563eb] dark:hover:bg-[#172554]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Quiz
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <AnimatePresence>
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">{quiz.name}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge
                          variant="outline"
                          className="bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe] dark:bg-[#172554]/30 dark:text-[#93c5fd] dark:border-[#1e40af]"
                        >
                          {quiz.topic}
                        </Badge>
                        {quiz.createdAt && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/quiz/${quiz.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#2563eb] text-[#2563eb] hover:bg-[#eff6ff] dark:hover:bg-[#172554]"
                        >
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(quiz)}
                        title="Delete quiz"
                        className="opacity-80 hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AlertDialog open={!!quizToDelete} onOpenChange={(open) => !open && setQuizToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz
              <strong className="font-semibold text-foreground"> {quizToDelete?.name}</strong> and all of its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
