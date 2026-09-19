import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApplicationStatus, ApplicantType, DocumentType } from "@/types";

/**
 * Merge Tailwind CSS classes with conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to Indonesian locale.
 */
export function formatDate(dateStr: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return "-";

  const defaults: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  };

  return new Date(dateStr).toLocaleDateString("id-ID", defaults);
}

/**
 * Format a date string with time.
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format application status to Indonesian display text.
 */
export function formatStatus(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    pending: "Menunggu",
    reviewing: "Sedang Ditinjau",
    accepted: "Diterima",
    rejected: "Ditolak",
  };
  return map[status] || status;
}

/**
 * Get status color classes for badges.
 */
export function getStatusColor(status: ApplicationStatus | "locked"): {
  bg: string;
  text: string;
  dot: string;
} {
  const colors = {
    pending: { bg: "bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/60", text: "text-amber-800 dark:text-amber-200", dot: "bg-amber-500" },
    reviewing: { bg: "bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60", text: "text-blue-800 dark:text-blue-200", dot: "bg-blue-500" },
    accepted: { bg: "bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60", text: "text-emerald-800 dark:text-emerald-200", dot: "bg-emerald-500" },
    rejected: { bg: "bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800/60", text: "text-red-800 dark:text-red-200", dot: "bg-red-500" },
    locked: { bg: "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700", text: "text-slate-700 dark:text-white", dot: "bg-slate-400" },
  };
  return colors[status] || colors.pending;
}

/**
 * Format applicant type to Indonesian display text.
 */
export function formatApplicantType(type: ApplicantType | null | undefined): string {
  if (!type) return "-";
  const map: Record<ApplicantType, string> = {
    slta: "SLTA/Sederajat",
    mahasiswa: "Mahasiswa",
    fresh_graduate: "Fresh Graduate",
    instansi: "Instansi/Lembaga",
  };
  return map[type] || type;
}

/**
 * Format document type to display text.
 */
export function formatDocumentType(type: DocumentType): string {
  const map: Record<DocumentType, string> = {
    cv: "Curriculum Vitae",
    cover_letter: "Surat Pengantar",
    id_card: "Kartu Identitas",
    proposal: "Proposal",
  };
  return map[type] || type;
}

/**
 * Format a number as a percentage string.
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format rule pass/fail result.
 */
export function formatRuleResult(passed: boolean | null): string {
  if (passed === null) return "Belum Diproses";
  return passed ? "Lolos ✓" : "Tidak Lolos ✗";
}

/**
 * Get the month name in Indonesian.
 */
export function getMonthName(month: number): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return months[month - 1] || "";
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

/**
 * Generate initials from a name (e.g. "Ahmad Fauzi" → "AF").
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format file size to human-readable.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
