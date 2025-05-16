const API_URL = process.env.API_URL || "http://localhost:3000"

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || `API error: ${response.status}`
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  return null
}


export async function registerUser(username: string, password: string, email: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  })

  return handleResponse(response)
}

export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse(response);
}

export async function getUserInfo() {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

export async function refreshToken() {
  const token = localStorage.getItem("token")
  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

// Quiz APIs

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
  const quizzes = await handleResponse(response)


  if (!quizzes || quizzes.length === 0) {
    throw new Error("Quiz not found")
  }

  // Mock questions for the quiz
  const questions = [
    {
      id: "q1",
      text: "What is the capital of France?",
      description: "Choose the correct capital city",
      options: [
        { id: "a1", text: "London", isCorrect: false },
        { id: "a2", text: "Berlin", isCorrect: false },
        { id: "a3", text: "Paris", isCorrect: true },
        { id: "a4", text: "Madrid", isCorrect: false },
      ],
      explanation: "Paris is the capital and most populous city of France.",
    },
    {
      id: "q2",
      text: "Which planet is known as the Red Planet?",
      options: [
        { id: "a1", text: "Venus", isCorrect: false },
        { id: "a2", text: "Mars", isCorrect: true },
        { id: "a3", text: "Jupiter", isCorrect: false },
        { id: "a4", text: "Saturn", isCorrect: false },
      ],
      explanation: "Mars is called the Red Planet because of its reddish appearance.",
      hint: "Think about the color of rust (iron oxide).",
    },
    {
      id: "q3",
      text: "What is the largest mammal in the world?",
      options: [
        { id: "a1", text: "African Elephant", isCorrect: false },
        { id: "a2", text: "Blue Whale", isCorrect: true },
        { id: "a3", text: "Giraffe", isCorrect: false },
        { id: "a4", text: "Polar Bear", isCorrect: false },
      ],
      explanation: "The Blue Whale is the largest animal known to have ever existed.",
    },
    {
      id: "q4",
      text: "Which of these is NOT a programming language?",
      options: [
        { id: "a1", text: "Python", isCorrect: false },
        { id: "a2", text: "Java", isCorrect: false },
        { id: "a3", text: "Cobra", isCorrect: true },
        { id: "a4", text: "JavaScript", isCorrect: false },
      ],
      explanation:
        "While Python is a programming language named after a snake, Cobra is not a widely recognized programming language.",
    },
    {
      id: "q5",
      text: "In which year did World War II end?",
      options: [
        { id: "a1", text: "1943", isCorrect: false },
        { id: "a2", text: "1945", isCorrect: true },
        { id: "a3", text: "1947", isCorrect: false },
        { id: "a4", text: "1950", isCorrect: false },
      ],
      explanation:
        "World War II ended in 1945 with the surrender of Japan after the atomic bombings of Hiroshima and Nagasaki.",
      hint: "It ended shortly after the first atomic bombs were used in warfare.",
    },
  ]

  return { quiz: quizzes[0], questions }
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
