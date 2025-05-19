"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { Question } from "@/types"
import { Input } from "./ui/input"

interface TextAnswerQuestionProps {
  question: Question
  questionNumber: number
  isLast: boolean
  onSubmitAnswer?: (answer: string) => void
}

export function TextAnswerQuestion({
  question,
  questionNumber,
  isLast,
  onSubmitAnswer,
}: TextAnswerQuestionProps) {
  const [answer, setAnswer] = useState("")

  useEffect(() => {
    setAnswer("")
  }, [questionNumber])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value)
  }

  const handleButtonClick = () => {
    if (onSubmitAnswer) {
      onSubmitAnswer(answer)
    }
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Card className="border border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-xl flex items-start gap-3">
              <span className="bg-[#dbeafe] dark:bg-[#1e3a8a]/30 text-[#1e40af] dark:text-[#93c5fd] p-2 rounded-full h-8 w-8 flex items-center justify-center text-sm">
                {questionNumber}
              </span>
              <span>{question.question}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Type your answer here..."
                value={answer}
                onChange={handleChange}
                className="min-h-[120px] border-slate-300 dark:border-slate-700 focus-visible:ring-[#2563eb]"
                autoFocus
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button onClick={handleButtonClick} disabled={!answer} type="submit" className="blue-gradient blue-gradient-hover text-white">
              {isLast ? "Finish Quiz" : "Next Question"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  )
}
