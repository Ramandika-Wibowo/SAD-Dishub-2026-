"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import type { Application } from "@/types";
import Card from "@/components/ui/Card";
import { StatusBadge, RuleBadge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  FileCheck,
  Hourglass,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Info,
  History,
} from "lucide-react";

export default function StatusPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    api.get("/applications/my")
      .then((res) => {
        const list: Application[] = res.data.data?.data || res.data.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setApps(list);
        } else {
          setEmpty(true);
        }
      })
      .catch(() => setEmpty(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <SkeletonCard /><SkeletonCard /><SkeletonCard />
    </div>
  );

  const app = apps[selectedIndex] || null;

  if (empty || !app) return (
    <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in">
      <FileCheck className="w-16 h-16 text-surface-200 mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-surface-700">Belum Ada Pengajuan</h2>
      <p className="text-sm text-surface-400 mt-1 mb-6">Anda belum mengajukan magang. Mulai sekarang!</p>
      <Link href="/apply" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-700 text-white rounded-lg font-medium text-sm hover:bg-primary-800 transition-colors">
        Ajukan Magang
      </Link>
    </div>
  );

  const isEvaluated = app.r1_passed !== null;
  const isDecided = app.status === "accepted" || app.status === "rejected";

  const isInternshipEnded =
    app.status === "accepted" &&
    (Boolean(app.is_completed) ||
      (app.internship_end &&
        new Date(app.internship_end).getTime() < new Date().setHours(0, 0, 0, 0)));

  // Timeline nodes
  const nodes = [
    {
      key: "submitted",
      icon: FileCheck,
      title: "Berkas Diterima",
      time: formatDateTime(app.created_at),
      active: true,
      completed: true,
    },
    {
      key: "evaluating",
      icon: Hourglass,
      title: "Sedang Dievaluasi",
      time: isEvaluated ? "Evaluasi selesai" : "Menunggu proses admin",
      active: app.status !== "pending",
      completed: isEvaluated,
    },
    {
      key: "decided",
      icon: isInternshipEnded
        ? CheckCircle2
        : app.status === "accepted"
        ? CheckCircle2
        : app.status === "rejected"
        ? XCircle
        : Clock,
      title: isInternshipEnded ? "Masa Magang Selesai" : "Keputusan Akhir",
      time: isInternshipEnded
        ? `Selesai pada ${formatDate(app.internship_end)}`
        : isDecided
        ? formatDateTime(app.updated_at)
        : "Belum diputuskan",
      active: isDecided,
      completed: isDecided,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Status Pengajuan</h1>
          <p className="page-subtitle">Pantau perkembangan pengajuan magang Anda.</p>
        </div>

        {/* History Switcher if multiple applications exist */}
        {apps.length > 1 && (
          <div className="flex items-center gap-2 bg-surface-100 p-1 rounded-xl text-xs">
            <History className="w-3.5 h-3.5 text-surface-500 ml-2" />
            <span className="font-semibold text-surface-600">Riwayat:</span>
            <div className="flex gap-1 overflow-x-auto">
              {apps.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const ended =
                  item.status === "accepted" &&
                  (Boolean(item.is_completed) ||
                    (item.internship_end &&
                      new Date(item.internship_end).getTime() < new Date().setHours(0, 0, 0, 0)));
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      isSelected
                        ? "bg-white text-primary-700 shadow-xs font-semibold"
                        : "text-surface-500 hover:text-surface-800"
                    }`}
                  >
                    #{apps.length - idx} {item.division?.name?.replace("Bidang ", "") || "Divisi"}
                    {ended ? " (Alumni)" : idx === 0 ? " (Terbaru)" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <Card padding="lg">
        <div className="space-y-0">
          {nodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <div key={node.key} className="flex gap-4">
                {/* Line & Dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    node.completed ? "bg-primary-700 border-primary-700 text-white" :
                    node.active ? "bg-white border-primary-400 text-primary-600" :
                    "bg-surface-100 border-surface-300 text-surface-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {i < nodes.length - 1 && (
                    <div className={`w-0.5 h-12 my-1 ${node.completed ? "bg-primary-700" : "bg-surface-200"}`} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6 pt-1.5">
                  <p className={`text-sm font-semibold ${node.active ? "text-surface-900" : "text-surface-400"}`}>
                    {node.title}
                  </p>
                  <p className="text-xs text-surface-400 mt-0.5">{node.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Rule Results (after algorithm executed) */}
      {isEvaluated && (
        <Card padding="lg">
          <h3 className="text-sm font-semibold text-surface-900 mb-3">Hasil Evaluasi Algoritma</h3>
          <div className="flex flex-wrap gap-2">
            <RuleBadge passed={app.r1_passed} label="R1 Dokumen" />
            <RuleBadge passed={app.r3_passed} label="R3 Kuota" />
            <RuleBadge passed={app.r4_passed} label="R4 Kesesuaian" />
          </div>
          {app.algorithm_score !== null && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-surface-500">Skor Algoritma:</span>
              <span className="text-sm font-bold text-primary-700">{app.algorithm_score}/100</span>
              <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden max-w-[200px]">
                <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${app.algorithm_score}%` }} />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Decision Card */}
      <Card padding="lg" className={
        isInternshipEnded ? "bg-teal-50 border-teal-200" :
        app.status === "accepted" ? "bg-emerald-50 border-emerald-200" :
        app.status === "rejected" ? "bg-red-50 border-red-200" :
        "bg-blue-50 border-blue-200"
      }>
        <div className="flex items-start gap-3">
          {isInternshipEnded ? (
            <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
          ) : app.status === "accepted" ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : app.status === "rejected" ? (
            <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-semibold ${
              isInternshipEnded ? "text-teal-900" :
              app.status === "accepted" ? "text-emerald-800" :
              app.status === "rejected" ? "text-red-800" :
              "text-blue-800"
            }`}>
              {isInternshipEnded ? "Masa Magang Telah Selesai 🎓" :
               app.status === "accepted" ? "Pengajuan Diterima! 🎉" :
               app.status === "rejected" ? "Pengajuan Ditolak" :
               "Pengajuan Sedang Diproses"}
            </h3>

            {/* Info Penempatan */}
            {app.status === "accepted" && app.recommended_division && (
              <div className="flex items-center gap-1.5 mt-2 text-sm text-emerald-700">
                <MapPin className="w-4 h-4" />
                <span>Penempatan: <strong>{app.recommended_division.name}</strong></span>
              </div>
            )}

            {/* Info Periode Magang */}
            {app.status === "accepted" && app.internship_start && app.internship_end && (
              <div className="flex items-center gap-1.5 mt-1 text-sm text-surface-600">
                <Calendar className="w-4 h-4" />
                <span>Periode: <strong>{formatDate(app.internship_start)}</strong> s/d <strong>{formatDate(app.internship_end)}</strong></span>
              </div>
            )}

            {/* Status Selesai / Alumni Message & Re-apply button */}
            {isInternshipEnded && (
              <div className="mt-3 pt-3 border-t border-teal-200/60">
                <p className="text-xs text-teal-800 leading-relaxed">
                  Selamat atas terselesaikannya seluruh rangkaian kegiatan magang di Suara Surabaya Media. Anda dipersilakan mendaftar kembali untuk periode selanjutnya jika ingin mengikuti program magang baru.
                </p>
                <div className="mt-3">
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    Ajukan Magang Baru
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Rejection Message & Re-apply to other division button */}
            {app.status === "rejected" && (
              <div className="mt-2 text-sm text-red-700">
                {app.rejection_reason && (
                  <div>
                    <p className="font-medium">Alasan Penolakan:</p>
                    <p className="mt-0.5 text-xs text-red-600">{app.rejection_reason}</p>
                  </div>
                )}
                <div className="mt-3">
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    Ajukan ke Divisi Lain
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {(app.status === "pending" || app.status === "reviewing") && (
              <p className="mt-1 text-sm text-blue-700">
                Sedang diproses oleh admin. Harap tunggu notifikasi selanjutnya.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
