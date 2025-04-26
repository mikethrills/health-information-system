import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useData } from '../../context/DataContext';
import { Calendar, Activity, User, ListPlus } from 'lucide-react';

const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProgram, getProgramClients } = useData();
  
  if (!id) {
    return <div>Program ID is required</div>;
  }
  
  const program = getProgram(id);
  const enrolledClients = getProgramClients(id);
  
  if (!program) {
    return (
      <Card>
        <div className="text-center py-8">
          <Activity size={48} className="mx-auto text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Program Not Found</h2>
          <p className="mt-1 text-sm text-gray-500">
            The program you're looking for does not exist or has been removed.
          </p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate('/programs')}>
            Back to Programs
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
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
              <p className="text-sm text-gray-500">
                Program ID: {id.substring(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to={`/enrollments/new?programId=${id}`}>
              <Button>
                <ListPlus size={18} className="mr-2" />
                Enroll Client
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-2">Program Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{program.description}</p>
          
          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>Created on {formatDate(program.createdAt)}</span>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-4">Enrolled Clients ({enrolledClients.length})</h2>
          
          {enrolledClients.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <User size={32} className="mx-auto text-gray-400" />
              <h3 className="mt-2 text-base font-medium text-gray-900">No Clients</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no clients enrolled in this program yet.
              </p>
              <Link to={`/enrollments/new?programId=${id}`}>
                <Button className="mt-4">Enroll a Client</Button>
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
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact Information
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
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {client.firstName[0]}{client.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.contactNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(client.enrollmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : client.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/clients/${client.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Client
                        </Link>
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

export default ProgramDetail;