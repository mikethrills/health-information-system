import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { useData } from '../../context/DataContext';
import { Search, Plus, Activity } from 'lucide-react';

const ProgramsList: React.FC = () => {
  const { programs } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPrograms = searchQuery
    ? programs.filter((program) =>
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : programs;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            label=""
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            fullWidth
          />
        </div>
        <Link to="/programs/new">
          <Button>
            <Plus size={18} className="mr-2" />
            Create New Program
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">All Programs ({filteredPrograms.length})</h2>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="text-center py-8">
            <Activity size={48} className="mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">
              {searchQuery ? 'No programs match your search criteria.' : 'No programs have been created yet.'}
            </p>
            {searchQuery ? (
              <Button variant="secondary" className="mt-4" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            ) : (
              <Link to="/programs/new">
                <Button className="mt-4">Create Your First Program</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Activity size={20} className="text-blue-600" />
                    </div>
                    <h3 className="ml-3 text-base font-medium text-gray-900 truncate">
                      {program.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Created {new Date(program.createdAt).toLocaleDateString()}
                    </div>
                    <Link to={`/programs/${program.id}`} className="text-sm text-blue-600 hover:text-blue-800">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProgramsList;