# Health Information System

A comprehensive health information system for managing clients and health programs/services.

## Features

- Create and manage health programs (TB, Malaria, HIV, etc.)
- Register and manage clients
- Enroll clients in multiple health programs
- Search for clients
- View client profiles with their enrolled programs
- JWT Authentication for API security
- Comprehensive test coverage
- Docker deployment support

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL (production) / SQLite (development)
- JWT Authentication
- Swagger API Documentation

### Frontend
- React with TypeScript
- React Router
- Tailwind CSS
- Context API for state management

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 16+
- npm or yarn
- PostgreSQL (for production)

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/health-information-system.git
   cd health-information-system
   \`\`\`

2. Set up the backend
   \`\`\`bash
   # Create a virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Apply migrations
   python manage.py migrate
   
   # Create a superuser
   python manage.py createsuperuser
   
   # Create test users (optional)
   python manage.py shell < create_users.py
   
   # Load sample data (optional)
   python manage.py shell < load_sample_data.py
   
   # Start the development server
   python manage.py runserver
   \`\`\`

3. Set up the frontend
   \`\`\`bash
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   \`\`\`

4. Open your browser and navigate to http://localhost:3000

## Authentication

The system uses JWT (JSON Web Token) authentication. The following test users are available after running the create_users.py script:

- Admin User: 
  - Username: `admin`
  - Password: `admin123`
  
- Doctor User:
  - Username: `doctor`
  - Password: `doctor123`
  
- Nurse User:
  - Username: `nurse`
  - Password: `nurse123`

## API Documentation

API documentation is available at:
- Swagger UI: `/swagger/`
- ReDoc: `/redoc/`

## Testing

Run backend tests:
\`\`\`bash
python manage.py test
\`\`\`

Run frontend tests:
\`\`\`bash
npm test
\`\`\`

## Deployment

### Using Docker

1. Create a `.env` file based on `.env.example`
2. Build and run the Docker containers
   \`\`\`bash
   docker-compose up -d
   \`\`\`

### Manual Deployment

1. Set up a PostgreSQL database
2. Configure environment variables:
   \`\`\`
   SECRET_KEY=your-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_HOST=your-db-host
   DB_PORT=5432
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   \`\`\`
3. Install production dependencies:
   \`\`\`bash
   pip install gunicorn psycopg2-binary
   \`\`\`
4. Collect static files:
   \`\`\`bash
   python manage.py collectstatic --settings=health_system.settings_prod
   \`\`\`
5. Run migrations:
   \`\`\`bash
   python manage.py migrate --settings=health_system.settings_prod
   \`\`\`
6. Start the server with Gunicorn:
   \`\`\`bash
   gunicorn --env DJANGO_SETTINGS_MODULE=health_system.settings_prod health_system.wsgi:application
   \`\`\`

## Security Considerations

- JWT authentication for API endpoints
- Input validation and sanitization
- CORS configuration for API access
- Environment variables for sensitive information
- HTTPS enforcement in production
- Secure cookie settings
- Database connection security

## Project Structure

\`\`\`
health_information_system/
├── clients/                  # Django app for client management
│   ├── models.py             # Database models
│   ├── serializers.py        # API serializers
│   ├── views.py              # API views
│   ├── urls.py               # API URL routing
│   └── tests.py              # Tests for the app
├── health_system/            # Django project settings
│   ├── settings.py           # Development settings
│   ├── settings_prod.py      # Production settings
│   ├── urls.py               # Main URL routing
│   └── wsgi.py               # WSGI configuration
├── src/                      # React frontend
│   ├── api/                  # API service functions
│   ├── components/           # Reusable UI components
│   ├── context/              # React context providers
│   ├── pages/                # Page components
│   └── types/                # TypeScript type definitions
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
├── docker-compose.yml        # Docker configuration
└── README.md                 # Project documentation
\`\`\`

## License

This project is licensed under the MIT License.
