from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError # Import this
from .models import Habit, HabitLog
from .serializers import HabitSerializer, HabitLogSerializer

class HabitViewSet(viewsets.ModelViewSet):
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Habit.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class HabitLogViewSet(viewsets.ModelViewSet):
    serializer_class = HabitLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HabitLog.objects.filter(habit__user=self.request.user)

    def perform_create(self, serializer):
        # 1. Get the data the user sent
        habit = serializer.validated_data['habit']
        date = serializer.validated_data['completed_date']
        
        # 2. Check if it already exists
        if HabitLog.objects.filter(habit=habit, completed_date=date).exists():
            # 3. Raise a polite error (400 Bad Request) instead of crashing (500)
            raise ValidationError("You have already completed this habit today.")
            
        serializer.save()