"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Card from "../../components/UI/Card"
import Button from "../../components/UI/Button"
import Input from "../../components/UI/Input"
import { useAuth } from "../../context/AuthContext"
import { ActivitySquare, AlertCircle, Loader } from "lucide-react"

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(formData.username, formData.password)
      navigate("/")
    } catch (err) {
      // Error is handled in the auth context
      console.error("Login submission error:", err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <ActivitySquare className="h-12 w-12 text-blue-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Health Information System</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access the system</p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="text-red-500 mr-2 h-5 w-5 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />

            <div>
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Note: Use credentials created in Django.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login

