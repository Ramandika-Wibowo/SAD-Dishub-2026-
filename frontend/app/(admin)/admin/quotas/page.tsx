"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { Division } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { toastSuccess, toastError, toastWarning } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  Edit3,
  AlertTriangle,
  Lock,
  Unlock,
  Sliders,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function AdminQuotasPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDiv, setEditDiv] = useState<Division | null>(null);
  const [activeTab, setActiveTab] = useState<"quota" | "rulebase">("quota");

  // Edit form states
  const [newQuota, setNewQuota] = useState("");
  const [newThreshold, setNewThreshold] = useState("60");
  const [newKeywords, setNewKeywords] = useState("");
  const [newHighPrograms, setNewHighPrograms] = useState("");
  const [newMediumPrograms, setNewMediumPrograms] = useState("");
  const [saving, setSaving] = useState(false);

  const lockedCount = divisions.filter((d) => d.is_locked).length;

  const fetchDivisions = async () => {
    try {
      const res = await api.get("/admin/divisions");
      setDivisions(res.data.data || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchDivisions(); }, []);

  const openEditModal = (d: Division) => {
    setEditDiv(d);
    setNewQuota(String(d.max_quota));
    setNewThreshold(String(d.passing_threshold ?? 60));
    setNewKeywords(d.target_keywords || "");
    setNewHighPrograms(d.relevant_programs_high || "");
    setNewMediumPrograms(d.relevant_programs_medium || "");
    setActiveTab("quota");
  };

  const handleSave = async () => {
    if (!editDiv || !newQuota) return;
    const val = parseInt(newQuota);
    if (isNaN(val) || val < 0) { toastError("Kuota harus berupa angka positif."); return; }
    if (val < editDiv.active_applicants) {
      toastWarning("Kuota tidak boleh lebih kecil dari jumlah pelamar aktif.");
      return;
    }

    const thresholdVal = parseInt(newThreshold);
    if (isNaN(thresholdVal) || thresholdVal < 1 || thresholdVal > 100) {
      toastError("Ambang batas skor kelulusan harus bernilai 1 - 100.");
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/admin/divisions/${editDiv.id}`, {
        max_quota: val,
        passing_threshold: thresholdVal,
        target_keywords: newKeywords.trim(),
        relevant_programs_high: newHighPrograms.trim(),
        relevant_programs_medium: newMediumPrograms.trim(),
      });
      toastSuccess("Data divisi dan rule base berhasil diperbarui.");
      setEditDiv(null);
      fetchDivisions();
    } catch (err: any) {
      toastError(err.response?.data?.message || "Gagal memperbarui data divisi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Manajemen Divisi</h1>
        <p className="page-subtitle">Atur kapasitas penerimaan kuota dan rule base algoritma penilaian per divisi.</p>
      </div>

      {/* Locked Alert */}
      {lockedCount > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
              {lockedCount} divisi terkunci otomatis (R3 / R5)
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-300 mt-0.5">
              Divisi yang kuotanya penuh akan otomatis terkunci dan tidak menerima pelamar baru. Tambahkan kuota untuk membukanya kembali.
            </p>
          </div>
        </div>
      )}

      {/* Divisions Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="bg-surface-50 dark:bg-slate-900 border-b border-surface-200 dark:border-slate-800">
                {["Divisi", "Maks Kuota", "Pelamar Aktif", "Sisa Kuota", "Ambang Batas (R2/R4)", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {divisions.map((d) => {
                const remaining = d.max_quota - d.active_applicants;
                const pct = d.max_quota > 0 ? (d.active_applicants / d.max_quota) * 100 : 0;
                return (
                  <tr key={d.id} className={cn(
                    "transition-colors",
                    d.is_locked && "bg-red-50/40 dark:bg-red-950/30"
                  )}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.is_locked ? "bg-red-100 dark:bg-red-950/60" : "bg-primary-50 dark:bg-primary-950/60"}`}>
                          {d.is_locked ? <Lock className="w-4 h-4 text-red-500" /> : <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-surface-800 dark:text-white">{d.name}</p>
                          <p className="text-[11px] text-surface-400 dark:text-slate-400 truncate max-w-[220px]" title={d.target_keywords || ""}>
                            {d.target_keywords ? `Keahlian: ${d.target_keywords}` : "Rule bawaan sistem"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-surface-700 dark:text-white">{d.max_quota}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-surface-700 dark:text-white">{d.active_applicants}</span>
                        <div className="w-16 h-2 bg-surface-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${
                            pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"
                          }`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold">
                      <span className={remaining <= 0 ? "text-red-600" : "text-emerald-600"}>{remaining}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-primary-700 dark:text-primary-400">
                      {d.passing_threshold ?? 60}/100
                    </td>
                    <td className="px-4 py-3.5">
                      {d.is_locked ? (
                        <StatusBadge status="locked" />
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <Unlock className="w-3 h-3" /> Buka
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Button variant="ghost" size="sm" icon={<Edit3 className="w-4 h-4" />}
                        onClick={() => openEditModal(d)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal (Quota & Rule Base) */}
      <Modal isOpen={!!editDiv} onClose={() => setEditDiv(null)} title="Edit Divisi & Rule Base"
        description={`Pengaturan kuota dan aturan seleksi algoritma untuk divisi ${editDiv?.name}`}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditDiv(null)}>Batal</Button>
            <Button onClick={handleSave} loading={saving}>Simpan Perubahan</Button>
          </>
        }>
        {editDiv && (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-surface-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab("quota")}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5",
                  activeTab === "quota"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-surface-500 hover:text-surface-700 dark:text-slate-400"
                )}
              >
                <Building2 className="w-4 h-4" /> Kapasitas Kuota
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rulebase")}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5",
                  activeTab === "rulebase"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-surface-500 hover:text-surface-700 dark:text-slate-400"
                )}
              >
                <Sliders className="w-4 h-4" /> Rule Base Algoritma (R2 & R4)
              </button>
            </div>

            {/* Tab 1: Quota */}
            {activeTab === "quota" && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700">
                    <p className="text-xs text-surface-400 dark:text-slate-400">Pelamar Aktif Saat Ini</p>
                    <p className="text-lg font-bold text-surface-900 dark:text-white mt-0.5">{editDiv.active_applicants}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-slate-700">
                    <p className="text-xs text-surface-400 dark:text-slate-400">Status Divisi (R3 / R5)</p>
                    <p className="text-lg font-bold mt-0.5">{editDiv.is_locked ?
                      <span className="text-red-600 dark:text-red-400">Terkunci (Penuh)</span> :
                      <span className="text-emerald-600 dark:text-emerald-400">Terbuka</span>}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="label-base font-semibold">Kuota Maksimum Penerimaan</label>
                  <input type="number" min={editDiv.active_applicants} value={newQuota}
                    onChange={(e) => setNewQuota(e.target.value)}
                    className="input-base" placeholder="Masukkan kuota baru" />
                  <p className="text-xs text-surface-400 mt-1.5">
                    Minimal {editDiv.active_applicants} peserta (disesuaikan dengan jumlah pelamar yang sedang aktif).
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Rule Base */}
            {activeTab === "rulebase" && (
              <div className="space-y-4 pt-1">
                <div className="p-3 rounded-lg bg-primary-50/60 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 text-xs text-primary-800 dark:text-primary-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-primary-600" />
                  <span>
                    Rule base ini digunakan secara otomatis oleh sistem DSS saat mengevaluasi kesesuaian pelamar (R2 kualifikasi CV dan R4 kesesuaian program studi).
                  </span>
                </div>

                <div>
                  <label className="label-base font-semibold">Ambang Batas Skor Kelulusan (Threshold R2 & R4)</label>
                  <div className="flex items-center gap-3">
                    <input type="number" min={1} max={100} value={newThreshold}
                      onChange={(e) => setNewThreshold(e.target.value)}
                      className="input-base w-32" placeholder="60" />
                    <span className="text-xs text-surface-500 dark:text-slate-400">
                      Standar: <strong>60</strong> (skor akhir di bawah ambang batas akan menghasilkan rekomendasi <em>Pertimbangan</em>).
                    </span>
                  </div>
                </div>

                <div>
                  <label className="label-base font-semibold">Kata Kunci Keahlian & Kualifikasi CV (R2)</label>
                  <textarea rows={3} value={newKeywords}
                    onChange={(e) => setNewKeywords(e.target.value)}
                    className="input-base text-xs leading-relaxed"
                    placeholder="Contoh: fotografi, videografi, dkv, editing video, desain grafis" />
                  <p className="text-xs text-surface-400 mt-1">
                    Pisahkan setiap kata kunci keahlian atau keterampilan teknis dengan koma (,). Sistem akan otomatis memperluas dengan sinonim relevan.
                  </p>
                </div>

                <div>
                  <label className="label-base font-semibold">Program Studi Prioritas Tinggi (R4 — Skor 95)</label>
                  <textarea rows={3} value={newHighPrograms}
                    onChange={(e) => setNewHighPrograms(e.target.value)}
                    className="input-base text-xs leading-relaxed"
                    placeholder="Contoh: ilmu komunikasi, jurnalistik, desain komunikasi visual, broadcasting" />
                  <p className="text-xs text-surface-400 mt-1">
                    Daftar program studi dengan kecocokan utama (pisahkan dengan koma).
                  </p>
                </div>

                <div>
                  <label className="label-base font-semibold">Program Studi Prioritas Sedang (R4 — Skor 70)</label>
                  <textarea rows={3} value={newMediumPrograms}
                    onChange={(e) => setNewMediumPrograms(e.target.value)}
                    className="input-base text-xs leading-relaxed"
                    placeholder="Contoh: sistem informasi, teknik informatika, seni rupa, sastra" />
                  <p className="text-xs text-surface-400 mt-1">
                    Daftar program studi dengan kecocokan pendukung/lintas bidang (pisahkan dengan koma).
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
