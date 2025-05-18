"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateQuizForm } from "@/components/create-quiz-form"
import { UserProfile } from "@/components/user-profile"
import { Header } from "@/components/header"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState("profile")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  useEffect(() => {
    if (tabParam && ["profile", "create-quiz"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true)
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we load your profile</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        {isAuthenticated && user ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="create-quiz">Create Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>View and manage your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <UserProfile />
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
                  <CreateQuizForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Please log in to access your profile</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to view and manage your quizzes.</p>
          </div>
        )}
      </div>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onRegisterClick={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />

      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        onLoginClick={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </div>
  )
}
