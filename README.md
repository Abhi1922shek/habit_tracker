# HabitFlow - Full Stack Habit Tracker 🚀

A modern, mobile-first habit tracking application built with the "Gen Z" tech stack.

## 🛠 Tech Stack
- **Backend:** Python, Django, Django Rest Framework (DRF)
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)
- **Visualization:** Recharts
- **DevOps:** Docker, GitHub Actions (CI/CD)

## ✨ Features
- 🔐 **Secure Auth:** Custom User model with JWT Login/Signup.
- 📊 **Dashboard:** Track daily habits with streaks and visual graphs.
- 📱 **Mobile First:** Responsive UI with Dark Mode.
- 📈 **Analytics:** Weekly progress charts.
- ⚡ **Real-time:** Instant toggle updates and streak calculation.

## 🚀 How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate | Mac: source venv/bin/activate)
pip install -r requirements.txt
# Create .env file with DB credentials
python manage.py migrate
python manage.py runserver