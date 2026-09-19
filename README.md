# 🎙️ E-Internship Suara Surabaya Media

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Laravel](https://img.shields.io/badge/Laravel-11.0-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-316192?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**E-Internship Suara Surabaya Media** adalah platform web modern untuk manajemen penerimaan, penyeleksian, dan evaluasi peserta magang/PKL (Praktik Kerja Lapangan) di lingkungan **Suara Surabaya Media** (Radio Suara Surabaya FM 100). 

Sistem ini mengintegrasikan otomasi seleksi berbasis aturan (*Rule-Based Decision Support System*), manajemen kuota divisi dinamis, pelacakan linimasa status pelamar, serta pelaporan analitik eksekutif.

---

## 🌟 Fitur Utama

### 👤 1. Portal Pelamar (Applicant)
* **Autentikasi Aman:** Registrasi dan login berbasis token (Laravel Sanctum) dilengkapi slider hero interaktif 5 detik.
* **Pengajuan Magang Multi-Langkah:** Formulir terpadu untuk pemilihan divisi kerja, input data diri akademik, dan unggah berkas (CV, KTP, Surat Pengantar Kampus, Proposal).
* **Alur Pendaftaran Ulang (Alumni):** Pelamar yang telah menyelesaikan masa magang (`internship_end < hari ini`) otomatis terdeteksi sebagai alumni dan dapat mendaftar kembali pada siklus magang berikutnya.
* **Pelacakan Status Real-Time:** Linimasa interaktif untuk memantau status pengajuan (*Menunggu*, *Sedang Ditinjau*, *Diterima*, atau *Ditolak*).
* **Profil Pengguna Responsif:** Pengelolaan data pribadi dan tabel metadata akun sistem yang selaras pada mode terang maupun gelap.

### 🛡️ 2. Portal Redaksi & HRD (Admin)
* **Antrean Pengajuan Terpusat:** Tabel pengelolaan pelamar lengkap dengan pencarian, filter status, dan filter divisi.
* **Algoritma Seleksi Otomatis (DSS):** Rekomendasi seleksi pelamar berdasarkan kriteria kelengkapan dokumen (R1), ketersediaan kuota (R3), dan kecocokan jurusan/program studi (R4).
* **Keputusan Penerimaan & Penolakan:** Admin dapat menerima pelamar dengan menentukan tanggal mulai/selesai magang dan catatan kedatangan, atau menolak dengan mencantumkan alasan penolakan.
* **Manajemen Kuota Divisi:** Pengaturan kuota maksimal dan penguncian divisi (*lock/unlock*) secara *real-time*.

### 📊 3. Portal Direksi & Pimpinan (Head)
* **Dasbor Analitik Eksekutif:** Visualisasi tren pendaftar bulanan, komposisi jenis pelamar (Mahasiswa, Siswa SLTA, Fresh Graduate), dan utilisasi kapasitas divisi.
* **Ekspor Laporan:** Unduh rekapitulasi data pendaftar dan penerimaan magang ke format spreadsheet Microsoft Excel (`.xlsx`).

### 🌓 4. Desain & Aksesibilitas
* **Dukungan Dual Mode:** Beralih instan antara **Light Mode** dan **Dark Mode** melalui komponen `ThemeToggle` dengan persistensi `localStorage`.
* **Desain Berstandar Impeccable:** Mengadopsi palet korporat **Suara Surabaya Royal Blue** (`#1D4ED8`) dengan kontras font tinggi, transisi halus, dan tata letak responsif di desktop maupun perangkat seluler.

---

## 🏗️ Arsitektur Teknologi

```
┌────────────────────────────────────────────────────────┐
│               Browser Klien / Pengguna                 │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST API (Port 3000 & 8000)
┌───────────────────────────▼────────────────────────────┐
│          Frontend: Next.js 14 (App Router)             │
│    • TypeScript, Tailwind CSS, Axios, Lucide Icons     │
│    • Mode Produksi Bebas Lag (Pre-compiled Pages)      │
└───────────────────────────┬────────────────────────────┘
                            │ JSON REST API
┌───────────────────────────▼────────────────────────────┐
│             Backend: Laravel 11 (REST API)             │
│    • Laravel Sanctum Authentication                    │
│    • Notification Helper & Queue Worker                │
│    • Local Disk File Storage (Uploads & Berkas)        │
└───────────────────────────┬────────────────────────────┘
                            │ SQL Queries
┌───────────────────────────▼────────────────────────────┐
│          Basis Data: PostgreSQL Lokal (Port 5432)       │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Panduan Memulai Cepat (Quick Start)

### Prasyarat Sistem
* **PHP:** Versi 8.2 atau lebih baru (dengan ekstensi `pdo_pgsql`, `pgsql`, `fileinfo`, `gd`, `zip`)
* **Node.js:** Versi 18.x atau 20.x
* **Composer:** Versi 2.x
* **PostgreSQL:** Versi 14 atau lebih baru (Port default `5432`)

---

### 🟢 Menjalankan Aplikasi (1-Click Launcher - Windows)

Untuk kemudahan pengoperasian di lingkungan Windows tanpa konfigurasi terminal manual:
1. Pastikan PostgreSQL lokal Anda telah aktif.
2. Klik dua kali (*double-click*) file:
   ```bash
   START_APLIKASI.bat
   ```
   *Skrip otomatis menyalakan PostgreSQL service, menjalankan Laravel API di port `8000`, menyalakan Next.js Production server di port `3000`, dan membuka browser Anda secara otomatis.*

---

### 🔴 Mematikan Aplikasi
Untuk membebaskan alokasi RAM dan CPU laptop secara bersih:
* Klik dua kali file:
  ```bash
  STOP_APLIKASI.bat
  ```

---

### ⚙️ Menjalankan Manual melalui Terminal

#### 1. Persiapan Backend (Laravel)
```bash
cd backend

# Salin konfigurasi environment
cp .env.example .env

# Pasang dependensi
composer install

# Generate Application Key
php artisan key:generate

# Jalankan migrasi dan seeder awal
php artisan migrate --seed

# Buat symbolic link storage
php artisan storage:link

# Jalankan server
php artisan serve --port=8000
```

#### 2. Persiapan Frontend (Next.js)
```bash
cd frontend

# Pasang dependensi
npm install

# Buat build production untuk performa instan
npm run build

# Jalankan server production
npm run start
```
Buka antarmuka aplikasi melalui browser di **`http://localhost:3000`**.

---

## 🔑 Kredensial Akun Pengujian

| Peran (Role) | Alamat Email | Kata Sandi | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin Redaksi/HR** | `admin@suarasurabaya.net` | `password123` | Manajemen seleksi & kuota divisi |
| **Pimpinan Redaksi** | `pimpinan@suarasurabaya.net` | `password123` | Analitik & ekspor laporan |
| **Pelamar (Mahasiswa)** | `ahmad.fauzi@student.ac.id` | `password123` | Pengajuan & pelacakan status |

> **Catatan:** Sistem login juga dilengkapi *backward-compatibility alias* untuk email demo terdahulu (`@dishub-surabaya.go.id`).

---

## 📁 Struktur Direktori

```text
Aplikasi/
├── backend/                  # REST API Laravel 11
│   ├── app/
│   │   ├── Http/Controllers/ # Controller Auth, Applicant, Admin, Head
│   │   ├── Models/           # Model Eloquent (User, Application, Division, dll)
│   │   └── Helpers/          # NotificationHelper & Utility
│   ├── database/             # Migrasi & Seeder Database
│   └── routes/               # API Routes (v1)
│
├── frontend/                 # Web Interface Next.js 14
│   ├── app/                  # App Router Pages & Layouts
│   │   ├── (auth)/           # Halaman Login & Registrasi
│   │   ├── (applicant)/      # Dashboard, Form Pengajuan, Status, Profil
│   │   ├── (admin)/          # Dashboard Admin, Verifikasi, Kuota
│   │   └── (head)/           # Dashboard Analitik & Ekspor Data
│   ├── components/           # Komponen UI Reusable (ThemeToggle, Slider, dll)
│   ├── lib/                  # Axios Client, Auth Helpers, Formatter
│   └── public/               # Asset Gambar (Logo SS, Banner Slider)
│
├── START_APLIKASI.bat        # Skrip otomatis peluncur aplikasi (Production Mode)
├── STOP_APLIKASI.bat         # Skrip penghenti seluruh proses background
└── README.md                 # Dokumentasi proyek
```

---

## 🎓 Informasi Akademik

Proyek ini dikembangkan dalam rangka pemenuhan luaran tugas mata kuliah **Analisis dan Perancangan Sistem (Software Architecture & Design)**.

* **Program Studi:** Sistem Informasi
* **Fakultas:** Sains dan Teknologi
* **Perguruan Tinggi:** UIN Sunan Ampel Surabaya
* **Objek Studi:** Suara Surabaya Media (Radio Suara Surabaya FM 100)
* **Tahun:** 2026

---
© 2026 Suara Surabaya Media • E-Internship Management System
