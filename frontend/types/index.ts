export interface User {
  id: string
  username: string
  email?: string
  iat?: number
  exp?: number
}

export interface Quiz {
  id: string
  name: string
  topic: string
  userId?: string
  createdAt?: string
}

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  text: string
  description?: string
  options: QuizOption[]
  explanation?: string
  hint?: string
}

export interface AuthResponse {
  token: string
  user?: User
}
