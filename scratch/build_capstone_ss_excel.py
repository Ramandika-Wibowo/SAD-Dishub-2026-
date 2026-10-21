import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_capstone_ss_excel():
    wb = openpyxl.Workbook()
    wb.remove(wb.active)  # remove default sheet
    
    # -------------------------------------------------------------
    # STYLES DEFINITION
    # -------------------------------------------------------------
    FONT_TITLE = Font(name="Calibri", size=14, bold=True, color="1D4ED8")
    FONT_SUBTITLE = Font(name="Calibri", size=10, italic=True, color="64748B")
    FONT_SECTION = Font(name="Calibri", size=11, bold=True, color="1D4ED8")
    FONT_HEADER = Font(name="Calibri", size=9, bold=True, color="FFFFFF")
    FONT_BOLD = Font(name="Calibri", size=9, bold=True, color="1E293B")
    FONT_REGULAR = Font(name="Calibri", size=9, color="1E293B")
    FONT_MUTED = Font(name="Calibri", size=8.5, color="64748B")
    FONT_TOTAL = Font(name="Calibri", size=10, bold=True, color="1D4ED8")
    FONT_ALERT = Font(name="Calibri", size=9, bold=True, color="B91C1C")
    
    FILL_HEADER = PatternFill(start_color="1D4ED8", end_color="1D4ED8", fill_type="solid")
    FILL_ZEBRA = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    FILL_WHITE = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")
    FILL_TOTAL = PatternFill(start_color="EFF6FF", end_color="EFF6FF", fill_type="solid")
    FILL_HIGHLIGHT = PatternFill(start_color="DBEAFE", end_color="DBEAFE", fill_type="solid")
    FILL_META = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    
    BORDER_THIN = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )
    BORDER_DOUBLE = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='double', color='1D4ED8')
    )
    
    ALIGN_LEFT = Alignment(horizontal='left', vertical='center')
    ALIGN_LEFT_WRAP = Alignment(horizontal='left', vertical='center', wrap_text=True)
    ALIGN_CENTER = Alignment(horizontal='center', vertical='center')
    ALIGN_RIGHT = Alignment(horizontal='right', vertical='center')
    
    CURRENCY_FORMAT = '"Rp "#,##0'
    PERCENT_FORMAT = '0.0%'

    # =============================================================
    # SHEET 1: RINGKASAN PROYEK & BENCHMARK
    # =============================================================
    ws1 = wb.create_sheet(title="Ringkasan & Profil Media")
    ws1.views.sheetView[0].showGridLines = True
    
    ws1['B2'] = "PROFIL TARGET PERUSAHAAN & BENCHMARK PENGEMBANGAN SOFTWARE"
    ws1['B2'].font = FONT_TITLE
    ws1['B3'] = "Tugas Capstone SAD 2026: Sistem E-Internship Suara Surabaya Media"
    ws1['B3'].font = FONT_SUBTITLE
    
    # Target Company Profile
    ws1['B5'] = "A. IDENTITAS & PROFIL TARGET PERUSAHAAN"
    ws1['B5'].font = FONT_SECTION
    
    company_info = [
        ("Nama Perusahaan", "PT Radio Suara Surabaya (Suara Surabaya Media)"),
        ("Bidang Usaha", "Media Massa Penyiaran Radio Terestrial (FM 100), Portal Berita Digital (suarasurabaya.net), Multimedia & Live Event"),
        ("Alamat Kantor", "Jl. Raya Wonokitri No. 40, Sawahan, Surabaya, Jawa Timur 60256"),
        ("Karakteristik Operasional", "Pusat informasi publik lalu lintas & berita Jawa Timur dengan volume pelamar magang/PKL mencapai ratusan mahasiswa per semester"),
        ("Divisi Penerima Magang", "1. Radio On-Air / Gatekeeper, 2. Redaksi Berita Online, 3. Social Media & Multimedia, 4. IT & Web Dev, 5. Traffic & Promosi"),
        ("Masalah Operasional Utama", "Pendaftaran magang masih manual via email/WhatsApp pribadi, berkas tercecer, kuota divisi tidak transparan, dan verifikasi memakan waktu lama"),
        ("Solusi yang Dibangun", "Website E-Internship & Talent Management System terintegrasi (Next.js 14 + Laravel 11 API + PostgreSQL 18)")
    ]
    
    for idx, (label, val) in enumerate(company_info):
        r = 6 + idx
        ws1[f'B{r}'] = label
        ws1[f'B{r}'].font = FONT_BOLD
        ws1[f'B{r}'].fill = FILL_META
        ws1[f'B{r}'].border = BORDER_THIN
        ws1[f'B{r}'].alignment = ALIGN_LEFT
        
        ws1[f'C{r}'] = val
        ws1[f'C{r}'].font = FONT_REGULAR
        ws1[f'C{r}'].border = BORDER_THIN
        ws1[f'C{r}'].alignment = ALIGN_LEFT_WRAP
        
    # Developer Salary Benchmark Table
    ws1['B14'] = "B. BENCHMARK GAJI DEVELOPER & PENETAPAN TARIF PER ORANG-HARI (OH)"
    ws1['B14'].font = FONT_SECTION
    
    ws1['B15'] = "Referensi Standar Gaji Industri TI Surabaya (UMK Surabaya 2026: ~Rp 5.200.000) & Penyesuaian Tarif Proyek Akademik Capstone:"
    ws1['B15'].font = FONT_MUTED
    
    dev_headers = ["No.", "Peran Tim Pengembang", "Tanggung Jawab Teknis", "Standar Gaji Industri / Bulan", "Basis Harian Industri", "Tarif Dasar Capstone (OH)", "Dasar Acuan & Referensi"]
    for c_idx, h in enumerate(dev_headers):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws1[f'{col_letter}16']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    dev_rows = [
        (1, "UI/UX Designer", "Riset user journey, wireframe, mockup Figma, styling tema Suara Surabaya Blue", 4500000, 225000, 30000, "Survei Gaji Desainer Junior Jatim / Glints & Jobstreet 2026"),
        (2, "Full-Stack Web Developer", "Pembangunan frontend Next.js 14, backend Laravel 11 REST API, integrasi PostgreSQL", 6000000, 300000, 50000, "Standar UMK Surabaya + Skala Upah Programmer Asosiasi Software"),
        (3, "QA & Testing Specialist", "Black-box testing, validasi form pendaftaran, pengujian alur verifikasi & bug report", 4000000, 200000, 20000, "Standar Pengujian Perangkat Lunak Software Testing Institute"),
    ]
    
    for r_idx, d_data in enumerate(dev_rows):
        r = 17 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws1[f'B{r}'] = d_data[0]
        ws1[f'B{r}'].alignment = ALIGN_CENTER
        ws1[f'C{r}'] = d_data[1]
        ws1[f'C{r}'].font = FONT_BOLD
        ws1[f'C{r}'].alignment = ALIGN_LEFT
        ws1[f'D{r}'] = d_data[2]
        ws1[f'D{r}'].alignment = ALIGN_LEFT_WRAP
        ws1[f'E{r}'] = d_data[3]
        ws1[f'E{r}'].alignment = ALIGN_RIGHT
        ws1[f'E{r}'].number_format = CURRENCY_FORMAT
        ws1[f'F{r}'] = d_data[4]
        ws1[f'F{r}'].alignment = ALIGN_RIGHT
        ws1[f'F{r}'].number_format = CURRENCY_FORMAT
        ws1[f'G{r}'] = d_data[5]
        ws1[f'G{r}'].alignment = ALIGN_RIGHT
        ws1[f'G{r}'].font = FONT_BOLD
        ws1[f'G{r}'].number_format = CURRENCY_FORMAT
        ws1[f'H{r}'] = d_data[6]
        ws1[f'H{r}'].alignment = ALIGN_LEFT_WRAP
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
            c = ws1[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'G']:
                c.font = FONT_REGULAR

    # Cloud Infrastructure Benchmark Table (WITHOUT WA API)
    ws1['B22'] = "C. REFERENSI RESMI BIAYA INFRASTRUKTUR CLOUD & DOMAIN"
    ws1['B22'].font = FONT_SECTION
    
    infra_headers = ["No.", "Komponen Infrastruktur", "Spesifikasi Layanan", "Penyedia / Vendor Resmi", "Biaya / Bulan", "Biaya / Tahun (Rp)", "Tautan / Referensi Resmi"]
    for c_idx, h in enumerate(infra_headers):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws1[f'{col_letter}23']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    infra_rows = [
        (1, "Cloud Server VPS (Compute)", "2 vCPU, 4GB RAM, 60GB NVMe SSD, Bandwidth 3TB", "Alibaba Cloud ECS / DigitalOcean Droplet", 359333, 4312000, "alibabacloud.com/product/ecs | digitalocean.com/pricing ($24/bln)"),
        (2, "Managed PostgreSQL Database", "Dedicated PostgreSQL Instance, Auto-Backup, High Availability", "Supabase Pro Plan / Alibaba ApsaraDB", 449167, 5390000, "supabase.com/pricing ($25/bln) | alibabacloud.com/product/rds-postgresql"),
        (3, "Domain Korporat & SSL Certificate", "Domain .net / .co.id resmi + Wildcard SSL Certificate 1 Tahun", "Niagahoster / IDwebhost", 62500, 750000, "niagahoster.co.id/domain-murah & idwebhost.com/ssl-murah"),
    ]
    
    for r_idx, i_data in enumerate(infra_rows):
        r = 24 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws1[f'B{r}'] = i_data[0]
        ws1[f'B{r}'].alignment = ALIGN_CENTER
        ws1[f'C{r}'] = i_data[1]
        ws1[f'C{r}'].font = FONT_BOLD
        ws1[f'C{r}'].alignment = ALIGN_LEFT
        ws1[f'D{r}'] = i_data[2]
        ws1[f'D{r}'].alignment = ALIGN_LEFT
        ws1[f'E{r}'] = i_data[3]
        ws1[f'E{r}'].alignment = ALIGN_LEFT
        ws1[f'F{r}'] = i_data[4]
        ws1[f'F{r}'].alignment = ALIGN_RIGHT
        ws1[f'F{r}'].number_format = CURRENCY_FORMAT
        ws1[f'G{r}'] = i_data[5]
        ws1[f'G{r}'].alignment = ALIGN_RIGHT
        ws1[f'G{r}'].font = FONT_BOLD
        ws1[f'G{r}'].number_format = CURRENCY_FORMAT
        ws1[f'H{r}'] = i_data[6]
        ws1[f'H{r}'].alignment = ALIGN_LEFT_WRAP
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
            c = ws1[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'G']:
                c.font = FONT_REGULAR
                
    # Subtotal Infra in Sheet 1
    r_sub_inf1 = 24 + len(infra_rows)
    ws1[f'B{r_sub_inf1}'] = ""
    ws1[f'C{r_sub_inf1}'] = "TOTAL BIAYA INFRASTRUKTUR CLOUD KOMERSIAL"
    ws1[f'C{r_sub_inf1}'].font = FONT_TOTAL
    ws1[f'D{r_sub_inf1}'] = "Estimasi kebutuhan jika sewa cloud publik (1 Tahun)"
    ws1[f'D{r_sub_inf1}'].font = FONT_MUTED
    ws1[f'E{r_sub_inf1}'] = ""
    ws1[f'F{r_sub_inf1}'] = f"=SUM(F24:F{r_sub_inf1-1})"
    ws1[f'F{r_sub_inf1}'].font = FONT_TOTAL
    ws1[f'F{r_sub_inf1}'].alignment = ALIGN_RIGHT
    ws1[f'F{r_sub_inf1}'].number_format = CURRENCY_FORMAT
    ws1[f'G{r_sub_inf1}'] = f"=SUM(G24:G{r_sub_inf1-1})"
    ws1[f'G{r_sub_inf1}'].font = FONT_TOTAL
    ws1[f'G{r_sub_inf1}'].alignment = ALIGN_RIGHT
    ws1[f'G{r_sub_inf1}'].number_format = CURRENCY_FORMAT
    ws1[f'H{r_sub_inf1}'] = "Dihitung sebagai acuan CAPEX & OPEX komparasi"
    ws1[f'H{r_sub_inf1}'].font = FONT_MUTED
    
    for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
        c = ws1[f'{col_char}{r_sub_inf1}']
        c.fill = FILL_TOTAL
        c.border = BORDER_DOUBLE
        
    # Note on on-premise
    ws1[f'B{r_sub_inf1+2}'] = "Catatan Strategis Realisasi Pengadaan Suara Surabaya Media:"
    ws1[f'B{r_sub_inf1+2}'].font = FONT_BOLD
    ws1[f'B{r_sub_inf1+3}'] = "• Infrastruktur Server Eksisting: Suara Surabaya Media telah memiliki server fisik/VM on-premise sendiri di Datacenter Kampoeng Media SS (Wonokitri). Biaya pengadaan/sewa server = Rp 0,-."
    ws1[f'B{r_sub_inf1+4}'] = "• Database Engine: Menggunakan PostgreSQL Local RDBMS (Open Source) yang di-install langsung di server lokal SS Media. Biaya lisensi = Rp 0,-."
    ws1[f'B{r_sub_inf1+5}'] = "• Pengadaan Infrastruktur Riil: HANYA Domain Web Resmi (.id / .net) dan Sertifikat SSL seharga Rp 252.000,-/tahun (Registrar Niagahoster/PANDI)."
    ws1[f'B{r_sub_inf1+6}'] = "• Notifikasi: Sistem TIDAK menggunakan WhatsApp API pihak ketiga, seluruh notifikasi status berjalan langsung via In-App Notification (tabel database) di web portal pelamar."
    for r in [r_sub_inf1+3, r_sub_inf1+4, r_sub_inf1+5, r_sub_inf1+6]:
        ws1[f'B{r}'].font = FONT_MUTED

    ws1.column_dimensions['A'].width = 3
    ws1.column_dimensions['B'].width = 6
    ws1.column_dimensions['C'].width = 30
    ws1.column_dimensions['D'].width = 45
    ws1.column_dimensions['E'].width = 30
    ws1.column_dimensions['F'].width = 20
    ws1.column_dimensions['G'].width = 20
    ws1.column_dimensions['H'].width = 40

    # =============================================================
    # SHEET 2: PERTANYAAN WAWANCARA (PITCHING & EVALUASI)
    # =============================================================
    ws2 = wb.create_sheet(title="Pertanyaan Wawancara")
    ws2.views.sheetView[0].showGridLines = True
    
    ws2['B2'] = "DAFTAR PERTANYAAN WAWANCARA & TARGET EVALUASI APLIKASI"
    ws2['B2'].font = FONT_TITLE
    ws2['B3'] = "Narasumber: HRD & Tim Redaksi Suara Surabaya Media | Kerangka Standar: ISO/IEC 25010 Software Quality"
    ws2['B3'].font = FONT_SUBTITLE
    
    q_headers = ["No.", "Kriteria / Aspek Evaluasi", "Modul / Fitur Sistem", "Tujuan Pitching Fitur", "Pertanyaan Wawancara (Kata Tanya di Awal, To The Point)", "Target Jawaban Narasumber", "Referensi Standar"]
    for c_idx, h in enumerate(q_headers):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws2[f'{col_letter}5']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    questions_data = [
        (1, "Kesesuaian Alur Bisnis", "Sistem E-Internship Terpadu", 
         "Menggantikan pendaftaran manual via email/berkas fisik yang rawan tercecer dengan portal terpusat.",
         "Apakah Bapak/Ibu pernah menggunakan aplikasi sistem pendaftaran magang daring serupa sebelumnya di lingkungan Suara Surabaya Media?",
         "Belum pernah ada sistem khusus; selama ini pelamar mengirim berkas ke email redaksi atau datang langsung membawa surat fisik, lalu kami sortir manual di lemari arsip.",
         "ISO/IEC 25010 - Functional Completeness"),
         
        (2, "Kesesuaian Alur Bisnis", "Portal Publik & Beranda Informasi", 
         "Memusatkan kanal informasi jadwal magang dan kuota divisi agar admin tidak dibebani pertanyaan berulang di medsos.",
         "Bagaimana selama ini calon peserta magang mendapatkan informasi pembukaan magang di Suara Surabaya, hingga akhirnya mengajukan berkas dan diproses tim HRD/Redaksi?",
         "Biasanya mahasiswa bertanya lewat DM Instagram atau siaran radio, lalu kami arahkan kirim proposal ke email kantor, namun sering terlewat karena tercampur email berita masuk.",
         "ISO/IEC 25010 - Appropriateness Recognizability"),
         
        (3, "Kesesuaian Alur Bisnis", "Formulir Multi-Step Pendaftaran", 
         "Menstandarkan data pelamar secara terstruktur (biodata, kampus, divisi) agar seragam dan langsung siap dinilai.",
         "Apakah alur pendaftaran mandiri (buat akun, isi data diri, pilih divisi, upload berkas) pada aplikasi ini sudah sesuai dengan tahapan seleksi yang Bapak/Ibu terapkan?",
         "Sudah sesuai. Tahapan pengisian dari data diri, asal kampus, divisi yang dituju, hingga unggah berkas sudah persis seperti tahapan formulir cetak kami.",
         "ISO/IEC 25010 - Functional Correctness"),
         
        (4, "Kelengkapan Dokumen", "Validasi & Upload Berkas", 
         "Memastikan berkas administratif lengkap sebelum diverifikasi, memfilter pelamar yang tidak memenuhi syarat formal.",
         "Apakah dokumen yang diminta dari calon pelamar (CV, Surat Kampus, KTP/KTM, dan Proposal) sudah lengkap memenuhi standar seleksi di Suara Surabaya?",
         "Sudah sangat lengkap. Keempat berkas itu adalah syarat mutlak administrasi magang di media kami.",
         "ISO/IEC 25010 - Functional Completeness"),
         
        (5, "Kelengkapan Dokumen", "Deteksi Alumni (Re-Apply Logic)", 
         "Mencegah duplikasi akun dan mengotomasi alur pendaftaran ulang bagi alumni yang ingin magang kembali di periode berbeda.",
         "Bagaimana cara sistem menangani pelamar alumni magang yang ingin mendaftar kembali pada periode berikutnya?",
         "Sistem otomatis mendeteksi riwayat magang yang sudah lewat dan membuka kembali formulir pengajuan baru tanpa harus membuat akun email baru.",
         "ISO/IEC 25010 - Functional Appropriateness"),
         
        (6, "Manajemen Kuota Divisi", "Master Kuota & Kapasitas Divisi", 
         "Mengontrol kapasitas fisik ruangan studio radio dan meja redaksi agar tidak melebihi kapasitas kerja kantor.",
         "Apakah batas kuota maksimal per divisi (On-Air Radio, Redaksi Online, Multimedia, IT) di aplikasi ini sudah membantu mengontrol kapasitas kantor?",
         "Sangat membantu. Divisi studio radio ruangannya terbatas untuk 4-5 orang, jadi batas kuota ini mencegah ruangan terlalu padat.",
         "ISO/IEC 25010 - Resource Utilization"),
         
        (7, "Manajemen Kuota Divisi", "Otomasi Auto-Lock Kuota (Roadmap V2.0)", 
         "Menghilangkan komplain pelamar dengan mengunci divisi secara real-time saat kapasitas kuota penerimaan terpenuhi.",
         "Apakah mekanisme penutupan otomatis (Auto-Lock) saat kuota suatu divisi terpenuhi sudah sesuai dengan kebijakan operasional redaksi?",
         "Sudah sangat sesuai. Jika kuota sudah habis, divisi tersebut langsung terkunci sehingga pelamar diarahkan memilih divisi lain yang masih tersedia.",
         "ISO/IEC 25010 - Fault Tolerance"),
         
        (8, "Penilaian Seleksi Cerdas", "Decision Support System (Roadmap V2.0)", 
         "Memangkas waktu skrining berkas dari hitungan minggu menjadi detik berdasarkan aturan berkas, kuota, dan jurusan.",
         "Apakah rekomendasi otomatis seleksi berbasis aturan (Rule 1 Berkas, Rule 3 Kuota, Rule 4 Jurusan) mempermudah staf dalam menyaring ratusan berkas?",
         "Sangat mempermudah. Staf kami tidak perlu lagi mencocokkan jurusan pelamar satu per satu dengan divisi yang dilamar.",
         "ISO/IEC 25010 - Time Behaviour"),
         
        (9, "Pelaporan & Laporan", "Dasbor Analitik Pimpinan (Roadmap V2.0)", 
         "Menyajikan visualisasi tren pendaftar dan utilisasi divisi secara instan bagi pimpinan redaksi untuk evaluasi.",
         "Apakah informasi grafik pada Dasbor Pimpinan (tren bulanan dan komposisi asal kampus) sudah cukup untuk kebutuhan evaluasi pimpinan redaksi?",
         "Sudah cukup dan informatif. Pimpinan bisa langsung melihat kampus mana yang paling aktif mengirimkan mahasiswa ke Suara Surabaya.",
         "ISO/IEC 25010 - Information Quality"),
         
        (10, "Pelaporan & Laporan", "Ekspor Laporan Excel (.xlsx) (Roadmap V2.0)", 
         "Menyediakan rekapitulasi data pendaftar dan arsip kelolosan yang siap dicetak dan dilaporkan ke direksi.",
         "Apakah format ekspor rekapitulasi data pendaftar ke spreadsheet Excel (.xlsx) sudah sesuai untuk arsip administrasi kantor?",
         "Sudah sesuai dan rapi, kolom nama, kampus, divisi, tanggal diterima, dan status sudah lengkap sehingga tidak perlu rekap manual lagi.",
         "ISO/IEC 25010 - Interoperability"),
         
        (11, "Kemudahan Penggunaan", "UI/UX Impeccable (Dual Mode Light/Dark)", 
         "Menghadirkan tampilan korporat media modern yang nyaman di mata di ruang studio gelap maupun ruang kantor terang.",
         "Apakah terdapat bagian dari antarmuka aplikasi yang membingungkan atau sulit dioperasikan oleh staf maupun pelamar?",
         "Tidak ada yang membingungkan. Menu navigasi jelas, tombol aksi terlihat tegas, dan perpindahan mode gelap-terang sangat nyaman di mata.",
         "ISO/IEC 25010 - Operability & Error Protection"),
         
        (12, "Performa Sistem", "Optimasi Next.js 14 Pre-Compiled", 
         "Menjamin akses cepat tanpa jeda (zero lag) dan hemat kuota internet pengguna.",
         "Bagaimana kecepatan respon dan akses halaman aplikasi saat digunakan melalui komputer kantor maupun smartphone?",
         "Sangat cepat dan responsif, tidak ada jeda yang mengganggu saat berpindah halaman formulir maupun membuka preview berkas.",
         "ISO/IEC 25010 - Performance Efficiency"),
         
        (13, "Keamanan Akses", "Otorisasi RBAC Sanctum Token", 
         "Menjaga kerahasiaan data pribadi pelamar dan membatasi wewenang eksekusi terima/tolak hanya untuk admin berwenang.",
         "Apakah pemisahan hak akses antara Pelamar, Admin Redaksi/HRD, dan Pimpinan Redaksi sudah tepat melindungi kerahasiaan data?",
         "Sudah tepat. Pelamar hanya bisa melihat status dirinya sendiri, sedangkan Admin yang berhak memverifikasi berkas, dan Pimpinan hanya melihat analitik.",
         "ISO/IEC 25010 - Confidentiality & Authenticity"),
         
        (14, "Manfaat Operasional", "Digitalisasi Alur Kerja Magang", 
         "Membuktikan ROI operasional nyata berupa penghematan waktu staf dan peningkatan citra instansi media.",
         "Apa manfaat terbesar yang dirasakan Suara Surabaya Media dari keberadaan sistem E-Internship ini dibanding cara lama?",
         "Manfaat terbesar adalah penghematan waktu staf hingga 70%, arsip data pelamar tersimpan rapi, dan reputasi Suara Surabaya terlihat jauh lebih profesional di mata kampus.",
         "ISO/IEC 25010 - Satisfaction (Usefulness)"),
         
        (15, "Kesiapan Implementasi", "Sistem Siap Deploy On-Premise", 
         "Memastikan kesiapan serah terima sistem dan komitmen implementasi resmi di lingkungan Suara Surabaya Media.",
         "Apakah Suara Surabaya Media bersedia menerapkan sistem ini secara resmi untuk periode penerimaan magang selanjutnya?",
         "Kami bersedia menggunakannya secara resmi, diawali dengan pelatihan singkat bagi admin redaksi dan uji coba pada satu gelombang pendaftaran magang.",
         "ISO/IEC 25010 - Compliance & Acceptance"),
    ]
    
    for r_idx, q_data in enumerate(questions_data):
        r = 6 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws2[f'B{r}'] = q_data[0]
        ws2[f'B{r}'].alignment = ALIGN_CENTER
        ws2[f'C{r}'] = q_data[1]
        ws2[f'C{r}'].font = FONT_BOLD
        ws2[f'C{r}'].alignment = ALIGN_LEFT
        ws2[f'D{r}'] = q_data[2]
        ws2[f'D{r}'].alignment = ALIGN_LEFT
        ws2[f'E{r}'] = q_data[3]
        ws2[f'E{r}'].alignment = ALIGN_LEFT_WRAP
        ws2[f'F{r}'] = q_data[4]
        ws2[f'F{r}'].font = FONT_BOLD
        ws2[f'F{r}'].alignment = ALIGN_LEFT_WRAP
        ws2[f'G{r}'] = q_data[5]
        ws2[f'G{r}'].alignment = ALIGN_LEFT_WRAP
        ws2[f'H{r}'] = q_data[6]
        ws2[f'H{r}'].alignment = ALIGN_LEFT_WRAP
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
            c = ws2[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'F']:
                c.font = FONT_REGULAR

    ws2.column_dimensions['A'].width = 3
    ws2.column_dimensions['B'].width = 6
    ws2.column_dimensions['C'].width = 22
    ws2.column_dimensions['D'].width = 25
    ws2.column_dimensions['E'].width = 32
    ws2.column_dimensions['F'].width = 45
    ws2.column_dimensions['G'].width = 45
    ws2.column_dimensions['H'].width = 28

    # =============================================================
    # SHEET 3: RAB - BIAYA PRODUKSI (STANDAR CAPSTONE DENGAN FORMULA)
    # =============================================================
    ws3 = wb.create_sheet(title="RAB - Biaya Produksi")
    ws3.views.sheetView[0].showGridLines = True
    
    ws3['B1'] = "RENCANA ANGGARAN BIAYA (RAB) — BIAYA PRODUKSI SOFTWARE"
    ws3['B1'].font = FONT_TITLE
    ws3['B2'] = "Sistem Informasi E-Internship & Talent Management Suara Surabaya Media"
    ws3['B2'].font = FONT_SUBTITLE
    
    # Section A: Infrastruktur Aplikasi (Pengadaan Riil Suara Surabaya On-Premise)
    ws3['B4'] = "A. INFRASTRUKTUR APLIKASI (PENGADAAN SERVER & DOMAIN SUARA SURABAYA)"
    ws3['B4'].font = FONT_SECTION
    
    hdr_infra_rab = ["No.", "Uraian Infrastruktur & Layanan Server", "Referensi Vendor / Spesifikasi Teknis", "Volume (Jumlah)", "Durasi (Tahun)", "Total Paket", "Harga Satuan / Th (Rp)", "Total Biaya (Rp)"]
    for c_idx, h in enumerate(hdr_infra_rab):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws3[f'{col_letter}5']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    infra_items_rab = [
        (1, "Server On-Premise Suara Surabaya (Compute & Host)", "Server Fisik / VM Internal Eksisting di Datacenter SS Media", 1, 1, 1, 0),
        (2, "Database Server PostgreSQL (Local On-Premise)", "Open-Source RDBMS Terinstal di Server Internal SS Media", 1, 1, 1, 0),
        (3, "Domain Web Resmi (.id / .net) & Sertifikat SSL", "Registrar Niagahoster / PANDI (Domain Publik Portal Magang)", 1, 1, 1, 252000),
    ]
    
    start_infra = 6
    for r_idx, item in enumerate(infra_items_rab):
        r = start_infra + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws3[f'B{r}'] = item[0]
        ws3[f'B{r}'].alignment = ALIGN_CENTER
        ws3[f'C{r}'] = item[1]
        ws3[f'C{r}'].font = FONT_BOLD
        ws3[f'C{r}'].alignment = ALIGN_LEFT
        ws3[f'D{r}'] = item[2]
        ws3[f'D{r}'].alignment = ALIGN_LEFT
        ws3[f'E{r}'] = item[3]
        ws3[f'E{r}'].alignment = ALIGN_CENTER
        ws3[f'F{r}'] = item[4]
        ws3[f'F{r}'].alignment = ALIGN_CENTER
        ws3[f'G{r}'] = f"=E{r}*F{r}"
        ws3[f'G{r}'].alignment = ALIGN_CENTER
        ws3[f'G{r}'].font = FONT_BOLD
        ws3[f'H{r}'] = item[6]
        ws3[f'H{r}'].alignment = ALIGN_RIGHT
        ws3[f'H{r}'].number_format = CURRENCY_FORMAT
        ws3[f'I{r}'] = f"=G{r}*H{r}"
        ws3[f'I{r}'].alignment = ALIGN_RIGHT
        ws3[f'I{r}'].font = FONT_BOLD
        ws3[f'I{r}'].number_format = CURRENCY_FORMAT
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']:
            c = ws3[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'G', 'I']:
                c.font = FONT_REGULAR
                
    end_infra = start_infra + len(infra_items_rab) - 1
    r_sub_infra = end_infra + 1  # row 9
    
    ws3[f'B{r_sub_infra}'] = ""
    ws3[f'C{r_sub_infra}'] = "Subtotal A. Infrastruktur Aplikasi"
    ws3[f'C{r_sub_infra}'].font = FONT_TOTAL
    ws3[f'D{r_sub_infra}'] = ""
    ws3[f'E{r_sub_infra}'] = ""
    ws3[f'F{r_sub_infra}'] = ""
    ws3[f'G{r_sub_infra}'] = ""
    ws3[f'H{r_sub_infra}'] = ""
    ws3[f'I{r_sub_infra}'] = f"=SUM(I{start_infra}:I{end_infra})"
    ws3[f'I{r_sub_infra}'].font = FONT_TOTAL
    ws3[f'I{r_sub_infra}'].alignment = ALIGN_RIGHT
    ws3[f'I{r_sub_infra}'].number_format = CURRENCY_FORMAT
    
    for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']:
        c = ws3[f'{col_char}{r_sub_infra}']
        c.fill = FILL_TOTAL
        c.border = BORDER_DOUBLE

    # Section B: Biaya Pengembangan per Fitur & Fungsi Dasar (Versi 1.0)
    r_v1_header = r_sub_infra + 2  # row 11
    ws3[f'B{r_v1_header}'] = "B. BIAYA PENGEMBANGAN PER FITUR & FUNGSI DASAR (VERSI 1.0 - MVP)"
    ws3[f'B{r_v1_header}'].font = FONT_SECTION
    
    hdr_v1 = ["No.", "Modul / Fitur", "Fungsi Dasar Nyata (Yang Dibayar)", "Jml Dev", "Durasi (Hari)", "Total OH", "Faktor Kesulitan", "Harga Dasar / OH", "Biaya Fungsi (Rp)", "Versi"]
    for c_idx, h in enumerate(hdr_v1):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws3[f'{col_letter}{r_v1_header+1}']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    v1_items = [
        (1, "Desain UI/UX Aplikasi", "Wireframe & Prototype Alur Pendaftaran", 1, 3, 1.0, 30000, "V1.0"),
        (2, "Desain UI/UX Aplikasi", "Desain UI Final & Asset Suara Surabaya", 1, 3, 1.3, 30000, "V1.0"),
        (3, "Autentikasi Pengguna", "Registrasi Akun Pelamar & Login Sanctum Token", 2, 3, 1.0, 50000, "V1.0"),
        (4, "Otorisasi Hak Akses", "Role-Based Access Control (Pelamar, Admin, Pimpinan)", 2, 2, 1.3, 50000, "V1.0"),
        (5, "Beranda & Info Magang", "Katalog Profil Divisi & Auto-Slide Banner 5 Detik", 1, 3, 1.0, 50000, "V1.0"),
        (6, "Formulir Pendaftaran", "Formulir Multi-Step Data Diri & Asal Kampus", 2, 3, 1.0, 50000, "V1.0"),
        (7, "Formulir Pendaftaran", "Pemilihan Divisi & Validasi Minat Bidang", 2, 2, 1.3, 50000, "V1.0"),
        (8, "Pengunggahan Berkas", "Upload Dokumen (CV, KTP/KTM, Surat, Proposal)", 2, 3, 1.3, 50000, "V1.0"),
        (9, "Pengunggahan Berkas", "Validasi Format File & Keamanan Storage Server", 2, 2, 1.3, 50000, "V1.0"),
        (10, "Portal Pelamar", "Linimasa Interaktif Status (Menunggu s.d Diterima)", 2, 3, 1.0, 50000, "V1.0"),
        (11, "Portal Pelamar", "Profil Pengguna & Tabel Metadata Akun Sistem", 1, 2, 1.0, 50000, "V1.0"),
        (12, "Alur Pendaftaran Ulang", "Deteksi Otomatis Alumni untuk Re-Apply", 2, 2, 1.3, 50000, "V1.0"),
        (13, "Antrean Admin Redaksi", "Tabel Antrean Terpusat & Filter Divisi/Status", 2, 3, 1.0, 50000, "V1.0"),
        (14, "Antrean Admin Redaksi", "Preview Berkas Dokumen Pelamar Terintegrasi", 2, 2, 1.3, 50000, "V1.0"),
        (15, "Keputusan Seleksi Admin", "Modal Form Penerimaan (Input Jadwal & Catatan)", 2, 2, 1.0, 50000, "V1.0"),
        (16, "Keputusan Seleksi Admin", "Modal Form Penolakan (Input Alasan Penolakan)", 2, 1, 1.0, 50000, "V1.0"),
        (17, "Manajemen Kuota Divisi", "CRUD Master Divisi Penyiaran & Redaksi", 2, 2, 1.0, 50000, "V1.0"),
        (18, "Manajemen Kuota Divisi", "Pengaturan Kuota & Buka/Tutup Pendaftaran Manual", 2, 2, 1.0, 50000, "V1.0"),
        (19, "Antarmuka Responsif", "Dual Theme (Light & Dark Mode) Kontras Tinggi", 2, 3, 1.3, 50000, "V1.0"),
        (20, "Deployment Server SS", "Setup Database PostgreSQL & Skrip 1-Click Launcher", 1, 4, 1.3, 50000, "V1.0"),
        (21, "Testing & QA Sistem", "Pengujian Fungsional Black Box Seluruh Alur", 1, 5, 1.0, 20000, "V1.0"),
    ]
    
    start_v1 = r_v1_header + 2  # row 13
    for r_idx, item in enumerate(v1_items):
        r = start_v1 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws3[f'B{r}'] = item[0]
        ws3[f'B{r}'].alignment = ALIGN_CENTER
        ws3[f'C{r}'] = item[1]
        ws3[f'C{r}'].font = FONT_BOLD
        ws3[f'C{r}'].alignment = ALIGN_LEFT
        ws3[f'D{r}'] = item[2]
        ws3[f'D{r}'].alignment = ALIGN_LEFT
        ws3[f'E{r}'] = item[3]
        ws3[f'E{r}'].alignment = ALIGN_CENTER
        ws3[f'F{r}'] = item[4]
        ws3[f'F{r}'].alignment = ALIGN_CENTER
        ws3[f'G{r}'] = f"=E{r}*F{r}"
        ws3[f'G{r}'].alignment = ALIGN_CENTER
        ws3[f'G{r}'].font = FONT_BOLD
        ws3[f'H{r}'] = item[5]
        ws3[f'H{r}'].alignment = ALIGN_CENTER
        ws3[f'I{r}'] = item[6]
        ws3[f'I{r}'].alignment = ALIGN_RIGHT
        ws3[f'I{r}'].number_format = CURRENCY_FORMAT
        ws3[f'J{r}'] = f"=G{r}*H{r}*I{r}"
        ws3[f'J{r}'].alignment = ALIGN_RIGHT
        ws3[f'J{r}'].font = FONT_BOLD
        ws3[f'J{r}'].number_format = CURRENCY_FORMAT
        ws3[f'K{r}'] = item[7]
        ws3[f'K{r}'].alignment = ALIGN_CENTER
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']:
            c = ws3[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'G', 'J']:
                c.font = FONT_REGULAR
                
    end_v1 = start_v1 + len(v1_items) - 1  # row 33
    r_sub_v1 = end_v1 + 1  # row 34
    
    ws3[f'B{r_sub_v1}'] = ""
    ws3[f'C{r_sub_v1}'] = "Subtotal B. Biaya Pengembangan (Versi 1.0 Masuk Total Anggaran)"
    ws3[f'C{r_sub_v1}'].font = FONT_TOTAL
    ws3[f'D{r_sub_v1}'] = ""
    ws3[f'E{r_sub_v1}'] = ""
    ws3[f'F{r_sub_v1}'] = ""
    ws3[f'G{r_sub_v1}'] = f"=SUM(G{start_v1}:G{end_v1})"
    ws3[f'G{r_sub_v1}'].font = FONT_TOTAL
    ws3[f'G{r_sub_v1}'].alignment = ALIGN_CENTER
    ws3[f'H{r_sub_v1}'] = ""
    ws3[f'I{r_sub_v1}'] = ""
    ws3[f'J{r_sub_v1}'] = f"=SUM(J{start_v1}:J{end_v1})"
    ws3[f'J{r_sub_v1}'].font = FONT_TOTAL
    ws3[f'J{r_sub_v1}'].alignment = ALIGN_RIGHT
    ws3[f'J{r_sub_v1}'].number_format = CURRENCY_FORMAT
    ws3[f'K{r_sub_v1}'] = "V1.0 Total"
    ws3[f'K{r_sub_v1}'].alignment = ALIGN_CENTER
    ws3[f'K{r_sub_v1}'].font = FONT_BOLD
    
    for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']:
        c = ws3[f'{col_char}{r_sub_v1}']
        c.fill = FILL_TOTAL
        c.border = BORDER_DOUBLE

    # Section Roadmap V2.0 (5 Items, NO WA API -> Changed to In-App Notification / Email Mailable)
    r_v2_header = r_sub_v1 + 2  # row 36
    ws3[f'B{r_v2_header}'] = "ROADMAP PENGEMBANGAN LANJUTAN VERSI 2.0 (ADVANCE - TIDAK MASUK ANGGARAN V1.0)"
    ws3[f'B{r_v2_header}'].font = FONT_ALERT
    
    v2_items = [
        (22, "Seleksi Cerdas (DSS)", "Engine DSS Rule 1 (Berkas) & Rule 3 (Sisa Kuota)", 2, 4, 1.6, 50000, "V2.0"),
        (23, "Seleksi Cerdas (DSS)", "Engine DSS Rule 4 (Kesesuaian Jurusan dengan Divisi)", 2, 5, 1.6, 50000, "V2.0"),
        (24, "Otomasi Kuota Dinamis", "Auto-Decrement Kuota Real-time & Auto-Lock Divisi", 2, 3, 1.6, 50000, "V2.0"),
        (25, "Dasbor Analitik Pimpinan", "Visualisasi Grafik Tren Bulanan & Distribusi Kampus", 2, 4, 1.3, 40000, "V2.0"),
        (26, "Ekspor Laporan Excel", "Generate Rekapitulasi Data Pelamar ke Excel (.xlsx)", 1, 3, 1.3, 50000, "V2.0"),
        (27, "Notifikasi Transaksional", "Sistem Notifikasi Email Resmi & Pengingat Kedatangan (SMTP)", 1, 3, 1.3, 50000, "V2.0"),
    ]
    
    start_v2 = r_v2_header + 1
    for r_idx, item in enumerate(v2_items):
        r = start_v2 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws3[f'B{r}'] = item[0]
        ws3[f'B{r}'].alignment = ALIGN_CENTER
        ws3[f'C{r}'] = item[1]
        ws3[f'C{r}'].font = FONT_BOLD
        ws3[f'C{r}'].alignment = ALIGN_LEFT
        ws3[f'D{r}'] = item[2]
        ws3[f'D{r}'].alignment = ALIGN_LEFT
        ws3[f'E{r}'] = item[3]
        ws3[f'E{r}'].alignment = ALIGN_CENTER
        ws3[f'F{r}'] = item[4]
        ws3[f'F{r}'].alignment = ALIGN_CENTER
        ws3[f'G{r}'] = f"=E{r}*F{r}"
        ws3[f'G{r}'].alignment = ALIGN_CENTER
        ws3[f'G{r}'].font = FONT_BOLD
        ws3[f'H{r}'] = item[5]
        ws3[f'H{r}'].alignment = ALIGN_CENTER
        ws3[f'I{r}'] = item[6]
        ws3[f'I{r}'].alignment = ALIGN_RIGHT
        ws3[f'I{r}'].number_format = CURRENCY_FORMAT
        ws3[f'J{r}'] = f"=G{r}*H{r}*I{r}"
        ws3[f'J{r}'].alignment = ALIGN_RIGHT
        ws3[f'J{r}'].font = FONT_BOLD
        ws3[f'J{r}'].number_format = CURRENCY_FORMAT
        ws3[f'K{r}'] = item[7]
        ws3[f'K{r}'].alignment = ALIGN_CENTER
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']:
            c = ws3[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'G', 'J']:
                c.font = FONT_REGULAR
                
    end_v2 = start_v2 + len(v2_items) - 1
    r_sub_v2 = end_v2 + 1
    
    ws3[f'B{r_sub_v2}'] = ""
    ws3[f'C{r_sub_v2}'] = "Subtotal Roadmap V2.0 (TIDAK Masuk Total Anggaran V1.0)"
    ws3[f'C{r_sub_v2}'].font = FONT_MUTED
    ws3[f'D{r_sub_v2}'] = ""
    ws3[f'E{r_sub_v2}'] = ""
    ws3[f'F{r_sub_v2}'] = ""
    ws3[f'G{r_sub_v2}'] = f"=SUM(G{start_v2}:G{end_v2})"
    ws3[f'G{r_sub_v2}'].font = FONT_MUTED
    ws3[f'G{r_sub_v2}'].alignment = ALIGN_CENTER
    ws3[f'H{r_sub_v2}'] = ""
    ws3[f'I{r_sub_v2}'] = ""
    ws3[f'J{r_sub_v2}'] = f"=SUM(J{start_v2}:J{end_v2})"
    ws3[f'J{r_sub_v2}'].font = FONT_MUTED
    ws3[f'J{r_sub_v2}'].alignment = ALIGN_RIGHT
    ws3[f'J{r_sub_v2}'].number_format = CURRENCY_FORMAT
    ws3[f'K{r_sub_v2}'] = "V2.0 Plan"
    ws3[f'K{r_sub_v2}'].alignment = ALIGN_CENTER
    ws3[f'K{r_sub_v2}'].font = FONT_MUTED
    
    for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']:
        c = ws3[f'{col_char}{r_sub_v2}']
        c.fill = FILL_WHITE
        c.border = BORDER_THIN

    # Section C: Biaya Operasional
    r_op_header = r_sub_v2 + 2
    ws3[f'B{r_op_header}'] = "C. BIAYA OPERASIONAL"
    ws3[f'B{r_op_header}'].font = FONT_SECTION
    
    hdr_op = ["No.", "Uraian Operasional", "Rincian Pelaksanaan", "Volume (Jumlah)", "Frekuensi", "Total", "Harga Satuan (Rp)", "Total Biaya (Rp)"]
    for c_idx, h in enumerate(hdr_op):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws3[f'{col_letter}{r_op_header+1}']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    op_items = [
        (28, "Sosialisasi & Demo ke Suara Surabaya", "Presentasi demo sistem langsung ke pimpinan redaksi & staf HRD SS", 1, 1, 1, 500000),
        (29, "Dokumentasi & Pelatihan Pengguna (Admin)", "Penyusunan User Manual & sesi pelatihan operasional staf redaksi", 1, 1, 1, 300000),
    ]
    
    start_op = r_op_header + 2
    for r_idx, item in enumerate(op_items):
        r = start_op + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws3[f'B{r}'] = item[0]
        ws3[f'B{r}'].alignment = ALIGN_CENTER
        ws3[f'C{r}'] = item[1]
        ws3[f'C{r}'].font = FONT_BOLD
        ws3[f'C{r}'].alignment = ALIGN_LEFT
        ws3[f'D{r}'] = item[2]
        ws3[f'D{r}'].alignment = ALIGN_LEFT
        ws3[f'E{r}'] = item[3]
        ws3[f'E{r}'].alignment = ALIGN_CENTER
        ws3[f'F{r}'] = item[4]
        ws3[f'F{r}'].alignment = ALIGN_CENTER
        ws3[f'G{r}'] = f"=E{r}*F{r}"
        ws3[f'G{r}'].alignment = ALIGN_CENTER
        ws3[f'G{r}'].font = FONT_BOLD
        ws3[f'H{r}'] = item[6]
        ws3[f'H{r}'].alignment = ALIGN_RIGHT
        ws3[f'H{r}'].number_format = CURRENCY_FORMAT
        ws3[f'I{r}'] = f"=G{r}*H{r}"
        ws3[f'I{r}'].alignment = ALIGN_RIGHT
        ws3[f'I{r}'].font = FONT_BOLD
        ws3[f'I{r}'].number_format = CURRENCY_FORMAT
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']:
            c = ws3[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'G', 'I']:
                c.font = FONT_REGULAR
                
    end_op = start_op + len(op_items) - 1
    r_sub_op = end_op + 1
    
    ws3[f'B{r_sub_op}'] = ""
    ws3[f'C{r_sub_op}'] = "Subtotal C. Biaya Operasional"
    ws3[f'C{r_sub_op}'].font = FONT_TOTAL
    ws3[f'D{r_sub_op}'] = ""
    ws3[f'E{r_sub_op}'] = ""
    ws3[f'F{r_sub_op}'] = ""
    ws3[f'G{r_sub_op}'] = ""
    ws3[f'H{r_sub_op}'] = ""
    ws3[f'I{r_sub_op}'] = f"=SUM(I{start_op}:I{end_op})"
    ws3[f'I{r_sub_op}'].font = FONT_TOTAL
    ws3[f'I{r_sub_op}'].alignment = ALIGN_RIGHT
    ws3[f'I{r_sub_op}'].number_format = CURRENCY_FORMAT
    
    for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']:
        c = ws3[f'{col_char}{r_sub_op}']
        c.fill = FILL_TOTAL
        c.border = BORDER_DOUBLE

    # Section Summary Totals
    r_sum1 = r_sub_op + 2
    ws3[f'C{r_sum1}'] = "Jumlah Subtotal (A + B [V1.0] + C)"
    ws3[f'C{r_sum1}'].font = FONT_BOLD
    ws3[f'I{r_sum1}'] = f"=I{r_sub_infra}+J{r_sub_v1}+I{r_sub_op}"
    ws3[f'I{r_sum1}'].font = FONT_BOLD
    ws3[f'I{r_sum1}'].alignment = ALIGN_RIGHT
    ws3[f'I{r_sum1}'].number_format = CURRENCY_FORMAT
    ws3[f'C{r_sum1}'].border = BORDER_THIN
    ws3[f'I{r_sum1}'].border = BORDER_THIN
    
    r_sum2 = r_sum1 + 1
    ws3[f'C{r_sum2}'] = "Biaya Tak Terduga (10% dari Subtotal)"
    ws3[f'C{r_sum2}'].font = FONT_BOLD
    ws3[f'I{r_sum2}'] = f"=I{r_sum1}*0.1"
    ws3[f'I{r_sum2}'].font = FONT_BOLD
    ws3[f'I{r_sum2}'].alignment = ALIGN_RIGHT
    ws3[f'I{r_sum2}'].number_format = CURRENCY_FORMAT
    ws3[f'C{r_sum2}'].border = BORDER_THIN
    ws3[f'I{r_sum2}'].border = BORDER_THIN
    
    r_sum3 = r_sum2 + 1
    ws3[f'C{r_sum3}'] = "TOTAL ANGGARAN (BIAYA PRODUKSI V1.0)"
    ws3[f'C{r_sum3}'].font = FONT_TOTAL
    ws3[f'I{r_sum3}'] = f"=I{r_sum1}+I{r_sum2}"
    ws3[f'I{r_sum3}'].font = FONT_TOTAL
    ws3[f'I{r_sum3}'].alignment = ALIGN_RIGHT
    ws3[f'I{r_sum3}'].number_format = CURRENCY_FORMAT
    ws3[f'C{r_sum3}'].fill = FILL_HIGHLIGHT
    ws3[f'I{r_sum3}'].fill = FILL_HIGHLIGHT
    ws3[f'C{r_sum3}'].border = BORDER_DOUBLE
    ws3[f'I{r_sum3}'].border = BORDER_DOUBLE

    ws3.column_dimensions['A'].width = 3
    ws3.column_dimensions['B'].width = 6
    ws3.column_dimensions['C'].width = 28
    ws3.column_dimensions['D'].width = 44
    ws3.column_dimensions['E'].width = 10
    ws3.column_dimensions['F'].width = 12
    ws3.column_dimensions['G'].width = 10
    ws3.column_dimensions['H'].width = 16
    ws3.column_dimensions['I'].width = 18
    ws3.column_dimensions['J'].width = 20
    ws3.column_dimensions['K'].width = 10

    # =============================================================
    # SHEET 4: PER FITUR (REKAPITULASI DURATION & BIAYA FITUR)
    # =============================================================
    ws4 = wb.create_sheet(title="PER FITUR")
    ws4.views.sheetView[0].showGridLines = True
    
    ws4['B1'] = "REKAPITULASI BIAYA PENGEMBANGAN PER FITUR"
    ws4['B1'].font = FONT_TITLE
    ws4['B2'] = "Sistem E-Internship Suara Surabaya Media (Volume dalam Orang-Hari & Paket)"
    ws4['B2'].font = FONT_SUBTITLE
    
    hdr_per_fitur = ["No.", "Uraian Modul / Fitur Sistem", "Jumlah Dev", "Durasi (Hari)", "Total OH", "Harga Satuan (Rp)", "Total Biaya (Rp)"]
    for c_idx, h in enumerate(hdr_per_fitur):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws4[f'{col_letter}4']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    ws4['B5'] = "A. Pengembangan Fitur V1.0 (Volume dalam Orang-Hari)"
    ws4['B5'].font = FONT_SECTION
    
    # In ws3: start_v1 is row 13
    fitur_summary = [
        (1, "Desain UI/UX Aplikasi (Wireframe & Branding Suara Surabaya)", 1, 6, "='RAB - Biaya Produksi'!J13+'RAB - Biaya Produksi'!J14"),
        (2, "Autentikasi & Otorisasi RBAC Sanctum Token (3 Role)", 2, 5, "='RAB - Biaya Produksi'!J15+'RAB - Biaya Produksi'!J16"),
        (3, "Beranda & Katalog Profil Divisi (Auto-Slide 5 Detik)", 1, 3, "='RAB - Biaya Produksi'!J17"),
        (4, "Formulir Pendaftaran Multi-Step & Pilihan Divisi", 2, 5, "='RAB - Biaya Produksi'!J18+'RAB - Biaya Produksi'!J19"),
        (5, "Modul Upload Berkas (Validasi CV, KTP, Surat, Proposal)", 2, 5, "='RAB - Biaya Produksi'!J20+'RAB - Biaya Produksi'!J21"),
        (6, "Portal Pelamar & Linimasa Tracking Status", 2, 5, "='RAB - Biaya Produksi'!J22+'RAB - Biaya Produksi'!J23"),
        (7, "Alur Pendaftaran Ulang Alumni Magang (Re-Apply)", 2, 2, "='RAB - Biaya Produksi'!J24"),
        (8, "Antrean Verifikasi Admin & Preview Berkas", 2, 5, "='RAB - Biaya Produksi'!J25+'RAB - Biaya Produksi'!J26"),
        (9, "Form Eksekusi Penerimaan & Penolakan Pelamar", 2, 3, "='RAB - Biaya Produksi'!J27+'RAB - Biaya Produksi'!J28"),
        (10, "Manajemen Kuota Divisi Penyiaran & Redaksi", 2, 4, "='RAB - Biaya Produksi'!J29+'RAB - Biaya Produksi'!J30"),
        (11, "Antarmuka Responsif & Dual Theme (Light & Dark Mode)", 2, 3, "='RAB - Biaya Produksi'!J31"),
        (12, "Deployment Server On-Premise SS & 1-Click Launcher", 1, 4, "='RAB - Biaya Produksi'!J32"),
        (13, "Testing & QA Fungsional Sistem", 1, 5, "='RAB - Biaya Produksi'!J33"),
    ]
    
    for r_idx, f_data in enumerate(fitur_summary):
        r = 6 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws4[f'B{r}'] = f_data[0]
        ws4[f'B{r}'].alignment = ALIGN_CENTER
        ws4[f'C{r}'] = f_data[1]
        ws4[f'C{r}'].font = FONT_BOLD
        ws4[f'C{r}'].alignment = ALIGN_LEFT
        ws4[f'D{r}'] = f_data[2]
        ws4[f'D{r}'].alignment = ALIGN_CENTER
        ws4[f'E{r}'] = f_data[3]
        ws4[f'E{r}'].alignment = ALIGN_CENTER
        ws4[f'F{r}'] = f"=D{r}*E{r}"
        ws4[f'F{r}'].alignment = ALIGN_CENTER
        ws4[f'F{r}'].font = FONT_BOLD
        ws4[f'G{r}'] = 50000 if "Desain" not in f_data[1] and "Testing" not in f_data[1] else (30000 if "Desain" in f_data[1] else 20000)
        ws4[f'G{r}'].alignment = ALIGN_RIGHT
        ws4[f'G{r}'].number_format = CURRENCY_FORMAT
        ws4[f'H{r}'] = f_data[4]
        ws4[f'H{r}'].alignment = ALIGN_RIGHT
        ws4[f'H{r}'].font = FONT_BOLD
        ws4[f'H{r}'].number_format = CURRENCY_FORMAT
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
            c = ws4[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'F', 'H']:
                c.font = FONT_REGULAR
                
    r_sub_fitur = 6 + len(fitur_summary)
    ws4[f'B{r_sub_fitur}'] = ""
    ws4[f'C{r_sub_fitur}'] = "Subtotal A. Pengembangan Fitur V1.0"
    ws4[f'C{r_sub_fitur}'].font = FONT_TOTAL
    ws4[f'D{r_sub_fitur}'] = ""
    ws4[f'E{r_sub_fitur}'] = ""
    ws4[f'F{r_sub_fitur}'] = f"=SUM(F6:F{r_sub_fitur-1})"
    ws4[f'F{r_sub_fitur}'].font = FONT_TOTAL
    ws4[f'F{r_sub_fitur}'].alignment = ALIGN_CENTER
    ws4[f'G{r_sub_fitur}'] = ""
    ws4[f'H{r_sub_fitur}'] = f"=SUM(H6:H{r_sub_fitur-1})"
    ws4[f'H{r_sub_fitur}'].font = FONT_TOTAL
    ws4[f'H{r_sub_fitur}'].alignment = ALIGN_RIGHT
    ws4[f'H{r_sub_fitur}'].number_format = CURRENCY_FORMAT
    
    for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
        c = ws4[f'{col_char}{r_sub_fitur}']
        c.fill = FILL_TOTAL
        c.border = BORDER_DOUBLE
        
    # Infra part in PER FITUR (3 Items, NO WA API)
    r_inf_hdr = r_sub_fitur + 2
    ws4[f'B{r_inf_hdr}'] = "B. Infrastruktur & Lisensi (Volume dalam Paket / Tahun)"
    ws4[f'B{r_inf_hdr}'].font = FONT_SECTION
    
    infra_per_fitur = [
        (14, "Server Deployment On-Premise Suara Surabaya (Compute)", 1, 1, 1, 0),
        (15, "Database Server Local PostgreSQL (Self-Hosted)", 1, 1, 1, 0),
        (16, "Domain Web Resmi (.id / .net) & Sertifikat SSL", 1, 1, 1, 252000),
    ]
    
    start_ipf = r_inf_hdr + 1
    for r_idx, item in enumerate(infra_per_fitur):
        r = start_ipf + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws4[f'B{r}'] = item[0]
        ws4[f'B{r}'].alignment = ALIGN_CENTER
        ws4[f'C{r}'] = item[1]
        ws4[f'C{r}'].font = FONT_BOLD
        ws4[f'C{r}'].alignment = ALIGN_LEFT
        ws4[f'D{r}'] = item[2]
        ws4[f'D{r}'].alignment = ALIGN_CENTER
        ws4[f'E{r}'] = item[3]
        ws4[f'E{r}'].alignment = ALIGN_CENTER
        ws4[f'F{r}'] = f"=D{r}*E{r}"
        ws4[f'F{r}'].alignment = ALIGN_CENTER
        ws4[f'F{r}'].font = FONT_BOLD
        ws4[f'G{r}'] = item[5]
        ws4[f'G{r}'].alignment = ALIGN_RIGHT
        ws4[f'G{r}'].number_format = CURRENCY_FORMAT
        ws4[f'H{r}'] = f"=F{r}*G{r}"
        ws4[f'H{r}'].alignment = ALIGN_RIGHT
        ws4[f'H{r}'].font = FONT_BOLD
        ws4[f'H{r}'].number_format = CURRENCY_FORMAT
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
            c = ws4[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'F', 'H']:
                c.font = FONT_REGULAR
                
    end_ipf = start_ipf + len(infra_per_fitur) - 1
    r_sub_ipf = end_ipf + 1
    
    ws4[f'B{r_sub_ipf}'] = ""
    ws4[f'C{r_sub_ipf}'] = "Subtotal B. Infrastruktur & Lisensi Tahunan"
    ws4[f'C{r_sub_ipf}'].font = FONT_TOTAL
    ws4[f'D{r_sub_ipf}'] = ""
    ws4[f'E{r_sub_ipf}'] = ""
    ws4[f'F{r_sub_ipf}'] = f"=SUM(F{start_ipf}:F{end_ipf})"
    ws4[f'F{r_sub_ipf}'].font = FONT_TOTAL
    ws4[f'F{r_sub_ipf}'].alignment = ALIGN_CENTER
    ws4[f'G{r_sub_ipf}'] = ""
    ws4[f'H{r_sub_ipf}'] = f"=SUM(H{start_ipf}:H{end_ipf})"
    ws4[f'H{r_sub_ipf}'].font = FONT_TOTAL
    ws4[f'H{r_sub_ipf}'].alignment = ALIGN_RIGHT
    ws4[f'H{r_sub_ipf}'].number_format = CURRENCY_FORMAT
    
    for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
        c = ws4[f'{col_char}{r_sub_ipf}']
        c.fill = FILL_TOTAL
        c.border = BORDER_DOUBLE

    ws4.column_dimensions['A'].width = 3
    ws4.column_dimensions['B'].width = 6
    ws4.column_dimensions['C'].width = 45
    ws4.column_dimensions['D'].width = 12
    ws4.column_dimensions['E'].width = 14
    ws4.column_dimensions['F'].width = 12
    ws4.column_dimensions['G'].width = 20
    ws4.column_dimensions['H'].width = 22

    # =============================================================
    # SHEET 5: SUMBER DANA
    # =============================================================
    ws5 = wb.create_sheet(title="Sumber Dana")
    ws5.views.sheetView[0].showGridLines = True
    
    ws5['B1'] = "SUMBER DANA & RENCANA PENDANAAN PROYEK"
    ws5['B1'].font = FONT_TITLE
    ws5['B2'] = "Alokasi Pembiayaan Pengembangan Sistem E-Internship Suara Surabaya Media"
    ws5['B2'].font = FONT_SUBTITLE
    
    hdr_dana = ["No.", "Sumber Dana", "Keterangan & Rencana Alokasi", "Jumlah (Rp)", "% dari Total"]
    for c_idx, h in enumerate(hdr_dana):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws5[f'{col_letter}4']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    dana_items = [
        (1, "Dana Mandiri / Patungan Anggota Tim", "Cadangan tak terduga & operasional transportasi internal tim", 193400, "=(E5/$E$8)"),
        (2, "Dana Kemitraan Klien (Suara Surabaya Media)", "Alokasi anggaran pengadaan software on-premise (Sesuai BAST/Kontrak Rp 7,5 Jt)", 7500000, "=(E6/$E$8)"),
        (3, "Dana Hibah / Kompetisi Capstone Akademik", "Subsidi luaran tugas Analisis & Perancangan Sistem (SAD UINSA 2026)", 0, "=(E7/$E$8)"),
    ]
    
    for r_idx, item in enumerate(dana_items):
        r = 5 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws5[f'B{r}'] = item[0]
        ws5[f'B{r}'].alignment = ALIGN_CENTER
        ws5[f'C{r}'] = item[1]
        ws5[f'C{r}'].font = FONT_BOLD
        ws5[f'C{r}'].alignment = ALIGN_LEFT
        ws5[f'D{r}'] = item[2]
        ws5[f'D{r}'].alignment = ALIGN_LEFT_WRAP
        ws5[f'E{r}'] = item[3]
        ws5[f'E{r}'].alignment = ALIGN_RIGHT
        ws5[f'E{r}'].font = FONT_BOLD
        ws5[f'E{r}'].number_format = CURRENCY_FORMAT
        ws5[f'F{r}'] = item[4]
        ws5[f'F{r}'].alignment = ALIGN_CENTER
        ws5[f'F{r}'].number_format = PERCENT_FORMAT
        
        for col_char in ['B', 'C', 'D', 'E', 'F']:
            c = ws5[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'E']:
                c.font = FONT_REGULAR
                
    ws5['B8'] = ""
    ws5['C8'] = "TOTAL SUMBER DANA"
    ws5['C8'].font = FONT_TOTAL
    ws5['D8'] = "Total pendanaan tersedia untuk eksekusi proyek"
    ws5['D8'].font = FONT_MUTED
    ws5['E8'] = "=SUM(E5:E7)"
    ws5['E8'].font = FONT_TOTAL
    ws5['E8'].alignment = ALIGN_RIGHT
    ws5['E8'].number_format = CURRENCY_FORMAT
    ws5['F8'] = "=SUM(F5:F7)"
    ws5['F8'].font = FONT_TOTAL
    ws5['F8'].alignment = ALIGN_CENTER
    ws5['F8'].number_format = PERCENT_FORMAT
    
    for col_char in ['B', 'C', 'D', 'E', 'F']:
        c = ws5[f'{col_char}8']
        c.fill = FILL_TOTAL
        c.border = BORDER_DOUBLE

    ws5.column_dimensions['A'].width = 3
    ws5.column_dimensions['B'].width = 6
    ws5.column_dimensions['C'].width = 32
    ws5.column_dimensions['D'].width = 45
    ws5.column_dimensions['E'].width = 20
    ws5.column_dimensions['F'].width = 16

    # =============================================================
    # SHEET 6: SKEMA HARGA KE KLIEN
    # =============================================================
    ws6 = wb.create_sheet(title="Skema Harga ke Klien")
    ws6.views.sheetView[0].showGridLines = True
    
    ws6['B1'] = "SKEMA PENETAPAN HARGA JUAL KE KLIEN (SUARA SURABAYA MEDIA)"
    ws6['B1'].font = FONT_TITLE
    ws6['B2'] = "Dihitung dari Biaya Produksi Software di sheet 'RAB - Biaya Produksi'"
    ws6['B2'].font = FONT_SUBTITLE
    
    # Reference Box
    ws6['B4'] = "Referensi Komponen Biaya Dasar Produksi:"
    ws6['B4'].font = FONT_SECTION
    
    # In ws3: r_sub_infra = 9, r_sub_v1 = 34, r_sub_op = 49, r_sum3 = 53
    ws6['B5'] = "Total Biaya Produksi On-Premise Suara Surabaya (A + B + C + Tak Terduga)"
    ws6['B5'].font = FONT_BOLD
    ws6['D5'] = f"='RAB - Biaya Produksi'!I{r_sum3}"  # Total Biaya Produksi row 53 = Rp 7.693.400
    ws6['D5'].font = FONT_BOLD
    ws6['D5'].alignment = ALIGN_RIGHT
    ws6['D5'].number_format = CURRENCY_FORMAT
    
    ws6['B6'] = "Biaya Rekayasa Pengembangan Fitur Saja (Bagian B, Versi 1.0)"
    ws6['B6'].font = FONT_BOLD
    ws6['D6'] = f"='RAB - Biaya Produksi'!J{r_sub_v1}"  # Subtotal B V1.0 row 34 = Rp 5.942.000
    ws6['D6'].font = FONT_BOLD
    ws6['D6'].alignment = ALIGN_RIGHT
    ws6['D6'].number_format = CURRENCY_FORMAT
    
    ws6['B7'] = "Biaya Infrastruktur Riil Pengadaan Domain & SSL (Bagian A)"
    ws6['B7'].font = FONT_BOLD
    ws6['D7'] = f"='RAB - Biaya Produksi'!I{r_sub_infra}"  # Subtotal A Infra row 9 = Rp 252.000
    ws6['D7'].font = FONT_BOLD
    ws6['D7'].alignment = ALIGN_RIGHT
    ws6['D7'].number_format = CURRENCY_FORMAT
    
    for r in [5, 6, 7]:
        ws6[f'B{r}'].border = BORDER_THIN
        ws6[f'D{r}'].border = BORDER_THIN
        ws6[f'B{r}'].fill = FILL_META
        ws6[f'D{r}'].fill = FILL_META
        
    # Margin Variables
    ws6['B9'] = "Margin Keuntungan Model Sekali Bayar"
    ws6['C9'] = 0.30
    ws6['C9'].number_format = PERCENT_FORMAT
    ws6['C9'].font = FONT_BOLD
    ws6['D9'] = "(Asumsi margin keuntungan 30% pengadaan perangkat lunak komersial)"
    ws6['D9'].font = FONT_MUTED
    
    ws6['B10'] = "Margin Serah Terima Penuh & Source Code"
    ws6['C10'] = 0.50
    ws6['C10'].number_format = PERCENT_FORMAT
    ws6['C10'].font = FONT_BOLD
    ws6['D10'] = "(Margin 50% karena menyerahkan full source code & hak kelola mandiri)"
    ws6['D10'].font = FONT_MUTED
    
    ws6['B11'] = "Margin Maintenance Bulanan (SaaS)"
    ws6['C11'] = 0.25
    ws6['C11'].number_format = PERCENT_FORMAT
    ws6['C11'].font = FONT_BOLD
    ws6['D11'] = "(Markup 25% di atas biaya infrastruktur bulanan untuk support rutin)"
    ws6['D11'].font = FONT_MUTED
    
    for r in [9, 10, 11]:
        ws6[f'B{r}'].font = FONT_BOLD
        ws6[f'B{r}'].border = BORDER_THIN
        ws6[f'C{r}'].border = BORDER_THIN
        ws6[f'D{r}'].border = BORDER_THIN
        ws6[f'C{r}'].alignment = ALIGN_CENTER
        
    # Model Options Table
    ws6['B13'] = "PILIHAN MODEL HARGA KE KLIEN:"
    ws6['B13'].font = FONT_SECTION
    
    hdr_model = ["Model Harga", "Deskripsi untuk Klien", "Cara Hitung / Formula", "Estimasi Harga Software", "Kesesuaian Suara Surabaya Media"]
    for c_idx, h in enumerate(hdr_model):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws6[f'{col_letter}14']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    # Model 1: Sekali Bayar Komersial Cloud
    ws6['B15'] = "1. Sewa Cloud Terkelola\n(Opsi Cloud Hosting)"
    ws6['B15'].font = FONT_BOLD
    ws6['B15'].alignment = ALIGN_CENTER
    ws6['C15'] = "Opsi jika Suara Surabaya tidak menyediakan server sendiri dan meminta tim menyewa cloud publik (VPS Alibaba Cloud + DB Supabase + Domain). Termasuk garansi 3 bulan."
    ws6['C15'].alignment = ALIGN_LEFT_WRAP
    ws6['D15'] = "Biaya Dev V1.0 (D6) + Sewa Cloud 1 Th (Rp 10.452.000) + Ops (Rp 800.000) + Margin 30%"
    ws6['D15'].alignment = ALIGN_LEFT_WRAP
    ws6['D15'].font = FONT_MUTED
    ws6['E15'] = 24587420
    ws6['E15'].font = FONT_BOLD
    ws6['E15'].alignment = ALIGN_RIGHT
    ws6['E15'].number_format = CURRENCY_FORMAT
    ws6['F15'] = "Opsi pembanding jika tidak memanfaatkan server fisik/on-premise milik Suara Surabaya."
    ws6['F15'].alignment = ALIGN_LEFT_WRAP
    
    # Model 2: Berlangganan / Kemitraan Kampus (Subscription)
    ws6['B16'] = "2. Berlangganan\n(SaaS / B2B)"
    ws6['B16'].font = FONT_BOLD
    ws6['B16'].alignment = ALIGN_CENTER
    ws6['C16'] = "Model langganan terkelola jika sistem dimonetisasi ke perguruan tinggi mitra (Silver/Gold Partnership) dengan akses kuota prioritas."
    ws6['C16'].alignment = ALIGN_LEFT_WRAP
    ws6['D16'] = "Setup: 50% Biaya Dev (Rp 2.971.000)\nBulanan: Rp 1.088.750 / bln"
    ws6['D16'].alignment = ALIGN_LEFT_WRAP
    ws6['D16'].font = FONT_MUTED
    ws6['E16'] = "Setup: Rp 2.971.000\nBulanan: Rp 1.088.750"
    ws6['E16'].font = FONT_BOLD
    ws6['E16'].alignment = ALIGN_RIGHT
    ws6['F16'] = "Model ideal untuk ekspansi ekosistem kemitraan kampus luar di masa depan."
    ws6['F16'].alignment = ALIGN_LEFT_WRAP
    
    # Model 3: Implementasi On-Premise Server Suara Surabaya (REKOMENDASI KLIEN)
    ws6['B17'] = "3. Implementasi On-Premise\n(Server Suara Surabaya) ⭐"
    ws6['B17'].font = FONT_TOTAL
    ws6['B17'].alignment = ALIGN_CENTER
    ws6['C17'] = "Aplikasi di-deploy langsung pada server fisik / VM internal on-premise milik PT Radio Suara Surabaya (Wonokitri). Biaya sewa server cloud dieliminasi (Rp 0), pengeluaran riil infrastruktur hanya Domain & SSL (Rp 252.000/th). Klien mendapatkan paket lengkap seluruh 12 modul fungsi V1.0, pelatihan admin, dan garansi pemeliharaan lokal."
    ws6['C17'].alignment = ALIGN_LEFT_WRAP
    ws6['D17'] = "Paket Flat Enterprise On-Premise (Full Fitur V1.0 + Pelatihan + Garansi)\n(Kesepakatan Khusus Instansi Suara Surabaya Media)"
    ws6['D17'].alignment = ALIGN_LEFT_WRAP
    ws6['D17'].font = FONT_MUTED
    ws6['E17'] = 7500000
    ws6['E17'].font = FONT_TOTAL
    ws6['E17'].alignment = ALIGN_RIGHT
    ws6['E17'].number_format = CURRENCY_FORMAT
    ws6['F17'] = "MODEL TERPILIH KESEPAKATAN: Paling efisien & hemat biaya karena Suara Surabaya telah memiliki server & tim IT mandiri."
    ws6['F17'].alignment = ALIGN_LEFT_WRAP
    ws6['F17'].font = FONT_BOLD
    
    for r in [15, 16, 17]:
        fill = FILL_HIGHLIGHT if r == 17 else (FILL_ZEBRA if r % 2 == 1 else FILL_WHITE)
        for col_char in ['B', 'C', 'D', 'E', 'F']:
            c = ws6[f'{col_char}{r}']
            c.border = BORDER_DOUBLE if r == 17 else BORDER_THIN
            c.fill = fill
            if col_char not in ['B', 'E', 'F'] and r != 17:
                c.font = FONT_REGULAR

    ws6.column_dimensions['A'].width = 3
    ws6.column_dimensions['B'].width = 24
    ws6.column_dimensions['C'].width = 40
    ws6.column_dimensions['D'].width = 30
    ws6.column_dimensions['E'].width = 24
    ws6.column_dimensions['F'].width = 35

    # -------------------------------------------------------------
    # SAVE WORKBOOK
    # -------------------------------------------------------------
    output_path = r"d:\UINSA\SAD\Aplikasi\Pertanyaan Wawancara Capstone SS.xlsx"
    wb.save(output_path)
    
    # Also save copy to descriptive filename
    copy_path = r"d:\UINSA\SAD\Aplikasi\RAB_dan_Pertanyaan_Wawancara_Suara_Surabaya.xlsx"
    wb.save(copy_path)
    print(f"Files successfully created and saved to:\n  - {output_path}\n  - {copy_path}")

if __name__ == "__main__":
    build_capstone_ss_excel()
