from rest_framework import serializers
from .models import Habit, HabitLog

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['id', 'completed_date']

class HabitSerializer(serializers.ModelSerializer):
    # This includes the logs inside the habit data, making it easy to render the dashboard
    logs = HabitLogSerializer(many=True, read_only=True)

    class Meta:
        model = Habit
        fields = ['id', 'title', 'description', 'created_at', 'logs']
        read_only_fields = ['created_at']