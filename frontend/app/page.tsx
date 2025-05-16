import { QuizList } from "@/components/quiz-list"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold bg-clip-text">
              Welcome to BrainForgeQuiz
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Test your knowledge with our collection of quizzes on various topics. Create your own quizzes and share
              them with others.
            </p>
          </div>

          <div className="w-full mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Quizzes</h2>
            </div>
            <QuizList />
          </div>
        </div>
      </main>

      <footer className="text-white py-12 mt-5">
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} BrainForgeQuiz. All rights reserved.</p>
          </div>
      </footer>
    </div>
  )
}
