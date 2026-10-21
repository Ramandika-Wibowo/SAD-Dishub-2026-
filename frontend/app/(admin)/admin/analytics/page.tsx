"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="py-24 text-center">
      <div className="skeleton h-6 w-48 mx-auto mb-2 rounded" />
      <p className="text-sm text-surface-400">Mengalihkan ke Dasbor Admin...</p>
    </div>
  );
}
