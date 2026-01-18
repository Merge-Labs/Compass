# Compass NGO Management System

[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Merge-Labs/Compass?include_prereleases)](https://img.shields.io/github/v/release/Merge-Labs/Compass?include_prereleases)
[![GitHub last commit](https://img.shields.io/github/last-commit/Merge-Labs/Compass)](https://img.shields.io/github/last-commit/Merge-Labs/Compass)
[![GitHub issues](https://img.shields.io/github/issues-raw/Merge-Labs/Compass)](https://img.shields.io/github/issues-raw/Merge-Labs/Compass)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Merge-Labs/Compass)](https://img.shields.io/github/issues-pr/Merge-Labs/Compass)

**Compass** is a comprehensive NGO Management System designed to streamline operations for non-profit organizations. Built with Django REST Framework for the backend and React with Tailwind CSS for the frontend, Compass provides role-based access control, grant management, document handling, and analytics for efficient NGO operations.

The system supports multiple user roles including Super Admins, Admins, Management Leads, and Grant Officers, each with tailored dashboards and permissions to manage grants, documents, divisions, programs, and organizational workflows.

# Quick Start Demo

Compass provides an intuitive interface for managing your NGO's operations:

- **Role-Based Dashboards**: Customized views for Super Admins, Admins, Management Leads, and Grant Officers
- **Grant Management**: Track grant applications, deadlines, and progress
- **Document Management**: Upload, organize, and access important documents
- **Division & Program Management**: Organize your NGO's structure and programs
- **Analytics**: Visualize key metrics and performance indicators
- **Task Management**: Assign and track tasks across your organization
- **Notifications**: Stay updated with email notifications for important events

# Table of Contents

- [Compass NGO Management System](#compass-ngo-management-system)
- [Quick Start Demo](#quick-start-demo)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Django)](#backend-setup-django)
  - [Frontend Setup (React)](#frontend-setup-react)
- [Usage](#usage)
  - [User Roles](#user-roles)
  - [Key Features](#key-features)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Running in Development Mode](#running-in-development-mode)
  - [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Contribute](#contribute)
- [License](#license)

# Installation
[(Back to top)](#table-of-contents)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.9 or higher
- **Node.js** 18 or higher
- **npm** or **yarn**
- **PostgreSQL** (recommended for production) or SQLite (for development)
- **Git**

## Backend Setup (Django)

1. Clone the repository:

```shell
git clone https://github.com/Merge-Labs/Compass.git
cd Compass/nisria-backend
```

2. Create and activate a virtual environment:

```shell
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```shell
pip install -r requirements.txt
```

4. Set up environment variables:

```shell
cp env.example .env
# Edit .env with your configuration (database, secret key, etc.)
```

5. Run migrations:

```shell
python manage.py migrate
```

6. Create a superuser:

```shell
python manage.py createsuperuser
```

7. Start the development server:

```shell
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

## Frontend Setup (React)

1. Navigate to the frontend directory:

```shell
cd ../nisria-frontend
```

2. Install dependencies:

```shell
npm install
```

3. Start the development server:

```shell
npm run dev
```

The frontend application will be available at `http://localhost:5173`

# Usage
[(Back to top)](#table-of-contents)

## User Roles

Compass supports four distinct user roles with different permissions:

| Role            | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| **Super Admin** | Full access. Can manage users, programs, grants, documents, and verify deletions |
| **Admin**       | Can upload, view, and manage documents and programs                              |
| **Management Lead** | Oversees Compass operations and grants                                     |
| **Grant Officer** | Sources and manages grants, updates deadlines                                |

## Key Features

### Grant Management
- Create, update, and track grants
- Set deadlines and milestones
- Monitor grant progress and status
- Automated deadline reminders

### Document Management
- Upload and organize documents
- Categorize documents by type (budgets, reports, proposals)
- Secure document storage
- Role-based access to documents

### Division & Program Management
- Manage organizational divisions (e.g., Nisria, Maisha)
- Create and oversee programs within divisions
- Track program metrics and outcomes

### Analytics & Reporting
- Visual dashboards for key metrics
- Grant performance analytics
- Program success tracking
- Customizable reports

### Task Management
- Create and assign tasks to team members
- Set priorities and deadlines
- Track task completion
- Email notifications for task updates

# Development
[(Back to top)](#table-of-contents)

## Project Structure

```
Compass/
│
├── nisria-backend/              # Django REST Framework backend
│   ├── accounts/                # User management and authentication
│   ├── grants/                  # Grant management logic
│   ├── documents/               # Document handling
│   ├── divisions/               # Divisions and programs
│   ├── analytics/               # Analytics and reporting
│   ├── task_manager/            # Task management
│   ├── notifications/           # Email notifications
│   ├── compass/                 # Django project settings
│   └── manage.py
│
├── nisria-frontend/             # React + Tailwind CSS frontend
│   ├── src/
│   │   ├── assets/              # Static assets
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React Context (Auth, Theme)
│   │   ├── routes/              # Routing and protected routes
│   │   └── services/            # API service layer
│   ├── public/
│   └── package.json
│
└── documents/                   # Project documentation
```

## Running in Development Mode

### Backend Development

```shell
cd nisria-backend
source venv/bin/activate
python manage.py runserver
```

For auto-reloading with Django:
```shell
python manage.py runserver --noreload
```

### Frontend Development

```shell
cd nisria-frontend
npm run dev
```

The Vite development server will hot-reload on file changes.

### Running with Docker (Production)

```shell
cd nisria-backend
docker-compose -f docker-compose.prod.yml up --build
```

## Running Tests

### Backend Tests

```shell
cd nisria-backend
python manage.py test
```

### Frontend Tests

```shell
cd nisria-frontend
npm run test
```

### Linting

Backend:
```shell
cd nisria-backend
flake8 .
```

Frontend:
```shell
cd nisria-frontend
npm run lint
```

# Deployment
[(Back to top)](#table-of-contents)

For detailed deployment instructions, please refer to [README-deploy.md](./documents/README-deploy.md).

**Quick deployment overview:**

1. Backend: Deploy using Docker with the provided `docker-compose.prod.yml`
2. Frontend: Deploy to Vercel or similar platform using the `vercel.json` configuration
3. Configure environment variables for production
4. Set up PostgreSQL database
5. Configure CORS settings for frontend-backend communication
6. Set up SSL certificates for HTTPS

# Contribute
[(Back to top)](#table-of-contents)

We welcome contributions to Compass! However, this is a proprietary project owned by [Nisria.Inc](https://www.nisria.co/).

**Before contributing:**

1. Contact us at [wahome@nisria.co] for permission and licensing information
2. Review our [Security Policy](./SECURITY.md)
3. Check existing issues and pull requests
4. Follow the code style and conventions used in the project

**Development workflow:**

1. Fork the repository (with permission)
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Reporting bugs or requesting features:**

Please create an issue with detailed information about the bug or feature request.

# License
[(Back to top)](#table-of-contents)

This project is proprietary software owned by [Nisria.Inc](https://www.nisria.co/). 

**Important:** This repository is NOT licensed under any open source license. All rights are reserved by Nisria.Inc.

For licensing inquiries or permission requests, please contact: [wahome@nisria.co]

See [LICENSE.md](./LICENSE.md) for full details.

---

**Copyright © 2025 [Nisria.Inc](https://www.nisria.co/). All rights reserved.**
