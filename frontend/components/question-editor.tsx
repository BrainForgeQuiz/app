"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/types"
import { Input } from "./ui/input"

interface TextQuestionEditorProps {
  question: Question
  onChange: (question: Question) => void
}

export function TextQuestionEditor({ question, onChange }: TextQuestionEditorProps) {
  const handleChange = (field: keyof Question, value: string) => {
    onChange({
      ...question,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          placeholder="Enter your question"
          value={question.question}
          onChange={(e) => handleChange("question", e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="question-correct-answer">
          Correct Answer
        </Label>
        <Textarea
          id="question-correct-answer"
          placeholder="Enter the correct answer"
          value={question.correctAnswer || ""}
          onChange={(e) => handleChange("correctAnswer", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="question-points">
          Points
        </Label>
        <Input
          type="number"
          min={1}
          max={3}
          id="question-points"
          placeholder="Enter the points how much this question is worth"
          className="w-16"
          value={question.points || 1}
          onChange={(e) => handleChange("points", e.target.value)}
        />
      </div>
    </div>
  )
}
