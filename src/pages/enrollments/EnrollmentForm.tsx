import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import { useData } from '../../context/DataContext';
import { EnrollmentStatus } from '../../types';

const EnrollmentForm: React.FC = () => {
  const { clients, programs, enrollClientInProgram } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedClientId = queryParams.get('clientId');
  const preselectedProgramId = queryParams.get('programId');
  
  const [formData, setFormData] = useState({
    clientId: preselectedClientId || '',
    programId: preselectedProgramId || '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'active' as EnrollmentStatus,
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Navigate to appropriate view based on pre-selection
  useEffect(() => {
    if (formData.clientId && formData.programId) {
      // Both client and program are preselected, stay on form
    } else if (formData.clientId) {
      // Set page title or focus
    } else if (formData.programId) {
      // Set page title or focus
    }
  }, [formData.clientId, formData.programId]);
  
  const handleClientChange = (value: string) => {
    setFormData((prev) => ({ ...prev, clientId: value }));
    if (errors.clientId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.clientId;
        return newErrors;
      });
    }
  };
  
  const handleProgramChange = (value: string) => {
    setFormData((prev) => ({ ...prev, programId: value }));
    if (errors.programId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.programId;
        return newErrors;
      });
    }
  };
  
  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as EnrollmentStatus }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.clientId) {
      newErrors.clientId = 'Client is required';
    }
    
    if (!formData.programId) {
      newErrors.programId = 'Program is required';
    }
    
    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = 'Enrollment date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      enrollClientInProgram({
        clientId: formData.clientId,
        programId: formData.programId,
        enrollmentDate: formData.enrollmentDate,
        status: formData.status,
        notes: formData.notes,
      });
      
      // Navigate based on context
      if (preselectedClientId) {
        navigate(`/clients/${preselectedClientId}`);
      } else if (preselectedProgramId) {
        navigate(`/programs/${preselectedProgramId}`);
      } else {
        navigate('/enrollments');
      }
    }
  };
  
  // Prepare option lists
  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: `${client.firstName} ${client.lastName}`,
  }));
  
  const programOptions = programs.map((program) => ({
    value: program.id,
    label: program.name,
  }));
  
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'terminated', label: 'Terminated' },
  ];
  
  return (
    <Card>
      <h2 className="text-lg font-medium mb-6">New Program Enrollment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Client"
            options={clientOptions}
            value={formData.clientId}
            onChange={handleClientChange}
            error={errors.clientId}
            fullWidth
            disabled={!!preselectedClientId}
          />
          
          <Select
            label="Program"
            options={programOptions}
            value={formData.programId}
            onChange={handleProgramChange}
            error={errors.programId}
            fullWidth
            disabled={!!preselectedProgramId}
          />
          
          <div>
            <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700">
              Enrollment Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="enrollmentDate"
                id="enrollmentDate"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={formData.enrollmentDate}
                onChange={handleChange}
                aria-invalid={errors.enrollmentDate ? 'true' : 'false'}
                aria-describedby={errors.enrollmentDate ? 'enrollmentDate-error' : undefined}
              />
            </div>
            {errors.enrollmentDate && (
              <p className="mt-2 text-sm text-red-600" id="enrollmentDate-error">
                {errors.enrollmentDate}
              </p>
            )}
          </div>
          
          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={handleStatusChange}
            fullWidth
          />
          
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <div className="mt-1">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (preselectedClientId) {
                navigate(`/clients/${preselectedClientId}`);
              } else if (preselectedProgramId) {
                navigate(`/programs/${preselectedProgramId}`);
              } else {
                navigate('/enrollments');
              }
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Enroll Client</Button>
        </div>
      </form>
    </Card>
  );
};

export default EnrollmentForm;