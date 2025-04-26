import type { Client, Program, Enrollment } from "../types"

// Base API URL
const API_BASE_URL = "/api"

// Helper to handle response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An unknown error occurred" }))
    throw new Error(error.message || "An error occurred")
  }
  return response.json()
}

// Get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Client APIs
export const getClients = async (): Promise<Client[]> => {
  const response = await fetch(`${API_BASE_URL}/clients/`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  const data = await handleResponse(response)
  return data.results || data
}

export const getClient = async (id: string): Promise<Client> => {
  const response = await fetch(`${API_BASE_URL}/clients/${id}/`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

export const createClient = async (client: Omit<Client, "id" | "createdAt">): Promise<Client> => {
  const response = await fetch(`${API_BASE_URL}/clients/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      first_name: client.firstName,
      last_name: client.lastName,
      date_of_birth: client.dateOfBirth,
      gender: client.gender.charAt(0).toUpperCase(),
      contact_number: client.contactNumber,
      email: client.email,
      address: client.address,
    }),
  })
  return handleResponse(response)
}

export const searchClients = async (query: string): Promise<Client[]> => {
  const response = await fetch(`${API_BASE_URL}/clients/?search=${encodeURIComponent(query)}`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  const data = await handleResponse(response)
  return data.results || data
}

// Program APIs
export const getPrograms = async (): Promise<Program[]> => {
  const response = await fetch(`${API_BASE_URL}/programs/`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  const data = await handleResponse(response)
  return data.results || data
}

export const getProgram = async (id: string): Promise<Program> => {
  const response = await fetch(`${API_BASE_URL}/programs/${id}/`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

export const createProgram = async (program: Omit<Program, "id" | "createdAt">): Promise<Program> => {
  const response = await fetch(`${API_BASE_URL}/programs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      name: program.name,
      description: program.description,
    }),
  })
  return handleResponse(response)
}

// Enrollment APIs
export const getEnrollments = async (): Promise<Enrollment[]> => {
  const response = await fetch(`${API_BASE_URL}/enrollments/`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  const data = await handleResponse(response)
  return data.results || data
}

export const createEnrollment = async (enrollment: Omit<Enrollment, "id">): Promise<Enrollment> => {
  const response = await fetch(`${API_BASE_URL}/enrollments/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      client: enrollment.clientId,
      program: enrollment.programId,
      enrollment_date: enrollment.enrollmentDate,
      status: enrollment.status,
      notes: enrollment.notes || "",
    }),
  })
  return handleResponse(response)
}

export const updateEnrollmentStatus = async (id: string, status: Enrollment["status"]): Promise<Enrollment> => {
  const response = await fetch(`${API_BASE_URL}/enrollments/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  })
  return handleResponse(response)
}

export const getClientEnrollments = async (clientId: string): Promise<Enrollment[]> => {
  const response = await fetch(`${API_BASE_URL}/enrollments/?client=${clientId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  const data = await handleResponse(response)
  return data.results || data
}

export const getProgramEnrollments = async (programId: string): Promise<Enrollment[]> => {
  const response = await fetch(`${API_BASE_URL}/enrollments/?program=${programId}`, {
    headers: {
      ...getAuthHeaders(),
    },
  })
  const data = await handleResponse(response)
  return data.results || data
}

// Helper function to convert Django model to frontend model
export const convertClientFromApi = (apiClient: any): Client => {
  return {
    id: apiClient.id,
    firstName: apiClient.first_name,
    lastName: apiClient.last_name,
    dateOfBirth: apiClient.date_of_birth,
    gender: apiClient.gender === "M" ? "male" : apiClient.gender === "F" ? "female" : "other",
    contactNumber: apiClient.contact_number,
    email: apiClient.email,
    address: apiClient.address,
    createdAt: apiClient.created_at,
  }
}

export const convertProgramFromApi = (apiProgram: any): Program => {
  return {
    id: apiProgram.id,
    name: apiProgram.name,
    description: apiProgram.description,
    createdAt: apiProgram.created_at,
  }
}

export const convertEnrollmentFromApi = (apiEnrollment: any): Enrollment => {
  return {
    id: apiEnrollment.id,
    clientId: apiEnrollment.client,
    programId: apiEnrollment.program,
    enrollmentDate: apiEnrollment.enrollment_date,
    status: apiEnrollment.status,
    notes: apiEnrollment.notes,
  }
}

