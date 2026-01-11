FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files for production
RUN python manage.py collectstatic --no-input

EXPOSE 8000

# Use Gunicorn for production
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]