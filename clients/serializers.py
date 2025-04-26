from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Client, Program, Enrollment
from django.core.validators import RegexValidator, EmailValidator

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['id', 'name', 'description', 'created_at']

class EnrollmentSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'client', 'program', 'program_name', 'enrollment_date', 'status', 'notes']

class ClientSerializer(serializers.ModelSerializer):
    # Add validators
    contact_number = serializers.CharField(
        validators=[RegexValidator(r'^\d{10,15}$', 'Enter a valid phone number.')]
    )
    email = serializers.EmailField(validators=[EmailValidator()])
    
    class Meta:
        model = Client
        fields = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 
                  'contact_number', 'email', 'address', 'created_at']
        
    def validate_date_of_birth(self, value):
        """
        Check that the date of birth is not in the future.
        """
        import datetime
        if value > datetime.date.today():
            raise serializers.ValidationError("Date of birth cannot be in the future")
        return value

class ClientProfileSerializer(serializers.ModelSerializer):
    enrollments = serializers.SerializerMethodField()
    
    class Meta:
        model = Client
        fields = ['id', 'first_name', 'last_name', 'date_of_birth', 'gender', 
                  'contact_number', 'email', 'address', 'created_at', 'enrollments']
    
    def get_enrollments(self, obj):
        enrollments = Enrollment.objects.filter(client=obj)
        return [{
            'id': enrollment.id,
            'program_id': enrollment.program.id,
            'program_name': enrollment.program.name,
            'program_description': enrollment.program.description,
            'enrollment_date': enrollment.enrollment_date,
            'status': enrollment.status,
            'notes': enrollment.notes
        } for enrollment in enrollments]

