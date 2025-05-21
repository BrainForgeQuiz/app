"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useAuthModal } from "@/context/auth-modal-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/components/user-profile"
import { Button } from "@/components/ui/button"
import { TextQuizCreator } from "@/components/quiz-creator"
import { UserQuizList } from "@/components/user-quiz-list"
import { QuizLeaderboard } from "@/components/quiz-leaderboard"

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { openLogin } = useAuthModal()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    if (tabParam && ["profile", "my-quizzes", "create-quiz"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openLogin()
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your profile</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access your profile</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view and manage your quizzes.</p>
          <Button onClick={openLogin}>Log In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="grid grid-cols-3 mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold md:col-span-1">Your Profile</h1>
            <div className="lg:col-span-1 col-span-2 flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="my-quizzes">My Quizzes</TabsTrigger>
                <TabsTrigger value="create-quiz">Create Quiz</TabsTrigger>
              </TabsList>
            </div>
            <div className="lg:col-span-1" />
          </div>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>View and manage your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserProfile />
                </CardContent>
              </Card>
              <QuizLeaderboard />
            </div>
          </TabsContent>
          <TabsContent value="my-quizzes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Quizzes</CardTitle>
                <CardDescription>Manage quizzes you've created</CardDescription>
              </CardHeader>
              <CardContent>
                <UserQuizList setTab={setActiveTab} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="create-quiz" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Quiz</CardTitle>
                <CardDescription>Create a new quiz to share with others</CardDescription>
              </CardHeader>
              <CardContent>
                <TextQuizCreator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}
