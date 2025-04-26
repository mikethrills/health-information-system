import { Client, Program, Enrollment } from '../types';

// This file would typically be used in development to mock API responses
// In a real environment, this would be replaced with an actual backend API

// Example of how you could setup a mock API server using an approach like MSW
export const setupMockServer = () => {
  // Mock implementation for the API endpoints
  // This is just a stub and would need to be implemented with a real mocking library
  const handlers = [
    // Handle GET /api/clients
    {
      url: '/api/clients',
      method: 'GET',
      response: (req: Request) => {
        // Return mock clients from localStorage
        const clients = localStorage.getItem('health-clients');
        return clients ? JSON.parse(clients) : [];
      },
    },
    
    // Handle GET /api/clients/:id
    {
      url: new RegExp('/api/clients/[^/]+$'),
      method: 'GET',
      response: (req: Request) => {
        const id = req.url.split('/').pop();
        const clients = JSON.parse(localStorage.getItem('health-clients') || '[]');
        const client = clients.find((c: Client) => c.id === id);
        return client || { error: 'Client not found' };
      },
    },
    
    // Similar handlers for other endpoints would be defined here
  ];

  // Actual implementation would intercept fetch calls
  // and respond with mock data
  console.log('Mock API server is set up for development');
};

// Notes for implementing a real mock server:
// 1. Install MSW (Mock Service Worker) or similar library
// 2. Define handlers for each endpoint
// 3. Initialize the mock server in development
// 4. Handle CRUD operations using localStorage