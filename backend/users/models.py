from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    
    # You can add more fields here later (e.g., bio, avatar)
    
    def __str__(self):
        return self.username