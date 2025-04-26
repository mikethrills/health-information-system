#!/usr/bin/env python
"""
Setup script for Health Information System.
This script will:
1. Install required packages
2. Create and apply migrations
3. Create a superuser (optional)
4. Load sample data (optional)
5. Create default user accounts for testing
"""
import os
import sys
import subprocess
import json
from getpass import getpass

def run_command(command):
    """Run a shell command and print output."""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"Command failed with exit code {result.returncode}")
        sys.exit(1)
    return result

def setup_backend():
    """Set up the Django backend."""
    print("\n=== Setting up Django backend ===")
    
    # Install requirements
    run_command("pip install -r requirements.txt")
    
    # Make migrations
    run_command("python manage.py makemigrations clients")
    
    # Apply migrations
    run_command("python manage.py migrate")
    
    # Create superuser if requested
    create_superuser = input("\nDo you want to create a superuser? (y/n): ").lower() == 'y'
    if create_superuser:
        run_command("python manage.py createsuperuser")
    
    # Create default test users
    create_test_users = input("\nDo you want to create default test users? (y/n): ").lower() == 'y'
    if create_test_users:
        create_default_users()
    
    # Load sample data if requested
    load_sample_data = input("\nDo you want to load sample data? (y/n): ").lower() == 'y'
    if load_sample_data:
        create_sample_data()

def create_default_users():
    """Create default users for testing the application."""
    print("\n=== Creating default test users ===")
    
    # Create a Python script to create users
    with open('create_users.py', 'w') as f:
        f.write("""
from django.contrib.auth.models import User

# Create default users if they don't exist
users = [
    {'username': 'admin', 'password': 'admin123', 'email': 'admin@example.com', 'is_staff': True, 'is_superuser': True},
    {'username': 'doctor', 'password': 'doctor123', 'email': 'doctor@example.com'},
    {'username': 'nurse', 'password': 'nurse123', 'email': 'nurse@example.com'},
]

for user_data in users:
    is_staff = user_data.pop('is_staff', False)
    is_superuser = user_data.pop('is_superuser', False)
    username = user_data['username']
    password = user_data.pop('password')
    
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_user(username=username, **user_data)
        user.set_password(password)
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.save()
        print(f"Created user: {username}")
    else:
        print(f"User {username} already exists")

print("Default users created successfully!")
""")
    
    # Run the script using Django's shell
    run_command("python manage.py shell < create_users.py")
    
    # Clean up
    os.remove('create_users.py')
    print("Default users created successfully!")

def create_sample_data():
    """Create sample data for the application."""
    print("\n=== Creating sample data ===")
    
    # Sample programs
    programs = [
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
    clients = [
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
    
    # Create a Python script to load the data
    with open('load_sample_data.py', 'w') as f:
        f.write("""
from clients.models import Program, Client, Enrollment
from django.utils import timezone
import json
import datetime

# Load programs
programs_data = %s

for program_data in programs_data:
    Program.objects.create(
        name=program_data['name'],
        description=program_data['description']
    )

# Load clients
clients_data = %s

for client_data in clients_data:
    Client.objects.create(
        first_name=client_data['first_name'],
        last_name=client_data['last_name'],
        date_of_birth=client_data['date_of_birth'],
        gender=client_data['gender'],
        contact_number=client_data['contact_number'],
        email=client_data['email'],
        address=client_data['address']
    )

# Create some enrollments
clients = Client.objects.all()
programs = Program.objects.all()

# Enroll first client in first and second program
if clients.count() > 0 and programs.count() > 1:
    Enrollment.objects.create(
        client=clients[0],
        program=programs[0],
        enrollment_date=datetime.date.today(),
        status='active'
    )
    Enrollment.objects.create(
        client=clients[0],
        program=programs[1],
        enrollment_date=datetime.date.today() - datetime.timedelta(days=30),
        status='active'
    )

# Enroll second client in second and third program
if clients.count() > 1 and programs.count() > 2:
    Enrollment.objects.create(
        client=clients[1],
        program=programs[1],
        enrollment_date=datetime.date.today() - datetime.timedelta(days=15),
        status='active'
    )
    Enrollment.objects.create(
        client=clients[1],
        program=programs[2],
        enrollment_date=datetime.date.today() - datetime.timedelta(days=45),
        status='completed'
    )

print("Sample data loaded successfully!")
""" % (json.dumps(programs, indent=4), json.dumps(clients, indent=4)))
    
    # Run the script using Django's shell
    run_command("python manage.py shell < load_sample_data.py")
    
    # Clean up
    os.remove('load_sample_data.py')
    print("Sample data created successfully!")

if __name__ == "__main__":
    setup_backend()
    print("\n=== Setup completed successfully! ===")
    print("\nTo start the Django development server:")
    print("  python manage.py runserver")
    print("\nTo start the React development server:")
    print("  npm run dev")

