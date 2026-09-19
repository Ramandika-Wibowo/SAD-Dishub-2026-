# Panduan Penggunaan & Optimasi Performa E-Internship Suara Surabaya Media

Dokumen ini menjelaskan cara menjalankan sistem secara instan dan bebas lag (*zero slow-loading*), serta tips menjaga performa aplikasi pada laptop dengan spesifikasi prosesor dual-core (Intel Core i7-7600U).

---

## 1. Mengapa Sebelumnya Terasa Lambat (*Lagging*)?

Sebelumnya, sistem dijalankan menggunakan perintah:
```bash
npm run dev
```
Perintah ini mengaktifkan **Mode Development Next.js**, di mana:
* Setiap rute dan halaman dikompilasi secara *on-the-fly* (saat pertama kali dibuka oleh pengguna).
* Pada prosesor 2-core 15 Watt (i7-7600U), proses kompilasi 750+ modul membutuhkan **20 hingga 25 detik per halaman** (tercatat di log: `GET /login 200 in 24822ms`).
* Ditambah lagi, Windows Defender secara real-time memindai ribuan file di `node_modules` setiap kali kompilasi berlangsung.

---

## 2. Solusi: Mode Production (Super Cepat & Ringan)

Dalam **Mode Production (`npm run build` lalu `npm run start`)**:
* Seluruh 750+ modul halaman, styling Tailwind, dan komponen React **sudah dikompilasi sebelumnya** menjadi berkas HTML statis dan JavaScript bundle yang sangat ringkas.
* Saat Anda membuka atau berpindah halaman di browser, server hanya menyajikan file yang sudah jadi tanpa perlu memproses ulang di CPU.
* Waktu respons halaman turun drastis dari **~24 detik menjadi di bawah 100 milidetik (instan)**.

---

## 3. Cara Menjalankan Sistem (1-Click Launcher)

Kami telah membuatkan skrip otomatis di folder proyek:

### 🟢 Menjalankan Aplikasi
Cukup **klik dua kali (double-click)** pada file:
👉 **`START_APLIKASI.bat`**

Skrip ini akan secara otomatis:
1. Memastikan layanan PostgreSQL lokal aktif.
2. Menjalankan backend Laravel API (`http://127.0.0.1:8000`) dan queue worker.
3. Menjalankan frontend Next.js dalam mode **Production** (`http://localhost:3000`).
4. Membuka browser Anda secara otomatis ke halaman login.

### 🔴 Mematikan Aplikasi
Cukup tekan sembarang tombol pada jendela hitam `START_APLIKASI.bat`, atau **double-click** file:
👉 **`STOP_APLIKASI.bat`**

---

## 4. Tips Tambahan: Mengecualikan Folder dari Windows Defender

Agar prosesor laptop tidak terbebani oleh pemindaian antivirus (*Antimalware Service Executable*), kecualikan folder proyek:

1. Buka **Windows Security** (Start Menu $\rightarrow$ ketik `Windows Security`).
2. Klik **Virus & threat protection**.
3. Di bagian *Virus & threat protection settings*, klik **Manage settings**.
4. Gulir ke bawah ke bagian **Exclusions** $\rightarrow$ klik **Add or remove exclusions**.
5. Klik **Add an exclusion** $\rightarrow$ pilih **Folder**.
6. Pilih folder:
   `D:\UINSA\SAD\Aplikasi`

---

## 5. Kredensial Akun Pengujian

* **Admin Suara Surabaya:** `admin@suarasurabaya.net` (atau `admin@dishub-surabaya.go.id`) / `password123`
* **Pimpinan Redaksi:** `pimpinan@suarasurabaya.net` (atau `pimpinan@dishub-surabaya.go.id`) / `password123`
* **Pelamar:** `ahmad.fauzi@student.ac.id` / `password123`
