import { QuizList } from "@/components/quiz-list"

export default function Home() {
  return (
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
  )
}
