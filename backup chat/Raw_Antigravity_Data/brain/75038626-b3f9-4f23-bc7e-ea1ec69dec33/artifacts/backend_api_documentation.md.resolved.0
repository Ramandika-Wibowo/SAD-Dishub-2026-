# E-Internship Dishub — Backend API Documentation

> Laravel 11 REST API for the Dinas Perhubungan Kota Surabaya internship portal.

## 📁 Project Structure

```
backend/
├── .env.example                              # Environment template
├── composer.json                             # Dependencies (Sanctum, PhpSpreadsheet, Guzzle)
├── bootstrap/app.php                         # Laravel 11 bootstrap + middleware registration
├── config/
│   ├── cors.php                              # CORS for Next.js frontend
│   ├── database.php                          # PostgreSQL (Supabase) config
│   ├── sanctum.php                           # Sanctum stateful domains
│   └── services.php                          # Supabase + algorithm threshold
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_..._users_table.php
│   │   ├── 0001_01_01_000001_..._cache_table.php
│   │   ├── 0001_01_01_000002_..._personal_access_tokens_table.php
│   │   ├── 2024_01_01_000010_..._divisions_table.php
│   │   ├── 2024_01_01_000020_..._applications_table.php
│   │   ├── 2024_01_01_000030_..._documents_table.php
│   │   ├── 2024_01_01_000040_..._notifications_table.php
│   │   └── 2024_01_01_000050_..._export_logs_table.php
│   └── seeders/DatabaseSeeder.php            # Default users + 10 divisions
├── app/
│   ├── Models/
│   │   ├── User.php                          # HasApiTokens, role helpers
│   │   ├── Division.php                      # R5 evaluation, remaining_quota
│   │   ├── Application.php                   # Status helpers, document check
│   │   ├── Document.php
│   │   ├── Notification.php                  # Unread scope
│   │   └── ExportLog.php
│   ├── Http/
│   │   ├── Middleware/RoleMiddleware.php      # role:applicant,admin,head
│   │   ├── Controllers/Api/V1/
│   │   │   ├── AuthController.php            # Register, Login, Logout, Me
│   │   │   ├── ApplicantController.php       # Divisions, Apply, Upload, Track
│   │   │   ├── AdminController.php           # Review, Sort Algorithm, Decide
│   │   │   └── HeadController.php            # Analytics, Export XLSX
│   │   └── Requests/
│   │       ├── Auth/RegisterRequest.php
│   │       ├── Auth/LoginRequest.php
│   │       ├── Applicant/StoreApplicationRequest.php
│   │       ├── Applicant/UploadDocumentRequest.php
│   │       ├── Admin/DecideApplicationRequest.php
│   │       ├── Admin/UpdateDivisionRequest.php
│   │       └── Head/ExportRequest.php
│   ├── Helpers/NotificationHelper.php        # Global helper functions
│   ├── Services/SupabaseStorageService.php   # File upload/download/delete
│   └── Providers/AppServiceProvider.php
└── routes/api.php                            # All /api/v1/* routes
```

---

## 🗄️ Database Schema (6 Tables)

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `users` | id, name, email, role, applicant_type | All portal users |
| `divisions` | id, name, max_quota, active_applicants, is_locked | Dishub divisions with quota |
| `applications` | id, user_id, division_id, status, r1/r3/r4_passed, algorithm_score | Internship applications |
| `documents` | id, application_id, type, file_path | CV, cover letter, ID card |
| `notifications` | id, user_id, title, message, is_read | In-app alerts |
| `export_logs` | id, exported_by, file_name, filters | XLSX export history |

---

## 🔐 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register applicant |
| POST | `/api/v1/auth/login` | Login → token + role |
| POST | `/api/v1/auth/logout` | Revoke token |
| GET | `/api/v1/auth/me` | Current user info |

### Applicant (role: applicant)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/divisions` | Browse all divisions |
| POST | `/api/v1/applications` | Submit application |
| POST | `/api/v1/applications/{id}/documents` | Upload CV/cover/ID |
| GET | `/api/v1/applications/my` | Track my applications |
| GET | `/api/v1/notifications` | My notifications |
| PATCH | `/api/v1/notifications/{id}/read` | Mark as read |

### Admin (role: admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/applications` | List all (filtered, paginated) |
| GET | `/api/v1/admin/applications/{id}` | Full detail + rule results |
| POST | `/api/v1/admin/applications/{id}/execute-sort` | Run R1→R3→R4 algorithm |
| PATCH | `/api/v1/admin/applications/{id}/decide` | Accept/reject + R5 |
| GET | `/api/v1/admin/divisions` | Division quota stats |
| PATCH | `/api/v1/admin/divisions/{id}` | Update quota |

### Head / Pimpinan (role: head)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/head/analytics` | Full dashboard data |
| POST | `/api/v1/head/export` | Generate XLSX report |
| GET | `/api/v1/head/export-logs` | Export history |

---

## ⚙️ Rule-Based Algorithm

```
R1: Document Completeness → CV + Cover Letter + ID Card all uploaded?
R3: Quota Availability    → Division not locked AND active < max?
R4: Keyword Matching      → CV filename/program vs division name (score 0-100, threshold: 60)
R5: Auto-Lock             → If active_applicants ≥ max_quota → lock division
```

All 3 rules (R1, R3, R4) must pass → status = `reviewing`
Any failure → status = `rejected` + notification with specific reason.

---

## 🚀 Setup Instructions

```bash
# 1. Install dependencies
cd backend
composer install

# 2. Configure environment
cp .env.example .env
php artisan key:generate
# Edit .env with your Supabase credentials

# 3. Run migrations
php artisan migrate

# 4. Seed default data
php artisan db:seed

# 5. Start development server
php artisan serve
# API available at http://localhost:8000/api/v1
```

### Default Seeded Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dishub-surabaya.go.id | password123 |
| Head | pimpinan@dishub-surabaya.go.id | password123 |
| Applicant | ahmad.fauzi@student.ac.id | password123 |

---

## 📝 Supabase Setup Checklist

1. Create Supabase project → Copy `DB_HOST`, `DB_PASSWORD`
2. Create storage bucket: `e-internship-documents`
3. Set bucket policies to allow authenticated uploads
4. Copy `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_KEY` to `.env`
