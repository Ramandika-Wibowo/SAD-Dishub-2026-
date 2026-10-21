"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login, getRoleDashboardPath, getRememberedEmail } from "@/lib/auth";
import { toastSuccess, toastError } from "@/components/ui/Toast";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill remembered email on page load
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setForm((prev) => ({ ...prev, email: remembered }));
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid.";
    if (!form.password) e.password = "Kata sandi wajib diisi.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login(form, rememberMe);
      toastSuccess(`Selamat datang, ${data.user.name}!`);
      const dest = redirect || getRoleDashboardPath(data.role);
      router.push(dest);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Email atau kata sandi tidak valid.";
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ──────────────────────────────────────────────────────────
          MAIN HEADING (Exact styling from reference: "Welcome Back")
          ────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.05] tracking-tight">
          Welcome<br />Back
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Masuk ke akun E-Internship Suara Surabaya Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900 dark:focus:ring-white"
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-1 transition-all`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 pr-11 rounded-xl border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900 dark:focus:ring-white"
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-1 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 focus:outline-none transition-colors"
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>
          )}
        </div>

        {/* Remember me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:checked:bg-white cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toastError("Silakan hubungi admin redaksi Suara Surabaya untuk bantuan akun.");
            }}
            className="font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Forgot Password
          </Link>
        </div>

        {/* Primary Action Button: High Contrast "Sign in" */}
        <button
          type="submit"
          disabled={loading}
          className="btn-auth-primary mt-2"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Sign in</span>
          )}
        </button>

        {/* Link to Register */}
        <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-slate-900 dark:text-white hover:underline underline-offset-2 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
