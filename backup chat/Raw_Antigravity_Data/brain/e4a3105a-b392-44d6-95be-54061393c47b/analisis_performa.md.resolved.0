# 🐢 Analisis Performa Aplikasi E-Internship Dishub

> Target SRS: response time < 3 detik. Aktual: ~10 detik. **Selisih: 7 detik lebih lambat.**

---

## 🔴 Penyebab Utama (Urutan Prioritas)

### 1. `QUEUE_CONNECTION=sync` — Penyebab #1 Kelambatan
**File:** `backend/.env` baris 38

```env
QUEUE_CONNECTION=sync
```

**Dampak kritis:** Fungsi `sendNotification()` dan `notifyStatusChange()` dipanggil **synchronous** di dalam setiap request API. Artinya:
- Saat register → kirim notifikasi → **tunggu selesai** → baru response dikembalikan
- Saat admin decide → kirim notifikasi → **tunggu selesai** → baru response
- Setiap operasi yang harusnya berjalan di background malah **memblokir HTTP response**

**Solusi:** Ganti ke driver `database` atau `redis`:
```env
QUEUE_CONNECTION=database
```
Lalu jalankan worker: `php artisan queue:work`

---

### 2. Next.js `reactStrictMode: true` — Double Render di Development
**File:** `frontend/next.config.js` baris 3

```js
reactStrictMode: true,
```

**Dampak:** Pada mode development, React Strict Mode **me-render setiap komponen DUA KALI** untuk mendeteksi side effects. Ini berarti setiap API call pun bisa dipanggil dua kali. Di production ini tidak terjadi, tapi di development `npm run dev` ini sangat terasa.

**Solusi sementara (dev only):**
```js
reactStrictMode: false, // hanya untuk debugging performa
```

---

### 3. Supabase Session Refresh di Setiap Request — Overhead Jaringan
**File:** `frontend/middleware.ts` baris 32

```ts
// Dipanggil di SETIAP request non-static
const supabaseResponse = updateSession(request);
```

**File:** `frontend/utils/supabase/middleware.ts`

`updateSession` membuat **koneksi ke Supabase** (server eksternal di luar negeri) setiap kali ada navigasi halaman. Ini terjadi meskipun aplikasi tidak menggunakan Supabase Auth (auth menggunakan Laravel Sanctum + cookies sendiri).

**Dampak:** Tambahan latency jaringan ke server Supabase (Singapore ~50-150ms) di **setiap navigasi halaman**.

**Solusi:** Karena auth sudah pakai Laravel Sanctum, hapus pemanggilan `updateSession` dari middleware:

```ts
// middleware.ts - SEBELUM
const supabaseResponse = updateSession(request);
// ... 
return supabaseResponse;

// SESUDAH - ganti dengan response biasa
return NextResponse.next();
```

---

### 4. `APP_DEBUG=true` & `LOG_LEVEL=debug` — Overhead Logging
**File:** `backend/.env`

```env
APP_DEBUG=true
LOG_LEVEL=debug
```

**Dampak:** Laravel mencatat **setiap query SQL, setiap request detail, dan stack trace** ke file log. Pada mode debug, ini menambah I/O disk overhead di setiap request.

**Solusi untuk pengujian:**
```env
APP_DEBUG=false
LOG_LEVEL=error
```

---

### 5. `CACHE_DRIVER=file` & `SESSION_DRIVER=file` — I/O File yang Lambat
**File:** `backend/.env`

```env
CACHE_DRIVER=file
SESSION_DRIVER=file
```

**Dampak:** Setiap request yang membutuhkan cache atau session harus **baca/tulis file dari disk**. Ini lebih lambat 10-100x dibanding in-memory cache.

**Solusi ideal:** Gunakan Redis atau Memcached. Untuk development tanpa Redis:
```env
CACHE_DRIVER=array
SESSION_DRIVER=cookie
```

---

### 6. N+1 Query Problem — `listApplications` Tanpa Index
**File:** `backend/app/Http/Controllers/Api/V1/AdminController.php` baris 26

```php
$query = Application::with(['user', 'division', 'documents', 'recommendedDivision']);
```

Eager loading 4 relasi sekaligus cukup baik (menghindari N+1), namun query `whereHas` di baris 38-50 menggunakan **subquery yang tidak ter-index**:

```php
$query->whereHas('user', function ($q) use ($request) {
    $q->where('applicant_type', $request->applicant_type);
});
```

Juga fungsi `listDivisions()` melakukan **dua query terpisah** (Division::all() + DB::table('applications')) lalu **menggabungkan di PHP**, bukan di SQL.

---

### 7. `php artisan serve` — Single-threaded PHP Dev Server
**Dampak:** `php artisan serve` menggunakan PHP built-in server yang **single-threaded** — hanya bisa melayani **1 request pada satu waktu**. Jika ada request yang lambat, semua request lain mengantri.

**Solusi:** Untuk production/testing, gunakan Nginx + PHP-FPM. Untuk development, ini adalah keterbatasan inherent.

---

## 📋 Ringkasan & Action Plan

| # | Masalah | Dampak | Effort | Solusi |
|---|---------|--------|--------|--------|
| 1 | `QUEUE_CONNECTION=sync` | 🔴 Sangat Besar | Rendah | Ganti ke `database` + jalankan worker |
| 2 | `reactStrictMode: true` | 🟠 Besar (dev) | Rendah | Set `false` sementara |
| 3 | Supabase updateSession di middleware | 🟠 Besar | Rendah | Hapus panggilan updateSession |
| 4 | `APP_DEBUG=true` + `LOG_LEVEL=debug` | 🟡 Sedang | Rendah | Set `false`/`error` |
| 5 | `CACHE_DRIVER=file` | 🟡 Sedang | Rendah | Ganti ke `array` atau `redis` |
| 6 | Subquery tanpa index + join di PHP | 🟡 Sedang | Sedang | Tambah DB index |
| 7 | `php artisan serve` single-thread | 🟡 Sedang | Tinggi | Inherent limitasi dev server |

**Estimasi penghematan waktu setelah perbaikan #1-#5:** 6-8 detik per request → bisa mencapai target < 3 detik.
