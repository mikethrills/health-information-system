"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import * as authService from "../api/authService"
import type { User } from "../types"

interface AuthContextProps {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      } else if (process.env.NODE_ENV === "development" && !token) {
        // For development, add a console note about authentication
        console.log("Development mode: Use the login form with credentials from Django superuser or test users")
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // Real authentication with Django backend
      const response = await authService.login({ username, password })

      localStorage.setItem("token", response.access)
      localStorage.setItem("refreshToken", response.refresh)
      localStorage.setItem("user", JSON.stringify(response.user))

      setUser(response.user)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

