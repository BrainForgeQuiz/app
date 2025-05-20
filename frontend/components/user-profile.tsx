"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut, User } from "lucide-react"

export function UserProfile() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-lg">
        <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-md">
          <AvatarFallback className="text-2xl text-white">
            {user.username ? user.username.charAt(0).toUpperCase() : <User />}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold">{user.username}</h2>
        </div>
      </div><Card className="border border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground font-medium">Username:</span>
              <span className="col-span-2">{user.username}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center py-2">
              <span className="text-muted-foreground font-medium">User ID:</span>
              <span className="col-span-2 text-xs sm:text-sm font-mono bg-slate-100 dark:bg-slate-800 p-1 rounded">
                {user.id}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button variant="destructive" className="w-full mt-4" onClick={logout}>
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </>
  )
}
