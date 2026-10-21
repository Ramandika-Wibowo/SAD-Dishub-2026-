"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { logout, getCachedUser, getRole } from "@/lib/auth";
import api from "@/lib/axios";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Download,
  LogOut,
  ChevronLeft,
  Menu,
  Building2,
  AlertCircle,
} from "lucide-react";
import type { UserRole } from "@/types";

// ─── Navigation Items by Role ──────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Pengajuan", href: "/admin/applications", icon: <FileText className="w-5 h-5" /> },
  { label: "Manajemen Divisi", href: "/admin/quotas", icon: <Building2 className="w-5 h-5" /> },
  { label: "Ekspor Data", href: "/admin/export", icon: <Download className="w-5 h-5" /> },
];

function getNavItems(role?: UserRole): NavItem[] {
  switch (role) {
    case "admin":
    case "head":
      return adminNavItems;
    default:
      return [];
  }
}

// ─── Sidebar Component ─────────────────────────────

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [hasUndecided, setHasUndecided] = useState(false);
  const [undecidedCount, setUndecidedCount] = useState(0);
  const pathname = usePathname();

  const checkUndecided = useCallback(async () => {
    const currentRole = getRole();
    if (currentRole !== "admin" && currentRole !== "head") return;
    try {
      const res = await api.get("/admin/analytics");
      const pending = res.data.data?.total_pending || 0;
      const reviewing = res.data.data?.total_reviewing || 0;
      const total = pending + reviewing;
      setUndecidedCount(total);
      setHasUndecided(total > 0);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    setUser(getCachedUser());
    setRole(getRole());
    setMounted(true);
    checkUndecided();
  }, [checkUndecided]);

  useEffect(() => {
    if (mounted) {
      checkUndecided();
    }
  }, [pathname, mounted, checkUndecided]);

  const navItems = getNavItems(role);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center shrink-0">
          <img 
            alt="Logo Suara Surabaya FM 100" 
            src="/images/logo.png" 
            className="h-8 w-auto object-contain dark:filter dark:brightness-125"
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-surface-900 dark:text-white truncate">E-Internship</p>
            <p className="text-[11px] text-surface-400 dark:text-slate-400 truncate">Suara Surabaya</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const isPengajuan = item.href === "/admin/applications";
          const showExclamation = isPengajuan && hasUndecided;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium relative group",
                "transition-all duration-150",
                isActive
                  ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 border-l-[3px] border-primary-600 dark:border-primary-500"
                  : "text-surface-600 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800 hover:text-surface-800 dark:hover:text-white"
              )}
            >
              <div className="relative shrink-0 flex items-center justify-center">
                {item.icon}
                {showExclamation && collapsed && (
                  <span
                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-xs ring-2 ring-white dark:ring-slate-900 animate-pulse"
                    title={`${undecidedCount} pelamar belum diputuskan`}
                  >
                    !
                  </span>
                )}
              </div>
              {!collapsed && (
                <>
                  <span className="truncate flex-1">{item.label}</span>
                  {showExclamation && (
                    <span
                      className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-black shadow-xs shrink-0 animate-pulse"
                      title={`${undecidedCount} pelamar belum diputuskan`}
                    >
                      !
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-surface-200 dark:border-slate-800 p-3 space-y-2 shrink-0">
        {user && (
          <div className={cn("flex items-center gap-3 px-2 py-2", collapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950/80 flex items-center justify-center shrink-0 border border-primary-200 dark:border-primary-800">
              <span className="text-xs font-bold text-primary-700 dark:text-primary-300">
                {getInitials(user.name)}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-surface-800 dark:text-slate-100 truncate">{user.name}</p>
                <p className="text-xs text-surface-400 dark:text-slate-400 truncate capitalize">{user.role}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium",
            "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>

      {/* Collapse Button (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center h-10 border-t border-surface-200 dark:border-slate-800 text-surface-400 hover:text-surface-600 dark:hover:text-slate-200 hover:bg-surface-50 dark:hover:bg-slate-800 transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")}
        />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-900 shadow-card border border-surface-200 dark:border-slate-800 text-surface-600 dark:text-slate-300"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white dark:bg-slate-900 border-r border-surface-200 dark:border-slate-800",
          "transition-all duration-300 ease-out",
          // Desktop
          "hidden lg:flex lg:flex-col",
          collapsed ? "lg:w-[68px]" : "lg:w-64",
          // Mobile (always full width when open)
          mobileOpen && "!flex w-72",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for main content */}
      <div
        className={cn(
          "hidden lg:block shrink-0 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      />
    </>
  );
}
