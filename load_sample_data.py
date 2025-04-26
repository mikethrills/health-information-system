from clients.models import Program, Client, Enrollment
from django.utils import timezone
import datetime

# Sample programs
programs_data = [
    {
        "name": "Tuberculosis Control Program",
        "description": "A comprehensive program for TB prevention, diagnosis, and treatment."
    },
    {
        "name": "Malaria Prevention Program",
        "description": "Program focused on preventing malaria through education and distribution of mosquito nets."
    },
    {
        "name": "HIV/AIDS Support Program",
        "description": "Support and treatment program for individuals living with HIV/AIDS."
    },
    {
        "name": "Maternal Health Program",
        "description": "Program providing prenatal and postnatal care for mothers and infants."
    },
    {
        "name": "Diabetes Management Program",
        "description": "Program for managing diabetes through education, monitoring, and treatment."
    }
]

# Sample clients
clients_data = [
    {
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1985-05-15",
        "gender": "M",
        "contact_number": "1234567890",
        "email": "john.doe@example.com",
        "address": "123 Main St, Anytown"
    },
    {
        "first_name": "Jane",
        "last_name": "Smith",
        "date_of_birth": "1990-08-22",
        "gender": "F",
        "contact_number": "9876543210",
        "email": "jane.smith@example.com",
        "address": "456 Oak Ave, Somewhere"
    },
    {
        "first_name": "Michael",
        "last_name": "Johnson",
        "date_of_birth": "1978-11-30",
        "gender": "M",
        "contact_number": "5551234567",
        "email": "michael.j@example.com",
        "address": "789 Pine Rd, Nowhere"
    },
    {
        "first_name": "Sarah",
        "last_name": "Williams",
        "date_of_birth": "1995-03-12",
        "gender": "F",
        "contact_number": "3334445555",
        "email": "sarah.w@example.com",
        "address": "101 Elm St, Anywhere"
    },
    {
        "first_name": "David",
        "last_name": "Brown",
        "date_of_birth": "1982-07-08",
        "gender": "M",
        "contact_number": "7778889999",
        "email": "david.b@example.com",
        "address": "202 Maple Dr, Everywhere"
    }
]

# Load programs
for program_data in programs_data:
    if not Program.objects.filter(name=program_data['name']).exists():
        Program.objects.create(
            name=program_data['name'],
            description=program_data['description']
        )
        print(f"Created program: {program_data['name']}")
    else:
        print(f"Program {program_data['name']} already exists")

# Load clients
for client_data in clients_data:
    if not Client.objects.filter(first_name=client_data['first_name'], last_name=client_data['last_name']).exists():
        Client.objects.create(
            first_name=client_data['first_name'],
            last_name=client_data['last_name'],
            date_of_birth=client_data['date_of_birth'],
            gender=client_data['gender'],
            contact_number=client_data['contact_number'],
            email=client_data['email'],
            address=client_data['address']
        )
        print(f"Created client: {client_data['first_name']} {client_data['last_name']}")
    else:
        print(f"Client {client_data['first_name']} {client_data['last_name']} already exists")

# Create some enrollments
clients = Client.objects.all()
programs = Program.objects.all()

# Enroll first client in first and second program
if clients.count() > 0 and programs.count() > 1:
    client = clients[0]
    program1 = programs[0]
    program2 = programs[1]
    
    if not Enrollment.objects.filter(client=client, program=program1).exists():
        Enrollment.objects.create(
            client=client,
            program=program1,
            enrollment_date=datetime.date.today(),
            status='active'
        )
        print(f"Enrolled {client.first_name} in {program1.name}")
    
    if not Enrollment.objects.filter(client=client, program=program2).exists():
        Enrollment.objects.create(
            client=client,
            program=program2,
            enrollment_date=datetime.date.today() - datetime.timedelta(days=30),
            status='active'
        )
        print(f"Enrolled {client.first_name} in {program2.name}")

# Enroll second client in second and third program
if clients.count() > 1 and programs.count() > 2:
    client = clients[1]
    program2 = programs[1]
    program3 = programs[2]
    
    if not Enrollment.objects.filter(client=client, program=program2).exists():
        Enrollment.objects.create(
            client=client,
            program=program2,
            enrollment_date=datetime.date.today() - datetime.timedelta(days=15),
            status='active'
        )
        print(f"Enrolled {client.first_name} in {program2.name}")
    
    if not Enrollment.objects.filter(client=client, program=program3).exists():
        Enrollment.objects.create(
            client=client,
            program=program3,
            enrollment_date=datetime.date.today() - datetime.timedelta(days=45),
            status='completed'
        )
        print(f"Enrolled {client.first_name} in {program3.name}")

print("Sample data loaded successfully!")

