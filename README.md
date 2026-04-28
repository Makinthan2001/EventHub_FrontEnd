# 🎉 EventHub - Event Registration & Management System

A complete full-stack event management platform built with **React** (Frontend) and **Django** (Backend).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)

---

## ✨ Features

### For Users:

- 🔐 User Registration & JWT Authentication
- 📅 Browse and search events by category
- 🎫 Event registration with ticket selection
- 📊 Personal dashboard to manage created events
- 📝 Create and edit events (pending admin approval)
- 🔔 Notifications system

### For Admins:

- ✅ Approve/Reject pending events
- 👥 User management
- 📈 Event analytics and reports
- 🎯 Full CRUD operations on all events

---

## 🛠️ Tech Stack

### Frontend:

- **React** 19.2.0
- **Vite** 7.2.4
- **React Router DOM** 7.11.0
- **Tailwind CSS** 4.1.18
- **Lucide React** (Icons)

### Backend:

- **Django** 5.0.1
- **Django REST Framework** 3.14.0
- **Django REST Framework SimpleJWT** 5.3.1
- **Django CORS Headers** 4.3.1
- **PyMySQL** 1.1.0
- **Pillow** 10.4.0

### Database:

- **MySQL** 8.0+

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm
- **Python** 3.10+
- **MySQL** 8.0+
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd APT
```

### 2. Frontend Setup

```bash
cd frontend/Event-Registration-and-Management-System

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: `http://localhost:5173`

### 3. Backend Setup

#### Create Virtual Environment

The virtual environment is typically located in the `backend/` directory. If it was previously created in the frontend directory, you can move it or recreate it:

```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=event_management
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
```

---

## 🗄️ Database Setup

### Option 1: Import SQL File (Recommended)

From the project root:

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE event_management;"

# Import structure and data
mysql -u root -p event_management < frontend/Event-Registration-and-Management-System/database_export.sql
```

### Option 2: Run Migrations

```bash
cd backend
python manage.py migrate
```

### Create Test Users

```bash
python create_test_users.py
```

---

## 🎯 Running the Project

### Start Backend Server

```bash
cd backend
python manage.py runserver
```

Backend will run at: `http://127.0.0.1:8000`

### Start Frontend Server

```bash
cd frontend/Event-Registration-and-Management-System
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🔑 Test User Credentials

| Role        | Email                    | Password   |
| ----------- | ------------------------ | ---------- |
| **Admin**   | admin@example.com        | admin123   |
| **Manager** | manager@example.com      | manager123 |
| **User**    | john.doe@example.com     | john123    |
| **User**    | sarah.smith@example.com  | sarah123   |
| **User**    | alice.wonder@example.com | alice123   |

---

## 📡 API Documentation

### Base URL

```
http://127.0.0.1:8000/api
```

### Authentication Endpoints

#### Register

```http
POST /auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "password2": "password123",
  "full_name": "John Doe",
  "phone_number": "1234567890"
}
```

#### Login

```http
POST /auth/login/
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "message": "Login successful",
  "user": {...},
  "tokens": {
    "access": "eyJ0eXAi...",
    "refresh": "eyJ0eXAi..."
  }
}
```

#### Logout

```http
POST /auth/logout/
Authorization: Bearer <access_token>

{
  "refresh_token": "your_refresh_token"
}
```

### Event Endpoints

#### List Events

```http
GET /events/
```

#### Create Event

```http
POST /events/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Tech Conference 2026",
  "description": "Annual tech event",
  "category": "Technology",
  "event_date": "2026-06-15",
  "event_time": "09:00:00",
  "location": "Convention Center",
  "agenda": [
    {
      "time": "09:00",
      "title": "Opening Keynote",
      "description": "Welcome speech"
    }
  ],
  "tickets": [
    {
      "type": "VIP",
      "price": "5000.00",
      "quantity_available": 50,
      "benefits": [
        {"description": "Front row seating"}
      ]
    }
  ]
}
```

#### Approve Event (Admin Only)

```http
POST /events/{id}/approve/
Authorization: Bearer <admin_access_token>
```

---

## 👥 User Roles

### Regular User

- View approved events
- Create events (pending approval)
- Edit own events
- Register for events
- Access user dashboard

### Staff/Manager

- All user permissions
- Approve/reject events
- Edit any event
- Access admin dashboard

### Superuser/Admin

- All staff permissions
- Full database access
- User management
- Access Django admin panel

---

## 📁 Project Structure

```
APT/
├── backend/                 # Django Backend
│   ├── config/              # Django settings
│   ├── apps/
│   │   ├── accounts/        # User authentication
│   │   └── events/          # Event management
│   ├── manage.py
│   └── requirements.txt
└── frontend/                # React Frontend
    └── Event-Registration-and-Management-System/
        ├── src/
        │   ├── components/  # Reusable React components
        │   ├── pages/       # Page components
        │   ├── utils/       # Utility functions (auth, etc.)
        │   └── assets/      # Images, styles
        ├── public/          # Static assets
        ├── database_export.sql
        ├── package.json
        └── README.md
```

---

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with Django's security
- ✅ CORS protection
- ✅ Protected routes (frontend & backend)
- ✅ Role-based access control
- ✅ SQL injection prevention (Django ORM)
- ✅ XSS protection
- ✅ Session management
- ✅ Automatic token refresh

---

## 📝 Environment Variables

### Backend (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=event_management
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

---

## 🐛 Troubleshooting

### Frontend Issues

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

```bash
# Recreate virtual environment
deactivate
rm -rf .venv
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Database Issues

```bash
# Reset database
mysql -u root -p -e "DROP DATABASE event_management;"
mysql -u root -p -e "CREATE DATABASE event_management;"
mysql -u root -p event_management < database_export.sql
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Developed By

**Event Management Team**

---

**Happy Event Managing! 🎉**
#   E v e n t H u b _ F r o n t E n d  
 