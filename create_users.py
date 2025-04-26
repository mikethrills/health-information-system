# Simple script to create test users
from django.contrib.auth.models import User

# Check if admin user exists, if not create it
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_user('admin', 'admin@example.com', 'admin123')
    admin.is_staff = True
    admin.is_superuser = True
    admin.save()
    print("Created admin user")
else:
    print("Admin user already exists")

# Check if doctor user exists, if not create it
if not User.objects.filter(username='doctor').exists():
    User.objects.create_user('doctor', 'doctor@example.com', 'doctor123')
    print("Created doctor user")
else:
    print("Doctor user already exists")

# Check if nurse user exists, if not create it
if not User.objects.filter(username='nurse').exists():
    User.objects.create_user('nurse', 'nurse@example.com', 'nurse123')
    print("Created nurse user")
else:
    print("Nurse user already exists")

print("User creation completed")

