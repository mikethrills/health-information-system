export interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
}

export interface Program {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Client {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  contactNumber: string
  email: string
  address: string
  createdAt: string
}

export interface Enrollment {
  id: string
  clientId: string
  programId: string
  enrollmentDate: string
  status: "active" | "completed" | "terminated"
  notes?: string
}

export type Gender = "male" | "female" | "other"
export type EnrollmentStatus = "active" | "completed" | "terminated"

