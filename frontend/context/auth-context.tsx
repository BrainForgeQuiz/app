"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { registerUser, loginUser, getUserInfo, refreshToken } from "@/lib/auth_api"
import type { User } from "@/types"
import toast from "react-hot-toast"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, email: string) => Promise<void>
  logout: () => Promise<void>
  refreshUserToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserInfo()
    } else {
      setIsLoading(false)
    }
    const refreshInterval = setInterval(
      () => {
        const token = localStorage.getItem("token")
        if (token) {
          refreshUserToken()
        }
      },
      45 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [])

  const fetchUserInfo = async () => {
    try {
      const userData = await getUserInfo()
      setUser(userData?.data || userData)
    } catch (error) {
      localStorage.removeItem("token")
      toast.error("Session expired. Please log in again")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    const loginResponse = await loginUser(username, password)
    const token = loginResponse.data?.token
    if (!token) {
      throw new Error('No token found in login response')
    }
    toast.success("You have been logged in successfully")
    localStorage.setItem("token", token)
    await fetchUserInfo()
  }

  const register = async (username: string, password: string, email: string) => {
    await registerUser(username, password, email)
    toast.success("Registration successful. You can now log in.")
  }

  const logout = async () => {
    try {
      localStorage.removeItem("token")
    } catch (error) {
      toast.error("Logout failed. Please try again.")
    } finally {
      setUser(null)
      toast.success("You logged out successfully")
    }
  }

  const refreshUserToken = async () => {
    try {
      const refreshResponse = await refreshToken()
      const token = refreshResponse.data?.token
      if (!token) {
        throw new Error('No token found in refresh response')
      }
      localStorage.setItem("token", token)
    } catch (error) {
      localStorage.removeItem("token")
      setUser(null)
      toast.error("Session expired. Please log in again")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUserToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
