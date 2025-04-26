// API functions for handling authentication
import type { User } from "../types"

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  access: string
  refresh: string
  user: User
}

interface RegisterData {
  username: string
  password: string
  email: string
  first_name?: string
  last_name?: string
}

const API_URL = "/api"

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.error || "Login failed")
  }

  return response.json()
}

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.error || "Registration failed")
  }

  return response.json()
}

export const getUserProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  return response.json()
}

export const refreshToken = async (refreshToken: string): Promise<{ access: string }> => {
  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!response.ok) {
    throw new Error("Failed to refresh token")
  }

  return response.json()
}

