"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type { Application, Division, Analytics } from "@/types";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge, RecommendationBadge } from "@/components/ui/Badge";
import { SkeletonStat, SkeletonCard } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import BarChartComponent from "@/components/charts/BarChart";
import DonutChart from "@/components/charts/DonutChart";
import LineChartComponent from "@/components/charts/LineChart";
import { formatApplicantType, getMonthName, cn } from "@/lib/utils";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  RefreshCw,
  Building2,
  Lock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appsSort, setAppsSort] = useState("-created_at");

  const fetchAppsData = async (sortValue: string) => {
    try {
      const res = await api.get("/admin/applications", { params: { per_page: 8, sort: sortValue } });
      const appData = res.data.data?.data || [];
      setApps(Array.isArray(appData) ? appData : []);
    } catch { /* silent */ }
  };

  const handleSortChange = (newSort: string) => {
    setAppsSort(newSort);
    fetchAppsData(newSort);
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [appsRes, analyticsRes] = await Promise.all([
        api.get("/admin/applications", { params: { per_page: 8, sort: appsSort } }),
        api.get("/admin/analytics"),
      ]);
      const appData = appsRes.data.data?.data || [];
      setApps(Array.isArray(appData) ? appData : []);
      setAnalytics(analyticsRes.data.data || null);
    } catch { /* silent */ }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard /><SkeletonCard />
      </div>
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );

  const statCards = [
    {
      label: "Total Pelamar",
      value: analytics?.total_applicants ?? 0,
      icon: Users,
      color: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60",
    },
    {
      label: "Menunggu Review",
      value: (analytics?.total_pending ?? 0) + (analytics?.total_reviewing ?? 0),
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60",
    },
    {
      label: "Diterima",
      value: analytics?.total_accepted ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      label: "Ditolak",
      value: analytics?.total_rejected ?? 0,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60",
    },
  ];

  const barData = (analytics?.applicants_per_division || []).map((d) => ({
    name: d.division_name.replace("Bidang ", "").replace("UPT ", ""),
    value: d.count,
  }));

  const donutData = (analytics?.applicant_type_breakdown || []).map((d) => ({
    name: formatApplicantType(d.type),
    value: d.count,
  }));

  const lineData = (analytics?.monthly_trend || []).map((d) => ({
    name: getMonthName(d.month).substring(0, 3),
    value: d.count,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Dasbor Admin</h1>
          <p className="page-subtitle">Ringkasan pendaftaran magang, analitik statistik, dan data pelamar terkini.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchData} 
          disabled={refreshing}
          icon={<RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />}
        >
          {refreshing ? "Memuat..." : "Segarkan Data"}
        </Button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} padding="md">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-surface-500 dark:text-slate-400 font-medium">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section (from Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Pelamar per Divisi */}
        <Card padding="lg">
          <CardHeader><CardTitle>Pelamar per Divisi</CardTitle></CardHeader>
          {barData.length > 0 ? (
            <BarChartComponent data={barData} height={280} />
          ) : (
            <p className="text-sm text-surface-400 text-center py-8">Belum ada data pelamar per divisi.</p>
          )}
        </Card>

        {/* Donut Chart: Jenis Pelamar */}
        <Card padding="lg">
          <CardHeader><CardTitle>Distribusi Jenis Pelamar</CardTitle></CardHeader>
          {donutData.length > 0 ? (
            <DonutChart
              data={donutData}
              height={280}
              centerValue={analytics?.total_applicants ?? 0}
              centerLabel="Total"
            />
          ) : (
            <p className="text-sm text-surface-400 text-center py-8">Belum ada data jenis pelamar.</p>
          )}
        </Card>
      </div>

      {/* Line Chart: Tren Pelamar */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Tren Pendaftaran Magang (12 Bulan Terakhir)</CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <TrendingUp className="w-3.5 h-3.5" /> Data pendaftaran bulanan
          </div>
        </CardHeader>
        {lineData.length > 0 ? (
          <LineChartComponent data={lineData} height={260} showArea />
        ) : (
          <p className="text-sm text-surface-400 text-center py-8">Belum ada data tren pendaftaran.</p>
        )}
      </Card>

      {/* Division Capacity Table (from Analytics) */}
      {analytics?.division_capacity && analytics.division_capacity.length > 0 && (
        <Card padding="none">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              Kapasitas Kuota Divisi
            </h3>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/quotas")}>
              Kelola Divisi
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px]">
              <thead>
                <tr className="bg-surface-50 dark:bg-slate-900 border-y border-surface-200 dark:border-slate-800">
                  {["Divisi", "Maks", "Aktif", "Sisa", "Kapasitas"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
                {analytics.division_capacity.map((d) => (
                  <tr key={d.division_name} className="hover:bg-surface-50 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-3 text-sm font-medium text-surface-800 dark:text-white">{d.division_name}</td>
                    <td className="px-4 py-3 text-sm text-surface-600 dark:text-slate-200">{d.max_quota}</td>
                    <td className="px-4 py-3 text-sm text-surface-600 dark:text-slate-200">{d.active_applicants}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      <span className={d.max_quota - d.active_applicants <= 0 ? "text-red-600" : "text-emerald-600"}>
                        {d.max_quota - d.active_applicants}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2.5 bg-surface-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={cn(
                            "h-full rounded-full transition-all",
                            d.percentage >= 90 ? "bg-red-500" :
                            d.percentage >= 70 ? "bg-amber-500" : "bg-emerald-500"
                          )} style={{ width: `${Math.min(d.percentage, 100)}%` }} />
                        </div>
                        <span className={cn(
                          "text-xs font-semibold min-w-[40px]",
                          d.percentage >= 90 ? "text-red-600" :
                          d.percentage >= 70 ? "text-amber-600" : "text-emerald-600"
                        )}>
                          {d.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Recent Applications Table */}
      <Card padding="none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 pt-5 pb-3 gap-3">
          <div>
            <h3 className="text-base font-semibold text-surface-900 dark:text-white">Pengajuan Magang</h3>
            <p className="text-xs text-surface-500 dark:text-slate-400">Daftar pendaftar magang terkini</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={appsSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-surface-700 dark:text-slate-200 font-medium"
            >
              <option value="-created_at">Urutkan: Terbaru</option>
              <option value="-algorithm_score">Urutkan: Ranking / Skor Tertinggi</option>
              <option value="algorithm_score">Urutkan: Skor Terendah</option>
            </select>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/applications")}
              icon={<TrendingUp className="w-4 h-4" />}>
              Lihat Semua
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="bg-surface-50 dark:bg-slate-900 border-y border-surface-200 dark:border-slate-800">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">No</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">Nama</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">Institusi</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">Jenis</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">Divisi</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">Skill</th>
                <th
                  onClick={() => handleSortChange(appsSort === "-algorithm_score" ? "algorithm_score" : "-algorithm_score")}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors select-none group"
                  title="Klik untuk urutkan berdasarkan skor / ranking"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Skor / Ranking</span>
                    {appsSort === "-algorithm_score" ? (
                      <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    ) : appsSort === "algorithm_score" ? (
                      <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 text-surface-400 group-hover:text-primary-500 opacity-70" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">Rekomendasi / Pertimbangan</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 dark:text-slate-300 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {apps.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-surface-400 dark:text-slate-400">Belum ada pengajuan.</td></tr>
              ) : (
                apps.map((a, i) => (
                  <tr key={a.id} className="hover:bg-surface-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 text-sm text-surface-500 dark:text-slate-300">{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-surface-800 dark:text-white">{a.user?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-surface-600 dark:text-slate-200">{a.user?.institution_name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-surface-600 dark:text-slate-200">{formatApplicantType(a.user?.applicant_type)}</td>
                    <td className="px-4 py-3 text-sm text-surface-600 dark:text-slate-200">{a.division?.name || "-"}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {a.skills ? (
                        <div className="flex flex-wrap gap-1">
                          {a.skills
                            .split(/[,;\n]+/)
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .slice(0, 3)
                            .map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 text-xs font-medium bg-surface-100 text-surface-700 dark:bg-slate-800 dark:text-slate-300 rounded border border-surface-200 dark:border-slate-700 truncate max-w-[150px]"
                                title={a.skills || ""}
                              >
                                {skill}
                              </span>
                            ))}
                          {a.skills.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean).length > 3 && (
                            <span
                              className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-surface-100 text-surface-500 dark:bg-slate-800 dark:text-slate-400 rounded"
                              title={a.skills || ""}
                            >
                              +{a.skills.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean).length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-surface-400 dark:text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-surface-700 dark:text-white">
                          {a.algorithm_score ?? "-"}
                        </span>
                        {appsSort === "-algorithm_score" && a.algorithm_score !== null && a.algorithm_score !== undefined && (
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide",
                            i === 0
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                              : i === 1
                              ? "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                              : i === 2
                              ? "bg-amber-800/10 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-700/30"
                              : "bg-surface-100 text-surface-600 dark:bg-slate-800 dark:text-slate-400"
                          )}>
                            Rank #{i + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3"><RecommendationBadge app={a} /></td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/applications/${a.id}`)}
                        icon={<Eye className="w-4 h-4" />}>Detail</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
