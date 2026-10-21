import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_shading(cell, color_hex):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=110, bottom=110, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def make_box(doc, text, bold_title=""):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_shading(cell, "EFF6FF")
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="none"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="1D4ED8"/>
            <w:bottom w:val="none"/>
            <w:right w:val="none"/>
        </w:tcBorders>
    ''')
    tcPr.append(borders)
    set_cell_margins(cell, top=130, bottom=130, left=180, right=180)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    if bold_title:
        r_bold = p.add_run(bold_title + "\n")
        r_bold.font.name = "Calibri"
        r_bold.font.size = Pt(9.5)
        r_bold.font.bold = True
        r_bold.font.color.rgb = RGBColor(29, 78, 216)
    r_text = p.add_run(text)
    r_text.font.name = "Calibri"
    r_text.font.size = Pt(9)
    r_text.font.color.rgb = RGBColor(30, 41, 59)
    
    sp = doc.add_paragraph()
    sp.paragraph_format.space_before = Pt(0)
    sp.paragraph_format.space_after = Pt(4)

def build_rab_doc():
    doc = docx.Document()
    
    # Page setup - A4
    section = doc.sections[0]
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(0.85)
    section.right_margin = Inches(0.85)
    
    # Primary colors
    COLOR_PRIMARY = RGBColor(29, 78, 216)   # Suara Surabaya Royal Blue
    COLOR_TEXT = RGBColor(30, 41, 59)       # Dark Slate 800
    COLOR_MUTED = RGBColor(100, 116, 139)   # Slate 500
    
    # Header Document
    p_header = doc.add_paragraph()
    p_header.paragraph_format.space_before = Pt(0)
    p_header.paragraph_format.space_after = Pt(2)
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_header.add_run("SUARA SURABAYA MEDIA (RADIO SUARA SURABAYA FM 100)")
    r_inst.font.name = "Arial"
    r_inst.font.size = Pt(10.5)
    r_inst.font.bold = True
    r_inst.font.color.rgb = COLOR_MUTED
    
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(2)
    p_title.paragraph_format.space_after = Pt(4)
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("RENCANA ANGGARAN BIAYA (RAB) & ANALISIS MODEL BISNIS\nSISTEM E-INTERNSHIP & TALENT MANAGEMENT (FULL ENTERPRISE)")
    r_title.font.name = "Arial"
    r_title.font.size = Pt(13)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_PRIMARY
    
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(12)
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Pengembangan Aplikasi Lengkap Pada Server Internal Suara Surabaya & Proyeksi Revenue Kemitraan Kampus B2B")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(9.5)
    r_sub.font.italic = True
    r_sub.font.color.rgb = COLOR_MUTED
    
    # Metadata Info Table
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(meta_table, color="E2E8F0")
    
    def fill_meta(cell, label, val):
        set_cell_margins(cell, top=50, bottom=50, left=90, right=90)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r1 = p.add_run(label + ": ")
        r1.font.name = "Calibri"
        r1.font.size = Pt(9)
        r1.font.bold = True
        r1.font.color.rgb = COLOR_MUTED
        r2 = p.add_run(val)
        r2.font.name = "Calibri"
        r2.font.size = Pt(9)
        r2.font.color.rgb = COLOR_TEXT
        
    fill_meta(meta_table.cell(0, 0), "Objek Sistem", "Suara Surabaya Media (Radio SS FM 100)")
    fill_meta(meta_table.cell(0, 1), "Kategori Sistem", "Full Enterprise E-Internship & Decision Support System (DSS)")
    fill_meta(meta_table.cell(1, 0), "Infrastruktur Server", "Server On-Premise Milik Suara Surabaya (Cloud Hosting = Rp 0)")
    fill_meta(meta_table.cell(1, 1), "Total Nilai Investasi", "Rp 7.500.000,- (Full Fitur Tanpa Paket)")
    
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    
    # Section 1: Executive Summary
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(8)
    h1.paragraph_format.space_after = Pt(3)
    r = h1.add_run("1. RINGKASAN EKSEKUTIF & KEBIJAKAN PENGEMBANGAN")
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY
    
    p_desc = doc.add_paragraph()
    p_desc.paragraph_format.space_before = Pt(1)
    p_desc.paragraph_format.space_after = Pt(6)
    p_desc.paragraph_format.line_spacing = 1.15
    r_desc = p_desc.add_run(
        "Dokumen Rencana Anggaran Biaya (RAB) ini disusun langsung untuk pengadaan software versi penuh (Full Enterprise), "
        "mencakup seluruh modul fungsional tanpa pembagian paket bertingkat. Sistem E-Internship Suara Surabaya Media ini "
        "mengintegrasikan portal pelamar modern, sistem manajemen kuota divisi penyiaran/redaksi, mesin rekomendasi otomatis "
        "berbasis aturan (Decision Support System / DSS), dasbor analitik pimpinan redaksi, hingga modul ekspor laporan spreadsheet.\n\n"
        "Mengingat pihak Suara Surabaya Media telah memiliki infrastruktur server internal (on-premise) dan tim jaringan sendiri, "
        "biaya server pihak ketiga ditiadakan sepenuhnya (Rp 0). Seluruh nilai investasi sebesar Rp 7.500.000,- dialokasikan murni "
        "untuk rekayasa perangkat lunak, konfigurasi di server internal SS, serta pengujian sistem. Dokumen ini juga memuat studi kelayakan "
        "perolehan bisnis (revenue) melalui skema Kemitraan Kampus B2B yang diproyeksikan memberikan keuntungan bersih dan balik modal "
        "sangat cepat (Break-Even Point dalam 4–5 bulan)."
    )
    r_desc.font.name = "Calibri"
    r_desc.font.size = Pt(9.5)
    r_desc.font.color.rgb = COLOR_TEXT
    
    # Section 2: Arsitektur Sistem
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(10)
    h2.paragraph_format.space_after = Pt(3)
    r = h2.add_run("2. VALUASI ARSITEKTUR REKAYASA PERANGKAT LUNAK")
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY
    
    p_arch = doc.add_paragraph()
    p_arch.paragraph_format.space_before = Pt(1)
    p_arch.paragraph_format.space_after = Pt(4)
    p_arch.paragraph_format.line_spacing = 1.15
    r_arch = p_arch.add_run(
        "Sistem ini dibangun dengan arsitektur decoupled berstandar industri modern yang menjamin performa tinggi, "
        "keamanan otentikasi multi-level, serta kemudahan pemeliharaan pada server internal Suara Surabaya:"
    )
    r_arch.font.name = "Calibri"
    r_arch.font.size = Pt(9.5)
    r_arch.font.color.rgb = COLOR_TEXT
    
    arch_points = [
        ("Frontend Modern (Next.js 14 App Router & TypeScript): ", 
         "Antarmuka cepat pre-compiled rendering, dukungan Dual Mode (Light & Dark Theme) dengan teks kontras tinggi, mobile-responsive, dan hero carousel otomatis 5 detik."),
        ("Backend RESTful API (Laravel 11 & Sanctum Token): ", 
         "Logika bisnis terpusat dengan autentikasi aman Bearer Token, kontrol hak akses berbasis peran (RBAC 3 Level: Pelamar, Admin Redaksi/HRD, Pimpinan Redaksi), dan file storage engine lokal."),
        ("Basis Data Relasional Enterprise (PostgreSQL 18): ", 
         "Integritas data ACID Compliance, auto-indexing penelusuran status, andal beroperasi di server lokal SS."),
        ("Mesin Seleksi Cerdas (Rule-Based DSS Engine): ", 
         "Algoritma penilaian otomatis kelayakan berkas (Rule 1), sisa kuota divisi (Rule 3), dan kesesuaian jurusan akademik (Rule 4).")
    ]
    for bold_part, text_part in arch_points:
        p_pt = doc.add_paragraph()
        p_pt.paragraph_format.space_before = Pt(1)
        p_pt.paragraph_format.space_after = Pt(2)
        p_pt.paragraph_format.left_indent = Inches(0.2)
        p_pt.paragraph_format.line_spacing = 1.15
        rb = p_pt.add_run("• " + bold_part)
        rb.font.name = "Calibri"
        rb.font.size = Pt(9)
        rb.font.bold = True
        rb.font.color.rgb = COLOR_TEXT
        rt = p_pt.add_run(text_part)
        rt.font.name = "Calibri"
        rt.font.size = Pt(9)
        rt.font.color.rgb = COLOR_TEXT
        
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    
    # Section 3: RAB Full Fitur Enterprise (Rp 7.500.000)
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(10)
    h3.paragraph_format.space_after = Pt(3)
    r = h3.add_run("3. RINCIAN ANGGARAN BIAYA PENGEMBANGAN (FULL FITUR ENTERPRISE)")
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY
    
    p_rab_desc = doc.add_paragraph()
    p_rab_desc.paragraph_format.space_before = Pt(1)
    p_rab_desc.paragraph_format.space_after = Pt(5)
    r_rd = p_rab_desc.add_run(
        "Berikut adalah rincian nominal per modul dan komponen fitur untuk pengembangan sistem secara utuh.\n"
        "Total Nilai Pengadaan Software: "
    )
    r_rd.font.name = "Calibri"
    r_rd.font.size = Pt(9.5)
    r_rd.font.color.rgb = COLOR_TEXT
    r_price = p_rab_desc.add_run("Rp 7.500.000,- (Tujuh Juta Lima Ratus Ribu Rupiah)")
    r_price.font.name = "Calibri"
    r_price.font.size = Pt(10)
    r_price.font.bold = True
    r_price.font.color.rgb = COLOR_PRIMARY
    
    # Table RAB
    table_rab = doc.add_table(rows=1, cols=4)
    table_rab.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_rab, color="CBD5E1")
    
    hdr_cells = table_rab.rows[0].cells
    hdr_titles = ["No.", "Modul / Komponen Fitur", "Rincian Spesifikasi & Arsitektur Teknis", "Harga (Rp)"]
    for i, title in enumerate(hdr_titles):
        cell = hdr_cells[i]
        set_cell_shading(cell, "1D4ED8")
        set_cell_margins(cell, top=120, bottom=120, left=110, right=110)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        if i == 0:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        elif i == 3:
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        else:
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(title)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    items = [
        ("1", "Arsitektur Multi-Role 3-Level", "Setup Next.js 14 + Laravel 11 + PostgreSQL dengan 3 role: Pelamar, Admin Redaksi/HRD, dan Pimpinan Redaksi.", "650.000"),
        ("2", "Beranda & Banner Carousel 5 Detik", "Profil korporat media SS, navigasi terstruktur, auto-sliding banner carousel 5 detik transisi halus.", "350.000"),
        ("3", "Formulir Pendaftaran & Storage Berkas", "Multi-step wizard pengajuan, integrasi file storage lokal server SS, validasi berkas CV/KTP/Surat/Proposal.", "900.000"),
        ("4", "Portal Pelamar, Linimasa & Re-Apply", "Halaman profil selaras (Light/Dark), linimasa interaktif progress seleksi, dan otomasi deteksi alumni magang.", "700.000"),
        ("5", "Engine Seleksi Cerdas (DSS Rule-Based)", "Otomasi penilaian kelayakan pelamar: Rule 1 (Kelengkapan berkas), Rule 3 (Kapasitas kuota), Rule 4 (Kesesuaian jurusan).", "1.250.000"),
        ("6", "Antrean Admin & Eksekusi Rekomendasi", "Dashboard verifikasi terintegrasi DSS, modal penerimaan dengan jadwal & catatan, modal tolak dengan alasan.", "800.000"),
        ("7", "Manajemen Kuota Dinamis & Auto-Lock", "Kapasitas divisi real-time, auto-decrement kuota saat diterima, dan fitur penguncian divisi penuh (Lock/Unlock).", "550.000"),
        ("8", "Dasbor Analitik Eksekutif (Pimpinan)", "Portal khusus Pimpinan Redaksi dengan visual grafik tren pelamar bulanan, distribusi kampus, dan utilisasi kapasitas divisi.", "650.000"),
        ("9", "Ekspor Laporan Rekapitulasi Excel (.xlsx)", "Fitur generate dan unduh rekap data pelamar, arsip kelolosan, dan statistik pendaftaran ke spreadsheet Excel.", "350.000"),
        ("10", "UI/UX Standar Impeccable (Dual Mode)", "Desain korporat Suara Surabaya Blue, Dark Mode kontras tinggi, micro-interactions, responsive mobile/desktop.", "500.000"),
        ("11", "Deployment Server Internal SS & Indexing", "Instalasi & konfigurasi di server on-premise SS, optimasi indexing PostgreSQL, skrip 1-Click Launcher Windows.", "450.000"),
        ("12", "Testing Komprehensif & Garansi (60 Hari)", "End-to-end integration test, hardening validasi input, dokumentasi teknis kode, dan garansi pemeliharaan 60 hari.", "350.000"),
    ]
    
    for row_idx, item in enumerate(items):
        row = table_rab.add_row()
        cells = row.cells
        bg_col = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for i, val in enumerate(item):
            cell = cells[i]
            set_cell_shading(cell, bg_col)
            set_cell_margins(cell, top=75, bottom=75, left=110, right=110)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            if i == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            elif i == 3:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            if i == 1:
                r.font.bold = True
            r.font.color.rgb = COLOR_TEXT
            
    # Total Row
    total_row = table_rab.add_row()
    t_cells = total_row.cells
    for c in t_cells:
        set_cell_shading(c, "EFF6FF")
        set_cell_margins(c, top=100, bottom=100, left=110, right=110)
        
    p_tot_lbl = t_cells[1].paragraphs[0]
    r_tl = p_tot_lbl.add_run("TOTAL INVESTASI PENGEMBANGAN SOFTWARE")
    r_tl.font.name = "Calibri"
    r_tl.font.size = Pt(9)
    r_tl.font.bold = True
    r_tl.font.color.rgb = COLOR_PRIMARY
    
    p_tot_val = t_cells[3].paragraphs[0]
    p_tot_val.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_tv = p_tot_val.add_run("Rp 7.500.000")
    r_tv.font.name = "Calibri"
    r_tv.font.size = Pt(9.5)
    r_tv.font.bold = True
    r_tv.font.color.rgb = COLOR_PRIMARY

    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    
    # Section 4: Model Bisnis & Revenue
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(12)
    h4.paragraph_format.space_after = Pt(3)
    r = h4.add_run("4. ANALISIS MODEL BISNIS & PROYEKSI REVENUE (KEMITRAAN KAMPUS B2B)")
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY
    
    p_biz_desc = doc.add_paragraph()
    p_biz_desc.paragraph_format.space_before = Pt(1)
    p_biz_desc.paragraph_format.space_after = Pt(5)
    p_biz_desc.paragraph_format.line_spacing = 1.15
    r_biz_desc = p_biz_desc.add_run(
        "Karena infrastruktur server telah dimiliki mandiri oleh Suara Surabaya (biaya server OPEX = Rp 0), maka setiap penerimaan "
        "dari program kemitraan kampus langsung menjadi profit bersih bagi perusahaan. Sistem ini dapat dimonetisasi melalui program "
        "Kemitraan Perguruan Tinggi B2B (University Partnership & Talent Pool Subscription):"
    )
    r_biz_desc.font.name = "Calibri"
    r_biz_desc.font.size = Pt(9.5)
    r_biz_desc.font.color.rgb = COLOR_TEXT
    
    # Sub-section: Skema Paket Kemitraan Kampus
    p_tier_hdr = doc.add_paragraph()
    p_tier_hdr.paragraph_format.space_before = Pt(3)
    p_tier_hdr.paragraph_format.space_after = Pt(2)
    r_th = p_tier_hdr.add_run("A. Skema Paket Langganan Kemitraan Kampus (B2B):")
    r_th.font.name = "Calibri"
    r_th.font.size = Pt(10)
    r_th.font.bold = True
    r_th.font.color.rgb = COLOR_PRIMARY
    
    table_tier = doc.add_table(rows=1, cols=3)
    table_tier.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_tier, color="CBD5E1")
    
    hdr_tier = table_tier.rows[0].cells
    hdr_tier_titles = ["Paket Kemitraan Kampus", "Biaya Langganan", "Benefit & Hak Akses Institusi Mitra"]
    for i, t in enumerate(hdr_tier_titles):
        c = hdr_tier[i]
        set_cell_shading(c, "1D4ED8")
        set_cell_margins(c, top=110, bottom=110, left=110, right=110)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        if i == 1:
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r = p.add_run(t)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    tiers_data = [
        ("Silver University Partner\n(Fakultas / Prodi)", "Rp 3.000.000\n/ tahun", 
         "• Alokasi kuota prioritas magang resmi (maksimal 5 mahasiswa per tahun).\n"
         "• Portal verifikasi dokumen digital langsung untuk Dosen Pembimbing Lapangan (DPL).\n"
         "• Laporan evaluasi berkala dan sertifikat magang digital langsung terbit dari sistem."),
        ("Gold Strategic Partner\n(Universitas / Mitra Utama)", "Rp 5.000.000\n/ tahun", 
         "• Seluruh hak akses Paket Silver.\n"
         "• Alokasi kuota prioritas 10 mahasiswa per tahun lintas divisi (Radio On-Air, Redaksi Digital SS.net, Multimedia/Sosmed, dan IT/Traffic).\n"
         "• Hak akses talent scouting profil alumni magang berprestasi untuk bank talenta kampus/mitra.\n"
         "• Pencantuman logo resmi universitas di Beranda Sistem sebagai 'Official Media Partner'.")
    ]
    
    for row_idx, item in enumerate(tiers_data):
        row = table_tier.add_row()
        cells = row.cells
        bg_col = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for i, val in enumerate(item):
            cell = cells[i]
            set_cell_shading(cell, bg_col)
            set_cell_margins(cell, top=90, bottom=90, left=110, right=110)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            if i == 1:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            if i == 0:
                r.font.bold = True
            r.font.color.rgb = COLOR_TEXT
            
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    
    # Sub-section: Proyeksi Pendapatan & ROI
    p_proj_hdr = doc.add_paragraph()
    p_proj_hdr.paragraph_format.space_before = Pt(3)
    p_proj_hdr.paragraph_format.space_after = Pt(2)
    r_ph = p_proj_hdr.add_run("B. Proyeksi Keuangan & Simulasi Return on Investment (ROI):")
    r_ph.font.name = "Calibri"
    r_ph.font.size = Pt(10)
    r_ph.font.bold = True
    r_ph.font.color.rgb = COLOR_PRIMARY
    
    p_proj_desc = doc.add_paragraph()
    p_proj_desc.paragraph_format.space_before = Pt(1)
    p_proj_desc.paragraph_format.space_after = Pt(4)
    p_proj_desc.paragraph_format.line_spacing = 1.15
    r_pd = p_proj_desc.add_run(
        "Dengan target moderat 5 kampus mitra di Surabaya dan sekitarnya (misal: UINSA, Unair, ITS, Unesa, dan UPN Jatim), "
        "simulasi perolehan laba dengan investasi software Rp 7.500.000,- adalah:"
    )
    r_pd.font.name = "Calibri"
    r_pd.font.size = Pt(9.5)
    r_pd.font.color.rgb = COLOR_TEXT
    
    table_sim = doc.add_table(rows=1, cols=4)
    table_sim.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_sim, color="CBD5E1")
    
    hdr_sim = table_sim.rows[0].cells
    hdr_sim_titles = ["Komponen Analisis Keuangan", "Tahun 1 (Peluncuran)", "Tahun 2 (Pertumbuhan)", "Keterangan"]
    for i, t in enumerate(hdr_sim_titles):
        c = hdr_sim[i]
        set_cell_shading(c, "1D4ED8")
        set_cell_margins(c, top=110, bottom=110, left=110, right=110)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        if i in [1, 2]:
            p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r = p.add_run(t)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    sim_data = [
        ("Pendapatan Kemitraan Kampus (Revenue)", "Rp 19.000.000", "Rp 31.000.000", "Th 1: 2 Gold + 3 Silver; Th 2: 4 Gold + 4 Silver"),
        ("Biaya Investasi Software (CAPEX)", "(Rp 7.500.000)", "Rp 0", "Pengadaan software Full Enterprise (sekali bayar)"),
        ("Biaya Infrastruktur Server SS (OPEX)", "Rp 0", "Rp 0", "Disediakan mandiri oleh server internal Suara Surabaya"),
        ("Laba Bersih Operasional (Net Profit)", "Rp 11.500.000", "Rp 31.000.000", "Laba bersih operasional yang diterima Suara Surabaya"),
        ("Waktu Balik Modal (Break-Even Point)", "± 4 – 5 Bulan", "Profitable", "Investasi software lunas tertutup dalam < 5 bulan"),
    ]
    
    for row_idx, item in enumerate(sim_data):
        row = table_sim.add_row()
        cells = row.cells
        bg_col = "EFF6FF" if row_idx == 3 else ("F8FAFC" if row_idx % 2 == 1 else "FFFFFF")
        for i, val in enumerate(item):
            cell = cells[i]
            set_cell_shading(cell, bg_col)
            set_cell_margins(cell, top=80, bottom=80, left=110, right=110)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            if i in [1, 2]:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            if row_idx == 3:
                r.font.bold = True
                r.font.color.rgb = COLOR_PRIMARY
            else:
                r.font.color.rgb = COLOR_TEXT
                
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    
    # Sub-section: Nilai Tambah Non-Finansial
    make_box(
        doc,
        "1. Penghematan Jam Kerja Redaksi & HR (Cost-Saving ROI): Mengeliminasi seleksi berkas CV manual hingga 70% (~40 jam kerja per siklus), setara penghematan biaya operasional internal Rp 6.000.000 - Rp 10.000.000 per tahun.\n"
        "2. Exclusive Talent Pool Siap Rekrut: Bank talenta muda terverifikasi (penyiar radio, jurnalis online SS.net, editor video, multimedia) siap direkrut tanpa biaya agensi rekrutmen eksternal.\n"
        "3. Optimalisasi Aset Server Internal: Memaksimalkan utilitas server on-premise Suara Surabaya yang sudah ada tanpa menambah pengeluaran langganan server cloud eksternal.",
        bold_title="NILAI TAMBAH STRATEGIS & EFISIENSI OPERASIONAL (NON-FINANCIAL VALUE)"
    )
    
    # Section 5: Jadwal & Ketentuan Pengerjaan
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(10)
    h5.paragraph_format.space_after = Pt(3)
    r = h5.add_run("5. JADWAL PENGERJAAN & SKEMA PEMBAYARAN")
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = COLOR_PRIMARY
    
    p_terms = doc.add_paragraph()
    p_terms.paragraph_format.space_before = Pt(1)
    p_terms.paragraph_format.space_after = Pt(5)
    p_terms.paragraph_format.line_spacing = 1.15
    r_terms = p_terms.add_run(
        "A. Estimasi Waktu Pengerjaan (Timeline):\n"
        "• Total Durasi: ± 3 – 4 Minggu (Sprints terpadu hingga deployment server lokal SS dan user training).\n\n"
        "B. Skema Pembayaran Bertahap (Termin):\n"
        "1. Termin 1 (Uang Muka / DP 40%): Rp 3.000.000,- (Dibayarkan saat kick-off kesepakatan proyek disetujui).\n"
        "2. Termin 2 (Progress 30%): Rp 2.250.000,- (Dibayarkan setelah demo formulir pengajuan, upload berkas, dan antrean admin).\n"
        "3. Termin 3 (Pelunasan 30%): Rp 2.250.000,- (Dibayarkan setelah implementasi DSS, dasbor pimpinan, deployment ke server internal SS, dan serah terima sistem).\n\n"
        "C. Ketentuan & Layanan Tambahan:\n"
        "• Biaya mencakup source code lengkap, konfigurasi database PostgreSQL di server SS, dan garansi pemeliharaan 60 hari.\n"
        "• Tidak ada biaya server cloud karena seluruh sistem beroperasi di infrastruktur server milik Suara Surabaya."
    )
    r_terms.font.name = "Calibri"
    r_terms.font.size = Pt(9)
    r_terms.font.color.rgb = COLOR_TEXT
    
    # Sign-off footer
    p_sign = doc.add_paragraph()
    p_sign.paragraph_format.space_before = Pt(16)
    p_sign.paragraph_format.space_after = Pt(2)
    p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_s1 = p_sign.add_run("Surabaya, Oktober 2026\n")
    r_s1.font.name = "Calibri"
    r_s1.font.size = Pt(9)
    r_s1.font.color.rgb = COLOR_MUTED
    r_s2 = p_sign.add_run("Tim Pengembang Sistem Informasi E-Internship\nSuara Surabaya Media")
    r_s2.font.name = "Calibri"
    r_s2.font.size = Pt(9.5)
    r_s2.font.bold = True
    r_s2.font.color.rgb = COLOR_PRIMARY
    
    output_path = r"d:\UINSA\SAD\Aplikasi\RAB SS  123.docx"
    fallback_path = r"d:\UINSA\SAD\Aplikasi\RAB SS  123_revisi.docx"
    try:
        doc.save(output_path)
        print(f"File successfully created and saved to {output_path}")
    except PermissionError:
        doc.save(fallback_path)
        print(f"Original file is currently open in Microsoft Word. Saved to {fallback_path}")

if __name__ == "__main__":
    build_rab_doc()
