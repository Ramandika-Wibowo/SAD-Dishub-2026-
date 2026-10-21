# Metode Pengujian Sistem E-Internship Dishub

## Gambaran Umum

Proyek ini menggunakan **dua pendekatan pengujian** yang saling melengkapi:

| Aspek | Black Box (EP) | White Box (BPT) |
|---|---|---|
| **Fokus** | Perilaku dari luar (input/output) | Struktur kode dari dalam |
| **Penguji perlu lihat kode?** | Tidak | Ya |
| **Target** | Validasi fungsional | Cakupan logika & alur |
| **Contoh di proyek** | Form Login, Form Registrasi | `executeSort()`, `validate()` |

---

## 1. Black Box — Equivalence Partitioning (EP)

### Definisi
Teknik pengujian di mana **input dibagi menjadi kelas-kelas ekuivalen**. Nilai yang berada dalam satu kelas dianggap menghasilkan perilaku yang sama, sehingga cukup satu nilai representatif yang diuji per kelas.

### Cara Kerja
```
Input Range → Partisi Valid + Partisi Invalid → Test Case per Partisi
```

### Penerapan di Proyek: Fungsi `validate()` Login

**Kode yang diuji** (`app/(auth)/login/page.tsx`):
```typescript
const validate = () => {
  const e: Record<string, string> = {};
  if (!form.email.trim()) e.email = "Email wajib diisi.";
  else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid.";
  if (!form.password) e.password = "Password wajib diisi.";
  setErrors(e);
  return Object.keys(e).length === 0;
};
```

#### Partisi untuk field `Email`:

| Kelas | Partisi | Contoh Nilai | Ekspektasi |
|---|---|---|---|
| **Valid** | Email format benar | `budi@gmail.com` | Lolos validasi |
| **Invalid 1** | Email kosong | `""` | Error: "Email wajib diisi." |
| **Invalid 2** | Format salah (tanpa @) | `budigmail.com` | Error: "Format email tidak valid." |
| **Invalid 3** | Format salah (tanpa domain) | `budi@gmail` | Error: "Format email tidak valid." |
| **Invalid 4** | Hanya spasi | `"   "` | Error: "Email wajib diisi." (karena `.trim()`) |

#### Partisi untuk field `Kata Sandi`:

| Kelas | Partisi | Contoh Nilai | Ekspektasi |
|---|---|---|---|
| **Valid** | Password terisi | `rahasia123` | Lolos validasi |
| **Invalid** | Password kosong | `""` | Error: "Password wajib diisi." |

#### Test Case Lengkap:

| TC# | Email Input | Password Input | Hasil Ekspektasi |
|---|---|---|---|
| TC-01 | `budi@dishub.go.id` | `Rahasia@123` | ✅ Login berhasil, redirect ke dashboard |
| TC-02 | *(kosong)* | `Rahasia@123` | ❌ "Email wajib diisi." |
| TC-03 | `budigmail.com` | `Rahasia@123` | ❌ "Format email tidak valid." |
| TC-04 | `budi@gmail` | `Rahasia@123` | ❌ "Format email tidak valid." |
| TC-05 | `   ` (spasi) | `Rahasia@123` | ❌ "Email wajib diisi." |
| TC-06 | `budi@dishub.go.id` | *(kosong)* | ❌ "Password wajib diisi." |
| TC-07 | `tidakada@email.com` | `salahpassword` | ❌ Toast: "Email atau password salah." |

> **Prinsip EP:** TC-03 dan TC-04 mewakili satu kelas yang sama (format invalid). Kita tidak perlu menguji semua variasi format salah, cukup satu representatif.

---

### Penerapan di Proyek: Registrasi Pemohon

**Partisi untuk field `NIM/NIP`:**

| Kelas | Partisi | Contoh | Ekspektasi |
|---|---|---|---|
| Valid | Numerik, panjang wajar | `220602110001` | Diterima |
| Invalid 1 | Kosong | `""` | Ditolak |
| Invalid 2 | Mengandung huruf | `22ABC110001` | Ditolak |

---

## 2. White Box — Basis Path Testing (BPT)

### Definisi
Teknik pengujian yang **memetakan semua jalur logika independen** dalam sebuah fungsi menggunakan **Control Flow Graph (CFG)**. Setiap jalur unik harus diuji minimal sekali.

### Cara Kerja
1. Gambar **Control Flow Graph** dari kode
2. Hitung **Cyclomatic Complexity (CC)** = E - N + 2P
3. Identifikasi jalur independen sebanyak nilai CC
4. Buat test case untuk setiap jalur

> **Rumus:** `V(G) = Jumlah Decision Node + 1`

---

### Penerapan di Proyek: Fungsi `executeSort()` Admin DSS

**Kode yang diuji** (`AdminController.php`, baris 116–209):

```php
public function executeSort(int $id): JsonResponse
{
    $application = Application::with([...])->findOrFail($id);

    // Node 1: Status check
    if (!in_array($application->status, ['pending', 'reviewing'])) {  // D1
        return response()->json([...], 422);  // Path A (early return)
    }

    // Node 2: R1 - Document check
    $r1Passed = empty($missingTypes);  // D2
    if (!$r1Passed) {
        $warnings[] = 'R1 - Dokumen belum lengkap...';
    }

    // Node 3: R3 - Quota check
    $r3Passed = !$division->is_locked && $division->active_applicants < $division->max_quota;  // D3
    if (!$r3Passed) {
        $warnings[] = 'R3 - Kuota divisi sudah penuh...';
    }

    // Node 4: R4 - Keyword score check
    $r4Passed = $score >= $threshold;  // D4
    if (!$r4Passed) {
        $warnings[] = "R4 - Skor di bawah ambang batas";
    }

    // Node 5: Final result
    $allPassed = $r1Passed && $r3Passed && $r4Passed;
    $application->update([...]);
    notifyStatusChange(...);

    return response()->json([...]);
}
```

#### Control Flow Graph:

```
[START]
   │
   ▼
[D1: status == pending/reviewing?]
   │ TIDAK ──────────────────────────► [RETURN 422] ← Path A
   │ YA
   ▼
[D2: R1 - dokumen lengkap?]
   │ TIDAK → [warnings[] += "R1 gagal"]
   │ YA  ↘
   └────────► [D3: R3 - kuota tersedia?]
                │ TIDAK → [warnings[] += "R3 gagal"]
                │ YA  ↘
                └────────► [D4: R4 - skor >= threshold?]
                             │ TIDAK → [warnings[] += "R4 gagal"]
                             │ YA  ↘
                             └────────► [allPassed = R1∧R3∧R4]
                                          │
                                          ▼
                                      [RETURN JSON] ← Path B/C/D/E
```

#### Cyclomatic Complexity:
- **Decision nodes (D):** D1, D2, D3, D4 = **4 keputusan**
- **V(G) = 4 + 1 = 5** → Minimal **5 jalur independen** harus diuji

#### 5 Jalur Independen:

| Path | D1 | D2 (R1) | D3 (R3) | D4 (R4) | allPassed | Skenario |
|---|---|---|---|---|---|---|
| **A** | ❌ Status salah | - | - | - | - | Application status = `accepted` → return 422 |
| **B** | ✅ | ✅ | ✅ | ✅ | ✅ | Semua rule lolos → rekomendasi TERIMA |
| **C** | ✅ | ❌ | ✅ | ✅ | ❌ | R1 gagal (dokumen tidak lengkap) |
| **D** | ✅ | ✅ | ❌ | ✅ | ❌ | R3 gagal (kuota penuh/terkunci) |
| **E** | ✅ | ✅ | ✅ | ❌ | ❌ | R4 gagal (skor keyword < threshold) |

#### Test Case Basis Path:

| TC# | Path | Setup Kondisi | Ekspektasi Output |
|---|---|---|---|
| **TC-BP1** | A | Status = `accepted` | HTTP 422, pesan "hanya pending/reviewing" |
| **TC-BP2** | B | Status=`pending`, CV+SuratPengantar+KTP ada, kuota tersedia, skor=80 | `all_passed: true`, rekomendasi TERIMA |
| **TC-BP3** | C | Status=`pending`, hanya CV diupload (tidak ada KTP & surat), kuota oke, skor=80 | `r1_passed: false`, warnings berisi daftar dokumen kurang |
| **TC-BP4** | D | Status=`pending`, dokumen lengkap, `is_locked=true` (atau kuota penuh), skor=80 | `r3_passed: false`, warnings berisi "kuota penuh" |
| **TC-BP5** | E | Status=`pending`, dokumen lengkap, kuota oke, skor=20 (di bawah threshold 60) | `r4_passed: false`, warnings berisi skor di bawah ambang |

---

## Perbandingan & Relevansi Proyek

```
┌────────────────────────────────────────────────────────────────┐
│                   STRATEGI TESTING DISHUB                      │
├────────────────────┬───────────────────────────────────────────┤
│ FITUR              │ METODE YANG COCOK                         │
├────────────────────┼───────────────────────────────────────────┤
│ Form Login         │ Black Box EP (validasi input user)         │
│ Form Registrasi    │ Black Box EP (validasi data pemohon)       │
│ Upload Dokumen     │ Black Box EP (tipe file, ukuran)           │
│ DSS executeSort()  │ White Box BPT (logika R1, R3, R4)         │
│ decideApplication()│ White Box BPT (Accept/Reject branch)      │
│ evaluateR5()       │ White Box BPT (auto-lock quota)           │
└────────────────────┴───────────────────────────────────────────┘
```

### Mengapa dua metode ini?

- **EP (Black Box):** Memastikan sistem menangani **semua variasi input pengguna** dengan benar — penting untuk portal publik yang diakses mahasiswa.
- **BPT (White Box):** Memastikan **semua jalur logika algoritma DSS** sudah diuji — kritis karena kesalahan di sini mempengaruhi keputusan penerimaan magang.

> [!NOTE]
> Cyclomatic Complexity `executeSort()` = **5** menunjukkan fungsi ini cukup kompleks. Angka di atas 10 biasanya menandakan fungsi perlu dipecah menjadi bagian-bagian lebih kecil.
