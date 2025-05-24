import { API_URL, handleResponse } from "@/lib/utils"

export async function startGame(quizId: string) {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication required")
    }

    const response = await fetch(`${API_URL}/game/start`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizId }),
    })
    const gameToken = await handleResponse(response)
    if (!gameToken || !gameToken.data) {
        throw new Error("Game token not found")
    }

    return gameToken
}

export async function getQuestion(gameState: string) {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication required")
    }

    const response = await fetch(`${API_URL}/game/question`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameState }),
    })
    const question = await handleResponse(response)
    if (!question || !question.data) {
        throw new Error("Question not found")
    }
    return question.data
}

export async function checkAnswer(questionId: string, gameState: string, answer: string) {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Authentication required")
    }

    const response = await fetch(`${API_URL}/game/check`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameState, questionId, answer }),
    })
    const result = await handleResponse(response)
    if (!result || !result.data) {
        throw new Error("Question not found")
    }
    return result
}
