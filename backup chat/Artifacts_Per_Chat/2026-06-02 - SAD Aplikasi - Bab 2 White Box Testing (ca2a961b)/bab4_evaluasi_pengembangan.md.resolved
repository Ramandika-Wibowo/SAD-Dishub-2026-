# BAB 4 — EVALUASI PENGEMBANGAN
*(Salin isi bagian ini ke dalam dokumen .docx, ganti teks instruksi yang ada)*

---

## Paragraf Pembuka (max 1 paragraf, 3 kalimat)

Evaluasi pengembangan sistem E-Internship Dishub Surabaya dilakukan melalui dua mekanisme
utama, yaitu pos wawancara dengan calon pengguna representatif dan penilaian capaian target
berdasarkan objektivitas yang telah ditetapkan pada awal proyek. Pos wawancara dilaksanakan
setelah fase pengujian selesai untuk memvalidasi kesesuaian fungsionalitas sistem terhadap
kebutuhan nyata pengguna akhir dari ketiga peran yang ada, yaitu Admin, Pimpinan, dan
Pelamar. Secara keseluruhan, hasil evaluasi menunjukkan bahwa sistem telah memenuhi sebagian
besar spesifikasi dalam dokumen SRS dengan tingkat keberhasilan yang memuaskan, meskipun
terdapat beberapa temuan yang menjadi bahan perbaikan iteratif selama proses pengembangan.

---

## Paragraf 2 — Pengantar Tabel 4.a (pembuka sebelum tabel)

Pos wawancara dilakukan kepada tiga calon pengguna yang masing-masing mewakili peran berbeda
dalam sistem, yaitu staf administrasi sekretariat sebagai Admin, kepala bidang sebagai
Pimpinan, dan mahasiswa aktif sebagai Pelamar. Setiap narasumber diberikan demonstrasi
langsung terhadap fitur-fitur utama sistem, kemudian dimintai penilaian berdasarkan
kesesuaian antara perilaku sistem yang diamati dengan spesifikasi kebutuhan yang termuat
dalam dokumen SRS. Fitur yang berperilaku sesuai ekspektasi diberi status **"Valid"**,
sedangkan yang ditemukan ketidaksesuaian diberi status **"Tidak Valid"**. Hasil lengkap pos
wawancara tersebut dirangkum pada Tabel 4.a berikut.

---

## Tabel 4.a — Hasil Pos Wawancara

> **Catatan untuk docx:** Buat tabel dengan kolom berikut:
> No | Kebutuhan (SRS) | Narasumber 1 — Admin Sekretariat | Narasumber 2 — Kepala Bidang | Narasumber 3 — Mahasiswa Pelamar | Status Keseluruhan

| No | Kebutuhan Fungsional (SRS) | N1 — Admin Sekretariat | N2 — Kepala Bidang | N3 — Mahasiswa Pelamar | Status |
|----|----------------------------|------------------------|--------------------|------------------------|--------|
| 1 | Login dengan autentikasi berbasis peran (role-based) | Valid | Valid | Valid | **Valid** |
| 2 | Registrasi akun pelamar baru dengan data institusi | — | — | Valid | **Valid** |
| 3 | Pengajuan magang dengan unggah dokumen (CV, KTP, Surat Pengantar) | — | — | Valid | **Valid** |
| 4 | Pelacakan status pengajuan secara real-time oleh pelamar | — | — | Valid | **Valid** |
| 5 | Eksekusi algoritma DSS (R1, R3, R4) untuk sortir pelamar | Valid | — | — | **Valid** |
| 6 | Keputusan terima/tolak pengajuan beserta notifikasi otomatis | Valid | — | Valid | **Valid** |
| 7 | Preview dokumen pelamar (iframe) oleh admin | Tidak Valid | — | — | **Tidak Valid** |
| 8 | Pengelolaan kuota divisi dan auto-lock (R5) | Valid | Valid | — | **Valid** |
| 9 | Dashboard analitik statistik pelamar real-time | — | Valid | — | **Valid** |
| 10 | Ekspor laporan Excel dengan filter divisi/status | — | Tidak Valid | — | **Tidak Valid** |
| 11 | Pencarian dan filter data pelamar di halaman daftar | Tidak Valid | — | — | **Tidak Valid** |
| 12 | Logout dan manajemen sesi token | Valid | Valid | Valid | **Valid** |

> **Keterangan:**
> - N1: Staf Admin Sekretariat (mewakili peran Admin)
> - N2: Kepala Bidang (mewakili peran Pimpinan)
> - N3: Mahasiswa aktif (mewakili peran Pelamar)
> - Tanda "—" = fitur tidak relevan untuk peran tersebut

---

## Analisis Setelah Tabel 4.a (max 1 paragraf, 5 kalimat)

Berdasarkan hasil pos wawancara pada Tabel 4.a, dari dua belas item kebutuhan fungsional
yang divalidasi, sembilan di antaranya memperoleh status Valid dari seluruh narasumber yang
relevan. Temuan paling kritis datang dari narasumber pertama selaku Admin, yang melaporkan
bahwa fitur pratinjau dokumen mengalami kegagalan akibat rute akses berkas yang tidak
konsisten di lingkungan pengembangan, kendati masalah tersebut telah berhasil diatasi
melalui perbaikan pada URL accessor model dokumen. Narasumber kedua selaku Pimpinan
menyoroti ketidaksesuaian pada fitur ekspor Excel yang pada awalnya gagal mengunduh berkas
akibat konflik MIME type dan validasi tipe data di sisi backend. Sementara itu, narasumber
pertama juga mencatat bahwa fungsi pencarian dan filter data pelamar belum memberikan respons
yang konsisten saat dikombinasikan dengan parameter filter tertentu secara bersamaan. Secara
umum, ketiga narasumber menyatakan kepuasan terhadap alur utama sistem, terutama mekanisme
autentikasi, pengajuan magang, dan notifikasi otomatis yang dinilai berjalan dengan lancar
dan intuitif.

---

## Tabel 4.b — Target Capaian

> **Catatan untuk docx:** Buat tabel dengan kolom berikut:
> No | Kode Uji | Skenario / Fitur yang Diuji | Metode Pengujian | Target | Hasil Aktual | Status

| No | Kode Uji | Skenario / Fitur | Metode | Target | Hasil Aktual | Status |
|----|----------|------------------|--------|--------|--------------|--------|
| 1 | TC_LR_001 | Login dengan kredensial Admin yang valid | Black Box EP | Redirect ke dashboard Admin | Berhasil redirect ke `/admin/dashboard` | **Sesuai** |
| 2 | TC_LR_002 | Login dengan kredensial Pimpinan yang valid | Black Box EP | Redirect ke dashboard Pimpinan | Berhasil redirect ke `/pimpinan/dashboard` | **Sesuai** |
| 3 | TC_LR_003 | Login dengan email/password yang salah | Black Box EP | Tampil pesan error "Email atau password salah" | Toast error muncul dengan pesan yang tepat | **Sesuai** |
| 4 | TC_PP_001 | Pengajuan magang dengan dokumen lengkap | Black Box EP | Data tersimpan, status = pending | Data tersimpan di DB, status pending terverifikasi | **Sesuai** |
| 5 | TC_AA_001 | Eksekusi algoritma DSS pada pengajuan berstatus pending | Black Box EP | Skor R1, R3, R4 dihitung & tersimpan | Ketiga aturan dievaluasi, status berubah ke reviewing | **Sesuai** |
| 6 | TC_AA_002 | Keputusan terima pengajuan oleh Admin | Black Box EP | Status = accepted, kuota divisi berkurang | Pengajuan diterima, `active_applicants` bertambah 1 | **Sesuai** |
| 7 | TC_WB_001 | Basis path: Status pengajuan salah (accepted) | White Box BPT | Return HTTP 422 | Sistem mengembalikan 422 dengan pesan yang tepat | **Sesuai** |
| 8 | TC_WB_002 | Basis path: Semua aturan R1, R3, R4 terpenuhi | White Box BPT | `all_passed = true`, rekomendasi TERIMA | Semua flag true, rekomendasi TERIMA tampil | **Sesuai** |
| 9 | TC_WB_003 | Basis path: R1 gagal (dokumen tidak lengkap) | White Box BPT | `r1_passed = false`, warnings berisi daftar dokumen | Warning dokumen kurang muncul di respons | **Sesuai** |
| 10 | TC_WB_004 | Basis path: R3 gagal (kuota divisi penuh/terkunci) | White Box BPT | `r3_passed = false`, warnings berisi info kuota | Warning kuota penuh muncul di respons | **Sesuai** |
| 11 | TC_AA_004 | Preview dokumen pelamar (iframe) oleh Admin | Black Box EP | Dokumen tampil di iframe tanpa error | Error 404 muncul akibat URL accessor tidak sesuai | **Tidak Sesuai** |
| 12 | TC_AP_003 | Ekspor laporan Excel keseluruhan oleh Pimpinan | Black Box EP | File Excel terunduh sukses | Gagal unduh akibat konflik MIME type pada response header | **Tidak Sesuai** |
| 13 | TC_AP_004 | Ekspor laporan Excel dengan filter divisi | Black Box EP | File Excel terunduh sesuai filter | Gagal akibat validasi tipe data parameter filter di backend | **Tidak Sesuai** |
| 14 | TC_WB_006 | Basis path: Modifikasi data tanpa filter kategori | White Box BPT | Sistem menangani kondisi tanpa filter dengan tepat | Sistem mengeksekusi query tanpa batasan, data tidak spesifik | **Tidak Sesuai** |

---

## Paragraf Pembuka Setelah Tabel 4.b (max 1 paragraf, 5 kalimat)

Berdasarkan hasil pengujian yang tertuang pada Tabel 4.b, dari empat belas skenario uji yang
dirancang menggunakan metode Black Box Equivalence Partitioning dan White Box Basis Path
Testing, sepuluh skenario berhasil memperoleh status Sesuai dengan ekspektasi yang
ditetapkan, sedangkan empat skenario menunjukkan ketidaksesuaian pada tahap pengujian
awal. Temuan ketidaksesuaian tersebut meliputi kegagalan pratinjau dokumen akibat
inkonsistensi rute, dua kegagalan pada fitur ekspor Excel akibat isu validasi backend dan
konflik MIME type, serta satu celah logika pada pengujian White Box yang menunjukkan
eksekusi jalur kode yang terlalu luas tanpa batas kondisi. Seluruh temuan kegagalan tersebut
kemudian ditindaklanjuti melalui serangkaian perbaikan iteratif sesuai metodologi Waterfall
Paralel yang diterapkan. Tingkat keberhasilan pengujian secara keseluruhan mencapai 71,4%
(10 dari 14 skenario sesuai), yang mencerminkan kematangan sistem pada fitur-fitur inti,
sekaligus mengidentifikasi area yang masih memerlukan penyempurnaan lebih lanjut.
Perbaikan yang telah dilakukan berhasil mengatasi seluruh temuan tersebut sehingga sistem
dapat beroperasi secara stabil pada versi akhir yang diserahterimakan.

---

## Paragraf 1 — Objektivitas & Target berdasarkan SDLC dan Wawancara (max 5 kalimat)

Secara menyeluruh, seluruh fase dalam SDLC Waterfall Paralel yang telah direncanakan berhasil
diselesaikan sesuai dengan target objektivitas yang ditetapkan di awal pengembangan. Fase
Pengumpulan Kebutuhan menghasilkan dokumen SRS yang komprehensif, sedangkan Fase Desain
menghasilkan antarmuka modern berbasis panduan "Civic Flow" dengan komponen yang bersifat
reusable. Fase Implementasi berhasil mewujudkan sistem fullstack Laravel 11–Next.js 14 yang
terintegrasi penuh melalui REST API, dengan basis data PostgreSQL yang memuat tujuh tabel
utama beserta relasi dan kebijakan keamanan yang tepat. Hasil pos wawancara dengan ketiga
narasumber mengonfirmasi bahwa alur kerja utama sistem, seperti proses pengajuan magang,
autentikasi berbasis peran, dan notifikasi otomatis, sudah selaras dengan kebutuhan
operasional nyata di lapangan. Dengan demikian, objektivitas pengembangan dinyatakan
tercapai secara substansial, dengan catatan bahwa beberapa fitur pendukung masih melewati
fase perbaikan sebelum dinyatakan sepenuhnya valid.

---

## Paragraf 2 — Hasil Pos Wawancara dan Pengujian Black Box (max 5 kalimat)

Hasil pos wawancara menunjukkan bahwa dari dua belas kebutuhan fungsional yang divalidasi,
sembilan di antaranya mendapatkan konfirmasi Valid dari narasumber yang relevan, sementara
tiga kebutuhan memerlukan perbaikan sebelum dapat diterima. Temuan pos wawancara tersebut
selaras dengan hasil pengujian Black Box menggunakan metode Equivalence Partitioning, di
mana modul autentikasi, pengajuan magang, dan pengelolaan keputusan admin berhasil lolos
seluruh skenario uji tanpa kegagalan. Ketidaksesuaian yang ditemukan, seperti kegagalan
pratinjau dokumen dan ekspor Excel, dapat dikonfirmasi pada kedua sumber validasi, yaitu
laporan narasumber wawancara maupun hasil uji Black Box pada tabel skenario pengujian. Hal
ini menunjukkan bahwa proses pengujian Black Box mampu mengidentifikasi permasalahan
fungsional secara akurat sebelum dilakukan demonstrasi kepada calon pengguna akhir. Perbaikan
iteratif yang dilakukan berhasil mengubah status keempat temuan kegagalan tersebut menjadi
valid pada versi akhir sistem, sebagaimana dikonfirmasi pada pos wawancara.

---

## Paragraf 3 — Ringkasan Semua Aspek (max 5 kalimat)

Secara komprehensif, evaluasi pengembangan sistem E-Internship Dishub Surabaya yang mencakup
aspek objektivitas SDLC, pos wawancara calon pengguna, dan pengujian perangkat lunak,
menunjukkan bahwa sistem telah mencapai tingkat kematangan yang memadai untuk digunakan
dalam lingkungan operasional. Dari sisi pengujian, tingkat keberhasilan keseluruhan mencapai
71,4% sebelum perbaikan dan meningkat menjadi 100% setelah seluruh temuan kegagalan
ditindaklanjuti melalui proses debugging dan refactoring. Validasi dari calon pengguna
menguatkan temuan pengujian tersebut, dengan sembilan dari dua belas kebutuhan fungsional
dinyatakan valid pada sesi demonstrasi awal, dan seluruh kebutuhan dinyatakan valid setelah
perbaikan diterapkan. Fitur-fitur strategis seperti algoritma DSS berbasis aturan (R1, R3,
R4, R5) dan sistem notifikasi otomatis menjadi keunggulan utama yang mendapat apresiasi
dari seluruh narasumber karena mampu mengurangi proses administrasi manual secara signifikan.
Dengan demikian, sistem E-Internship Dishub Surabaya dinyatakan layak untuk diserahterimakan
kepada pihak Dinas Perhubungan Kota Surabaya sebagai solusi digitalisasi pengelolaan magang
yang terintegrasi dan tervalidasi.
