from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from .models import Client, Program, Enrollment
import json
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class BaseAPITestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.username = 'testuser'
        self.password = 'testpassword'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password
        )
        
        # Get JWT token
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        
        # Setup API client
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # Create test data
        self.program = Program.objects.create(
            name='Test Program',
            description='Test Description'
        )
        
        self.client_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'date_of_birth': '1990-01-01',
            'gender': 'M',
            'contact_number': '1234567890',
            'email': 'john@example.com',
            'address': '123 Main St'
        }
        
        self.test_client = Client.objects.create(**self.client_data)

class ClientAPITest(BaseAPITestCase):
    def test_create_client(self):
        url = reverse('client-list')
        response = self.client.post(
            url, 
            data=json.dumps({
                'first_name': 'Jane',
                'last_name': 'Smith',
                'date_of_birth': '1992-05-15',
                'gender': 'F',
                'contact_number': '9876543210',
                'email': 'jane@example.com',
                'address': '456 Oak St'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Client.objects.count(), 2)
        self.assertEqual(Client.objects.filter(first_name='Jane').count(), 1)

    def test_get_client_list(self):
        url = reverse('client-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_client_detail(self):
        url = reverse('client-detail', args=[self.test_client.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'John')

    def test_update_client(self):
        url = reverse('client-detail', args=[self.test_client.id])
        response = self.client.patch(
            url,
            data=json.dumps({'first_name': 'Johnny'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.test_client.refresh_from_db()
        self.assertEqual(self.test_client.first_name, 'Johnny')

    def test_delete_client(self):
        url = reverse('client-detail', args=[self.test_client.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Client.objects.count(), 0)

class ProgramAPITest(BaseAPITestCase):
    def test_create_program(self):
        url = reverse('program-list')
        response = self.client.post(
            url, 
            data=json.dumps({
                'name': 'New Program',
                'description': 'New Description'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Program.objects.count(), 2)
        self.assertEqual(Program.objects.filter(name='New Program').count(), 1)

    def test_get_program_list(self):
        url = reverse('program-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

class EnrollmentAPITest(BaseAPITestCase):
    def test_create_enrollment(self):
        url = reverse('enrollment-list')
        response = self.client.post(
            url, 
            data=json.dumps({
                'client': self.test_client.id,
                'program': self.program.id,
                'enrollment_date': '2023-01-01',
                'status': 'active',
                'notes': 'Test notes'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Enrollment.objects.count(), 1)
        
    def test_get_client_enrollments(self):
        # Create an enrollment
        Enrollment.objects.create(
            client=self.test_client,
            program=self.program,
            enrollment_date='2023-01-01',
            status='active'
        )
        
        url = f"{reverse('enrollment-list')}?client={self.test_client.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

