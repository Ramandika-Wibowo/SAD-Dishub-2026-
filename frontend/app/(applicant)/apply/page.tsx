"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCachedUser } from "@/lib/auth";
import api from "@/lib/axios";
import type { Division, Application } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import StepIndicator from "@/components/forms/StepIndicator";
import UploadDropzone from "@/components/forms/UploadDropzone";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { toastSuccess, toastError } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  Lock,
  ChevronRight,
  ChevronLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Briefcase,
  Layers,
  Globe,
} from "lucide-react";

const steps = [
  { label: "Pilih Divisi", description: "Tentukan penempatan" },
  { label: "Isi Data Diri", description: "Lengkapi informasi" },
  { label: "Detail CV", description: "Skills & Portofolio" },
  { label: "Unggah Dokumen", description: "Upload berkas" },
];

export default function ApplyPage() {
  const router = useRouter();
  const user = getCachedUser();

  const [step, setStep] = useState(0);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [divLoading, setDivLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [rejectedDivisionIds, setRejectedDivisionIds] = useState<number[]>([]);

  // Form state
  const [selectedDivision, setSelectedDivision] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    institution_name: user?.institution_name || "",
    study_program: "",
    skills: "",
    experience: "",
    projects: "",
    portfolio_url: "",
    internship_start: "",
    internship_end: "",
  });
  const [files, setFiles] = useState<{ cv: File | null; cover_letter: File | null; id_card: File | null; proposal: File | null }>({
    cv: null,
    cover_letter: null,
    id_card: null,
    proposal: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cek apakah pelamar boleh mengajukan magang
  useEffect(() => {
    api.get("/applications/my")
      .then((res) => {
        const apps: Application[] = res.data.data?.data || res.data.data || [];
        if (Array.isArray(apps) && apps.length > 0) {
          // Check if user has an active pending/reviewing application or ongoing accepted internship
          const hasActive = apps.some((a) => {
            if (a.status === "pending" || a.status === "reviewing") return true;
            if (a.status === "accepted") {
              const isEnded =
                Boolean(a.is_completed) ||
                (a.internship_end &&
                  new Date(a.internship_end).getTime() < new Date().setHours(0, 0, 0, 0));
              return !isEnded;
            }
            return false;
          });

          if (hasActive) {
            toastError("Anda masih memiliki pengajuan aktif atau masa magang yang sedang berjalan.");
            router.push("/dashboard");
            return;
          }

          // Catat ID divisi yang pernah ditolak
          const rejectedIds = apps
            .filter((a) => a.status === "rejected" && a.division?.id)
            .map((a) => a.division!.id);
          setRejectedDivisionIds(rejectedIds);
        }
      })
      .catch(() => {
        // Jika gagal cek, tetap lanjutkan
      })
      .finally(() => setCheckingEligibility(false));
  }, [router]);

  useEffect(() => {
    api.get("/divisions")
      .then((res) => setDivisions(res.data.data || []))
      .catch(() => toastError("Gagal memuat data divisi."))
      .finally(() => setDivLoading(false));
  }, []);

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !selectedDivision) e.division = "Pilih salah satu divisi.";
    if (step === 1) {
      if (!formData.institution_name.trim()) e.institution_name = "Wajib diisi.";
      if (!formData.study_program.trim()) e.study_program = "Wajib diisi.";
      if (!formData.internship_start) e.internship_start = "Wajib diisi.";
      if (!formData.internship_end) e.internship_end = "Wajib diisi.";
      if (formData.internship_start && formData.internship_end && formData.internship_start > formData.internship_end)
        e.internship_end = "Harus setelah tanggal mulai.";
    }
    if (step === 2) {
      if (!formData.skills.trim()) {
        e.skills = "Sebutkan minimal 1 keahlian atau tools utama Anda.";
      }
    }
    if (step === 3) {
      if (!files.cv) e.cv = "CV wajib diunggah.";
      if (!files.cover_letter) e.cover_letter = "Surat pengantar wajib diunggah.";
      if (!files.id_card) e.id_card = "Kartu identitas wajib diunggah.";
      if (!files.proposal) e.proposal = "Proposal wajib diunggah.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 3)); };
  const prevStep = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setShowConfirm(false);
    setSubmitting(true);

    let applicationId: number | null = null;

    try {
      // 1. Buat pengajuan terlebih dahulu
      const appRes = await api.post("/applications", {
        division_id: selectedDivision,
        ...formData,
      });
      applicationId = appRes.data.data?.id;

      if (!applicationId) throw new Error("Gagal mendapatkan ID pengajuan dari server.");

      // 2. Upload semua dokumen
      const fd = new FormData();
      if (files.cv) fd.append("cv", files.cv);
      if (files.cover_letter) fd.append("cover_letter", files.cover_letter);
      if (files.id_card) fd.append("id_card", files.id_card);
      if (files.proposal) fd.append("proposal", files.proposal);

      await api.post(`/applications/${applicationId}/documents`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toastSuccess("Pengajuan magang berhasil dikirim!");
      router.push("/status");
    } catch (err: any) {
      // Jika upload gagal, hapus pengajuan yang sudah terbuat agar tidak masuk ke admin
      if (applicationId) {
        try {
          await api.delete(`/applications/${applicationId}`);
        } catch {
          // Abaikan error rollback, tetap tampilkan error utama
        }
      }

      const message = err.response?.data?.message || err.message || "Gagal mengirim pengajuan.";
      toastError(`Pengajuan dibatalkan: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDiv = divisions.find((d) => d.id === selectedDivision);

  if (checkingEligibility) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Pengajuan Magang</h1>
        <p className="page-subtitle">Lengkapi 4 langkah berikut untuk mengajukan magang di Suara Surabaya Media.</p>
      </div>

      {/* Step Indicator */}
      <Card padding="md">
        <StepIndicator steps={steps} currentStep={step} />
      </Card>

      {/* ═══ Step 1: Pilih Divisi ═══ */}
      {step === 0 && (
        <div className="space-y-4">
          {errors.division && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4" /> {errors.division}
            </div>
          )}
          {divLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {divisions.map((div) => {
                const isSelected = selectedDivision === div.id;
                const isFull = div.is_locked || div.active_applicants >= div.max_quota;
                const isRejectedBefore = rejectedDivisionIds.includes(div.id);
                const isDisabled = isFull || isRejectedBefore;

                return (
                  <Card
                    key={div.id}
                    padding="md"
                    hover={!isDisabled}
                    onClick={isDisabled ? undefined : () => setSelectedDivision(div.id)}
                    className={cn(
                      "transition-all",
                      isDisabled && "opacity-60 cursor-not-allowed bg-surface-50",
                      isSelected && "ring-2 ring-primary-500 border-primary-400"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        isDisabled ? "bg-surface-100 dark:bg-slate-800" : isSelected ? "bg-primary-100 dark:bg-primary-950" : "bg-primary-50 dark:bg-primary-950/60"
                      )}>
                        {isFull ? (
                          <Lock className="w-5 h-5 text-surface-400 dark:text-slate-500" />
                        ) : isRejectedBefore ? (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-white truncate">{div.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {isRejectedBefore ? (
                            <span className="text-xs font-medium text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full">
                              Pernah Ditolak (Pilih divisi lain)
                            </span>
                          ) : isFull ? (
                            <>
                              <Users className="w-3.5 h-3.5 text-surface-400 dark:text-slate-400" />
                              <span className="text-xs font-medium text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full">Penuh</span>
                            </>
                          ) : (
                            <>
                              <Users className="w-3.5 h-3.5 text-surface-400 dark:text-slate-400" />
                              <span className="text-xs text-surface-500 dark:text-slate-300">
                                Sisa kuota: <span className="font-semibold text-primary-700 dark:text-primary-300">{div.max_quota - div.active_applicants}</span>/{div.max_quota}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ Step 2: Isi Data Diri ═══ */}
      {step === 1 && (
        <Card padding="lg">
          <h3 className="text-base font-semibold text-surface-900 mb-4">Data Diri Pemohon</h3>
          <div className="space-y-4">
            <div>
              <label className="label-base">Nama Institusi / Sekolah</label>
              <input value={formData.institution_name}
                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                className={`input-base ${errors.institution_name ? "input-error" : ""}`}
                placeholder="Contoh: UIN Sunan Ampel Surabaya" />
              {errors.institution_name && <p className="text-xs text-red-500 mt-1">{errors.institution_name}</p>}
            </div>
            <div>
              <label className="label-base">Program Studi / Jurusan</label>
              <input value={formData.study_program}
                onChange={(e) => setFormData({ ...formData, study_program: e.target.value })}
                className={`input-base ${errors.study_program ? "input-error" : ""}`}
                placeholder="Contoh: Sistem Informasi" />
              {errors.study_program && <p className="text-xs text-red-500 mt-1">{errors.study_program}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-base">Tanggal Mulai</label>
                <input type="date" value={formData.internship_start}
                  onChange={(e) => setFormData({ ...formData, internship_start: e.target.value })}
                  className={`input-base ${errors.internship_start ? "input-error" : ""}`} />
                {errors.internship_start && <p className="text-xs text-red-500 mt-1">{errors.internship_start}</p>}
              </div>
              <div>
                <label className="label-base">Tanggal Selesai</label>
                <input type="date" value={formData.internship_end}
                  onChange={(e) => setFormData({ ...formData, internship_end: e.target.value })}
                  className={`input-base ${errors.internship_end ? "input-error" : ""}`} />
                {errors.internship_end && <p className="text-xs text-red-500 mt-1">{errors.internship_end}</p>}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ═══ Step 3: Detail CV (Kualifikasi & Skills) ═══ */}
      {step === 2 && (
        <Card padding="lg">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-surface-900">Detail CV & Kualifikasi</h3>
            <p className="text-xs text-surface-500 mt-0.5">
              Informasi ini digunakan oleh algoritma penilaian Suara Surabaya Media untuk mengukur kecocokan keahlian Anda dengan divisi tujuan.
            </p>
          </div>

          <div className="space-y-4">
            {/* Card 1: Skills */}
            <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/30 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <label className="text-sm font-semibold text-surface-800">
                  Keahlian & Tools yang Dikuasai <span className="text-red-500">*</span>
                </label>
              </div>
              <p className="text-xs text-surface-500">
                Sebutkan skill teknis, aplikasi, atau kompetensi utama (pisahkan dengan koma).
              </p>
              <textarea
                rows={3}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className={`input-base !h-auto min-h-[80px] py-2.5 leading-relaxed resize-y ${errors.skills ? "input-error" : ""}`}
                placeholder="Contoh: Adobe Premiere Pro, Voice Over, Copywriting, DKV, Canva, Fotografi, Jurnalistik Berita, Figma..."
              />
              {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills}</p>}
            </div>

            {/* Card 2: Experience */}
            <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/30 space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <label className="text-sm font-semibold text-surface-800">
                  Pengalaman Organisasi / Kerja / Magang
                </label>
              </div>
              <p className="text-xs text-surface-500">
                Pengalaman kepanitiaan, himpunan mahasiswa, magang sebelumnya, atau pekerjaan lepas (freelance).
              </p>
              <textarea
                rows={4}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="input-base !h-auto min-h-[110px] py-2.5 leading-relaxed resize-y"
                placeholder="Contoh:&#10;- Reporter di Lembaga Pers Mahasiswa (2024 - 2025)&#10;- Koordinator Publikasi & Dokumentasi Event Kampus (2024)&#10;- Kontributor Artikel Berita Online"
              />
            </div>

            {/* Card 3: Projects */}
            <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/30 space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <label className="text-sm font-semibold text-surface-800">
                  Proyek & Karya Terbaik
                </label>
              </div>
              <p className="text-xs text-surface-500">
                Karya audio, video, tulisan artikel, desain grafis, sistem IT, atau kampanye yang pernah Anda buat.
              </p>
              <textarea
                rows={4}
                value={formData.projects}
                onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                className="input-base !h-auto min-h-[110px] py-2.5 leading-relaxed resize-y"
                placeholder="Contoh:&#10;- Membuat liputan video berita singkat UMKM Surabaya (15k views di TikTok)&#10;- Desain identitas visual (branding) & konten Instagram UKM&#10;- Memproduksi siaran podcast bertema edukasi anak muda"
              />
            </div>

            {/* Card 4: Portfolio Link */}
            <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/30 space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-semibold text-surface-800">
                  Tautan Portofolio / Hasil Karya (Opsional)
                </label>
              </div>
              <p className="text-xs text-surface-500">
                Tautan link Google Drive, Behance, GitHub, YouTube, LinkedIn, atau Media Sosial portofolio Anda.
              </p>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                className="input-base"
                placeholder="https://drive.google.com/... atau https://behance.net/username"
              />
            </div>
          </div>
        </Card>
      )}

      {/* ═══ Step 4: Unggah Dokumen ═══ */}
      {step === 3 && (
        <Card padding="lg">
          <h3 className="text-base font-semibold text-surface-900 mb-4">Unggah Berkas</h3>
          <div className="space-y-5">
            <UploadDropzone label="Curriculum Vitae (CV)" description="Format PDF, maks 2 MB"
              maxSize={2 * 1024 * 1024}
              accept={{ "application/pdf": [".pdf"] }}
              value={files.cv} onChange={(f) => setFiles({ ...files, cv: f })}
              error={errors.cv} />
            <UploadDropzone label="Surat Pengantar" description="Format PDF, maks 2 MB"
              maxSize={2 * 1024 * 1024}
              accept={{ "application/pdf": [".pdf"] }}
              value={files.cover_letter} onChange={(f) => setFiles({ ...files, cover_letter: f })}
              error={errors.cover_letter} />
            <UploadDropzone label="Kartu Identitas (KTP/KTM)" description="Format PDF atau JPG, maks 2 MB"
              maxSize={2 * 1024 * 1024}
              accept={{ "application/pdf": [".pdf"], "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
              value={files.id_card} onChange={(f) => setFiles({ ...files, id_card: f })}
              error={errors.id_card} />
            <UploadDropzone label="Proposal Magang" description="Format PDF, maks 10 MB"
              maxSize={10 * 1024 * 1024}
              accept={{ "application/pdf": [".pdf"] }}
              value={files.proposal} onChange={(f) => setFiles({ ...files, proposal: f })}
              error={errors.proposal} />
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={prevStep} disabled={step === 0}
          icon={<ChevronLeft className="w-4 h-4" />}>
          Kembali
        </Button>
        {step < 3 ? (
          <Button onClick={nextStep} icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
            Selanjutnya
          </Button>
        ) : (
          <Button onClick={() => { if (validateStep()) setShowConfirm(true); }}
            loading={submitting} icon={<Send className="w-4 h-4" />}
            disabled={!files.cv || !files.cover_letter || !files.id_card || !files.proposal}>
            Kirim Pengajuan
          </Button>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Konfirmasi Pengajuan"
        description="Pastikan data sudah benar sebelum mengirim."
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Batal</Button>
            <Button onClick={handleSubmit} loading={submitting}>Kirim Sekarang</Button>
          </>
        }>
        <div className="space-y-3 text-sm">
          <p><span className="font-medium text-surface-600">Divisi:</span> {selectedDiv?.name || "-"}</p>
          <p><span className="font-medium text-surface-600">Institusi:</span> {formData.institution_name}</p>
          <p><span className="font-medium text-surface-600">Prodi:</span> {formData.study_program}</p>
          <p><span className="font-medium text-surface-600">Keahlian (Skills):</span> {formData.skills || "-"}</p>
          {formData.portfolio_url && (
            <p><span className="font-medium text-surface-600">Portofolio:</span> {formData.portfolio_url}</p>
          )}
          <p><span className="font-medium text-surface-600">Periode:</span> {formData.internship_start} s/d {formData.internship_end}</p>
          <p><span className="font-medium text-surface-600">Dokumen:</span> {[files.cv?.name, files.cover_letter?.name, files.id_card?.name, files.proposal?.name].filter(Boolean).join(", ")}</p>
        </div>
      </Modal>
    </div>
  );
}
