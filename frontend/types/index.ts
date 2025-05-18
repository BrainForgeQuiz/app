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
  questionCount: number
}

export interface Question {
  id: string
  question: string
}

export interface AuthResponse {
  token: string
  user?: User
}
