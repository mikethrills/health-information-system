"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Client, Program, Enrollment } from "../types"

interface DataContextProps {
  clients: Client[]
  programs: Program[]
  enrollments: Enrollment[]
  loading: {
    clients: boolean
    programs: boolean
    enrollments: boolean
  }
  error: {
    clients: string | null
    programs: string | null
    enrollments: string | null
  }
  addClient: (client: Omit<Client, "id" | "createdAt">) => Promise<string>
  addProgram: (program: Omit<Program, "id" | "createdAt">) => Promise<string>
  enrollClientInProgram: (enrollment: Omit<Enrollment, "id">) => Promise<string>
  getClientPrograms: (
    clientId: string,
  ) => Array<Program & { enrollmentId: string; enrollmentDate: string; status: string }>
  getProgramClients: (
    programId: string,
  ) => Array<Client & { enrollmentId: string; enrollmentDate: string; status: string }>
  getClient: (clientId: string) => Client | undefined
  getProgram: (programId: string) => Program | undefined
  updateClientEnrollment: (enrollmentId: string, updates: Partial<Enrollment>) => Promise<void>
  searchClients: (query: string) => Promise<Client[]>
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextProps | undefined>(undefined)

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])

  const [loading, setLoading] = useState({
    clients: true,
    programs: true,
    enrollments: true,
  })

  const [error, setError] = useState({
    clients: null as string | null,
    programs: null as string | null,
    enrollments: null as string | null,
  })

  // Fetch data on component mount
  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    // For now, let's use localStorage data to avoid API issues
    try {
      const storedClients = localStorage.getItem("health-clients")
      const storedPrograms = localStorage.getItem("health-programs")
      const storedEnrollments = localStorage.getItem("health-enrollments")

      setClients(storedClients ? JSON.parse(storedClients) : [])
      setPrograms(storedPrograms ? JSON.parse(storedPrograms) : [])
      setEnrollments(storedEnrollments ? JSON.parse(storedEnrollments) : [])

      setLoading({
        clients: false,
        programs: false,
        enrollments: false,
      })
    } catch (err) {
      console.error("Error loading data:", err)
      setError({
        clients: "Failed to load clients",
        programs: "Failed to load programs",
        enrollments: "Failed to load enrollments",
      })
      setLoading({
        clients: false,
        programs: false,
        enrollments: false,
      })
    }
  }

  const addClient = async (clientData: Omit<Client, "id" | "createdAt">) => {
    try {
      const id = crypto.randomUUID()
      const newClient: Client = {
        ...clientData,
        id,
        createdAt: new Date().toISOString(),
      }

      const updatedClients = [...clients, newClient]
      setClients(updatedClients)
      localStorage.setItem("health-clients", JSON.stringify(updatedClients))

      return id
    } catch (err) {
      console.error("Error creating client:", err)
      throw err
    }
  }

  const addProgram = async (programData: Omit<Program, "id" | "createdAt">) => {
    try {
      const id = crypto.randomUUID()
      const newProgram: Program = {
        ...programData,
        id,
        createdAt: new Date().toISOString(),
      }

      const updatedPrograms = [...programs, newProgram]
      setPrograms(updatedPrograms)
      localStorage.setItem("health-programs", JSON.stringify(updatedPrograms))

      return id
    } catch (err) {
      console.error("Error creating program:", err)
      throw err
    }
  }

  const enrollClientInProgram = async (enrollmentData: Omit<Enrollment, "id">) => {
    try {
      // Check if enrollment already exists
      const existingEnrollment = enrollments.find(
        (e) => e.clientId === enrollmentData.clientId && e.programId === enrollmentData.programId,
      )

      if (existingEnrollment) {
        return existingEnrollment.id
      }

      const id = crypto.randomUUID()
      const newEnrollment: Enrollment = {
        ...enrollmentData,
        id,
      }

      const updatedEnrollments = [...enrollments, newEnrollment]
      setEnrollments(updatedEnrollments)
      localStorage.setItem("health-enrollments", JSON.stringify(updatedEnrollments))

      return id
    } catch (err) {
      console.error("Error creating enrollment:", err)
      throw err
    }
  }

  const getClientPrograms = (clientId: string) => {
    const clientEnrollments = enrollments.filter((e) => e.clientId === clientId)
    return clientEnrollments.map((enrollment) => {
      const program = programs.find((p) => p.id === enrollment.programId)
      if (!program) throw new Error(`Program with ID ${enrollment.programId} not found`)
      return {
        ...program,
        enrollmentId: enrollment.id,
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status,
      }
    })
  }

  const getProgramClients = (programId: string) => {
    const programEnrollments = enrollments.filter((e) => e.programId === programId)
    return programEnrollments.map((enrollment) => {
      const client = clients.find((c) => c.id === enrollment.clientId)
      if (!client) throw new Error(`Client with ID ${enrollment.clientId} not found`)
      return {
        ...client,
        enrollmentId: enrollment.id,
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status,
      }
    })
  }

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId)
  }

  const getProgram = (programId: string) => {
    return programs.find((p) => p.id === programId)
  }

  const updateClientEnrollment = async (enrollmentId: string, updates: Partial<Enrollment>) => {
    try {
      const updatedEnrollments = enrollments.map((enrollment) =>
        enrollment.id === enrollmentId ? { ...enrollment, ...updates } : enrollment,
      )

      setEnrollments(updatedEnrollments)
      localStorage.setItem("health-enrollments", JSON.stringify(updatedEnrollments))
    } catch (err) {
      console.error("Error updating enrollment:", err)
      throw err
    }
  }

  const searchClients = async (query: string) => {
    if (!query.trim()) return clients

    const lowerQuery = query.toLowerCase()
    return clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(lowerQuery) ||
        client.lastName.toLowerCase().includes(lowerQuery) ||
        client.email.toLowerCase().includes(lowerQuery) ||
        client.contactNumber.includes(query),
    )
  }

  return (
    <DataContext.Provider
      value={{
        clients,
        programs,
        enrollments,
        loading,
        error,
        addClient,
        addProgram,
        enrollClientInProgram,
        getClientPrograms,
        getProgramClients,
        getClient,
        getProgram,
        updateClientEnrollment,
        searchClients,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

