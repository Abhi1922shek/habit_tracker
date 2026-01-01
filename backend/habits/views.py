from rest_framework import viewsets, permissions
from .models import Habit, HabitLog
from .serializers import HabitSerializer, HabitLogSerializer

# 1. Viewset for Habits (CRUD)
class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated] # Only logged in users

    def get_queryset(self):
        # Only return habits belonging to the current user
        return Habit.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically assign the new habit to the current user
        serializer.save(user=self.request.user)

# 2. Viewset for Logs (Marking a habit as done)
class HabitLogViewSet(viewsets.ModelViewSet):
    serializer_class = HabitLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return logs where the habit belongs to the user
        return HabitLog.objects.filter(habit__user=self.request.user)

    def perform_create(self, serializer):
        # Logic to ensure user owns the habit they are logging could go here
        # For now, we rely on the frontend passing the correct habit ID
        serializer.save()