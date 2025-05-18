# Compass Management System API Specification

## Overview

This document outlines the RESTful API specification for the Compass NGO Management System. It includes the endpoints, models, access roles, and data formats used. This specification is intended for use in the development process

---

## 🧭 Compass Project Structure

```
compass/
│
├── compass/                      # Django project root
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py               # Main project settings
│   ├── urls.py                   # Root URLs - include all apps here
│   ├── wsgi.py
│
├── accounts/                     # User management (Superadmin, Admins, etc.)
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                 # Custom User, Profile, Roles
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   ├── permissions.py            # Custom permissions
│   ├── filters.py                # Filter logic for users
│
├── divisions/                   # Divisions and Programs logic (Nisiria, Maisha)
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                 # Division, Program, Custom Program Models
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   ├── filters.py
│
├── documents/                   # Handles all documents (budgets, reports, etc.)
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                 # Document model
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   ├── filters.py
│
├── grants/                      # Grant management logic
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                 # Grant model
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   ├── filters.py
│   ├── tasks.py                  # Notifications, reminders
│
├── templates/                   # For email templates 
│   ├── email_templates/
│
├── static/                      # Static assets (to use cloudinary)
│
├── media/                       # Uploaded files (e.g., profile images, docs) for now
│
├── manage.py
├── requirements.txt
├── README.md
```

---

## Authentication

All endpoints are secured using JWT authentication.

```
Authorization: Bearer <token>
```

---

## User Roles and Permissions

| Role            | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| Super Admin     | Full access. Can manage users, programs, grants, documents, and verify deletions |
| Admin           | Can upload, view, and manage documents and programs                              |
| Management Lead | Oversees Compass operations and grants                                           |
| Grant Officer   | Sources and manages grants, updates deadlines                                    |

---


## Base Models

### User Model
Fields required:
- full name 
- telephone
- email (must have @nisria.co extension)
- profile image
- role (super admin, admin, management lead, grant officer)
- location
- date created
- date updated

### Division model
- name
- description
- lead (with role Management lead)
- date created
- date_updated

### program Model (Base)
- name
- description
- division (which is from)
- monthly budget 
- annual budget
- maintainer (with role management lead)
- date created
- date updated


### education Program (inherit from program)
- student name
- current education level
- student location
- student contact (parent/ guardian)
- association (school / organization)
- start_date
- end_date
- date created
- date updated

### microfund model (inherit from program)
- person name
- chama_group
- is_active
- start_date
- location
- telephone

### rescue program (inherits from program)
- child name
- child age
- is_reunited
- under care
- date joined
- date_reunited
- place_found (option)
- rescuer contact (option)
- notes gotten (option)


### Vocation training (inherit from program)
- trainer name
- trainer_association
- trainer phone
- trainer email

- trainee name
- trainee phone
- trainee email
- trainer association
- date enrolled
-
- is under training

## Documents Model
- name
- description
- document link (urlField)
- document type (bank statement, CBO cert, NGO cert, impact report,  pitch deck, Monthly budget, annual budget, overall budget)
- document format
- division (overall, nisria, maisha)
- date created
- date updated
- file upload (optional for now)
- created by (User)
- updated by (User)

### Grant Model

| Field                 | Type                        | Description                                 |
| --------------------- | --------------------------- | ------------------------------------------- |
| `organization_name`   | `CharField`                 | Name of the organization offering the grant |
| `application_link`    | `URLField (blank=True)`     | Optional external link to application       |
| `amount_currency`     | `CharField`                 | Currency, e.g., USD, KES                    |
| `amount_value`        | `DecimalField`              | The actual amount awarded                   |
| `focus_area`          | `ForeignKey` to `Program`   | The program this grant aligns with          |
| `division`            | `ForeignKey` to `Division`  | Which part of the NGO this grant supports   |
| `notes`               | `TextField`                 | Grant officer's notes                       |
| `status`              | `ChoiceField`               |  Pending , Approved, Denied  
| `required_documents`  | `ManyToManyField(Document)` | Documents expected in the application       |
| `submitted_documents` | `ManyToManyField(Document)` | Documents actually submitted                |
| `contact_tel`         | `CharField`                 | Phone number of the organization            |
| `contact_email`       | `EmailField`                | Email of the organization                   |
| `location`            | `CharField`                 | Geographical location of the funder         |
| `organization_type`   | `ChoiceField`               | `normal`, `grant_awarder`                   |
| `is_applied`   | `BooleanField`               | `True / False`                   |
| `deadline`   | `DateTimeField`               | `DateTimeField`                   |
| `submitted by`   | `User (foreignKey)`               | the user who created the program                   |

---

### Email Template Model    
- name
- email template type (partnership, grant application)
- subject template
- subject body
- created by
- date created
- date updated

## API Layer

### Role based access control (RBAC)

| Role            | Description                                                                       | Permissions Level   |
| --------------- | --------------------------------------------------------------------------------- | ------------------- |
| Super Admin     | Full control of everything. Users, documents, grants, divisions, programs, etc.   | `Full`              |
| Admin           | View, edit, and upload documents across all programs.                             | `Medium`       |
| Management Lead | Oversee Compass operations and grants. Platform optimization, grants supervision. | `Medium`            |
| Grant Officer   | Focused on grants only: sourcing, updating, applications.                         | `Grants and viewing documents` |

---
### API Endpoints

## `accounts` Endpoints (Users & Roles)

| Endpoint                     | Method | Description                            |
| ---------------------------- | ------ | -------------------------------------- |
| `/api/accounts/register/`    | POST   | Register a new user (Super Admin only) |
| `/api/accounts/login/`       | POST   | Login user                             |
| `/api/accounts/logout/`      | POST   | Logout user                            |
| `/api/accounts/`             | GET    | List all users (Super Admin only)      |
| `/api/accounts/<id>/`        | GET    | Get user profile                       |
| `/api/accounts/<id>/update/` | PUT    | Update user details                    |
| `/api/accounts/<id>/delete/` | DELETE | Soft delete user                       |
| `/api/accounts/roles/`       | GET    | List available roles                   |

---

## `divisions` Endpoints

### Division

| Endpoint               | Method           | Description                     |
| ---------------------- | ---------------- | ------------------------------- |
| `/api/divisions/`      | GET, POST        | List/Create a division          |
| `/api/divisions/<id>/` | GET, PUT, DELETE | Retrieve/Update/Delete division |

### Program (APIs for polymorphic models)

| Endpoint                      | Method           | Description                                   |
| ----------------------------- | ---------------- | --------------------------------------------- |
| Education |
| `/api/programs/nisria/education/`              | GET, POST        | List/Create a program                         |
| `/api/programs/nisria/education/<id>/`         | GET, PUT, DELETE | Retrieve/Update/Delete a program              |
| `/api/programs/nisria/education/filter/`       | GET              | Filter programs by division, maintainer, etc. |
| `/api/programs/nisria/education/search/`       | GET              | Search programs by name                       |
| `/api/programs/nisria/education/<id>/details/` | GET              | Get all custom fields based on type           |
| microfund |
| `/api/programs/nisria/microfund/`              | GET, POST        | List/Create a program                         |
| `/api/programs/nisria/microfund/<id>/`         | GET, PUT, DELETE | Retrieve/Update/Delete a program              |
| `/api/programs/nisria/microfund/filter/`       | GET              | Filter programs by division, maintainer, etc. |
| `/api/programs/nisria/microfund/search/`       | GET              | Search programs by name                       |
| `/api/programs/nisria/microfund/<id>/details/` | GET              | Get all custom fields based on type           |
| Rescue |
| `/api/programs/nisria/rescue/`              | GET, POST        | List/Create a program                         |
| `/api/programs/nisria/rescue/<id>/`         | GET, PUT, DELETE | Retrieve/Update/Delete a program              |
| `/api/programs/nisria/rescue/filter/`       | GET              | Filter programs by division, maintainer, etc. |
| `/api/programs/nisria/rescue/search/`       | GET              | Search programs by name                       |
| `/api/programs/nisria/rescue/<id>/details/` | GET              | Get all custom fields based on type           |
| vocation |
| `/api/programs/maisha/vocational/`              | GET, POST        | List/Create a program                         |
| `/api/programs/maisha/vocational/<id>/`         | GET, PUT, DELETE | Retrieve/Update/Delete a program              |
| `/api/programs/maisha/vocational/filter/`       | GET              | Filter programs by division, maintainer, etc. |
| `/api/programs/maisha/vocational/search/`       | GET              | Search programs by name                       |
| `/api/programs/maisha/vocational/<id>/details/` | GET              | Get all custom fields based on type           |

---

## `documents` Endpoints

| Endpoint                             | Method    | Description                           |
| ------------------------------------ | --------- | ------------------------------------- |
| `/api/documents/`                    | GET, POST | List or upload documents              |
| `/api/documents/<id>/`               | GET, PUT  | Retrieve or update                    |
| `/api/documents/<id>/delete/`        | DELETE    | Soft delete (admin, management)       |
| `/api/documents/<id>/verify-delete/` | POST      | Super admin verifies deletion         |
| `/api/documents/filter/`             | GET       | Filter by type, format, division      |
| `/api/documents/search/`             | GET       | Search by name                        |
| `/api/documents/request-access/`     | POST      | Request access to protected documents |
| `/api/documents/<id>/grant-access/`  | POST      | Super admin grants access             |

---

## `grants` Endpoints

| Endpoint                          | Method           | Description                                      |
| --------------------------------- | ---------------- | ------------------------------------------------ |
| `/api/grants/`                    | GET, POST        | List or create grant                             |
| `/api/grants/<id>/`               | GET, PUT, DELETE | View, update, delete grant                       |
| `/api/grants/filter/`             | GET              | Filter by status, division, deadline, program    |
| `/api/grants/search/`             | GET              | Search grants by name or org                     |
| `/api/grants/<id>/documents/`     | GET              | List documents used in application               |
| `/api/grants/<id>/status-update/` | POST             | Update status (e.g. pending → approved)          |
| `/api/grants/notify-pending/`     | GET              | Trigger: notify for "aware" & upcoming deadlines |
| `/api/grants/analytics/`          | GET              | Total grants, by status, program, etc.           |

---

## `email_templates` Endpoints

| Endpoint                            | Method           | Description                                    |
| ----------------------------------- | ---------------- | ---------------------------------------------- |
| `/api/templates/`                   | GET, POST        | List/create templates                          |
| `/api/templates/<id>/`              | GET, PUT, DELETE | View, update, delete                           |
| `/api/templates/render/<id>/`       | GET              | Fill template with sample or real data         |
| `/api/templates/export-email/<id>/` | GET              | Redirect to default email app with filled data |

---

## `notifications` Endpoints (Optional Core App)

| Endpoint                             | Method | Description                          |
| ------------------------------------ | ------ | ------------------------------------ |
| `/api/notifications/`                | GET    | List notifications (by user or type) |
| `/api/notifications/create/`         | POST   | Manually create (e.g. super admin)   |
| `/api/notifications/<id>/mark-read/` | POST   | Mark notification as read            |

---

## `analytics` Endpoints

| Endpoint                            | Method | Description                                  |
| ----------------------------------- | ------ | -------------------------------------------- |
| `/api/analytics/overview/`          | GET    | Summary: total programs, users, grants, docs |
| `/api/analytics/program-breakdown/` | GET    | Programs per division                        |
| `/api/analytics/grant-status/`      | GET    | Grants by status or division                 |

---

## Search & Filter for All Major Models

| Model    | Search Endpoint                     | Filter Endpoint                                    |
| -------- | ----------------------------------- | -------------------------------------------------- |
| Program  | `/api/programs/search/?q=education` | `/api/programs/filter/?division=nisiria`           |
| Document | `/api/documents/search/?q=bank`     | `/api/documents/filter/?type=bank-statement`       |
| Grant    | `/api/grants/search/?q=unicef`      | `/api/grants/filter/?status=aware&division=maisha` |
**e.t.c.**

---

##  Soft Delete Flow

For `Document`, `User`, and `Grant`:

* When admin or lead **deletes**, set `is_deleted=True`
* Super Admin endpoint to **verify/confirm final delete**

---

---

## Packages to be used


### Core Django & DRF

| Purpose                             | Package                         |
| ----------------------------------- | ------------------------------- |
| Django framework                    | `Django`                        |
| REST API support                    | `djangorestframework`           |
| JWT Authentication                  | `djangorestframework-simplejwt` |
| CORS Handling (for frontend access) | `django-cors-headers`           |
| Filtering & Search                  | `django-filter`                 |

---

### Environment & Configuration

| Purpose                | Package                               |
| ---------------------- | ------------------------------------- |
| Manage env variables   | `python-decouple` or `django-environ` |
| Auto-loading env files | `.env` file support                   |

---

### Admin & Documentation

| Purpose                          | Package                                           |
| -------------------------------- | ------------------------------------------------- |
| Auto API Documentation (Swagger) | `drf-yasg`                                        |
| Improved Admin Dashboard         | `django-grappelli` or `django-jazzmin` (optional) |

---

### Storage & Media

| Purpose                         | Package                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| Image & file uploads            | `Cloudinary`                                                        |
| Media storage (S3, GCS, etc.)   | `django-storages` + `boto3` (for AWS) or `google-cloud-storage` |
| Rich file support (Excel, PDFs) | `python-docx`, `openpyxl`, `reportlab`, etc. (based on needs)   |

---

### Soft Deletion & History Tracking

| Purpose                           | Package                                     |
| --------------------------------- | ------------------------------------------- |
| Soft delete support               | `django-softdelete` or custom boolean field |
| Change tracking/versioning (opt.) | `django-simple-history`                     |

---

### Task Scheduling & Notifications

| Purpose           | Package                                                      |
| ----------------- | ------------------------------------------------------------ |
| Task queue        | `Celery`                                                     |
| Background worker | `Redis` (as broker)                                          |
| Email sending     | `django-anymail` or `smtplib` (with SendGrid, Mailgun, etc.) |

---

### Permissions, Roles, & Auth

| Purpose                | Package                                             |
| ---------------------- | --------------------------------------------------- |
| Role-based permissions | Built-in or custom roles logic                      |
| Extended User model    | Custom User model                                   |
| OTP SMS Support        | `Africa's Talking API` via requests or a Python SDK |

---

### Development Tools

| Purpose                 | Package                            |
| ----------------------- | ---------------------------------- |
| Code linting            | `flake8`                           |
| Code formatting         | `black`                            |
| Import sorting          | `isort`                            |
| API Testing & Debugging | `httpie`, `postman`                |
| Swagger file editing    | `swagger-cli`, `editor.swagger.io` |

---

