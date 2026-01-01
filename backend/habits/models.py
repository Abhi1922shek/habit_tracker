from django.db import models
from django.conf import settings 
from datetime import date

class Habit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # We could add 'frequency' here later (Daily, Weekly)

    def __str__(self):
        return self.title

class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    completed_date = models.DateField(default=date.today)
    
    class Meta:
        # Prevent marking the same habit as done twice on the same day
        unique_together = ['habit', 'completed_date']

    def __str__(self):
        return f"{self.habit.title} - {self.completed_date}"