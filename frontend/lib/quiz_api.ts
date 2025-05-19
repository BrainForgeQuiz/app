import { API_URL, handleResponse } from "@/lib/utils"

export async function fetchQuizzes() {
  const response = await fetch(`${API_URL}/quiz`)
  return handleResponse(response)
}

export async function createQuiz(quizData: { name: string; topic: string }) {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_URL}/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quizData),
  })

  return handleResponse(response)
}

export async function fetchQuizById(quizId: string) {
  const response = await fetch(`${API_URL}/quiz/${quizId}`)
  const quiz = await handleResponse(response)


  if (!quiz || !quiz.data) {
    throw new Error("Quiz not found")
  }

  return quiz.data
}

export async function deleteQuiz(quizId: string) {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_URL}/quiz/${quizId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

export async function addQuestionToQuiz(questionData: {quizId: string, question: string; answer: string, points: number }) {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("Authentication required")
  }

  const response = await fetch(`${API_URL}/question`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(questionData),
  })

  return handleResponse(response)
}