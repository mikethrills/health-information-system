from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ProgramViewSet, EnrollmentViewSet, login_view, register_view, user_profile

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'enrollments', EnrollmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_view, name='login'),
    path('auth/register/', register_view, name='register'),
    path('auth/me/', user_profile, name='user-profile'),
]

