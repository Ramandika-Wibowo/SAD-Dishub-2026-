# Review Software Architecture Diagram vs Implementasi Aktual

## Daftar Ketidaksesuaian

| No | Level | Di Diagram Lama | Seharusnya (Kode Aktual) | Keparahan |
|---|---|---|---|---|
| 1 | **L1** | "arsitektur Monolithic" | **Arsitektur Client-Server (Separated):** Next.js 14 (Frontend) + Laravel 11 (Backend API) berkomunikasi via REST API | 🔴 Kritis |
| 2 | **L1** | "Email Service – Notifikasi SMTP" | **Tidak ada SMTP.** Notifikasi bersifat *in-app* saja, disimpan ke tabel `notifications` di database | 🔴 Kritis |
| 3 | **L2** | "Aplikasi Web Monolithic, Server-side Rendering (MVC)" | **2 container terpisah:** (1) Next.js Frontend (SSR/CSR) (2) Laravel API Backend (RESTful) | 🔴 Kritis |
| 4 | **L2** | "File Storage" (generik) | **Supabase Storage** (bucket object storage via REST API) | 🟡 Minor |
| 5 | **L3** | "Keamanan & Akses: HTTPS, hashing session" | **Laravel Sanctum (Token-based Auth),** bukan session-based. Password di-hash via bcrypt | 🟠 Sedang |
| 6 | **L3** | "Modul Notifikasi: Email SMTP, Status Berkas" | **NotificationHelper (In-App):** sendNotification(), notifyStatusChange(), notifyRuleFailure() — tanpa email SMTP | 🔴 Kritis |
| 7 | **L4** | Tabel "Surat Persetujuan" (pendaftaran_id, nomor_surat, tgl_terbit, admin_id) | **Tidak ada tabel ini** di database. Keputusan admin disimpan di kolom `admin_note` dan `rejection_reason` pada tabel `applications` | 🔴 Kritis |
| 8 | **L4** | User: role (pelamar/admin) | Role ada 3: **applicant, admin, head** | 🟠 Sedang |
| 9 | **L4** | User: tanpa applicant_type, institution_name, phone | Field ada: **applicant_type, institution_name, phone** | 🟠 Sedang |
| 10 | **L4** | "Pendaftaran Pendaftaran": divisi_id, status, tgl_daftar, skor_algoritma | Nama tabel: **Application** dengan field tambahan: **study_program, internship_start, internship_end, r1_passed, r3_passed, r4_passed, recommended_division_id, rejection_reason, admin_note** | 🟠 Sedang |
| 11 | **L4** | "E-Internship Dishub": kuota_terisi, keyword_keahlian | Nama tabel: **Division** — field aktual: **name, max_quota, active_applicants, is_locked** (tanpa keyword_keahlian) | 🟠 Sedang |
| 12 | **L4** | Document: pendaftaran_id, tipe, path_file | Field aktual: **application_id, type, file_path, file_name** + accessor **file_url** | 🟡 Minor |

---

## Diagram Koreksi — 4 Level (PlantUML)

### Level 1: Context Diagram

```plantuml
@startuml
title Software Architecture – Level 1: Context

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam RectangleBorderColor black
skinparam RectangleBackgroundColor white
skinparam ActorBorderColor black
skinparam ActorBackgroundColor white
skinparam PackageBorderColor black
skinparam PackageBackgroundColor white
skinparam ArrowColor black

actor "Calon Peserta\n//mahasiswa, siswa,\nfresh graduate//" as CP
actor "Admin Sekretariat\n//Staf Dishub//" as Admin
actor "Pimpinan Bidang\n//Dishub Surabaya//" as Head

rectangle "<<Software System>>\n**E-Internship Dishub**\nPortal Web Pendaftaran Magang\nArsitektur Client-Server\n(Next.js + Laravel API)" as System

rectangle "<<External Service>>\n**Supabase Storage**\nPenyimpanan Dokumen\nPelamar (Object Storage)" as Supabase

CP --> System : Mendaftar akun,\nmengajukan magang,\nmengunggah dokumen,\nmemantau status
Admin --> System : Mengelola antrean,\nmenjalankan algoritma DSS,\nmenetapkan keputusan
Head --> System : Meninjau analitik,\nmengekspor laporan Excel

System --> Supabase : Upload & retrieve\ndokumen pelamar\n(REST API)
@enduml
```

### Level 2: Container Diagram

```plantuml
@startuml
title Software Architecture – Level 2: Container

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam RectangleBorderColor black
skinparam RectangleBackgroundColor white
skinparam ActorBorderColor black
skinparam ActorBackgroundColor white
skinparam DatabaseBorderColor black
skinparam DatabaseBackgroundColor white
skinparam ArrowColor black

actor "Calon Peserta" as CP
actor "Admin Sekretariat" as Admin
actor "Pimpinan Bidang" as Head

rectangle "<<Container: Next.js 14>>\n**Frontend Web App**\nAntarmuka pengguna responsif\n(SSR + CSR)\nTailwind CSS, Recharts, Axios" as Frontend

rectangle "<<Container: Laravel 11>>\n**Backend REST API**\nLogika bisnis, autentikasi,\nalgoritma DSS\nSanctum, PhpSpreadsheet" as Backend

database "<<Container: PostgreSQL>>\n**Database Relasional**\nPenyimpanan data utama\n(users, applications,\ndivisions, documents,\nnotifications)" as DB

rectangle "<<External: Supabase>>\n**Object Storage**\nDokumen Pelamar\n(CV, Surat, KTP)" as Storage

CP --> Frontend
Admin --> Frontend
Head --> Frontend

Frontend --> Backend : REST API\n(JSON via Axios)\nHTTPS + Bearer Token
Backend --> DB : Eloquent ORM\n(TCP/5432)
Backend --> Storage : Upload/Download\n(Supabase REST API)
@enduml
```

### Level 3: Component Diagram

```plantuml
@startuml
title Software Architecture – Level 3: Component

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam RectangleBorderColor black
skinparam RectangleBackgroundColor white
skinparam PackageBorderColor black
skinparam PackageBackgroundColor #F8F8F8
skinparam ArrowColor black

package "Frontend (Next.js 14)" {
    rectangle "Halaman Autentikasi\nLogin, Register" as FAuth
    rectangle "Dashboard Applicant\nStatus, Dokumen, Notifikasi" as FApp
    rectangle "Dashboard Admin\nAntrean, Algoritma, Keputusan" as FAdmin
    rectangle "Dashboard Head\nAnalitik, Ekspor" as FHead
}

package "Backend API (Laravel 11)" {
    rectangle "<<Controller>>\n**AuthController**\nLogin, Register, Logout\n(Sanctum Token)" as CAuth
    rectangle "<<Controller>>\n**ApplicantController**\nPengajuan, Upload Dokumen,\nLacak Status, Notifikasi" as CApplicant
    rectangle "<<Controller>>\n**AdminController**\nAntrean, Algoritma Sortir DSS,\nKeputusan, Kuota Divisi" as CAdmin
    rectangle "<<Controller>>\n**HeadController**\nAnalitik Agregasi,\nEkspor Excel (PhpSpreadsheet)" as CHead
    rectangle "<<Helper>>\n**NotificationHelper**\nsendNotification()\nnotifyStatusChange()\nnotifyRuleFailure()" as Notif
    rectangle "<<Service>>\n**SupabaseStorageService**\nupload(), delete()\ngetPublicUrl()" as StoreSvc
}

FAuth --> CAuth
FApp --> CApplicant
FAdmin --> CAdmin
FHead --> CHead

CAuth --> Notif : Registrasi →\nnotifikasi selamat datang
CAdmin --> Notif : Keputusan/Sortir →\nnotifikasi status
CApplicant --> StoreSvc : Upload dokumen
@enduml
```

### Level 4: Code Diagram (Model/Entity)

```plantuml
@startuml
title Software Architecture – Level 4: Code (Eloquent Models)

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam ClassBorderColor black
skinparam ClassBackgroundColor white
skinparam ArrowColor black

class User {
    id : bigint <<PK>>
    name : string
    email : string <<unique>>
    password : string <<hashed>>
    role : enum {applicant, admin, head}
    applicant_type : string <<nullable>>
    institution_name : string <<nullable>>
    phone : string <<nullable>>
    --
    + hasMany(Application)
    + hasMany(Notification)
    + isApplicant() : bool
    + isAdmin() : bool
    + isHead() : bool
}

class Application {
    id : bigint <<PK>>
    user_id : bigint <<FK>>
    division_id : bigint <<FK>>
    status : enum {pending, reviewing, accepted, rejected}
    study_program : string
    internship_start : date
    internship_end : date
    r1_passed : boolean <<nullable>>
    r3_passed : boolean <<nullable>>
    r4_passed : boolean <<nullable>>
    algorithm_score : float <<nullable>>
    recommended_division_id : bigint <<FK, nullable>>
    rejection_reason : text <<nullable>>
    admin_note : text <<nullable>>
    --
    + belongsTo(User)
    + belongsTo(Division)
    + hasMany(Document)
    + isPending() : bool
    + hasAllDocuments() : bool
}

class Division {
    id : bigint <<PK>>
    name : string
    max_quota : integer
    active_applicants : integer
    is_locked : boolean
    --
    + hasMany(Application)
    + getRemainingQuotaAttribute() : int
    + evaluateR5() : void
}

class Document {
    id : bigint <<PK>>
    application_id : bigint <<FK>>
    type : enum {cv, cover_letter, id_card}
    file_path : string
    file_name : string
    --
    + belongsTo(Application)
    + getFileUrlAttribute() : string
}

class Notification {
    id : bigint <<PK>>
    user_id : bigint <<FK>>
    title : string
    message : text
    is_read : boolean
    --
    + belongsTo(User)
    + scopeUnread()
}

User "1" --> "0..*" Application : hasMany
User "1" --> "0..*" Notification : hasMany
Application "1" --> "0..*" Document : hasMany
Application "0..*" --> "1" Division : belongsTo
Division "1" --> "0..*" Application : hasMany
@enduml
```
