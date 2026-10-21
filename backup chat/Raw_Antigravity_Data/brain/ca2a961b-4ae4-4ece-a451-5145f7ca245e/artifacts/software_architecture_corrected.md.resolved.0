# Software Architecture Diagram (Koreksi) — Gaya Template SRS

> Paste kode di bawah ke [plantuml.com](https://www.plantuml.com/plantuml/uml), unduh PNG, ganti diagram lama di SRS.

## Diagram Gabungan 4 Level (1 Gambar)

```plantuml
@startuml
skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 10
skinparam RectangleBorderColor black
skinparam RectangleBackgroundColor white
skinparam DatabaseBorderColor black
skinparam DatabaseBackgroundColor white
skinparam ArrowColor black
skinparam NoteBorderColor black
skinparam NoteBackgroundColor white
skinparam PackageBorderColor black
skinparam PackageBackgroundColor #F5F5F5
skinparam Padding 8
hide empty members

' ══════════════════════════════════════════════════
'  LEVEL 1 - CONTEXT
' ══════════════════════════════════════════════════
package "Level 1\nContext" as L1 {

    rectangle "Calon Peserta\n//mahasiswa//" as CP
    rectangle "Admin Sekretariat\n//Staf Dishub//" as AS
    rectangle "Pimpinan Bidang\n//Dishub Surabaya//" as PB

    rectangle "**E-Internship Dishub**\nPortal Web Pendaftaran Magang\narsitektur Client-Server" as SYS

    rectangle "**Supabase Storage**\nPenyimpanan Dokumen\nPelamar" as SUPA

    CP --> SYS
    AS --> SYS
    PB --> SYS
    SYS --> SUPA
}

' ══════════════════════════════════════════════════
'  LEVEL 2 - CONTAINER
' ══════════════════════════════════════════════════
package "Level 2\nContainer" as L2 {

    rectangle "**Browser Client**\nAntarmuka Web Responsif\n(Next.js 14, Tailwind,\nRecharts, Axios)" as BC

    rectangle "**Backend REST API**\nLogika Bisnis & Autentikasi\n(Laravel 11, Sanctum,\nPhpSpreadsheet)" as API

    database "**Database Relasional**\nPenyimpanan Data Utama\n(PostgreSQL)" as DB

    rectangle "**Supabase Storage**\nDokumen Pelamar\n(Object Storage)" as FS

    BC --> API : REST API\nJSON + Bearer Token
    API --> DB : Eloquent ORM\nTCP/5432
    API --> FS : Upload/Download\nREST API
}

L1 -[hidden]right- L2
SYS .right.> BC : <<ZOOM IN>>

' ══════════════════════════════════════════════════
'  LEVEL 3 - COMPONENT
' ══════════════════════════════════════════════════
package "Level 3\nComponent" as L3 {

    rectangle "**Modul Autentikasi**\nLogin, Register, RBAC\n(AuthController +\nSanctum Token)" as MA

    rectangle "**Modul Pendaftaran**\nForm, Validasi, Status\n(ApplicantController)" as MP

    rectangle "**Modul Upload Dokumen**\nUpload CV, Surat, KTP\n(SupabaseStorageService)" as MU

    rectangle "**Algoritma Sortir**\nKlasifikasi Teks, Keyword\nR1, R3, R4 Rule-Based" as ALG

    rectangle "**Manajemen Kuota**\nDecision Rule, Lock Otomatis\nevaluateR5()" as MK

    rectangle "**Modul Administrasi**\nVerifikasi, Kelulusan\n(AdminController)" as MAD

    rectangle "**Dasbor Analitik**\nGrafik, Ekspor, XLSX\n(HeadController)" as DA

    rectangle "**Modul Notifikasi**\nIn-App Notification\nNotificationHelper" as MN

    rectangle "**Keamanan & Akses**\nSanctum Token,\nBcrypt Hashing" as KA

    MA --> ALG
    MA --> MK
    MP --> MU
    MU --> MAD
    ALG --> DA
    MK --> MN
    MAD --> KA
}

API .down.> MA : <<ZOOM IN>>

' ══════════════════════════════════════════════════
'  LEVEL 4 - CODE
' ══════════════════════════════════════════════════
package "Level 4\nCODE" as L4 {

    rectangle "**User**\nid, name, email\npassword (hashed)\nrole (applicant/admin/head)\napplicant_type, phone\ninstitution_name\nhasMany Pendaftaran" as EU

    rectangle "**Application**\nid, user_id, division_id\nstatus, study_program\ninternship_start, internship_end\nr1_passed, r3_passed, r4_passed\nalgorithm_score\nrecommended_division_id\nrejection_reason, admin_note\nbelongsTo User, Division" as EA

    rectangle "**Division**\nid, name\nmax_quota, active_applicants\nis_locked\nevaluateR5()\n> hasMany Application" as ED

    rectangle "**Document**\nid, application_id, type\n(cv/cover_letter/id_card)\nfile_path, file_name\ngetFileUrlAttribute()" as EDO

    rectangle "**Notification**\nid, user_id\ntitle, message\nis_read\ncreated_at" as EN

    EU --> EA
    EU --> EN
    EA --> EDO
    EA --> ED
}

MA .right.> EU : <<ZOOM IN>>

@enduml
```

---

## Versi Terpisah (Jika Diagram Gabungan Terlalu Padat)

Jika diagram gabungan di atas terlalu kecil saat di-render, gunakan **4 diagram terpisah** berikut:

### Level 1 – Context

```plantuml
@startuml
skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam RectangleBorderColor black
skinparam RectangleBackgroundColor white
skinparam ArrowColor black
hide empty members

title Level 1 – Context

rectangle "Calon Peserta\n//mahasiswa//" as CP
rectangle "Admin Sekretariat\n//Staf Dishub//" as AS
rectangle "Pimpinan Bidang\n//Dishub Surabaya//" as PB

rectangle "**E-Internship Dishub**\nPortal Web Pendaftaran Magang\narsitektur Client-Server\n(Next.js 14 + Laravel 11 API)" as SYS

rectangle "**Supabase Storage**\nPenyimpanan Dokumen\nPelamar (Object Storage)" as SUPA

CP -down-> SYS
AS -down-> SYS
PB -down-> SYS
SYS -down-> SUPA
@enduml
```

### Level 2 – Container

```plantuml
@startuml
skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam RectangleBorderColor black
skinparam RectangleBackgroundColor white
skinparam DatabaseBorderColor black
skinparam DatabaseBackgroundColor white
skinparam ArrowColor black
hide empty members

title Level 2 – Container

rectangle "**Browser Client**\nAntarmuka Web Responsif\n(Next.js 14, Tailwind CSS,\nRecharts, Axios)" as BC

rectangle "**Backend REST API**\nLogika Bisnis & Autentikasi\n(Laravel 11, Sanctum,\nPhpSpreadsheet)" as API

database "**Database Relasional**\nPenyimpanan Data Utama\n(PostgreSQL)" as DB

rectangle "**Supabase Storage**\nDokumen Pelamar\n(Object Storage)" as FS

BC -right-> API : REST API\nJSON + Bearer Token
API -right-> DB : Eloquent ORM\nTCP/5432
API -down-> FS : Upload/Download\nSupabase REST API
@enduml
```

### Level 3 – Component

```plantuml
@startuml
skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam RectangleBorderColor black
skinparam RectangleBackgroundColor white
skinparam ArrowColor black
hide empty members

title Level 3 – Component

rectangle "**Modul Autentikasi**\nLogin, Register, RBAC\n(AuthController +\nSanctum Token)" as MA

rectangle "**Modul Pendaftaran**\nForm, Validasi, Status\n(ApplicantController)" as MP

rectangle "**Modul Upload Dokumen**\nUpload CV, Surat, KTP\n(SupabaseStorageService)" as MU

rectangle "**Algoritma Sortir**\nKlasifikasi Teks, Keyword\nR1, R3, R4 Rule-Based\n(AdminController)" as ALG

rectangle "**Manajemen Kuota**\nDecision Rule, Lock Otomatis\nevaluateR5()\n(AdminController)" as MK

rectangle "**Modul Administrasi**\nVerifikasi, Kelulusan\n(AdminController)" as MAD

rectangle "**Dasbor Analitik**\nGrafik, Ekspor, XLSX\n(HeadController)" as DA

rectangle "**Modul Notifikasi**\nIn-App Notification\n(NotificationHelper)" as MN

rectangle "**Keamanan & Akses**\nSanctum Token,\nBcrypt Hashing" as KA

MA -down-> ALG
MA -down-> MK
MP -down-> MU
ALG -down-> DA
MK -down-> MN
MAD -down-> KA
@enduml
```

### Level 4 – Code (Entity / Model)

```plantuml
@startuml
skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam RectangleBorderColor black
skinparam RectangleBackgroundColor white
skinparam ArrowColor black
hide empty members

title Level 4 – CODE

rectangle "**User**\nid, name, email\npassword (hashed)\nrole (applicant/admin/head)\napplicant_type\ninstitution_name, phone\nhasMany Application" as U

rectangle "**Application**\nid, user_id, division_id\nstatus, study_program\ninternship_start, internship_end\nr1_passed, r3_passed, r4_passed\nalgorithm_score\nrecommended_division_id\nrejection_reason, admin_note\nbelongsTo User, Division" as A

rectangle "**Division**\nid, name\nmax_quota, active_applicants\nis_locked\nevaluateR5()\nhasMany Application" as D

rectangle "**Document**\nid, application_id, type\n(cv/cover_letter/id_card)\nfile_path, file_name\ngetFileUrlAttribute()\nbelongsTo Application" as DOC

rectangle "**Notification**\nid, user_id\ntitle, message\nis_read, created_at\nbelongsTo User" as N

U -down-> A
U -down-> N
A -down-> DOC
A -right-> D
@enduml
```
