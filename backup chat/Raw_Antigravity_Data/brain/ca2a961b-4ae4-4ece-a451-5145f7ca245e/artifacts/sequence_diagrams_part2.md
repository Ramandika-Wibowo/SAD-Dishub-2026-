# 10 Sequence Diagram E-Internship — Part 2 (UC-06 s.d. UC-10)

---

## SD-06 · UC-06 – Ubah Status Kelulusan

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-06 (Ubah Status Kelulusan), di mana AdminController memperbarui status pengajuan menjadi *accepted* atau *rejected*, mengurangi kuota divisi melalui increment('active_applicants') dan mengevaluasi penguncian otomatis via evaluateR5() jika diterima, serta memicu pengiriman notifikasi hasil keputusan kepada pelamar melalui notifyStatusChange().

### PlantUML

```plantuml
@startuml
title sd Ubah Status Kelulusan (UC-06)

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
participant ":Division" as DivModel
database ":Database" as DB

Admin -> Browser : pilih keputusan\n(Terima / Tolak) + catatan
activate Browser

Browser -> Ctrl : PATCH /api/v1/admin/\napplications/{id}/decide\n{decision, admin_note /\nrejection_reason}
activate Ctrl

Ctrl -> DB : Application::with([user, division])\n->findOrFail(id)
activate DB
DB --> Ctrl : $application
deactivate DB

alt [status bukan pending/reviewing]
    Ctrl --> Browser : 422 {message:\n"Keputusan hanya untuk\npending/reviewing."}
    Browser --> Admin : tampilkan pesan error

else [decision = "accepted"]
    Ctrl -> DB : Application::update()\n{status="accepted",\nrecommended_division_id,\nadmin_note}
    activate DB
    DB --> Ctrl : ok
    deactivate DB

    Ctrl -> DivModel : $division->increment\n("active_applicants")
    activate DivModel
    DivModel -> DB : UPDATE divisions\nSET active_applicants + 1
    activate DB
    DB --> DivModel : ok
    deactivate DB

    DivModel -> DivModel : evaluateR5()\n[active >= max_quota\n→ is_locked = true]
    DivModel --> Ctrl : ok
    deactivate DivModel

    Ctrl -> DB : notifyStatusChange(user_id,\n"accepted", division_name,\nadmin_note, start_date)
    activate DB
    DB --> Ctrl : ok
    deactivate DB

    Ctrl --> Browser : 200 OK\n{message:"Pengajuan diterima\ndi divisi {name}."}
    Browser --> Admin : status "Diterima"

else [decision = "rejected"]
    Ctrl -> DB : Application::update()\n{status="rejected",\nrejection_reason}
    activate DB
    DB --> Ctrl : ok
    deactivate DB

    Ctrl -> DB : notifyStatusChange(user_id,\n"rejected", rejection_reason)
    activate DB
    DB --> Ctrl : ok
    deactivate DB

    Ctrl --> Browser : 200 OK\n{message:"Pengajuan ditolak."}
    deactivate Ctrl
    Browser --> Admin : status "Ditolak"
end
deactivate Browser
@enduml
```

---

## SD-07 · UC-07 – Kelola Kuota Divisi

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-07 (Kelola Kuota Divisi), di mana AdminController menampilkan statistik seluruh divisi beserta jumlah pelamar per-status, memperbarui batas kuota maksimal melalui UpdateDivisionRequest, dan mengevaluasi penguncian otomatis divisi melalui evaluateR5() apabila jumlah peserta aktif telah mencapai kapasitas yang ditetapkan.

### PlantUML

```plantuml
@startuml
title sd Kelola Kuota Divisi (UC-07)

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
participant ":Division" as DivModel
database ":Database" as DB

Admin -> Browser : akses halaman\n"Kelola Divisi"
activate Browser

Browser -> Ctrl : GET /api/v1/admin/divisions
activate Ctrl

Ctrl -> DB : Division::all()
activate DB
DB --> Ctrl : Collection $divisions
deactivate DB

Ctrl -> DB : SELECT division_id, status,\nCOUNT(*) FROM applications\nGROUP BY division_id, status
activate DB
DB --> Ctrl : $counts
deactivate DB

Ctrl -> Ctrl : map() → {name, max_quota,\nactive_applicants,\nremaining_quota, is_locked,\npending/accepted/rejected_count}

Ctrl --> Browser : 200 OK {data: [...]}
deactivate Ctrl

Browser --> Admin : render tabel divisi\n+ badge kuota + status kunci

Admin -> Browser : ubah kuota divisi\n(input max_quota baru)

Browser -> Ctrl : PATCH /api/v1/admin/\ndivisions/{id} {max_quota: 20}
activate Ctrl

Ctrl -> Ctrl : UpdateDivisionRequest\n::validate()

alt [validasi gagal]
    Ctrl --> Browser : 422 {errors:\n{max_quota: [...]}}
    Browser --> Admin : pesan error validasi
else [validasi sukses]
    Ctrl -> DivModel : $division->update()\n{max_quota: 20}
    activate DivModel
    DivModel -> DB : UPDATE divisions\nSET max_quota = 20
    activate DB
    DB --> DivModel : ok
    deactivate DB

    DivModel -> DivModel : evaluateR5()\n[active >= max_quota\n→ is_locked = true\nelse → is_locked = false]
    DivModel --> Ctrl : $division (updated)
    deactivate DivModel

    Ctrl --> Browser : 200 OK\n{message:"Kuota berhasil\ndiperbarui.", data:{...}}
    deactivate Ctrl
    Browser --> Admin : perbarui tampilan tabel
end
deactivate Browser
@enduml
```

---

## SD-08 · UC-08 – Tinjau Dasbor Analitik

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-08 (Tinjau Dasbor Analitik), di mana HeadController mengambil data statistik agregat mencakup total pelamar per-status, distribusi per-divisi, *breakdown* tipe pelamar, tren bulanan 12 bulan terakhir, serta persentase kapasitas divisi untuk ditampilkan dalam grafik interaktif pada *dashboard* Pimpinan Bidang.

### PlantUML

```plantuml
@startuml
title sd Tinjau Dasbor Analitik (UC-08)

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

actor ":Pimpinan\nBidang" as Head
participant ":WebBrowser" as Browser
participant ":HeadController" as Ctrl
database ":Database" as DB

Head -> Browser : akses halaman Dashboard
activate Browser

Browser -> Ctrl : GET /api/v1/head/analytics\n[Authorization: Bearer {token}]
activate Ctrl

Ctrl -> Ctrl : verifikasi role="head"\nvia Sanctum Middleware

Ctrl -> DB : SELECT COUNT(*) FROM applications\nWHERE status IN\n(pending, reviewing,\naccepted, rejected)
activate DB
DB --> Ctrl : summary counts
deactivate DB

Ctrl -> DB : Division::withCount(applications)\n->get()
activate DB
DB --> Ctrl : applicants_per_division
deactivate DB

Ctrl -> DB : SELECT applicant_type,\nCOUNT(*) FROM applications\nJOIN users GROUP BY type
activate DB
DB --> Ctrl : applicant_type_breakdown
deactivate DB

Ctrl -> DB : SELECT MONTH, YEAR, COUNT(*)\nFROM applications\nWHERE created_at >= 12 months\nGROUP BY month, year
activate DB
DB --> Ctrl : monthly_trend
deactivate DB

Ctrl -> DB : Division::all() → map()\npercentage = (active/max)*100
activate DB
DB --> Ctrl : division_capacity
deactivate DB

Ctrl --> Browser : 200 OK\n{total_applicants,\ntotal_accepted, total_rejected,\napplicants_per_division,\nmonthly_trend,\ndivision_capacity}
deactivate Ctrl

Browser --> Head : render grafik interaktif\n+ statistik ringkasan

Head -> Browser : klik "Refresh"

Browser -> Ctrl : GET /api/v1/head/analytics
activate Ctrl
Ctrl -> DB : (query ulang semua statistik)
activate DB
DB --> Ctrl : data terbaru
deactivate DB
Ctrl --> Browser : 200 OK {data terbaru}
deactivate Ctrl

Browser --> Head : perbarui tampilan\ndengan animasi loading
deactivate Browser
@enduml
```

---

## SD-09 · UC-09 – Ekspor Rekap Data

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-09 (Ekspor Rekap Data), di mana HeadController memfilter data pengajuan sesuai parameter yang dipilih Pimpinan Bidang (status, divisi, rentang tanggal, tipe pelamar), membangkitkan file .xlsx berformat laporan 17 kolom menggunakan PhpSpreadsheet, dan mengirimkannya sebagai BinaryFileResponse yang terunduh langsung ke perangkat pengguna.

### PlantUML

```plantuml
@startuml
title sd Ekspor Rekap Data (UC-09)

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

actor ":Pimpinan\nBidang" as Head
participant ":WebBrowser" as Browser
participant ":HeadController" as Ctrl
participant ":PhpSpreadsheet" as XLS
database ":Database" as DB

Head -> Browser : set filter (status, divisi,\ndate_from, date_to)\nklik "Ekspor ke Excel"
activate Browser

Browser -> Ctrl : POST /api/v1/head/export\n{status, division_id,\ndate_from, date_to}\n[responseType: blob]
activate Ctrl

Ctrl -> Ctrl : ExportRequest::validate()

Ctrl -> DB : Application::with([user, division])\n->where(status, division_id,\ndate range)\n->orderBy(created_at, desc)->get()
activate DB
DB --> Ctrl : Collection $applications
deactivate DB

Ctrl -> XLS : new Spreadsheet()
activate XLS
XLS -> XLS : setTitle("Data Pengajuan Magang")
XLS -> XLS : applyHeaderStyle(A1:Q1)\n[bold, fill:blue, border]
XLS -> XLS : setHeaders: No, Nama,\nEmail, Telepon, Tipe,\nInstitusi, Prodi, Divisi,\nStatus, Skor, R1, R3, R4,\nAlasan, Tgl Mulai/Selesai/Daftar

loop [setiap $application]
    XLS -> XLS : setCellValue()\nrow data pelamar
end

XLS -> XLS : autoSize(A→Q)
XLS --> Ctrl : $spreadsheet
deactivate XLS

Ctrl -> Ctrl : Xlsx::save(tempPath)\nfilename=Laporan_Magang_\n{Ymd_His}.xlsx

alt [data ditemukan]
    Ctrl --> Browser : BinaryFileResponse\nContent-Type: application/vnd.\nopenxmlformats-spreadsheetml\n[deleteFileAfterSend: true]
    deactivate Ctrl

    Browser -> Browser : createObjectURL(blob)\ntrigger download

    Browser --> Head : file .xlsx terunduh
else [data kosong]
    Ctrl --> Browser : file xlsx kosong\n(hanya header)
    Browser --> Head : file terunduh tanpa data
end
deactivate Browser
@enduml
```

---

## SD-10 · UC-10 – Kirim Notifikasi Otomatis

### Kalimat Pengantar

Diagram *sequence* berikut menggambarkan skenario UC-10 (Kirim Notifikasi Otomatis), di mana fungsi helper global sendNotification() dan notifyStatusChange() dipanggil oleh berbagai *controller* pada setiap perubahan status pengajuan untuk menyimpan rekaman notifikasi ke *database* dan menampilkannya secara *real-time* pada halaman notifikasi pelamar melalui ApplicantController::notifications().

### PlantUML

```plantuml
@startuml
title sd Kirim Notifikasi Otomatis (UC-10)

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

participant ":AuthController" as AuthCtrl
participant ":AdminController" as AdminCtrl
participant ":NotificationHelper" as Helper
database ":Database" as DB
actor ":Pelamar" as Pelamar
participant ":WebBrowser" as Browser
participant ":ApplicantController" as AppCtrl

== Trigger: Registrasi (UC-01) ==

AuthCtrl -> Helper : sendNotification(user_id,\n"Selamat Datang!",\n"Akun berhasil didaftarkan...")
activate Helper
Helper -> DB : Notification::create()\n{user_id, title, message,\nis_read: false}
activate DB
DB --> Helper : $notification
deactivate DB
Helper --> AuthCtrl : $notification
deactivate Helper

== Trigger: Algoritma Sortir (UC-05) ==

AdminCtrl -> Helper : notifyStatusChange(user_id,\n"reviewing")
activate Helper
Helper -> Helper : resolve title:\n"Pengajuan Sedang Ditinjau"
Helper -> DB : Notification::create()\n{user_id, title, message}
activate DB
DB --> Helper : $notification
deactivate DB
Helper --> AdminCtrl : $notification
deactivate Helper

== Trigger: Keputusan Diterima (UC-06) ==

AdminCtrl -> Helper : notifyStatusChange(user_id,\n"accepted", division_name,\nadmin_note, start_date)
activate Helper
Helper -> Helper : resolve title + message:\n"Selamat, Anda diterima\ndi divisi {name}.\nSilakan kunjungi Kantor\nDishub Surabaya..."
Helper -> DB : Notification::create()
activate DB
DB --> Helper : $notification
deactivate DB
Helper --> AdminCtrl : $notification
deactivate Helper

== Trigger: Keputusan Ditolak (UC-06) ==

AdminCtrl -> Helper : notifyStatusChange(user_id,\n"rejected", rejection_reason)
activate Helper
Helper -> Helper : resolve message:\n"Pengajuan Anda ditolak:\n{alasan}"
Helper -> DB : Notification::create()
activate DB
DB --> Helper : $notification
deactivate DB
Helper --> AdminCtrl : $notification
deactivate Helper

== Pelamar Melihat Notifikasi ==

Pelamar -> Browser : akses halaman Notifikasi
activate Browser

Browser -> AppCtrl : GET /api/v1/notifications\n[Authorization: Bearer {token}]
activate AppCtrl

AppCtrl -> DB : Notification::where(user_id)\n->orderBy(created_at, desc)\n->paginate(20)
activate DB
DB --> AppCtrl : paginated notifications
deactivate DB

AppCtrl --> Browser : 200 OK\n{data: notifications[]}
deactivate AppCtrl

Browser --> Pelamar : tampilkan daftar notifikasi\n(unread ditandai bold)

Pelamar -> Browser : klik notifikasi

Browser -> AppCtrl : PATCH /api/v1/notifications/\n{id}/read
activate AppCtrl
AppCtrl -> DB : Notification::update()\n{is_read: true}
activate DB
DB --> AppCtrl : ok
deactivate DB
AppCtrl --> Browser : 200 OK\n{message:"Ditandai dibaca."}
deactivate AppCtrl

Browser --> Pelamar : notifikasi berubah\nmenjadi sudah dibaca
deactivate Browser
@enduml
```
