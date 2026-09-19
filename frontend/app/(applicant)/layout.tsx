"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/ui/Topbar";
import BottomNav from "@/components/ui/BottomNav";
import { getCachedUser } from "@/lib/auth";

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    // Gunakan cache lokal — tidak perlu hit API /auth/me setiap navigasi
    const cached = getCachedUser();
    if (cached?.id) {
      setUserId(cached.id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-slate-950 transition-colors duration-200">
      <Topbar title="E-Internship" subtitle="Suara Surabaya Media" />
      <main className="container-main py-6 pb-4">
        {children}
      </main>
      <BottomNav />
      {/* {userId > 0 && (
        <ChatBubble userId={userId} />
      )} */}
    </div>
  );
}
