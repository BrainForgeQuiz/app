import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function handleResponse(response: Response) {
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