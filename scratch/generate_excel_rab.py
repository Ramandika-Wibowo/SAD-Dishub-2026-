import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_excel_rab():
    wb = openpyxl.Workbook()
    wb.remove(wb.active)  # Remove default sheet
    
    # -------------------------------------------------------------
    # STYLES DEFINITION
    # -------------------------------------------------------------
    FONT_TITLE = Font(name="Calibri", size=15, bold=True, color="1D4ED8")
    FONT_SUBTITLE = Font(name="Calibri", size=10, italic=True, color="64748B")
    FONT_SECTION = Font(name="Calibri", size=11, bold=True, color="1D4ED8")
    FONT_HEADER = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
    FONT_BOLD = Font(name="Calibri", size=10, bold=True, color="1E293B")
    FONT_REGULAR = Font(name="Calibri", size=10, color="1E293B")
    FONT_MUTED = Font(name="Calibri", size=9, color="64748B")
    FONT_TOTAL = Font(name="Calibri", size=11, bold=True, color="1D4ED8")
    FONT_PROFIT = Font(name="Calibri", size=10, bold=True, color="047857")
    
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
    
    # -------------------------------------------------------------
    # SHEET 1: RINGKASAN EKSEKUTIF
    # -------------------------------------------------------------
    ws1 = wb.create_sheet(title="Ringkasan Eksekutif")
    ws1.views.sheetView[0].showGridLines = True
    
    # Titles
    ws1['B2'] = "SUARA SURABAYA MEDIA (RADIO SUARA SURABAYA FM 100)"
    ws1['B2'].font = Font(name="Calibri", size=11, bold=True, color="64748B")
    
    ws1['B3'] = "RENCANA ANGGARAN BIAYA (RAB) & ANALISIS MODEL BISNIS"
    ws1['B3'].font = FONT_TITLE
    
    ws1['B4'] = "Pengembangan Sistem Informasi E-Internship & Talent Management (Full Enterprise) Pada Server Internal Suara Surabaya"
    ws1['B4'].font = FONT_SUBTITLE
    
    # Metadata Table
    meta_data = [
        ("Nama Sistem", "E-Internship & Talent Management Suara Surabaya Media"),
        ("Kategori Perangkat Lunak", "Full Enterprise Web Application & Decision Support System (DSS)"),
        ("Arsitektur Teknologi", "Decoupled Architecture (Next.js 14 App Router + Laravel 11 REST API + PostgreSQL 18)"),
        ("Infrastruktur Server", "Server On-Premise Milik Suara Surabaya Media (Biaya Cloud Server = Rp 0)"),
        ("Model Perolehan Bisnis", "Kemitraan Kampus B2B (University Partnership & Talent Pool Subscription)"),
        ("Total Nilai Investasi Software", 7500000),
        ("Waktu Pelaksanaan Proyek", "± 3 s.d. 4 Minggu (Sprints Terpadu & Deployment On-Premise)"),
        ("Garansi & Pemeliharaan", "60 Hari Kalender (Prioritas Pendampingan & Bug Fixing Bebas Biaya)"),
    ]
    
    ws1['B6'] = "INFORMASI PROYEK & KETENTUAN INFRASTRUKTUR"
    ws1['B6'].font = FONT_SECTION
    
    for idx, (label, val) in enumerate(meta_data):
        r = 7 + idx
        ws1[f'B{r}'] = label
        ws1[f'B{r}'].font = FONT_BOLD
        ws1[f'B{r}'].fill = FILL_META
        ws1[f'B{r}'].border = BORDER_THIN
        ws1[f'B{r}'].alignment = ALIGN_LEFT
        
        ws1[f'C{r}'] = val
        ws1[f'C{r}'].border = BORDER_THIN
        ws1[f'C{r}'].alignment = ALIGN_LEFT
        if label == "Total Nilai Investasi Software":
            ws1[f'C{r}'].font = FONT_TOTAL
            ws1[f'C{r}'].number_format = CURRENCY_FORMAT
        else:
            ws1[f'C{r}'].font = FONT_REGULAR
            
    # Highlight Box Total Nilai
    ws1['B16'] = "SKEMA TERMIN PEMBAYARAN"
    ws1['B16'].font = FONT_SECTION
    
    term_headers = ["Tahap Pembayaran", "Keterangan Milestone Pekerjaan", "Persentase", "Nominal Pembayaran (Rp)"]
    for c_idx, h in enumerate(term_headers):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws1[f'{col_letter}17']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    terms = [
        ("Termin 1 (Uang Muka / DP)", "Saat kick-off kesepakatan proyek disetujui", 0.40, "=C12*D18"),
        ("Termin 2 (Progress Pekerjaan)", "Setelah demo formulir pendaftaran, upload berkas, & antrean admin", 0.30, "=C12*D19"),
        ("Termin 3 (Pelunasan Final)", "Setelah implementasi DSS, dasbor pimpinan, deployment SS & serah terima", 0.30, "=C12*D20"),
    ]
    
    for r_idx, t_data in enumerate(terms):
        r = 18 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        for c_idx, val in enumerate(t_data):
            col_letter = get_column_letter(2 + c_idx)
            cell = ws1[f'{col_letter}{r}']
            cell.value = val
            cell.fill = fill
            cell.border = BORDER_THIN
            if c_idx == 0:
                cell.font = FONT_BOLD
                cell.alignment = ALIGN_LEFT
            elif c_idx == 2:
                cell.font = FONT_BOLD
                cell.alignment = ALIGN_CENTER
                cell.number_format = '0%'
            elif c_idx == 3:
                cell.font = FONT_BOLD
                cell.alignment = ALIGN_RIGHT
                cell.number_format = CURRENCY_FORMAT
            else:
                cell.font = FONT_REGULAR
                cell.alignment = ALIGN_LEFT
                
    # Total row termin
    ws1['B21'] = "TOTAL KESELURUHAN"
    ws1['B21'].font = FONT_TOTAL
    ws1['B21'].alignment = ALIGN_LEFT
    ws1['B21'].fill = FILL_TOTAL
    ws1['B21'].border = BORDER_DOUBLE
    
    ws1['C21'] = "100% Selesai & Serah Terima Sistem"
    ws1['C21'].font = FONT_BOLD
    ws1['C21'].fill = FILL_TOTAL
    ws1['C21'].border = BORDER_DOUBLE
    
    ws1['D21'] = "=SUM(D18:D20)"
    ws1['D21'].font = FONT_TOTAL
    ws1['D21'].fill = FILL_TOTAL
    ws1['D21'].alignment = ALIGN_CENTER
    ws1['D21'].number_format = '0%'
    ws1['D21'].border = BORDER_DOUBLE
    
    ws1['E21'] = "=SUM(E18:E20)"
    ws1['E21'].font = FONT_TOTAL
    ws1['E21'].fill = FILL_TOTAL
    ws1['E21'].alignment = ALIGN_RIGHT
    ws1['E21'].number_format = CURRENCY_FORMAT
    ws1['E21'].border = BORDER_DOUBLE

    # Set column widths Sheet 1
    ws1.column_dimensions['A'].width = 3
    ws1.column_dimensions['B'].width = 30
    ws1.column_dimensions['C'].width = 50
    ws1.column_dimensions['D'].width = 16
    ws1.column_dimensions['E'].width = 24
    
    # -------------------------------------------------------------
    # SHEET 2: RAB FULL FITUR ENTERPRISE (Rp 7.500.000)
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="RAB Full Fitur Enterprise")
    ws2.views.sheetView[0].showGridLines = True
    
    ws2['B2'] = "SUARA SURABAYA MEDIA"
    ws2['B2'].font = Font(name="Calibri", size=11, bold=True, color="64748B")
    ws2['B3'] = "RINCIAN ANGGARAN BIAYA PENGEMBANGAN SOFTWARE (FULL ENTERPRISE)"
    ws2['B3'].font = FONT_TITLE
    ws2['B4'] = "Implementasi Lengkap Seluruh Modul Sistem Informasi E-Internship Pada Server On-Premise Suara Surabaya"
    ws2['B4'].font = FONT_SUBTITLE
    
    headers_rab = ["No.", "Modul / Komponen Fitur", "Rincian Spesifikasi & Arsitektur Teknis", "Satuan", "Vol.", "Harga Satuan (Rp)", "Subtotal (Rp)"]
    for c_idx, h in enumerate(headers_rab):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws2[f'{col_letter}6']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    rab_items = [
        (1, "Arsitektur Multi-Role 3-Level", "Setup Next.js 14 + Laravel 11 + PostgreSQL dengan 3 role: Pelamar, Admin Redaksi/HRD, dan Pimpinan Redaksi", "Modul", 1, 650000),
        (2, "Beranda & Banner Carousel 5 Detik", "Profil korporat media SS, navigasi terstruktur, auto-sliding banner carousel 5 detik transisi halus", "Modul", 1, 350000),
        (3, "Formulir Pendaftaran & Storage Berkas", "Multi-step wizard pengajuan, integrasi file storage lokal server SS, validasi format berkas CV/KTP/Surat/Proposal", "Modul", 1, 900000),
        (4, "Portal Pelamar, Linimasa & Re-Apply", "Halaman profil selaras (Light/Dark), linimasa interaktif progress seleksi, dan otomasi deteksi alumni magang", "Modul", 1, 700000),
        (5, "Engine Seleksi Cerdas (DSS Rule-Based)", "Otomasi penilaian kelayakan pelamar: Rule 1 (Berkas), Rule 3 (Kapasitas kuota), Rule 4 (Kesesuaian jurusan)", "Modul", 1, 1250000),
        (6, "Antrean Admin & Eksekusi Rekomendasi", "Dashboard verifikasi terintegrasi DSS, modal penerimaan dengan jadwal & catatan, modal tolak dengan alasan", "Modul", 1, 800000),
        (7, "Manajemen Kuota Dinamis & Auto-Lock", "Kapasitas divisi real-time, auto-decrement kuota saat diterima, dan fitur penguncian divisi penuh (Lock/Unlock)", "Modul", 1, 550000),
        (8, "Dasbor Analitik Eksekutif (Pimpinan)", "Portal khusus Pimpinan Redaksi dengan visual grafik tren pelamar bulanan, distribusi kampus, utilisasi divisi", "Modul", 1, 650000),
        (9, "Ekspor Laporan Rekapitulasi Excel (.xlsx)", "Fitur generate dan unduh rekap data pelamar, arsip kelolosan, dan statistik pendaftaran ke spreadsheet Excel", "Modul", 1, 350000),
        (10, "UI/UX Standar Impeccable (Dual Mode)", "Desain korporat Suara Surabaya Blue, Dark Mode kontras tinggi, micro-interactions, responsive mobile/desktop", "Modul", 1, 500000),
        (11, "Deployment Server Internal SS & Indexing", "Instalasi & konfigurasi di server on-premise SS, optimasi indexing PostgreSQL, skrip 1-Click Launcher Windows", "Paket", 1, 450000),
        (12, "Testing Komprehensif & Garansi (60 Hari)", "End-to-end integration test, hardening validasi input, dokumentasi teknis kode, dan garansi pemeliharaan 60 hari", "Paket", 1, 350000),
    ]
    
    for r_idx, item in enumerate(rab_items):
        r = 7 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws2[f'B{r}'] = item[0]
        ws2[f'B{r}'].alignment = ALIGN_CENTER
        ws2[f'C{r}'] = item[1]
        ws2[f'C{r}'].alignment = ALIGN_LEFT
        ws2[f'C{r}'].font = FONT_BOLD
        ws2[f'D{r}'] = item[2]
        ws2[f'D{r}'].alignment = ALIGN_LEFT_WRAP
        ws2[f'E{r}'] = item[3]
        ws2[f'E{r}'].alignment = ALIGN_CENTER
        ws2[f'F{r}'] = item[4]
        ws2[f'F{r}'].alignment = ALIGN_CENTER
        ws2[f'G{r}'] = item[5]
        ws2[f'G{r}'].alignment = ALIGN_RIGHT
        ws2[f'G{r}'].number_format = CURRENCY_FORMAT
        ws2[f'H{r}'] = f"=F{r}*G{r}"
        ws2[f'H{r}'].alignment = ALIGN_RIGHT
        ws2[f'H{r}'].font = FONT_BOLD
        ws2[f'H{r}'].number_format = CURRENCY_FORMAT
        
        for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
            c = ws2[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['C', 'H']:
                c.font = FONT_REGULAR
                
    # Total Row
    r_tot = 7 + len(rab_items)
    ws2[f'B{r_tot}'] = ""
    ws2[f'C{r_tot}'] = "TOTAL INVESTASI PENGEMBANGAN SOFTWARE"
    ws2[f'C{r_tot}'].font = FONT_TOTAL
    ws2[f'D{r_tot}'] = ""
    ws2[f'E{r_tot}'] = ""
    ws2[f'F{r_tot}'] = ""
    ws2[f'G{r_tot}'] = ""
    ws2[f'H{r_tot}'] = f"=SUM(H7:H{r_tot-1})"
    ws2[f'H{r_tot}'].font = FONT_TOTAL
    ws2[f'H{r_tot}'].alignment = ALIGN_RIGHT
    ws2[f'H{r_tot}'].number_format = CURRENCY_FORMAT
    
    for col_char in ['B', 'C', 'D', 'E', 'F', 'G', 'H']:
        c = ws2[f'{col_char}{r_tot}']
        c.fill = FILL_TOTAL
        c.border = BORDER_DOUBLE
        
    # Note box
    r_note = r_tot + 2
    ws2[f'C{r_note}'] = "Catatan Teknis & Ketentuan Layanan:"
    ws2[f'C{r_note}'].font = FONT_BOLD
    ws2[f'C{r_note+1}'] = "• Biaya di atas merupakan harga pasti (fixed price) untuk seluruh 12 modul fitur tanpa ada pengurangan fitur."
    ws2[f'C{r_note+2}'] = "• Sistem berjalan di infrastruktur server on-premise milik Suara Surabaya Media (biaya server bulanan = Rp 0)."
    ws2[f'C{r_note+3}'] = "• Termasuk instalasi basis data PostgreSQL lokal, konfigurasi environment, dan skrip 1-Click Launcher Windows."
    ws2[f'C{r_note+4}'] = "• Garansi pemeliharaan teknis & perbaikan bug gratis selama 60 hari kalender sejak serah terima sistem."
    for ro in range(r_note+1, r_note+5):
        ws2[f'C{ro}'].font = FONT_MUTED

    ws2.column_dimensions['A'].width = 3
    ws2.column_dimensions['B'].width = 6
    ws2.column_dimensions['C'].width = 32
    ws2.column_dimensions['D'].width = 50
    ws2.column_dimensions['E'].width = 10
    ws2.column_dimensions['F'].width = 8
    ws2.column_dimensions['G'].width = 18
    ws2.column_dimensions['H'].width = 20
    
    # -------------------------------------------------------------
    # SHEET 3: MODEL BISNIS & ROI KAMPUS
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title="Model Bisnis & ROI Kampus")
    ws3.views.sheetView[0].showGridLines = True
    
    ws3['B2'] = "SUARA SURABAYA MEDIA"
    ws3['B2'].font = Font(name="Calibri", size=11, bold=True, color="64748B")
    ws3['B3'] = "MODEL BISNIS KEMITRAAN KAMPUS B2B & SIMULASI ROI"
    ws3['B3'].font = FONT_TITLE
    ws3['B4'] = "Proyeksi Arus Pendapatan (Recurring Revenue) & Pengembalian Modal Investasi Software Rp 7.500.000,-"
    ws3['B4'].font = FONT_SUBTITLE
    
    # Table 1: Tier Kemitraan Kampus
    ws3['B6'] = "A. SKEMA PAKET LANGGANAN KEMITRAAN KAMPUS (B2B SUBSCRIPTION)"
    ws3['B6'].font = FONT_SECTION
    
    tier_headers = ["Paket Kemitraan", "Sasaran Institusi", "Tarif Langganan", "Hak Akses & Fasilitas Utama"]
    for c_idx, h in enumerate(tier_headers):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws3[f'{col_letter}7']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    tiers = [
        ("Silver University Partner", "Fakultas / Program Studi", 3000000, 
         "Kuota prioritas maks. 5 mahasiswa/th, portal verifikasi digital bagi Dosen Pembimbing Lapangan (DPL), laporan evaluasi berkala"),
        ("Gold Strategic Partner", "Universitas / Mitra Utama", 5000000, 
         "Seluruh benefit Silver + kuota prioritas 10 mahasiswa/th lintas divisi (Radio On-Air, SS.net, Multimedia), hak talent scouting, logo di beranda"),
    ]
    
    for r_idx, t_data in enumerate(tiers):
        r = 8 + r_idx
        fill = FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE
        ws3[f'B{r}'] = t_data[0]
        ws3[f'B{r}'].font = FONT_BOLD
        ws3[f'B{r}'].alignment = ALIGN_LEFT
        ws3[f'C{r}'] = t_data[1]
        ws3[f'C{r}'].alignment = ALIGN_LEFT
        ws3[f'D{r}'] = t_data[2]
        ws3[f'D{r}'].alignment = ALIGN_RIGHT
        ws3[f'D{r}'].font = FONT_BOLD
        ws3[f'D{r}'].number_format = CURRENCY_FORMAT
        ws3[f'E{r}'] = t_data[3]
        ws3[f'E{r}'].alignment = ALIGN_LEFT_WRAP
        
        for col_char in ['B', 'C', 'D', 'E']:
            c = ws3[f'{col_char}{r}']
            c.border = BORDER_THIN
            c.fill = fill
            if col_char not in ['B', 'D']:
                c.font = FONT_REGULAR
                
    # Table 2: Financial Projection
    ws3['B12'] = "B. PROYEKSI KEUANGAN & SIMULASI RETURN ON INVESTMENT (ROI)"
    ws3['B12'].font = FONT_SECTION
    
    sim_headers = ["Komponen Analisis Keuangan", "Tahun 1 (Peluncuran)", "Tahun 2 (Pertumbuhan)", "Keterangan & Asumsi Perhitungan"]
    for c_idx, h in enumerate(sim_headers):
        col_letter = get_column_letter(2 + c_idx)
        cell = ws3[f'{col_letter}13']
        cell.value = h
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = ALIGN_CENTER
        cell.border = BORDER_THIN
        
    sim_items = [
        ("Pendapatan Kemitraan Kampus (Revenue)", 19000000, 31000000, "Th 1: 2 Gold + 3 Silver; Th 2: 4 Gold + 4 Silver (Mitra Kampus Jatim)"),
        ("Biaya Investasi Awal Software (CAPEX)", -7500000, 0, "Biaya pengadaan software Full Enterprise (sekali bayar di awal)"),
        ("Biaya Infrastruktur Server SS (OPEX)", 0, 0, "Disediakan mandiri oleh server internal on-premise Suara Surabaya (Rp 0)"),
        ("Laba Bersih Operasional (Net Profit)", "=C14+C15+C16", "=D14+D15+D16", "Keuntungan finansial bersih yang diterima pihak Suara Surabaya Media"),
        ("Waktu Balik Modal (Break-Even Point)", "± 4 – 5 Bulan", "Profitable", "Investasi software lunas tertutup dalam kurun waktu kurang dari 5 bulan"),
    ]
    
    for r_idx, s_data in enumerate(sim_items):
        r = 14 + r_idx
        fill = FILL_HIGHLIGHT if r_idx == 3 else (FILL_ZEBRA if r_idx % 2 == 1 else FILL_WHITE)
        ws3[f'B{r}'] = s_data[0]
        ws3[f'B{r}'].alignment = ALIGN_LEFT
        ws3[f'B{r}'].font = FONT_TOTAL if r_idx == 3 else FONT_BOLD
        
        ws3[f'C{r}'] = s_data[1]
        ws3[f'C{r}'].alignment = ALIGN_RIGHT if r_idx < 4 else ALIGN_CENTER
        if r_idx < 4:
            ws3[f'C{r}'].number_format = CURRENCY_FORMAT
        ws3[f'C{r}'].font = FONT_PROFIT if r_idx == 3 else FONT_BOLD
        
        ws3[f'D{r}'] = s_data[2]
        ws3[f'D{r}'].alignment = ALIGN_RIGHT if r_idx < 4 else ALIGN_CENTER
        if r_idx < 4:
            ws3[f'D{r}'].number_format = CURRENCY_FORMAT
        ws3[f'D{r}'].font = FONT_PROFIT if r_idx == 3 else FONT_BOLD
        
        ws3[f'E{r}'] = s_data[3]
        ws3[f'E{r}'].alignment = ALIGN_LEFT
        ws3[f'E{r}'].font = FONT_REGULAR
        
        for col_char in ['B', 'C', 'D', 'E']:
            c = ws3[f'{col_char}{r}']
            c.border = BORDER_DOUBLE if r_idx == 3 else BORDER_THIN
            c.fill = fill
            
    # Non financial notes
    r_val = 21
    ws3[f'B{r_val}'] = "C. NILAI TAMBAH STRATEGIS & EFISIENSI OPERASIONAL (NON-FINANCIAL ROI)"
    ws3[f'B{r_val}'].font = FONT_SECTION
    
    val_points = [
        ("Efisiensi Beban Kerja Manual (Cost-Saving): ", "Mengurangi hingga 70% jam kerja sortir manual CV/proposal (~40 jam kerja per gelombang), setara penghematan biaya operasional internal Rp 6.000.000 s.d. Rp 10.000.000 per tahun."),
        ("Exclusive Talent Pool Siap Pakai: ", "Suara Surabaya memiliki akses langsung ke bank talenta penyiaran, jurnalisme online SS.net, dan multimedia terverifikasi tanpa biaya agensi rekrutmen eksternal."),
        ("Optimalisasi Aset Server Internal: ", "Memaksimalkan utilisasi perangkat server on-premise Suara Surabaya yang sudah ada tanpa menambah pengeluaran langganan server cloud eksternal."),
        ("Penguatan Brand Media Edukatif: ", "Memperkokoh reputasi Suara Surabaya Media sebagai institusi pers modern, transparan, dan terdepan dalam adopsi teknologi informasi di kalangan akademisi."),
    ]
    
    for idx, (b_txt, r_txt) in enumerate(val_points):
        row = r_val + 1 + idx
        ws3[f'B{row}'] = f"• {b_txt}"
        ws3[f'B{row}'].font = FONT_BOLD
        ws3[f'B{row}'].alignment = ALIGN_LEFT
        
        ws3[f'C{row}'] = r_txt
        ws3[f'C{row}'].font = FONT_REGULAR
        ws3[f'C{row}'].alignment = ALIGN_LEFT_WRAP
        
    ws3.column_dimensions['A'].width = 3
    ws3.column_dimensions['B'].width = 32
    ws3.column_dimensions['C'].width = 25
    ws3.column_dimensions['D'].width = 25
    ws3.column_dimensions['E'].width = 50
    
    output_path = r"d:\UINSA\SAD\Aplikasi\RAB_Suara_Surabaya_Media.xlsx"
    wb.save(output_path)
    print(f"Excel workbook successfully created at: {output_path}")

if __name__ == "__main__":
    build_excel_rab()
