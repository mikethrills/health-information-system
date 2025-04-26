"use client"

import type React from "react"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import { useAuth } from "./context/AuthContext"
import Login from "./pages/auth/Login"
import { Loader } from "lucide-react"

// Pages
import Dashboard from "./pages/Dashboard"

// Client pages
import ClientsList from "./pages/clients/ClientsList"
import ClientForm from "./pages/clients/ClientForm"
import ClientDetail from "./pages/clients/ClientDetail"

// Program pages
import ProgramsList from "./pages/programs/ProgramsList"
import ProgramForm from "./pages/programs/ProgramForm"
import ProgramDetail from "./pages/programs/ProgramDetail"

// Enrollment pages
import EnrollmentsList from "./pages/enrollments/EnrollmentsList"
import EnrollmentForm from "./pages/enrollments/EnrollmentForm"

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size={40} className="animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Clients routes */}
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Layout>
              <ClientsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/new"
        element={
          <ProtectedRoute>
            <Layout>
              <ClientForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ClientDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Programs routes */}
      <Route
        path="/programs"
        element={
          <ProtectedRoute>
            <Layout>
              <ProgramsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/programs/new"
        element={
          <ProtectedRoute>
            <Layout>
              <ProgramForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/programs/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ProgramDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Enrollments routes */}
      <Route
        path="/enrollments"
        element={
          <ProtectedRoute>
            <Layout>
              <EnrollmentsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/enrollments/new"
        element={
          <ProtectedRoute>
            <Layout>
              <EnrollmentForm />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

