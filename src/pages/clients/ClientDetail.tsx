import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useData } from '../../context/DataContext';
import { Calendar, User, Mail, Phone, MapPin, Clock, Tags, ListPlus } from 'lucide-react';
import { EnrollmentStatus } from '../../types';

const StatusBadge: React.FC<{ status: EnrollmentStatus }> = ({ status }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    terminated: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClient, getClientPrograms, updateClientEnrollment } = useData();
  const [showUpdateStatus, setShowUpdateStatus] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EnrollmentStatus>('active');

  if (!id) {
    return <div>Client ID is required</div>;
  }

  const client = getClient(id);
  const enrolledPrograms = getClientPrograms(id);

  if (!client) {
    return (
      <Card>
        <div className="text-center py-8">
          <User size={48} className="mx-auto text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Client Not Found</h2>
          <p className="mt-1 text-sm text-gray-500">The client you're looking for does not exist or has been removed.</p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('/clients')}>
            Back to Clients
          </Button>
        </div>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStatusUpdate = (enrollmentId: string) => {
    updateClientEnrollment(enrollmentId, { status: selectedStatus });
    setShowUpdateStatus(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl font-medium">
                {client.firstName[0]}{client.lastName[0]}
              </span>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {client.firstName} {client.lastName}
              </h1>
              <p className="text-sm text-gray-500">
                Client ID: {id.substring(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/enrollments/new?clientId=${id}`}>
              <Button>
                <ListPlus size={18} className="mr-2" />
                Enroll in Program
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar size={20} className="text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{formatDate(client.dateOfBirth)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User size={20} className="text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900">{client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail size={20} className="text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={20} className="text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{client.contactNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={20} className="text-gray-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{client.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Enrollment History</h2>
            <p className="text-sm text-gray-500">
              Registered on {formatDate(client.createdAt)}
            </p>
          </div>
          
          {enrolledPrograms.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Tags size={32} className="mx-auto text-gray-400" />
              <h3 className="mt-2 text-base font-medium text-gray-900">No Programs</h3>
              <p className="mt-1 text-sm text-gray-500">
                This client is not enrolled in any health programs yet.
              </p>
              <Link to={`/enrollments/new?clientId=${id}`}>
                <Button className="mt-4">Enroll in a Program</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Program
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Enrollment Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledPrograms.map((program) => (
                    <tr key={program.enrollmentId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Tags size={16} className="text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{program.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{formatDate(program.enrollmentDate)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={program.status as EnrollmentStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {showUpdateStatus === program.enrollmentId ? (
                          <div className="flex items-center space-x-2">
                            <select
                              className="text-sm rounded border-gray-300"
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value as EnrollmentStatus)}
                            >
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                              <option value="terminated">Terminated</option>
                            </select>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(program.enrollmentId)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setShowUpdateStatus(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedStatus(program.status as EnrollmentStatus);
                              setShowUpdateStatus(program.enrollmentId);
                            }}
                          >
                            Update Status
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ClientDetail;