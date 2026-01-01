from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HabitViewSet, HabitLogViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'habits', HabitViewSet, basename='habit')
router.register(r'logs', HabitLogViewSet, basename='habitlog')

urlpatterns = [
    path('', include(router.urls)),
]