"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import type { Application, Division, ApplicationStatus, ApplicantType } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge, RecommendationBadge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatApplicantType, cn } from "@/lib/utils";
import {
  Search,
  Eye,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
} from "lucide-react";

function AdminApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apps, setApps] = useState<Application[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

  // Filters
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [filterDivision, setFilterDivision] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("-created_at");

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, per_page: 10, sort: sortBy };
      if (search) params.search = search;
      if (filterDivision) params.division_id = filterDivision;
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.applicant_type = filterType;

      const res = await api.get("/admin/applications", { params });
      const d = res.data.data;
      setApps(d?.data || []);
      setTotalPages(d?.last_page || 1);
      setTotal(d?.total || 0);
    } catch { /* silent */ }
    setLoading(false);
  }, [page, search, filterDivision, filterStatus, filterType, sortBy]);

  useEffect(() => {
    api.get("/admin/divisions").then((res) => setDivisions(res.data.data || [])).catch(() => { });
    // Fetch unread chat counts
    const fetchUnread = () => {
      api.get("/messages/unread-counts").then((res) => {
        if (res.data.success) setUnreadCounts(res.data.data.per_user || {});
      }).catch(() => { });
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(initialSearch);
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Antrean Pelamar</h1>
        <p className="page-subtitle">Kelola semua pengajuan magang yang masuk.</p>
      </div>

      {/* Filter Bar */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              className="input-base pl-10" placeholder="Cari nama atau email..." />
          </div>
          <select value={filterDivision} onChange={(e) => { setFilterDivision(e.target.value); setPage(1); }}
            className="input-base sm:w-48">
            <option value="">Semua Divisi</option>
            {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="input-base sm:w-36">
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="reviewing">Ditinjau</option>
            <option value="accepted">Diterima</option>
            <option value="rejected">Ditolak</option>
          </select>
          <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="input-base sm:w-36">
            <option value="">Semua Jenis</option>
            <option value="slta">SLTA</option>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="fresh_graduate">Fresh Graduate</option>
            <option value="instansi">Instansi</option>
          </select>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="input-base sm:w-48 font-medium">
            <option value="-created_at">Urutkan: Terbaru</option>
            <option value="-algorithm_score">Urutkan: Skor / Ranking Tertinggi</option>
            <option value="algorithm_score">Urutkan: Skor / Ranking Terendah</option>
            <option value="created_at">Urutkan: Terlama</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-200">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Nama</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Jenis Pelamar</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Divisi</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Skill</th>
                <th
                  onClick={() => {
                    setSortBy((prev) => (prev === "-algorithm_score" ? "algorithm_score" : "-algorithm_score"));
                    setPage(1);
                  }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider cursor-pointer hover:text-primary-600 transition-colors select-none group"
                  title="Klik untuk urutkan berdasarkan skor / ranking"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Skor / Ranking</span>
                    {sortBy === "-algorithm_score" ? (
                      <ArrowDown className="w-3.5 h-3.5 text-primary-600" />
                    ) : sortBy === "algorithm_score" ? (
                      <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 text-surface-400 group-hover:text-primary-500 opacity-70" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Rekomendasi / Pertimbangan</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-4 py-3.5"><div className="skeleton h-4 w-full rounded" /></td>
                  ))}</tr>
                ))
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center">
                    <FileText className="w-12 h-12 text-surface-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-surface-500">Tidak ada pengajuan ditemukan.</p>
                    <p className="text-xs text-surface-400 mt-1">Coba ubah filter pencarian Anda.</p>
                  </td>
                </tr>
              ) : (
                apps.map((a, i) => (
                  <tr key={a.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-surface-500">{(page - 1) * 10 + i + 1}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-surface-800">{a.user?.name || "-"}</p>
                      <p className="text-xs text-surface-400">{a.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-600">{formatApplicantType(a.user?.applicant_type)}</td>
                    <td className="px-4 py-3 text-sm text-surface-600">{a.division?.name || "-"}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {a.skills ? (
                        <div className="flex flex-wrap gap-1">
                          {a.skills
                            .split(/[,;\n]+/)
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 text-xs font-medium bg-surface-100 text-surface-700 rounded border border-surface-200 truncate max-w-[150px]"
                                title={a.skills || ""}
                              >
                                {skill}
                              </span>
                            ))}
                          {a.skills.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean).length > 3 && (
                            <span
                              className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-surface-100 text-surface-500 rounded"
                              title={a.skills || ""}
                            >
                              +{a.skills.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean).length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-surface-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-surface-700">
                          {a.algorithm_score !== null && a.algorithm_score !== undefined ? a.algorithm_score : "-"}
                        </span>
                        {sortBy === "-algorithm_score" && a.algorithm_score !== null && a.algorithm_score !== undefined && (
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide",
                            (page - 1) * 10 + i === 0
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : (page - 1) * 10 + i === 1
                              ? "bg-slate-200 text-slate-800 border border-slate-300"
                              : (page - 1) * 10 + i === 2
                              ? "bg-amber-800/10 text-amber-900 border border-amber-600/30"
                              : "bg-surface-100 text-surface-600 border border-surface-200"
                          )}>
                            Rank #{(page - 1) * 10 + i + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><RecommendationBadge app={a} /></td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/applications/${a.id}`)}
                          icon={<Eye className="w-4 h-4" />}>Detail</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200">
            <p className="text-sm text-surface-500">Hal. {page}/{totalPages} ({total} total)</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="p-2 rounded-md text-surface-500 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="p-2 rounded-md text-surface-500 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Keterangan Aturan Rule-Base (R1 - R4) */}
      <div className="p-4 rounded-xl border border-surface-200 bg-surface-50/70 dark:bg-slate-900/40 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 mb-2.5 text-surface-700 dark:text-slate-200 font-semibold">
          <Info className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>Keterangan Evaluasi Aturan Rule-Based (R1 — R4):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-surface-600 dark:text-slate-400">
          <div className="flex items-start gap-2 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-surface-200/80 dark:border-slate-700">
            <span className="font-bold text-primary-700 dark:text-primary-400 shrink-0">R1:</span>
            <div>
              <p className="font-semibold text-surface-800 dark:text-slate-200">Kelengkapan Dokumen</p>
              <p className="text-[11px] text-surface-500 dark:text-slate-400 mt-0.5">Memeriksa kelengkapan berkas wajib (CV, Surat Pengantar, Kartu Identitas).</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-surface-200/80 dark:border-slate-700">
            <span className="font-bold text-primary-700 dark:text-primary-400 shrink-0">R2:</span>
            <div>
              <p className="font-semibold text-surface-800 dark:text-slate-200">Kualifikasi & Detail CV</p>
              <p className="text-[11px] text-surface-500 dark:text-slate-400 mt-0.5">Kesesuaian keahlian (skills), pengalaman, dan projek dengan target divisi.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-surface-200/80 dark:border-slate-700">
            <span className="font-bold text-primary-700 dark:text-primary-400 shrink-0">R3:</span>
            <div>
              <p className="font-semibold text-surface-800 dark:text-slate-200">Ketersediaan Kuota</p>
              <p className="text-[11px] text-surface-500 dark:text-slate-400 mt-0.5">Ketersediaan kapasitas kuota divisi aktif dan status divisi tidak terkunci.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-surface-200/80 dark:border-slate-700">
            <span className="font-bold text-primary-700 dark:text-primary-400 shrink-0">R4:</span>
            <div>
              <p className="font-semibold text-surface-800 dark:text-slate-200">Kesesuaian Program Studi</p>
              <p className="text-[11px] text-surface-500 dark:text-slate-400 mt-0.5">Relevansi latar belakang program studi akademik terhadap divisi tujuan.</p>
            </div>
          </div>
        </div>
        <p className="mt-2.5 text-[11px] text-surface-500 dark:text-slate-400">
          <span className="font-medium text-surface-700 dark:text-slate-300">Status Aturan:</span> Simbol <span className="inline-block px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">✓</span> berarti memenuhi kriteria / lolos ambang batas, sedangkan <span className="inline-block px-1 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">✗</span> berarti di bawah ambang batas (menjadi bahan pertimbangan Admin). Keputusan akhir tetap di tangan Admin.
        </p>
      </div>
    </div>
  );
}

export default function AdminApplicationsPage() {
  return (
    <React.Suspense fallback={<div className="h-64 flex items-center justify-center text-surface-400">Memuat data pelamar...</div>}>
      <AdminApplicationsContent />
    </React.Suspense>
  );
}
