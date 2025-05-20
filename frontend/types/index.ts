export interface User {
  id: string
  username: string
  points: number
  iat?: number
  exp?: number
}

export interface Quiz {
  id: string
  name: string
  topic: string
  userId?: string
  createdAt?: string
  questionCount: number
}

export interface Question {
  id?: string
  question: string
  userAnswer?: string
  correctAnswer?: string
  points?: string
}

export interface LeaderboardEntry {
  id: string
  username: string
  points: number
}

export interface AuthResponse {
  token: string
  user?: User
}
