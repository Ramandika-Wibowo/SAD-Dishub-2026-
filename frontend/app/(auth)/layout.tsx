"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Radio, Building2, Users, ArrowRight } from "lucide-react";

// The 3 existing images provided by the user with distinctive text
const authImages = [
  {
    id: "studio",
    title: "Studio FM 100",
    tag: "BROADCASTING STUDIO FM 100",
    headline: "Jurnalisme Cepat, Solutif & Terpercaya di Era Penyiaran Digital",
    subtitle:
      "Pengalaman siaran profesional dengan standar radio berita nomor satu di Jawa Timur, menyuarakan dinamika masyarakat sejak 1983.",
    src: "/images/slider/slide2.png",
  },
  {
    id: "students",
    title: "Mahasiswa Magang",
    tag: "KOLABORASI PENDIDIKAN & MAGANG",
    headline: "Wadah Berkarya Nyata & Kolaborasi Talenta Muda Akademisi",
    subtitle:
      "Membuka kesempatan berharga bagi mahasiswa dan akademisi untuk terjun langsung mempraktikkan keilmuan di industri media massa.",
    src: "/images/slider/slide3.jpg",
  },
  {
    id: "building",
    title: "Gedung SS Centre",
    tag: "SUARA SURABAYA CENTRE",
    headline: "Pusat Inovasi & Hub Ekosistem Media Modern Terpadu",
    subtitle:
      "Gedung modern di Jl. Raya Bukit Darmo sebagai hub ekosistem penyiaran, media digital, dan layanan informasi publik terdepan.",
    src: "/images/slider/slide1.jpg",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  // Default image: Studio for Login, Mahasiswa for Register
  const [activeImg, setActiveImg] = useState(isLogin ? 0 : 1);
  const [isPaused, setIsPaused] = useState(false);

  // Update default when route changes
  useEffect(() => {
    setActiveImg(isLogin ? 0 : 1);
  }, [isLogin]);

  // 5-second automatic image rotation
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % authImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = authImages[activeImg];

  return (
    <div className="min-h-screen w-full bg-[#E5E9EE] dark:bg-[#070D12] text-slate-900 dark:text-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans transition-colors duration-300">
      {/* ──────────────────────────────────────────────────────────
          MAIN SHELL CONTAINER (Curved card with organic S-wave)
          ────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-7xl min-h-[720px] lg:h-[840px] bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[36px] shadow-[0_25px_70px_rgba(15,23,42,0.18)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col lg:flex-row border border-slate-200/80 dark:border-slate-800">

        {/* ══════════════════════════════════════════════════════════
            LEFT SIDE: FULL-BLEED IMAGE WITH S-CURVE WAVE DIVIDER
            ══════════════════════════════════════════════════════════ */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full lg:w-[56%] xl:w-[58%] min-h-[360px] lg:min-h-full overflow-hidden bg-slate-900 flex flex-col justify-between"
        >
          {/* Background Images with smooth fade */}
          {authImages.map((img, idx) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                activeImg === idx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
              />
            </div>
          ))}

          {/* Dark Cinematic Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35 z-[1]" />

          {/* Geometric Dark Circle Silhouette (as in reference mockup) */}
          <div className="absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-black/45 backdrop-blur-[1px] pointer-events-none z-[2] border border-white/5" />

          {/* Concentric Thin Arcs at Bottom-Left (as in reference mockup) */}
          <div className="absolute -bottom-8 -left-8 pointer-events-none select-none z-[3]">
            <svg className="w-56 h-56 sm:w-72 sm:h-72 text-white" viewBox="0 0 200 200" fill="none">
              <circle cx="0" cy="200" r="185" stroke="currentColor" strokeWidth="1.2" className="opacity-15" />
              <circle cx="0" cy="200" r="155" stroke="currentColor" strokeWidth="1.2" className="opacity-25" />
              <circle cx="0" cy="200" r="125" stroke="currentColor" strokeWidth="1.5" className="opacity-35" />
              <circle cx="0" cy="200" r="95" stroke="currentColor" strokeWidth="1.8" className="opacity-50" />
            </svg>
          </div>

          {/* Top Brand Tag inside Left Image - Resized bigger per user request */}
          <div className="relative z-10 p-6 sm:p-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="h-12 sm:h-14 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md flex items-center shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                <img
                  src="/images/logo.png"
                  alt="Suara Surabaya FM 100"
                  className="h-8 sm:h-9 w-auto object-contain transition-all"
                />
              </div>
              <span className="hidden sm:inline-block text-xs sm:text-sm font-extrabold tracking-widest uppercase text-white bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 shadow-md">
                E-INTERNSHIP
              </span>
            </Link>
          </div>

          {/* Main Hero Headline Text Overlay (Different text per image) */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-12 py-8 sm:py-12 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase mb-4 border border-white/20 shadow-sm transition-all">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              {currentSlide.tag}
            </span>

            <h2
              key={`title-${currentSlide.id}`}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-md animate-fade-in transition-all"
            >
              {currentSlide.headline}
            </h2>

            <p
              key={`sub-${currentSlide.id}`}
              className="mt-3.5 text-xs sm:text-sm lg:text-base text-white/85 font-medium max-w-md leading-relaxed animate-fade-in transition-all"
            >
              {currentSlide.subtitle}
            </p>

            {/* Interactive Image Selector Tabs with 5-Second Active Indicator */}
            <div className="mt-8 flex items-center gap-2.5 flex-wrap">
              {authImages.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImg(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-300 relative overflow-hidden flex items-center gap-2 ${
                    activeImg === idx
                      ? "bg-white text-slate-900 shadow-xl scale-105 font-bold"
                      : "bg-black/40 hover:bg-black/60 text-white/80 border border-white/15"
                  }`}
                >
                  {activeImg === idx && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  )}
                  <span>{img.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Organic S-Curve Wave SVG Divider (Right edge of left image, spilling over image) */}
          <svg
            className="hidden lg:block absolute top-0 -right-[1px] h-full w-28 xl:w-40 z-20 pointer-events-none fill-white dark:fill-slate-900 transition-colors duration-300"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Smooth triple-lobe organic S-curve matching user reference mockup */}
            <path d="M100,0 L50,0 C20,14 6,26 8,40 C10,54 75,56 80,68 C86,78 16,82 14,90 C12,96 45,100 100,100 Z" />
          </svg>
        </div>

        {/* ══════════════════════════════════════════════════════════
            RIGHT SIDE: CLEAN WHITE FORM CONTAINER WITH WAVE DIVIDER
            ══════════════════════════════════════════════════════════ */}
        <div className="relative w-full lg:w-[44%] xl:w-[42%] bg-white dark:bg-slate-900 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Top Bar on Form Side: Minimalist Menu & Theme Toggle */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <Link
              href={isLogin ? "/register" : "/login"}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              {isLogin ? "Daftar Akun Baru" : "Masuk ke Akun"} <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle variant="pill" />
            </div>
          </div>

          {/* Dynamic Content (Login Form or Register Form) */}
          <div className="relative z-10 my-auto py-2">
            {children}
          </div>

          {/* Footer note on right side */}
          <div className="relative z-10 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>© {new Date().getFullYear()} Suara Surabaya</span>
            <a
              href="https://www.suarasurabaya.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors font-mono"
            >
              suarasurabaya.net
            </a>
          </div>

          {/* Concentric Circle Motif in Bottom-Right Corner (Exact match to reference mockup) */}
          <div className="absolute -bottom-8 -right-8 pointer-events-none select-none z-0">
            <svg
              className="w-44 h-44 sm:w-56 sm:h-56 text-slate-900 dark:text-white transition-colors duration-300"
              viewBox="0 0 200 200"
              fill="none"
            >
              {/* Radiating concentric outline arcs */}
              <circle cx="200" cy="200" r="185" stroke="currentColor" strokeWidth="1.2" className="opacity-15 dark:opacity-20" />
              <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="1.2" className="opacity-25 dark:opacity-30" />
              <circle cx="200" cy="200" r="135" stroke="currentColor" strokeWidth="1.5" className="opacity-40 dark:opacity-45" />
              <circle cx="200" cy="200" r="110" stroke="currentColor" strokeWidth="1.8" className="opacity-60 dark:opacity-70" />
              {/* Solid dark quarter circle quadrant in the corner */}
              <path d="M200,200 L115,200 A85,85 0 0,0 200,115 Z" fill="currentColor" className="opacity-95 dark:opacity-95" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
