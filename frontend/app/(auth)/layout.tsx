"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthSlider from "@/components/auth/AuthSlider";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="font-sans text-surface-900 dark:text-slate-100 min-h-screen flex bg-surface-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Left Side - 5-Second Automated Carousel Slider */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative">
        <AuthSlider />
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-10 min-h-screen bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          {/* Top Bar inside Auth Form Area: Mode Switcher */}
          <div className="flex justify-end mb-4">
            <ThemeToggle variant="pill" />
          </div>

          {/* Header & Suara Surabaya Logo */}
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <div className="p-3 mb-3">
              <img
                src="/images/logo.png"
                alt="Logo Suara Surabaya FM 100"
                className="h-14 sm:h-16 w-auto object-contain dark:filter dark:brightness-125 transition-all"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-1">
              E-Internship
            </h1>
            <p className="text-xs sm:text-sm text-surface-500 dark:text-slate-400 font-medium max-w-xs">
              Portal Pendaftaran & Seleksi Magang Suara Surabaya Media
            </p>
          </div>

          {/* Tab Navigation (Masuk / Daftar) */}
          <div className="flex w-full border-b border-surface-200 dark:border-slate-800 mb-6">
            <Link
              href="/login"
              className={`flex-1 pb-3 pt-2 text-center transition-all duration-200 focus:outline-none text-sm ${
                isLogin
                  ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400 font-bold"
                  : "border-b-2 border-transparent text-surface-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-slate-200"
              }`}
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className={`flex-1 pb-3 pt-2 text-center transition-all duration-200 focus:outline-none text-sm ${
                !isLogin
                  ? "border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400 font-bold"
                  : "border-b-2 border-transparent text-surface-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-slate-200"
              }`}
            >
              Daftar Akun Baru
            </Link>
          </div>

          {/* Form Content */}
          <div className="animate-fade-in">{children}</div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-surface-100 dark:border-slate-800/80 text-center">
            <p className="text-xs text-surface-400 dark:text-slate-500">
              © {new Date().getFullYear()} Suara Surabaya Media • Pusat Informasi & Radio Berita FM 100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
