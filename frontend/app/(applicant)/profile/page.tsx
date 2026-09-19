"use client";

import React, { useState, useEffect } from "react";
import { getCachedUser, saveUser } from "@/lib/auth";
import api from "@/lib/axios";
import { toastSuccess, toastError } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import { formatDate, formatApplicantType, getInitials } from "@/lib/utils";
import {
  User,
  Phone,
  Building,
  Mail,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(getCachedUser());
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    institution_name: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        institution_name: user.institution_name || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/me", form);
      const updatedUser = res.data.data?.user || res.data.data;

      // Update local storage and state
      if (updatedUser) {
        saveUser(updatedUser);
        setUser(updatedUser);
      }

      toastSuccess("Profil berhasil diperbarui!");
    } catch (err: any) {
      toastError(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="page-header mb-6">
        <h1 className="page-title">Profil Saya</h1>
        <p className="page-subtitle">Kelola informasi data diri, kontak, dan detail akun Anda.</p>
      </div>

      {/* Main Profile Frame Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card dark:shadow-none border border-surface-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header Profile Banner */}
        <div className="bg-slate-50/80 dark:bg-slate-800/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-surface-200 dark:border-slate-800">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-md text-white font-bold text-2xl sm:text-3xl shrink-0 ring-4 ring-white dark:ring-slate-800">
            {getInitials(user.name)}
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white truncate">
              {user.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800/60">
                <GraduationCap className="w-3.5 h-3.5" />
                {formatApplicantType(user.applicant_type)}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                <CheckCircle2 className="w-3 h-3" /> Akun Aktif
              </span>
            </div>
            <p className="text-sm text-surface-500 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 mt-3">
              <Mail className="w-4 h-4 text-surface-400 dark:text-slate-400 shrink-0" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Data Diri yang Dapat Diubah */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-surface-100 dark:border-slate-800">
              <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-surface-800 dark:text-white">
                Data Pribadi & Kontak
              </h3>
            </div>

            <div className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="label-base text-surface-800 dark:text-white">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 dark:text-slate-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-base pl-10"
                    placeholder="Nama lengkap Anda"
                    required
                  />
                </div>
              </div>

              {/* Grid: Telepon & Institusi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-base text-surface-800 dark:text-white">Nomor Telepon / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 dark:text-slate-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-base pl-10"
                      placeholder="Contoh: 081234567890"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label-base text-surface-800 dark:text-white">Nama Institusi / Sekolah</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 dark:text-slate-400" />
                    <input
                      type="text"
                      value={form.institution_name}
                      onChange={(e) => setForm({ ...form, institution_name: e.target.value })}
                      className="input-base pl-10"
                      placeholder="Nama instansi pendidikan"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tabel Informasi Akun Sistem (Read-only) */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-surface-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-surface-800 dark:text-white">
                Informasi Akun Sistem (Permanen)
              </h3>
            </div>

            {/* Clean & perfectly aligned information table */}
            <div className="rounded-xl border border-surface-200 dark:border-slate-800 bg-surface-50/70 dark:bg-slate-800/40 divide-y divide-surface-200 dark:divide-slate-800 overflow-hidden">
              <div className="px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-medium text-surface-600 dark:text-slate-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-surface-400 dark:text-slate-400" />
                  Alamat Email
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-900 dark:text-white">
                    {user.email}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    Terverifikasi
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-medium text-surface-600 dark:text-slate-300 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-surface-400 dark:text-slate-400" />
                  Jenis Pendaftar
                </span>
                <span className="text-sm font-semibold text-surface-900 dark:text-white">
                  {formatApplicantType(user.applicant_type)}
                </span>
              </div>

              <div className="px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-medium text-surface-600 dark:text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-surface-400 dark:text-slate-400" />
                  Terdaftar Sejak
                </span>
                <span className="text-sm font-semibold text-surface-900 dark:text-white">
                  {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Form Footer Action */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-100 dark:border-slate-800">
            <Button type="submit" loading={loading} icon={<Save className="w-4 h-4" />}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
