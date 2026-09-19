"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCachedUser } from "@/lib/auth";
import api from "@/lib/axios";
import type { Application, Notification as NotifType, Division } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatDateTime } from "@/lib/utils";
import {
  Bell,
  ArrowRight,
  Upload,
  Search,
  CircleDot,
  UserCircle,
  FileCheck,
  ClipboardList,
  PartyPopper,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Deskripsi singkat per divisi (fallback jika tidak ada dari API)
const DIVISION_DESCRIPTIONS: Record<string, string> = {
  "Bidang Lalu Lintas": "Mengatur dan menganalisis manajemen lalu lintas kota.",
  "Bidang Angkutan": "Pengelolaan moda transportasi dan angkutan umum.",
  "Bidang Teknik Sarana": "Pemeliharaan dan pengujian sarana transportasi.",
  "Bidang Keselamatan": "Program keselamatan dan ketertiban berlalu lintas.",
  "Sekretariat": "Administrasi umum, kepegawaian, dan keuangan.",
};

const STEPS = [
  {
    icon: UserCircle,
    title: "Lengkapi Profil",
    desc: "Pastikan data diri, instansi, dan nomor telepon sudah terisi.",
    color: "bg-violet-100 text-violet-600",
    border: "border-violet-200",
  },
  {
    icon: Upload,
    title: "Unggah Dokumen",
    desc: "Upload CV, KTP, Surat Pengantar Kampus, dan Proposal.",
    color: "bg-blue-100 text-blue-600",
    border: "border-blue-200",
  },
  {
    icon: ClipboardList,
    title: "Tunggu Evaluasi",
    desc: "Admin akan meninjau berkas dan menjalankan sistem evaluasi.",
    color: "bg-amber-100 text-amber-600",
    border: "border-amber-200",
  },
  {
    icon: FileCheck,
    title: "Keputusan Admin",
    desc: "Kamu akan mendapat notifikasi hasil penerimaan magang.",
    color: "bg-emerald-100 text-emerald-600",
    border: "border-emerald-200",
  },
];

export default function ApplicantDashboardPage() {
  const user = getCachedUser();
  const [latestApp, setLatestApp] = useState<Application | null>(null);
  const [notifications, setNotifications] = useState<NotifType[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch applications & divisions secara parallel
        // Notifikasi TIDAK di-fetch di sini — sudah dihandle oleh Topbar
        const [appsRes, divsRes] = await Promise.all([
          api.get("/applications/my"),
          api.get("/divisions"),
        ]);

        const apps = appsRes.data.data?.data || appsRes.data.data || [];
        if (Array.isArray(apps) && apps.length > 0) setLatestApp(apps[0]);

        const divs = divsRes.data.data || divsRes.data || [];
        setDivisions(Array.isArray(divs) ? divs : []);

        // Baca notifikasi dari sessionStorage jika tersedia (di-set oleh Topbar)
        // Jika tidak ada, fetch langsung
        const cachedNotifs = sessionStorage.getItem("cached_notifications");
        if (cachedNotifs) {
          const parsed = JSON.parse(cachedNotifs);
          setNotifications(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
        } else {
          const notifsRes = await api.get("/notifications");
          const notifs = notifsRes.data.data?.data || notifsRes.data.data || [];
          setNotifications(Array.isArray(notifs) ? notifs.slice(0, 5) : []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cek apakah masa magang sebelumnya sudah selesai
  const isInternshipEnded =
    latestApp?.status === "accepted" &&
    (Boolean(latestApp.is_completed) ||
      (latestApp.internship_end &&
        new Date(latestApp.internship_end).getTime() < new Date().setHours(0, 0, 0, 0)));

  // Apakah pelamar boleh mengajukan magang?
  // Diizinkan jika belum pernah melamar ATAU status terakhir "rejected" ATAU magang sudah selesai
  const canApply = !latestApp || latestApp.status === "rejected" || isInternshipEnded;

  const quickActions = [
    {
      icon: Upload,
      title: canApply
        ? isInternshipEnded
          ? "Ajukan Magang Baru"
          : "Ajukan Magang"
        : "Anda Telah Mendaftar",
      desc: canApply
        ? isInternshipEnded
          ? "Masa magang selesai, daftar periode baru"
          : "Pilih divisi dan unggah berkas"
        : latestApp?.status === "accepted"
        ? "Masa magang sedang berlangsung"
        : "Pengajuan sedang diproses",
      href: canApply ? "/apply" : "#",
      color: canApply ? "bg-primary-50 text-primary-600" : "bg-surface-100 text-surface-400",
      disabled: !canApply,
    },
    {
      icon: Search,
      title: "Lacak Status",
      desc: "Pantau proses pengajuan",
      href: "/status",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Bell,
      title: "Notifikasi",
      desc: `${notifications.filter((n) => !n.is_read).length || 0} belum dibaca`,
      href: "#notifications",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  // Tentukan step aktif berdasarkan status aplikasi.
  // Return 4 saat accepted/rejected agar SEMUA 4 step memenuhi: idx < activeStep → isDone=true
  const getActiveStep = () => {
    if (!latestApp) return 0;
    if (latestApp.status === "pending") return 1;
    if (latestApp.status === "reviewing") return 2;
    if (latestApp.status === "accepted" || latestApp.status === "rejected") return 4;
    return 3;
  };
  const activeStep = getActiveStep();
  const isRejected = latestApp?.status === "rejected";

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <SkeletonCard />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <Card padding="lg" className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 border-0 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary-200 text-sm font-medium">Portal Internship • Suara Surabaya</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Halo, {user?.name?.split(" ")[0] || "Pemohon"}! 👋
          </h2>
          <p className="text-primary-100 mt-2 text-sm sm:text-base">
            Selamat datang di E-Internship Suara Surabaya Media.
          </p>
          {latestApp && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-primary-200 text-sm">Status pengajuan terakhir:</span>
              {isInternshipEnded ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-100 border border-emerald-400/30 backdrop-blur-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Selesai Magang (Alumni)
                </span>
              ) : (
                <StatusBadge status={latestApp.status} variant="light" />
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Re-apply Announcement for Completed Interns */}
      {isInternshipEnded && (
        <Card padding="md" className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Masa Magang Sebelumnya Telah Selesai!</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Terima kasih atas kontribusi Anda. Akun Anda siap untuk mengajukan program magang periode berikutnya.
                </p>
              </div>
            </div>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shrink-0 shadow-sm"
            >
              Ajukan Magang Baru
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const isDisabled = 'disabled' in action && action.disabled;
          const content = (
            <Card hover={!isDisabled} padding="md" className={`h-full group ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${action.color} transition-transform ${isDisabled ? '' : 'group-hover:scale-110'}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-semibold ${isDisabled ? 'text-surface-400 dark:text-slate-500' : 'text-surface-900 dark:text-white'}`}>{action.title}</h3>
                    {!isDisabled && <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-primary-500 transition-all group-hover:translate-x-1" />}
                  </div>
                  <p className="text-xs text-surface-500 dark:text-slate-300 mt-0.5">{action.desc}</p>
                </div>
              </div>
            </Card>
          );
          if (isDisabled) {
            return <div key={action.title}>{content}</div>;
          }
          return (
            <Link key={action.title} href={action.href}>
              {content}
            </Link>
          );
        })}
      </div>

      {/* Notifications */}
      <div id="notifications">
        <Card padding="none">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-semibold text-surface-900 dark:text-white">Notifikasi Terbaru</h3>
            </div>
            <span className="text-xs text-surface-400 dark:text-slate-400">{notifications.length} notifikasi</span>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-10 h-10 text-surface-200 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-surface-400 dark:text-slate-400">Belum ada notifikasi.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`px-5 py-3.5 flex gap-3 transition-colors ${!n.is_read ? "bg-primary-50/30 dark:bg-primary-950/20" : ""}`}>
                  <div className="mt-1.5 shrink-0">
                    <CircleDot className={`w-3 h-3 ${n.is_read ? "text-surface-300 dark:text-slate-600" : "text-primary-500"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-surface-800 dark:text-white">{n.title}</p>
                    <p className="text-xs text-surface-500 dark:text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[11px] text-surface-400 dark:text-slate-400 mt-1">{formatDateTime(n.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Alur Pendaftaran */}
      <Card padding="lg">
        <div className="flex items-center gap-2 mb-5">
          <PartyPopper className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-semibold text-surface-900 dark:text-white">Alur Pendaftaran Magang</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {STEPS.map((step, idx) => {
            const isDone = idx < activeStep;
            const isActive = idx === activeStep;
            const isLastStep = idx === STEPS.length - 1;
            // Step terakhir merah saat ditolak, hijau saat diterima
            const isRejectedStep = isDone && isLastStep && isRejected;

            const doneBg    = isRejectedStep ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900"       : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900";
            const doneIcon  = isRejectedStep ? "bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300"        : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300";
            const doneBadge = isRejectedStep ? "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200"        : "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200";
            const doneText  = isRejectedStep ? "text-red-700 dark:text-red-200"                   : "text-emerald-700 dark:text-emerald-200";
            const doneIcon2 = isRejectedStep ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />;

            return (
              <div key={step.title} className="relative">
                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+22px)] right-0 h-0.5 bg-surface-100 dark:bg-slate-800 z-0" />
                )}
                <div className={`relative z-10 rounded-2xl border p-4 transition-all ${
                  isDone
                    ? `${doneBg}`
                    : isActive
                    ? `${step.border} bg-white dark:bg-slate-900 shadow-sm`
                    : "bg-surface-50 dark:bg-slate-900/60 border-surface-100 dark:border-slate-800"
                }`}>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isDone ? doneIcon : isActive ? step.color : "bg-surface-100 dark:bg-slate-800 text-surface-400 dark:text-slate-500"
                    }`}>
                      {isDone ? doneIcon2 : <step.icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                          isDone ? doneBadge : isActive ? "bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300" : "bg-surface-100 dark:bg-slate-800 text-surface-400 dark:text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <p className={`text-sm font-semibold ${
                          isDone ? doneText : isActive ? "text-surface-900 dark:text-white" : "text-surface-400 dark:text-slate-400"
                        }`}>{step.title}</p>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDone || isActive ? "text-surface-500 dark:text-slate-300" : "text-surface-300 dark:text-slate-500"}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Divisi Tersedia */}
      <Card padding="none">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            <h3 className="text-base font-semibold text-surface-900 dark:text-white">Divisi Tersedia</h3>
          </div>
          <span className="text-xs text-surface-400 dark:text-slate-400">{divisions.length} divisi</span>
        </div>
        <div className="divide-y divide-surface-50 dark:divide-slate-800">
          {divisions.length === 0 ? (
            <div className="py-10 text-center">
              <Users className="w-10 h-10 text-surface-200 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-surface-400 dark:text-slate-400">Belum ada divisi tersedia.</p>
            </div>
          ) : (
            divisions.map((div) => {
              const pct = div.max_quota > 0 ? Math.min((div.active_applicants / div.max_quota) * 100, 100) : 0;
              const isFull = div.is_locked || div.remaining_quota <= 0;
              const desc = DIVISION_DESCRIPTIONS[div.name] || "Divisi kerja di Suara Surabaya Media.";
              return (
                <div key={div.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-surface-800 dark:text-white truncate">{div.name}</p>
                      {isFull ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 shrink-0">
                          <XCircle className="w-3 h-3" /> Penuh
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Tersedia
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-surface-400 dark:text-slate-300 mb-2">{desc}</p>
                    {/* Progress bar kuota */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isFull ? "bg-red-400" : pct > 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-surface-400 dark:text-slate-400 shrink-0">
                        {div.active_applicants}/{div.max_quota} kuota
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
