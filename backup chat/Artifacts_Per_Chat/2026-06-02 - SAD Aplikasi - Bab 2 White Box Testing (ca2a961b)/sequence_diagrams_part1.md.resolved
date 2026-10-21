# 10 Sequence Diagram E-Internship — Part 1 (UC-01 s.d. UC-05)

> **Cara pakai:** Buka [plantuml.com](https://www.plantuml.com/plantuml/uml) → paste kode → unduh PNG → tempel ke Word
> **Font dokumen:** Arial 12

---

## SD-01 · UC-01 – Manajemen Autentikasi

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-01 (Manajemen Autentikasi) pada alur pendaftaran akun baru dan masuk (*login*), di mana AuthController memvalidasi kredensial melalui RegisterRequest dan LoginRequest, menyimpan data pengguna ke *database* PostgreSQL, membuat token autentikasi Sanctum, serta mengarahkan pengguna ke halaman *dashboard* sesuai peran (*applicant*, *admin*, atau *head*).

### PlantUML

```plantuml
@startuml
title sd Manajemen Autentikasi (UC-01)

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam ParticipantPadding 20
skinparam sequenceArrowThickness 1
skinparam SequenceLifeLineBorderColor black
skinparam SequenceParticipantBorderColor black
skinparam SequenceParticipantBackgroundColor white
skinparam ActorBorderColor black
skinparam ActorBackgroundColor white
skinparam SequenceGroupBorderColor black
skinparam SequenceGroupBodyBackgroundColor white
hide footbox

actor ":Pengguna" as User
participant ":WebBrowser" as Browser
participant ":AuthController" as Auth
database ":Database" as DB

== Registrasi Akun Baru ==

User -> Browser : isi form registrasi\n(name, email, password,\napplicant_type, institution_name)
activate Browser

Browser -> Auth : POST /api/v1/auth/register
activate Auth

Auth -> Auth : RegisterRequest::validate()

alt [validasi gagal]
    Auth --> Browser : 422 Unprocessable\n{errors: {email: [...]}}
    Browser --> User : tampilkan pesan error
else [validasi sukses]
    Auth -> DB : User::create()\n{name, email, password(hashed),\nrole="applicant", applicant_type}
    activate DB
    DB --> Auth : $user
    deactivate DB

    Auth -> Auth : $user->createToken("auth-token")

    Auth -> DB : sendNotification(user_id,\n"Selamat Datang!", message)
    activate DB
    DB --> Auth : $notification
    deactivate DB

    Auth --> Browser : 201 Created\n{success:true, data:{user, token}}
    deactivate Auth
    Browser --> User : redirect ke /login
end
deactivate Browser

== Login ==

User -> Browser : masukkan email & password
activate Browser

Browser -> Auth : POST /api/v1/auth/login
activate Auth

Auth -> Auth : LoginRequest::validate()
Auth -> Auth : Auth::attempt(email, password)

alt [kredensial tidak valid]
    Auth --> Browser : 401 Unauthorized\n{message:"Email atau password salah."}
    Browser --> User : tampilkan pesan error
else [kredensial valid]
    Auth -> DB : SELECT * FROM users WHERE email=?
    activate DB
    DB --> Auth : $user
    deactivate DB

    Auth -> Auth : $user->createToken("auth-token")

    Auth --> Browser : 200 OK\n{user, token, role}
    deactivate Auth

    alt [role = "applicant"]
        Browser --> User : redirect ke /dashboard/applicant
    else [role = "admin"]
        Browser --> User : redirect ke /dashboard/admin
    else [role = "head"]
        Browser --> User : redirect ke /dashboard/head
    end
end
deactivate Browser
@enduml
```

---

## SD-02 · UC-02 – Unggah Dokumen & Formulir

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-02 (Unggah Dokumen & Formulir), di mana ApplicantController memeriksa duplikasi pengajuan dan ketersediaan kuota divisi, menyimpan data permohonan dengan status *pending*, mengunggah dokumen persyaratan (CV, Surat Pengantar, Kartu Identitas) ke Supabase Storage melalui SupabaseStorageService, serta mengirimkan notifikasi konfirmasi kepada Pelamar.

### PlantUML

```plantuml
@startuml
title sd Unggah Dokumen dan Formulir (UC-02)

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam ParticipantPadding 20
skinparam sequenceArrowThickness 1
skinparam SequenceLifeLineBorderColor black
skinparam SequenceParticipantBorderColor black
skinparam SequenceParticipantBackgroundColor white
skinparam ActorBorderColor black
skinparam ActorBackgroundColor white
skinparam SequenceGroupBorderColor black
skinparam SequenceGroupBodyBackgroundColor white
hide footbox

actor ":Pelamar" as Pelamar
participant ":WebBrowser" as Browser
participant ":ApplicantController" as Ctrl
participant ":SupabaseStorageService" as Storage
database ":Database" as DB

Pelamar -> Browser : isi form pengajuan\n(divisi, tanggal, program studi)
activate Browser

Browser -> Ctrl : POST /api/v1/applications\n{division_id, internship_start,\ninternship_end, study_program}
activate Ctrl

Ctrl -> DB : Application::where(user_id,\ndivision_id)->first()
activate DB
DB --> Ctrl : $existing
deactivate DB

alt [duplikat: sudah ditolak]
    Ctrl --> Browser : 422 {message:\n"Sudah pernah ditolak.\nPilih divisi lain."}
    Browser --> Pelamar : tampilkan pesan error
else [duplikat: pengajuan aktif]
    Ctrl --> Browser : 422 {message:\n"Sudah ada pengajuan aktif."}
    Browser --> Pelamar : tampilkan pesan error
else [tidak ada duplikat]
    Ctrl -> DB : Division::findOrFail(division_id)
    activate DB
    DB --> Ctrl : $division
    deactivate DB

    alt [$division->is_locked == true]
        Ctrl --> Browser : 422 {message:\n"Kuota divisi sudah penuh."}
        Browser --> Pelamar : tampilkan pesan kuota penuh
    else [kuota tersedia]
        Ctrl -> DB : Application::create()\n{user_id, division_id,\nstatus="pending", study_program}
        activate DB
        DB --> Ctrl : $application
        deactivate DB

        Ctrl -> DB : sendNotification()\n"Pengajuan Terkirim"
        activate DB
        DB --> Ctrl : ok
        deactivate DB

        Ctrl --> Browser : 201 Created\n{application, status:"pending"}

        loop [setiap dokumen: cv, cover_letter, id_card]
            Browser -> Ctrl : POST /api/v1/applications/\n{id}/documents {file, type}
            activate Ctrl

            Ctrl -> Ctrl : isPending()? validate()

            Ctrl -> Storage : upload(file,\n"applications/{id}/{type}")
            activate Storage

            alt [upload gagal]
                Storage --> Ctrl : Exception
                Ctrl --> Browser : 500 {message:\n"Gagal mengunggah {type}"}
            else [upload sukses]
                Storage --> Ctrl : {path, file_name}
                deactivate Storage

                Ctrl -> DB : Document::updateOrCreate()\n{application_id, type, file_path}
                activate DB
                DB --> Ctrl : $document
                deactivate DB

                Ctrl --> Browser : 200 OK {document_id}
                deactivate Ctrl
            end
        end

        Browser --> Pelamar : tampilkan status "Pending"\n+ daftar dokumen terunggah
    end
end
deactivate Ctrl
deactivate Browser
@enduml
```

---

## SD-03 · UC-03 – Lacak Status Berkas

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-03 (Lacak Status Berkas), di mana ApplicantController mengambil seluruh data pengajuan milik pelamar melalui relasi *Eloquent* (division, documents, recommendedDivision) dan menampilkan tahapan evaluasi secara dinamis meliputi status *pending*, *reviewing*, *accepted*, atau *rejected* beserta detail skor algoritma dan alasan penolakan.

### PlantUML

```plantuml
@startuml
title sd Lacak Status Berkas (UC-03)

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam ParticipantPadding 20
skinparam sequenceArrowThickness 1
skinparam SequenceLifeLineBorderColor black
skinparam SequenceParticipantBorderColor black
skinparam SequenceParticipantBackgroundColor white
skinparam ActorBorderColor black
skinparam ActorBackgroundColor white
skinparam SequenceGroupBorderColor black
skinparam SequenceGroupBodyBackgroundColor white
hide footbox

actor ":Pelamar" as Pelamar
participant ":WebBrowser" as Browser
participant ":ApplicantController" as Ctrl
database ":Database" as DB

Pelamar -> Browser : akses halaman\n"Status Pengajuan"
activate Browser

Browser -> Ctrl : GET /api/v1/applications/my\n[Authorization: Bearer {token}]
activate Ctrl

Ctrl -> Ctrl : $request->user()

Ctrl -> DB : Application::where(user_id)\n->with([division,\nrecommendedDivision, documents])\n->orderBy(created_at, desc)->get()
activate DB
DB --> Ctrl : Collection $applications
deactivate DB

Ctrl -> Ctrl : map() → {id, division,\nstatus, r1_passed, r3_passed,\nr4_passed, algorithm_score,\nrejection_reason, documents}

Ctrl --> Browser : 200 OK\n{success:true, data: [...]}
deactivate Ctrl

alt [status = "pending"]
    Browser --> Pelamar : badge kuning\n"Menunggu Verifikasi"
else [status = "reviewing"]
    Browser --> Pelamar : badge biru\n"Sedang Ditinjau" + skor
else [status = "accepted"]
    Browser --> Pelamar : badge hijau\n"Diterima" + divisi
else [status = "rejected"]
    Browser --> Pelamar : badge merah\n"Ditolak" + alasan
end

deactivate Browser
@enduml
```

---

## SD-04 · UC-04 – Kelola Antrean Pelamar

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-04 (Kelola Antrean Pelamar), di mana AdminController menampilkan seluruh data pelamar dalam format tabel interaktif yang mendukung penyaringan berdasarkan divisi, status, dan tipe pelamar, pencarian berdasarkan nama atau email, serta pengurutan dinamis dan *pagination*.

### PlantUML

```plantuml
@startuml
title sd Kelola Antrean Pelamar (UC-04)

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam ParticipantPadding 20
skinparam sequenceArrowThickness 1
skinparam SequenceLifeLineBorderColor black
skinparam SequenceParticipantBorderColor black
skinparam SequenceParticipantBackgroundColor white
skinparam ActorBorderColor black
skinparam ActorBackgroundColor white
skinparam SequenceGroupBorderColor black
skinparam SequenceGroupBodyBackgroundColor white
hide footbox

actor ":Admin\nSekretariat" as Admin
participant ":WebBrowser" as Browser
participant ":AdminController" as Ctrl
database ":Database" as DB

Admin -> Browser : akses halaman\n"Daftar Pelamar"
activate Browser

Browser -> Ctrl : GET /api/v1/admin/applications\n?division_id=&status=&\nsearch=&sort=-created_at\n&per_page=15
activate Ctrl

Ctrl -> DB : Application::with(\n[user, division, documents,\nrecommendedDivision])
activate DB

opt [filter division_id]
    Ctrl -> DB : ->where(division_id, ?)
end

opt [filter status]
    Ctrl -> DB : ->where(status, ?)
end

opt [search keyword]
    Ctrl -> DB : ->whereHas(user,\nname ILIKE ? OR email ILIKE ?)
end

Ctrl -> DB : ->orderBy(sort_field, dir)\n->paginate(per_page)
DB --> Ctrl : LengthAwarePaginator
deactivate DB

Ctrl --> Browser : 200 OK\n{data:[...], meta:pagination}
deactivate Ctrl

Browser --> Admin : render tabel interaktif\n+ kontrol filter + pagination

Admin -> Browser : klik baris pelamar

Browser -> Ctrl : GET /api/v1/admin/\napplications/{id}
activate Ctrl
Ctrl -> DB : Application::with([user,\ndivision, documents])\n->findOrFail(id)
activate DB
DB --> Ctrl : $application
deactivate DB
Ctrl --> Browser : 200 OK\n{application, rule_results}
deactivate Ctrl

Browser --> Admin : modal detail pelamar\n+ preview dokumen

deactivate Browser
@enduml
```

---

## SD-05 · UC-05 – Eksekusi Algoritma Sortir

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-05 (Eksekusi Algoritma Sortir), di mana AdminController mengevaluasi pengajuan secara otomatis melalui tiga aturan bisnis (R1: kelengkapan dokumen, R3: ketersediaan kuota divisi, R4: kesesuaian kata kunci menggunakan calculateKeywordScore()) lalu menghasilkan skor dan rekomendasi keputusan sebagai *Decision Support System* bagi Admin Sekretariat.

### PlantUML

```plantuml
@startuml
title sd Eksekusi Algoritma Sortir DSS (UC-05)

skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 11
skinparam ParticipantPadding 20
skinparam sequenceArrowThickness 1
skinparam SequenceLifeLineBorderColor black
skinparam SequenceParticipantBorderColor black
skinparam SequenceParticipantBackgroundColor white
skinparam ActorBorderColor black
skinparam ActorBackgroundColor white
skinparam SequenceGroupBorderColor black
skinparam SequenceGroupBodyBackgroundColor white
hide footbox

actor ":Admin\nSekretariat" as Admin
participant ":WebBrowser" as Browser
participant ":AdminController" as Ctrl
database ":Database" as DB

Admin -> Browser : klik "Proses Algoritma"\npada detail pelamar
activate Browser

Browser -> Ctrl : POST /api/v1/admin/\napplications/{id}/execute-sort
activate Ctrl

Ctrl -> DB : Application::with([documents,\ndivision, user])->findOrFail(id)
activate DB
DB --> Ctrl : $application
deactivate DB

alt [status bukan pending/reviewing]
    Ctrl --> Browser : 422 {message:\n"Algoritma hanya untuk\nstatus pending/reviewing."}
    Browser --> Admin : tampilkan pesan error
else [status valid]
    note over Ctrl : R1: Kelengkapan Dokumen
    Ctrl -> Ctrl : cek: cv, cover_letter, id_card\n→ $r1Passed

    note over Ctrl : R3: Ketersediaan Kuota
    Ctrl -> Ctrl : !is_locked &&\nactive < max_quota\n→ $r3Passed

    note over Ctrl : R4: Keyword Matching
    Ctrl -> Ctrl : calculateKeywordScore()\n→ relevanceMap(0.6)\n+ keywordOverlap(0.4)\n→ $score, $r4Passed

    Ctrl -> DB : Application::update()\n{r1, r3, r4, score,\nstatus="reviewing"}
    activate DB
    DB --> Ctrl : ok
    deactivate DB

    Ctrl -> DB : notifyStatusChange()\n{user_id, "reviewing"}
    activate DB
    DB --> Ctrl : ok
    deactivate DB

    alt [r1 && r3 && r4 == true]
        Ctrl --> Browser : 200 OK\n{recommendation:\n"Disarankan MENERIMA"}
        Browser --> Admin : hasil: rekomendasi TERIMA
    else [ada aturan gagal]
        Ctrl --> Browser : 200 OK\n{recommendation:\n"Perlu ditinjau",\nwarnings:[...]}
        deactivate Ctrl
        Browser --> Admin : hasil + daftar peringatan
    end
end
deactivate Browser
@enduml
```
