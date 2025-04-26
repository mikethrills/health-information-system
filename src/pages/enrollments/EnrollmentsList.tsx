import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { useData } from '../../context/DataContext';
import { Search, ListPlus, Filter } from 'lucide-react';

const EnrollmentsList: React.FC = () => {
  const { enrollments, clients, programs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Combine data for display
  const enrollmentsWithDetails = useMemo(() => {
    return enrollments.map((enrollment) => {
      const client = clients.find((c) => c.id === enrollment.clientId);
      const program = programs.find((p) => p.id === enrollment.programId);
      
      return {
        ...enrollment,
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown Client',
        programName: program ? program.name : 'Unknown Program',
      };
    });
  }, [enrollments, clients, programs]);
  
  // Apply filters
  const filteredEnrollments = enrollmentsWithDetails.filter((enrollment) => {
    const matchesSearch =
      enrollment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.programName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              label=""
              type="text"
              placeholder="Search enrollments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
        <Link to="/enrollments/new">
          <Button>
            <ListPlus size={18} className="mr-2" />
            New Enrollment
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">All Enrollments ({filteredEnrollments.length})</h2>
        </div>

        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-8">
            <ListPlus size={48} className="mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'No enrollments match your search criteria.' 
                : 'No enrollments have been created yet.'}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <Button 
                variant="secondary" 
                className="mt-4" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Link to="/enrollments/new">
                <Button className="mt-4">Create Your First Enrollment</Button>
              </Link>
            )}
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
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/clients/${enrollment.clientId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {enrollment.clientName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/programs/${enrollment.programId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {enrollment.programName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          enrollment.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : enrollment.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/clients/${enrollment.clientId}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Client
                      </Link>
                      <Link
                        to={`/programs/${enrollment.programId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Program
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EnrollmentsList;