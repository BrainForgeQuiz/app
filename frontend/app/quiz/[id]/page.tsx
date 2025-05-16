"use client"
import { Header } from "@/components/header"
import { useParams } from "next/navigation"

export default function QuizPage() {
  const params = useParams()
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Not Implemented</h2>
          <p className="text-muted-foreground">
            Quiz ID: {params.id}
          </p>
        </div>
      </div>
    </div>
  )
}
