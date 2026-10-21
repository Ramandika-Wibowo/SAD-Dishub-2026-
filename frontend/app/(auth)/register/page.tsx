"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import { toastSuccess, toastError } from "@/components/ui/Toast";
import type { ApplicantType, RegisterFormData } from "@/types";
import { Eye, EyeOff, User, Mail, Lock, Phone, GraduationCap, Building } from "lucide-react";

const applicantTypes: { value: ApplicantType; label: string }[] = [
  { value: "mahasiswa", label: "Mahasiswa Aktif" },
  { value: "slta", label: "Siswa SLTA / Sederajat" },
  { value: "fresh_graduate", label: "Fresh Graduate" },
  { value: "instansi", label: "Instansi / Perseorangan" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    applicant_type: "mahasiswa",
    institution_name: "",
    phone: "",
  });

  const set = (key: keyof RegisterFormData, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama lengkap wajib diisi.";
    if (!form.email.trim()) e.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid.";
    if (!form.password) e.password = "Password wajib diisi.";
    else if (form.password.length < 8) e.password = "Password minimal 8 karakter.";
    if (form.password !== form.password_confirmation) e.password_confirmation = "Konfirmasi password tidak cocok.";
    if (!form.institution_name.trim()) e.institution_name = "Nama institusi/kampus wajib diisi.";
    if (!form.phone.trim()) e.phone = "Nomor telepon/WhatsApp wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      toastSuccess("Registrasi berhasil! Selamat datang di Suara Surabaya.");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registrasi gagal. Silakan periksa formulir.";
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors) {
        const mapped: Record<string, string> = {};
        Object.entries(fieldErrors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setErrors(mapped);
      }
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ──────────────────────────────────────────────────────────
          MAIN HEADING (Styled after reference: "Create Account")
          ────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight">
          Create<br />Account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Daftar akun baru untuk mengikuti seleksi magang Suara Surabaya.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Masukkan nama lengkap Anda"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900 dark:focus:ring-white"
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-1 transition-all`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Alamat Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900 dark:focus:ring-white"
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-1 transition-all`}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Applicant Type & Phone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Jenis Pendaftar
            </label>
            <select
              value={form.applicant_type}
              onChange={(e) => set("applicant_type", e.target.value as ApplicantType)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-all cursor-pointer"
            >
              {applicantTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No. Telepon / WA
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+62 812..."
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900 dark:focus:ring-white"
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-1 transition-all`}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Institution Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Nama Universitas / Sekolah
          </label>
          <input
            type="text"
            value={form.institution_name}
            onChange={(e) => set("institution_name", e.target.value)}
            placeholder="Contoh: UIN Sunan Ampel Surabaya"
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.institution_name
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900 dark:focus:ring-white"
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-1 transition-all`}
          />
          {errors.institution_name && <p className="text-xs text-red-500">{errors.institution_name}</p>}
        </div>

        {/* Passwords Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="Min. 8 karakter"
                className={`w-full px-3.5 py-2.5 pr-9 rounded-xl border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900 dark:focus:ring-white"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-1 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Konfirmasi Sandi
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPw ? "text" : "password"}
                value={form.password_confirmation}
                onChange={(e) => set("password_confirmation", e.target.value)}
                placeholder="Ulangi sandi"
                className={`w-full px-3.5 py-2.5 pr-9 rounded-xl border ${
                  errors.password_confirmation
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900 dark:focus:ring-white"
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-1 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-xs text-red-500">{errors.password_confirmation}</p>
            )}
          </div>
        </div>

        {/* Primary Action Button: High Contrast "Sign up" */}
        <button
          type="submit"
          disabled={loading}
          className="btn-auth-primary mt-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Sign up</span>
          )}
        </button>

        {/* Link to Login */}
        <div className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-slate-900 dark:text-white hover:underline underline-offset-2 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
