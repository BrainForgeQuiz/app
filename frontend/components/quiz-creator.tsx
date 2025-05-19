"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { TextQuestionEditor } from "@/components/question-editor"
import { PlusCircle, Save, Trash2, Loader2, ArrowUp, ArrowDown } from "lucide-react"
import { createQuiz, addQuestionToQuiz } from "@/lib/quiz_api"
import type { Question } from "@/types"

const TOPICS = ["HISTORY", "LITERATURE"]

export function TextQuizCreator() {
  const [quizName, setQuizName] = useState("")
  const [quizTopic, setQuizTopic] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const addNewQuestion = () => {
    const newQuestion: Question = {
      question: "",
      correctAnswer: "",
    }
    setQuestions([...questions, newQuestion])
    setCurrentQuestionIndex(questions.length)
  }

  const updateQuestion = (updatedQuestion: Question) => {
    if (currentQuestionIndex !== null) {
      const updatedQuestions = [...questions]
      updatedQuestions[currentQuestionIndex] = updatedQuestion
      setQuestions(updatedQuestions)
    }
  }

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index)
    setQuestions(updatedQuestions)

    if (currentQuestionIndex === index) {
      setCurrentQuestionIndex(null)
    } else if (currentQuestionIndex !== null && currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const moveQuestionUp = (index: number) => {
    if (index > 0) {
      const updatedQuestions = [...questions]
      const temp = updatedQuestions[index]
      updatedQuestions[index] = updatedQuestions[index - 1]
      updatedQuestions[index - 1] = temp
      setQuestions(updatedQuestions)

      if (currentQuestionIndex === index) {
        setCurrentQuestionIndex(index - 1)
      } else if (currentQuestionIndex === index - 1) {
        setCurrentQuestionIndex(index)
      }
    }
  }

  const moveQuestionDown = (index: number) => {
    if (index < questions.length - 1) {
      const updatedQuestions = [...questions]
      const temp = updatedQuestions[index]
      updatedQuestions[index] = updatedQuestions[index + 1]
      updatedQuestions[index + 1] = temp
      setQuestions(updatedQuestions)

      if (currentQuestionIndex === index) {
        setCurrentQuestionIndex(index + 1)
      } else if (currentQuestionIndex === index + 1) {
        setCurrentQuestionIndex(index)
      }
    }
  }

  const saveQuiz = async () => {
    if (!quizName.trim()) {
      toast.error("Quiz name is required")
      return
    }

    if (!quizTopic) {
      toast.error("Please select a topic for your quiz")
      return
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question to your quiz")
      return
    }

    const invalidQuestions = questions.findIndex(
      (q) =>
        !q.question.trim() ||
        !q.correctAnswer ||
        !q.correctAnswer.trim()
    )
    if (invalidQuestions !== -1) {
      toast.error(`Question #${invalidQuestions + 1} is invalid. Please fill in all fields.`)
      setCurrentQuestionIndex(invalidQuestions)
      return
    }

    setIsSaving(true)

    try {
      const quiz = await createQuiz({
        name: quizName,
        topic: quizTopic,
      })
      if (!quiz || !quiz.data) {
        toast.error(quiz.error || "Failed to create quiz")
        return
      }
      await Promise.all(
        questions.map((q) =>
          addQuestionToQuiz({
            quizId: quiz.data,
            question: q.question,
            answer: q.correctAnswer ?? "",
            points: q.points ? Number(q.points) : 1,
          })
        )
      )

      toast.success("Quiz saved successfully!")

      setQuizName("")
      setQuizTopic("")
      setQuestions([])
      setCurrentQuestionIndex(null)
    } catch (error) {
      toast.error("Failed to save quiz. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-name">Quiz Name</Label>
                <Input
                  id="quiz-name"
                  placeholder="Enter quiz name"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiz-topic">Topic</Label>
                <Select value={quizTopic} onValueChange={setQuizTopic}>
                  <SelectTrigger id="quiz-topic">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {questions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No questions yet</p>
              ) : (
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`p-3 rounded-md flex justify-between items-center cursor-pointer ${currentQuestionIndex === index
                        ? "bg-[#eff6ff] dark:bg-[#1e3a8a]/30 border border-[#2563eb] dark:border-[#3b82f6]"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#2563eb] dark:hover:border-[#3b82f6]"
                        }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="bg-[#dbeafe] dark:bg-[#1e3a8a]/50 text-[#1e40af] dark:text-[#93c5fd] p-1 rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="truncate">{question.question || "Untitled Question"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                onClick={addNewQuestion}
                className="w-full mt-4 border-[#2563eb] text-[#2563eb] hover:bg-[#eff6ff] dark:hover:bg-[#172554]"
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </CardContent>
        </Card >
        <Button onClick={saveQuiz} disabled={isSaving} className="blue-gradient blue-gradient-hover text-white w-full mt-4">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Quiz
            </>
          )}
        </Button>
      </div>

      <div className="md:col-span-2">
        {currentQuestionIndex !== null && questions[currentQuestionIndex] ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Question #{currentQuestionIndex + 1}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveQuestionUp(currentQuestionIndex)}
                  disabled={currentQuestionIndex === 0}
                  className="h-8 w-8"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveQuestionDown(currentQuestionIndex)}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="h-8 w-8"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteQuestion(currentQuestionIndex)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TextQuestionEditor question={questions[currentQuestionIndex]} onChange={updateQuestion} />
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">No Question Selected</h3>
              <p className="text-muted-foreground mb-4">
                Select a question from the list or add a new one to edit
              </p>
              <Button onClick={addNewQuestion} className="blue-gradient blue-gradient-hover text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
