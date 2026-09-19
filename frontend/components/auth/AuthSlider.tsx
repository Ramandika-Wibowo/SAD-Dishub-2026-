"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Radio, Sparkles, Building2, Users } from "lucide-react";

interface SlideData {
  src: string;
  tag: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: SlideData[] = [
  {
    src: "/images/slider/slide1.jpg",
    tag: "SUARA SURABAYA CENTRE",
    icon: <Building2 className="w-3.5 h-3.5" />,
    title: "Pusat Inovasi & Kolaborasi Media",
    description:
      "Gedung modern Suara Surabaya Centre di Jl. Raya Bukit Darmo sebagai hub ekosistem penyiaran, media digital, dan layanan publik terpadu.",
  },
  {
    src: "/images/slider/slide2.png",
    tag: "BROADCASTING STUDIO FM 100",
    icon: <Radio className="w-3.5 h-3.5" />,
    title: "Jurnalisme Cepat, Solutif & Terpercaya",
    description:
      "Pengalaman siaran profesional dengan standar radio berita nomor satu di Jawa Timur, menyuarakan dinamika masyarakat sejak 1983.",
  },
  {
    src: "/images/slider/slide3.jpg",
    tag: "KOLABORASI PENDIDIKAN & MAGANG",
    icon: <Users className="w-3.5 h-3.5" />,
    title: "Wadah Berkarya Talenta Muda",
    description:
      "Membuka kesempatan berharga bagi mahasiswa dan akademisi untuk terjun langsung mempraktikkan keilmuan di industri media massa terkemuka.",
  },
];

export default function AuthSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isPaused]);

  return (
    <div
      className="relative w-full h-full min-h-[560px] lg:min-h-screen overflow-hidden select-none bg-slate-950 flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Cross-fade */}
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Image */}
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-7000 ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
              style={{ backgroundImage: `url('${slide.src}')` }}
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/30" />
            {/* Suara Surabaya Blue Accent Glow */}
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
          </div>
        );
      })}

      {/* Top Bar: Brand Frequency Badge */}
      <div className="relative z-20 p-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>FM 100 MHz • SUARA SURABAYA MEDIA</span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-20 p-8 sm:p-12 mt-auto">
        <div className="max-w-xl space-y-4">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/95 text-white text-[11px] font-bold tracking-wider uppercase shadow-sm">
            {slides[current].icon}
            <span>{slides[current].tag}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            {slides[current].title}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed drop-shadow">
            {slides[current].description}
          </p>

          {/* Controls: Indicators & Navigation */}
          <div className="pt-4 flex items-center justify-between gap-4">
            {/* Slide Progress Indicators */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => {
                const isActive = idx === current;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className="group py-2 focus:outline-none"
                    title={`Slide ${idx + 1}`}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-10 bg-blue-500 shadow-sm shadow-blue-500/50"
                          : "w-2.5 bg-white/30 group-hover:bg-white/60"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Prev/Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
