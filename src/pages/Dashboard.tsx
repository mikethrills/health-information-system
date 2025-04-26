"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Card from "../components/UI/Card"
import Button from "../components/UI/Button"
import { Users, Activity, ListPlus, Loader } from "lucide-react"
import { useData } from "../context/DataContext"

const Dashboard: React.FC = () => {
  const { clients, programs, enrollments, loading, refreshData } = useData()
  const [recentClients, setRecentClients] = useState<typeof clients>([])
  const [recentPrograms, setRecentPrograms] = useState<typeof programs>([])

  useEffect(() => {
    // Refresh data when component mounts
    refreshData()
  }, [refreshData])

  useEffect(() => {
    // Get 5 most recent clients
    if (!loading.clients && clients.length > 0) {
      const sortedClients = [...clients]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      setRecentClients(sortedClients)
    }

    // Get 5 most recent programs
    if (!loading.programs && programs.length > 0) {
      const sortedPrograms = [...programs]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      setRecentPrograms(sortedPrograms)
    }
  }, [clients, programs, loading])

  if (loading.clients || loading.programs || loading.enrollments) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader size={40} className="animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-blue-600">Total Clients</h2>
              <p className="text-2xl font-bold">{clients.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-green-50 border border-green-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Activity size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-green-600">Health Programs</h2>
              <p className="text-2xl font-bold">{programs.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-purple-50 border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <ListPlus size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-purple-600">Enrollments</h2>
              <p className="text-2xl font-bold">{enrollments.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/clients/new">
            <Button>
              <Users size={18} className="mr-2" />
              Register New Client
            </Button>
          </Link>
          <Link to="/programs/new">
            <Button variant="secondary">
              <Activity size={18} className="mr-2" />
              Create New Program
            </Button>
          </Link>
          <Link to="/enrollments/new">
            <Button variant="success">
              <ListPlus size={18} className="mr-2" />
              New Enrollment
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recent Clients</h2>
            <Link to="/clients" className="text-blue-500 text-sm hover:text-blue-700">
              View All
            </Link>
          </div>
          {recentClients.length === 0 ? (
            <p className="text-gray-500">No clients registered yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentClients.map((client) => (
                <li key={client.id} className="py-3">
                  <Link to={`/clients/${client.id}`} className="flex items-center hover:bg-gray-50 p-2 rounded">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-medium">
                        {client.firstName[0]}
                        {client.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recent Programs</h2>
            <Link to="/programs" className="text-blue-500 text-sm hover:text-blue-700">
              View All
            </Link>
          </div>
          {recentPrograms.length === 0 ? (
            <p className="text-gray-500">No programs created yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentPrograms.map((program) => (
                <li key={program.id} className="py-3">
                  <Link to={`/programs/${program.id}`} className="flex items-center hover:bg-gray-50 p-2 rounded">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Activity size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{program.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{program.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

