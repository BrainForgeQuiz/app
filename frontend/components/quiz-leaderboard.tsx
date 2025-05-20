"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Clock, Medal, User } from "lucide-react"
import { motion } from "framer-motion"
import { fetchLeaderboard } from "@/lib/quiz_api"
import type { LeaderboardEntry } from "@/types"
import { useAuth } from "@/context/auth-context"

interface QuizLeaderboardProps {
  limit?: number
}

export function QuizLeaderboard({ limit = 10 }: QuizLeaderboardProps) {
  const { user, isAuthenticated } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchRef = useRef(false)

  useEffect(() => {
    const didFetch = fetchRef.current;
    if (didFetch) return;
    fetchRef.current = true;
    const getLeaderboard = async () => {
      try {
        setIsLoading(true)
        const data = await fetchLeaderboard(limit)
        setLeaderboard(data.data)
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err)
        setError("Failed to load leaderboard data")
      } finally {
        setIsLoading(false)
      }
    }

    getLeaderboard()
  }, [limit])

  // Get medal color based on position
  const getMedalColor = (position: number) => {
    switch (position) {
      case 0:
        return "text-yellow-500"
      case 1:
        return "text-slate-400"
      case 2:
        return "text-amber-700"
      default:
        return "text-slate-500"
    }
  }

  if (isLoading) {
    return (
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if(!isAuthenticated) {
    return (
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">Please log in to view the leaderboard.</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">No leaderboard data available yet.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-center p-3 rounded-lg ${
                index === 0
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                  : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 mr-3">
                {index < 3 ? (
                  <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                ) : (
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <h3 className="font-medium truncate">{entry.username}</h3>
                  {entry.username === user?.username && <Badge className="ml-2 blue-gradient text-white text-xs">You</Badge>}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <User className="h-3 w-3 mr-1" />
                  <span>xd</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#2563eb]">{entry.points} pts</div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
