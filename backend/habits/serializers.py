from rest_framework import serializers
from .models import Habit, HabitLog

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        # We added 'habit' here so the view can read it
        fields = ['id', 'habit', 'completed_date']

class HabitSerializer(serializers.ModelSerializer):
    logs = HabitLogSerializer(many=True, read_only=True)

    class Meta:
        model = Habit
        fields = ['id', 'title', 'description', 'created_at', 'logs']
        read_only_fields = ['created_at']