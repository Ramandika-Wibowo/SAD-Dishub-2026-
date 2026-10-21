# 📊 Konten PPT Seminar Hasil Magang MBKM (15 Slide)

**Judul:** Analisis dan Perancangan Ulang SOP Operasional Aplikasi SCATS Dinas Perhubungan Pemerintah Kota Surabaya Berbasis ISO 31000:2018

---

## SLIDE 1 — Cover

- **Judul:** Analisis dan Perancangan Ulang SOP Operasional Aplikasi SCATS Dinas Perhubungan Pemerintah Kota Surabaya Berbasis ISO 31000:2018
- Nama: Ramandika Arya Wibowo | NIM: 09020623045
- Program Studi Sistem Informasi, Fakultas Sains dan Teknologi, UIN Sunan Ampel Surabaya
- Dosen Pembimbing: Yunita Ardilla, S.Kom., M.MT.
- Pembimbing Lapangan: Raden Ajeng Mumtaz Sakinah, A.Md.

> 🖼️ **Gambar:** Logo UINSA + Logo Dishub Surabaya, background foto gedung SITS Bratang

---

## SLIDE 2 — Latar Belakang & Masalah Inti

**Konteks:**
- Kota Surabaya mengendalikan **137 persimpangan** secara otomatis via **SCATS**, didukung **953 CCTV** & **454 sensor TraffiCam**
- Dalam kondisi insidental → operator **wajib intervensi manual** terhadap SCATS

**Masalah pada SOP Eksisting:**
- Langkah Kerja No. 7: *"mengidentifikasi kendala dan melakukan optimalisasi pengaturan Traffic Light menggunakan SCATS"* → **terlalu makro, tanpa SLA**
- Operator mengandalkan **intuisi** → **human error** (lupa kembalikan mode manual ke otomatis) → **spillback**
- Ditemukan **symbolic error** pada flowchart SOP (simbol kotak untuk decision)

> 🖼️ **Gambar:** Screenshot antarmuka SCATS + kutipan Langkah 7 di-highlight merah

---

## SLIDE 3 — Rumusan Masalah & Tujuan

| No | Rumusan Masalah | Tujuan |
|----|----------------|--------|
| 1 | Bagaimana **tingkat kepatuhan** operator terhadap SOP eksisting? | Mengevaluasi via **gap analysis** |
| 2 | Apa saja **risiko operasional** intervensi manual SCATS? | Mengidentifikasi & menganalisis via **ISO 31000:2018** |
| 3 | Bagaimana **usulan perancangan ulang** SOP? | Menghasilkan SOP ber-SLA sesuai **Permenpan RB 35/2012 & BPMN** |

---

## SLIDE 4 — Justifikasi ISO 37301:2021 (Evaluasi Kepatuhan)

**"Mengapa ISO 37301:2021, bukan COBIT atau ITIL?"**

| Aspek | ISO 37301:2021 | COBIT / ITIL |
|-------|---------------|-------------|
| **Fokus** | Budaya kepatuhan & perilaku personel | Infrastruktur TI & tata kelola |
| **Tujuan** | Mengukur bagaimana instruksi **dipahami & dijalankan** di lapangan | Menilai kapabilitas proses TI |
| **Integrasi** | HLS **identik** dengan ISO 31000 → temuan langsung jadi input mitigasi | Tidak terintegrasi langsung |

**Cara Kerja (Klausul 9 — Evaluasi Kinerja):**
1. Identifikasi Kewajiban Kepatuhan → bedah SOP eksisting
2. Evaluasi Kinerja Aktual → kuesioner 10 operator
3. Pengukuran Kesenjangan → Expected vs Current State
4. Analisis Akar Masalah (Klausul 10) → input perancangan ulang

> 🖼️ **Gambar:** Diagram 4 langkah evaluasi kepatuhan (Gambar 3.4), tabel perbandingan 3 framework

---

## SLIDE 5 — Justifikasi ISO 31000:2018 & Fokus Klausul 6

**"Mengapa ISO 31000:2018, bukan COSO ERM atau NIST?"**

| Framework | Kelebihan | Keterbatasan untuk SITS |
|-----------|-----------|------------------------|
| COSO ERM | Kuat di audit keuangan | Terlalu condong sektor finansial |
| NIST CSF | Spesifik keamanan siber | Hanya fokus cybersecurity |
| **ISO 31000:2018** | **Generik, fleksibel, adaptif** | ✅ Cocok untuk pemerintahan |

**Mengapa Klausul 6 (Proses)?**
- Arsitektur ISO 31000 = Prinsip + Kerangka Kerja + **★ Proses (Klausul 6)**
- Prinsip & Framework bersifat manajerial tingkat tinggi
- **Klausul 6 bersifat aplikatif** → langsung diturunkan jadi instruksi kerja teknis SOP
- Klausul 6.5 (Risk Treatment) **selaras** dengan tujuan: menetapkan SLA mitigasi

> 🖼️ **Gambar:** Gambar 2.3 (Prinsip Manajemen Risiko) + diagram 3 pilar dengan highlight Klausul 6

---

## SLIDE 6 — Tahapan Klausul 6 & Metodologi

**Tahapan Proses Manajemen Risiko (Klausul 6):**

| Klausul | Tahapan | Implementasi di SITS |
|---------|---------|---------------------|
| 6.2 | Komunikasi & Konsultasi | Koordinasi operator ↔ CC 112, Satlantas |
| 6.3 | Ruang Lingkup & Kriteria | Penetapan area terimbas, batas wewenang |
| 6.4 | Penilaian Risiko (Identifikasi → Analisis → Evaluasi) | CCTV, evaluasi dampak spillback, keputusan intervensi |
| 6.5 | Perlakuan Risiko | Intervensi SCATS (Dwell, Lock CT, Plan Lock) |
| 6.6 | Pemantauan & Tinjauan | Monitoring pasca-intervensi via CCTV |
| 6.7 | Pencatatan & Pelaporan | Logbook intervensi & durasi insiden |

**Metode:** Observasi CC Room → Kuesioner 10 operator → Wawancara mentor → Studi dokumen SOP

> 🖼️ **Gambar:** Diagram alir circular Klausul 6 + Gambar 3.3 (Flowchart Penelitian MBKM)

---

## SLIDE 7 — Temuan Gap Analysis Kepatuhan

**Judul:** Temuan Analisis Kesenjangan (ISO 37301:2021) — Data 10 Operator

| Temuan | % |
|--------|---|
| SOP lama **tidak memiliki batas waktu** intervensi | **50%** |
| Operator **mengandalkan intuisi** saat menahan fase hijau | **90%** |
| Pernah **lupa mengembalikan** mode ke otomatis | **70%** |
| Dampak spillback / merah abadi dinilai **parah** (skor 4-5) | **100%** |
| Setuju SOP baru ber-SLA akan **mengurangi risiko** | **90%** |

**Temuan Sintaksis Visual:**
- Langkah 12 SOP lama menggunakan simbol **Kotak** untuk pertanyaan bersyarat → seharusnya **Belah Ketupat (Decision)** sesuai BPMN

> ⚠️ **Callout:** "90% operator terpaksa mengandalkan intuisi karena SOP tanpa SLA!"

> 🖼️ **Gambar:** Bar chart data persentase, screenshot flowchart lama vs perbaikan BPMN

---

## SLIDE 8 — Identifikasi & Penilaian Risiko

**Identifikasi Risiko (Klausul 6.4.2):**

| No | Aktivitas | Risiko | Penyebab |
|----|-----------|--------|----------|
| 1 | Lock Cycle Time | **Spillback** di simpang hulu | Kunci siklus terlalu lama |
| 2 | Dwell (Tahan Hijau) | **Merah Abadi** arah lawan | Lupa matikan Dwell |
| 3 | Peralihan Mode | **Data sensor error** | Sensor kotor / jaringan |

**Risk Register (Klausul 6.4.3 & 6.4.4):**

| No | Risiko | L | I | Skor | Level |
|----|--------|---|---|------|-------|
| 1 | Spillback | 4 | 4 | **16** | 🔴 **EKSTREM** → Wajib Mitigasi Segera |
| 2 | Merah Abadi | 3 | 3 | **9** | 🟠 **TINGGI** → Kontrol Manajemen |
| 3 | Sensor Error | 3 | 2 | **6** | 🟡 **SEDANG** → Pemantauan Berkala |

> 🖼️ **Gambar:** Matriks risiko 5×5 berwarna dengan posisi R1, R2, R3 ditandai

---

## SLIDE 9 — Inti Perancangan Ulang: Dekomposisi Langkah 7

**SOP LAMA (1 langkah makro):**
> "Mengidentifikasi kendala dan melakukan optimalisasi pengaturan menggunakan SCATS"

**⬇ SOP BARU (6 sub-langkah terukur ber-SLA):**

| Sub | Langkah | SLA | Klausul ISO 31000 |
|-----|---------|-----|-------------------|
| 7.1 | Cek Live Traffic Google Maps + CCTV | 2 menit | 6.4.2 (Identifikasi Risiko) |
| 7.2 | Identifikasi simpang & ruas terimbas | 2 menit | 6.4.3 (Analisis Risiko) |
| 7.3 | Koordinasi patroli (jika Major Alarm) | 1 menit | 6.2 (Komunikasi) |
| 7.4 | Analisis jenis hambatan | 1 menit | 6.4.4 (Evaluasi Risiko) |
| 7.5 | Koordinasi CC 112 & petugas lapangan | 2 menit | 6.2 (Komunikasi) |
| 7.6 | Intervensi SCATS (Lock CT / Dwell / Plan Lock) | **Maks. 3 Siklus** | 6.5 (Perlakuan Risiko) |

> 🖼️ **Gambar:** Infografis "before vs after" — 1 kotak besar merah (kiri) → 6 kotak hijau (kanan)

---

## SLIDE 10 — SOP Skenario 1: Hambatan Lalu Lintas

**Fokus mitigasi:** Mencegah spillback akibat durasi intervensi berlebihan

| No | Langkah | SLA | Klausul |
|----|---------|-----|---------|
| 1 | Cek Live Traffic + CCTV | 2 Mnt | 6.4.2 |
| 2 | Identifikasi simpang terimbas | 2 Mnt | 6.4.3 |
| 3 | Koordinasi patroli (Major Alarm) | 1 Mnt | 6.2 |
| 4 | Analisis jenis hambatan samping | 1 Mnt | 6.4.4 |
| 5 | Koordinasi CC 112 | 2 Mnt | 6.2 |
| 6 | Intervensi SCATS | Maks. 3 Siklus | 6.5 |
| 7 | Pastikan lalin normal via CCTV | 2 Mnt | 6.6 |

> 🖼️ **Gambar:** Gambar 4.1 (Flowchart SOP Hambatan Lalu Lintas)

---

## SLIDE 11 — SOP Skenario 2: Cuaca Buruk

**Fokus mitigasi:** Percepatan koordinasi saat jarak pandang CCTV menurun + genangan

| No | Langkah | SLA | Klausul |
|----|---------|-----|---------|
| 1 | Pantau sebaran hujan & genangan via CCTV | 5 Mnt | 6.4.2 |
| 2 | Laporkan imbas ke CC 112 | Kondisional | 6.2 |
| 3 | Teruskan ke patroli lapangan | 3 Mnt | 6.2 |
| 4 | Optimalisasi SCATS | Maks. 3 Siklus | 6.5 |
| 5 | Informasikan ke masyarakat via medsos | 2 Mnt | 6.2 |
| 6 | Monitoring sampai normal | Kondisional | 6.6 |

> 🖼️ **Gambar:** Gambar 4.2 (Flowchart SOP Cuaca Buruk)

---

## SLIDE 12 — SOP Skenario 3 & 4: Unjuk Rasa & Pengawalan

**Skenario 3 — Unjuk Rasa / Pawai Massa**
Fokus: Mencegah gridlock pada rute pengalihan

| Langkah Kunci | SLA |
|--------------|-----|
| Kumpulkan info (tujuan, jumlah massa, rute) | 10 Mnt |
| Pantau pergerakan massa via CCTV → lapor CC 112 | Kondisional |
| Optimalisasi SCATS jalur buangan | Maks. 3 Siklus |

**Skenario 4 — Pengawalan VVIP / Damkar / Ambulans**
Fokus: Presisi Green Wave tanpa mengorbankan jalur lawan

| Langkah Kunci | SLA |
|--------------|-----|
| Komunikasi Kenari (tujuan & rute) | 2 Mnt |
| Pengawalan Dwell (tambah durasi hijau) | 3 Mnt |
| Normalkan kembali ke mode otomatis | 1 Mnt/Simpang |

> 🖼️ **Gambar:** Gambar 4.3 (Flowchart Unjuk Rasa) + Gambar 4.4 (Flowchart Pengawalan)

---

## SLIDE 13 — Implikasi Manajerial

**3 Rekomendasi Implementasi:**

| No | Rekomendasi | Detail |
|----|------------|--------|
| 1 | **Sosialisasi & Simulasi** (Tabletop Exercise) | Bangun budaya *risk-aware*, drill batas maks. 3 siklus |
| 2 | **Visualisasi Ruang Kendali** | Cetak & tempel flowchart BPMN di CC Room sebagai *visual cue* |
| 3 | **Pembaruan Format Logbook** | Tambah kolom durasi intervensi manual → implementasi Klausul 6.7 |

> 🖼️ **Gambar:** Mockup flowchart ditempel di dinding CC Room

---

## SLIDE 14 — Kesimpulan & Saran

**Kesimpulan:**

| RQ | Hasil |
|----|-------|
| **RQ1** | Compliance gap signifikan — 90% intuisi, 70% lupa mode, 100% dampak parah + symbolic error flowchart |
| **RQ2** | 3 risiko: 1 Ekstrem (Spillback=16), 1 Tinggi (Merah Abadi=9), 1 Sedang (Sensor=6) |
| **RQ3** | 4 SOP baru — dekomposisi Langkah 7 → 6 sub-langkah ber-SLA (maks. 3 siklus) |

**Saran:**
- **SITS:** Sosialisasikan draf SOP & tinjau ulang SLA **minimal 1 tahun sekali**
- **Peneliti selanjutnya:** Perluas ke risiko hardware & cybersecurity; gunakan simulasi VISSIM

---

## SLIDE 15 — Terima Kasih

- **"Terima Kasih"**
- Sesi Diskusi & Tanya Jawab
- Ramandika Arya Wibowo | 09020623045

> 🖼️ **Gambar:** Foto bersama tim SITS, background SITS Bratang

---

## 📸 RINGKASAN SARAN GAMBAR

| Slide | Gambar |
|-------|--------|
| 1 | Logo UINSA + Dishub, foto SITS |
| 2 | Screenshot SCATS, kutipan Langkah 7 |
| 4 | Diagram 4 langkah evaluasi, perbandingan framework |
| 5 | Gambar 2.3 (Prinsip ISO 31000), diagram 3 pilar |
| 6 | Diagram circular Klausul 6, Flowchart Penelitian |
| 7 | Bar chart data kepatuhan, flowchart lama vs baru |
| 8 | Matriks risiko 5×5 berwarna |
| 9 | Infografis before vs after Langkah 7 |
| 10 | Gambar 4.1 (Flowchart SOP Hambatan) |
| 11 | Gambar 4.2 (Flowchart SOP Cuaca Buruk) |
| 12 | Gambar 4.3 + 4.4 (Flowchart Unjuk Rasa & Pengawalan) |
| 15 | Foto bersama tim SITS |
