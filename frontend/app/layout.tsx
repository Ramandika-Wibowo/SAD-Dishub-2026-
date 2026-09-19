import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "E-Internship Suara Surabaya Media",
    template: "%s | E-Internship Suara Surabaya",
  },
  description:
    "Portal pendaftaran dan seleksi magang terpadu Suara Surabaya Media - Jaringan Radio Berita & Media Digital Terdepan di Jawa Timur",
  keywords: [
    "magang",
    "internship",
    "suara surabaya",
    "ss media",
    "radio",
    "broadcasting",
    "jurnalistik",
    "media kreatif",
    "surabaya",
  ],
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="h-full bg-surface-50 dark:bg-slate-950 text-surface-800 dark:text-slate-100 transition-colors duration-200">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "0.75rem",
              padding: "12px 16px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
            },
            success: {
              iconTheme: { primary: "#DC2626", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#ffffff" },
            },
          }}
        />
      </body>
    </html>
  );
}
