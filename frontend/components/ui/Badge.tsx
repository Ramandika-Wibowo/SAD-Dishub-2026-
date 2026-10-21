"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { ApplicationStatus, Application } from "@/types";
import { formatStatus, getStatusColor, getApplicationRecommendation } from "@/lib/utils";

// ─── Generic Badge ─────────────────────────────────

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-surface-100 dark:bg-slate-800 text-surface-600 dark:text-white border border-transparent dark:border-slate-700",
  primary: "bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-transparent dark:border-primary-800/40",
  success: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-transparent dark:border-emerald-800/40",
  warning: "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-transparent dark:border-amber-800/40",
  danger: "bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-transparent dark:border-red-800/40",
  info: "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-transparent dark:border-blue-800/40",
};

const dotVariants: Record<BadgeVariant, string> = {
  default: "bg-surface-400",
  primary: "bg-primary-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotVariants[variant])} />
      )}
      {children}
    </span>
  );
}

// ─── Status Badge (Specialized) ────────────────────

interface StatusBadgeProps {
  status: ApplicationStatus | "locked";
  variant?: "default" | "light";
  className?: string;
}

export function StatusBadge({ status, variant = "default", className }: StatusBadgeProps) {
  const colors = getStatusColor(status);
  const label = status === "locked" ? "Terkunci" : formatStatus(status as ApplicationStatus);
  const isLight = variant === "light";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap",
        isLight ? "bg-white/15 text-white border border-white/30" : [colors.bg, colors.text],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isLight ? "bg-white" : colors.dot)} />
      {label}
    </span>
  );
}

// ─── Rule Badge ────────────────────────────────────

interface RuleBadgeProps {
  passed?: boolean | null;
  label: string;
  className?: string;
}

export function RuleBadge({ passed, label, className }: RuleBadgeProps) {
  const variant = passed == null ? "default" : passed ? "success" : "danger";

  return (
    <Badge variant={variant} dot size="sm" className={className}>
      {label}: {passed == null ? "Pending" : passed ? "Lolos" : "Gagal"}
    </Badge>
  );
}

// ─── Recommendation Badge (Decision Support) ───────

interface RecommendationBadgeProps {
  app: Application | undefined | null;
  className?: string;
}

export function RecommendationBadge({ app, className }: RecommendationBadgeProps) {
  const rec = getApplicationRecommendation(app);

  if (rec.type === "unevaluated") {
    return (
      <span className={cn("text-xs text-surface-400 dark:text-slate-500 italic", className)}>
        Belum dievaluasi
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1 items-start", className)}>
      <Badge
        variant={rec.type === "recommended" ? "success" : "warning"}
        dot
        size="sm"
        className="font-semibold shadow-xs"
      >
        {rec.label}
      </Badge>
      <span
        className="text-[11px] leading-tight text-surface-500 dark:text-slate-400 max-w-[210px] line-clamp-2"
        title={rec.reason}
      >
        {rec.reason}
      </span>
      {app?.r1_passed !== undefined && app?.r1_passed !== null && (
        <div className="flex items-center gap-1 mt-0.5" title="Nilai Aturan Rule-Base (R1: Dokumen, R2: CV/Kualifikasi, R3: Kuota, R4: Relevansi)">
          {[
            { label: "R1", passed: app.r1_passed, title: "R1: Kelengkapan Dokumen" },
            { label: "R2", passed: app.r2_passed, title: `R2: Detail CV & Kualifikasi (${app.r2_score ?? 0}/100)` },
            { label: "R3", passed: app.r3_passed, title: "R3: Ketersediaan Kuota Divisi" },
            { label: "R4", passed: app.r4_passed, title: `R4: Relevansi Program Studi (${app.r4_score ?? 0}/100)` },
          ].map((r) => (
            <span
              key={r.label}
              title={r.title}
              className={cn(
                "px-1 py-0.5 text-[10px] font-semibold rounded leading-none select-none",
                r.passed === true
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : r.passed === false
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  : "bg-surface-100 text-surface-500 dark:bg-slate-800 dark:text-slate-400 border border-surface-200 dark:border-slate-700"
              )}
            >
              {r.label}:{r.passed === true ? "✓" : r.passed === false ? "✗" : "-"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
