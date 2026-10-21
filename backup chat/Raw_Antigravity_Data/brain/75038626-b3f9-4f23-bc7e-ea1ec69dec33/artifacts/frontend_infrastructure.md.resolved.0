# E-Internship Dishub — Frontend Infrastructure

> Next.js 14 (App Router, TypeScript, Tailwind CSS) — shared infrastructure, ready for page implementation.

## 📁 Complete File Structure (39 files)

```
frontend/
├── .env.example
├── package.json                     # Next 14, axios, recharts, react-dropzone, xlsx, js-cookie, lucide
├── tsconfig.json                    # @/* path alias
├── tailwind.config.ts               # Design system: primary blue, surfaces, status colors, animations
├── next.config.js                   # Supabase images, API proxy
├── postcss.config.js
├── middleware.ts                    # Route protection by role (cookie-based)
│
├── types/
│   └── index.ts                     # 30+ TypeScript interfaces (User, Application, Division, Analytics…)
│
├── lib/
│   ├── axios.ts                     # Axios instance + Bearer token interceptor + 401 auto-redirect
│   ├── auth.ts                      # login/register/logout/getUser + cookie/localStorage management
│   └── utils.ts                     # cn(), formatDate(), formatStatus(), getStatusColor(), getInitials()…
│
├── components/
│   ├── index.ts                     # Barrel exports for all components
│   ├── ui/
│   │   ├── Button.tsx               # 5 variants × 3 sizes, loading spinner, icon support
│   │   ├── Card.tsx                 # Card + Header/Title/Description/Content/Footer sub-components
│   │   ├── Badge.tsx                # Generic Badge + StatusBadge + RuleBadge
│   │   ├── Modal.tsx                # Overlay + Escape close + scroll lock + 4 sizes
│   │   ├── Toast.tsx                # Custom styled toasts: success/error/warning/info
│   │   ├── Skeleton.tsx             # Line/Text/Card/TableRow/Stat skeleton loaders
│   │   ├── Table.tsx                # Generic typed table + sorting + pagination
│   │   ├── Sidebar.tsx              # Collapsible sidebar, role-based nav, mobile hamburger
│   │   ├── Topbar.tsx               # Title + notification dropdown + search + user avatar
│   │   └── BottomNav.tsx            # Mobile bottom bar for applicant role
│   ├── charts/
│   │   ├── BarChart.tsx             # Recharts bar with auto colors, horizontal/vertical
│   │   ├── DonutChart.tsx           # Recharts donut with center label, percentage tooltips
│   │   └── LineChart.tsx            # Recharts line with gradient area fill, multi-line
│   └── forms/
│       ├── UploadDropzone.tsx       # react-dropzone with preview, validation, max size
│       └── StepIndicator.tsx        # Horizontal/vertical step progress indicator
│
└── app/
    ├── globals.css                  # Inter font, card system, input styles, scrollbar, skeleton
    ├── layout.tsx                   # Root layout + Toaster provider
    ├── (auth)/
    │   ├── layout.tsx               # Blue gradient background
    │   ├── login/page.tsx           # Placeholder
    │   └── register/page.tsx        # Placeholder
    ├── (applicant)/
    │   ├── layout.tsx               # Topbar + BottomNav
    │   ├── dashboard/page.tsx       # Placeholder
    │   ├── apply/page.tsx           # Placeholder
    │   └── status/page.tsx          # Placeholder
    ├── (admin)/
    │   ├── layout.tsx               # Sidebar + Topbar
    │   └── admin/
    │       ├── dashboard/page.tsx   # Placeholder
    │       ├── applications/page.tsx
    │       ├── applications/[id]/page.tsx
    │       └── quotas/page.tsx      # Placeholder
    └── (head)/
        ├── layout.tsx               # Sidebar + Topbar
        └── head/
            ├── dashboard/page.tsx   # Placeholder
            └── export/page.tsx      # Placeholder
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1D4ED8` | Buttons, active states, links |
| Surface | `#F8FAFC` | Page background |
| Pending | `#F59E0B` | Yellow badge |
| Reviewing | `#3B82F6` | Blue badge |
| Accepted | `#10B981` | Green badge |
| Rejected | `#EF4444` | Red badge |
| Font | Inter | All text |
| Card radius | `0.75rem` | All cards |
| Shadows | card / card-hover / modal | 3-tier elevation |

---

## 🔐 Middleware Route Protection

| Route Pattern | Allowed Role | Unauthenticated → |
|---------------|-------------|-------------------|
| `/dashboard/*` | applicant | → `/login` |
| `/apply/*` | applicant | → `/login` |
| `/status/*` | applicant | → `/login` |
| `/admin/*` | admin | → `/login` |
| `/head/*` | head | → `/login` |
| `/login`, `/register` | public | → own dashboard (if logged in) |
| `/` | any | → dashboard or login |

---

## 📦 Component Usage Examples

```tsx
// Single-line imports via barrel export
import { Button, Card, CardTitle, StatusBadge, Table, Modal } from "@/components";

// Button variants
<Button variant="primary" loading={saving}>Simpan</Button>
<Button variant="outline" icon={<Download />}>Unduh</Button>
<Button variant="danger" size="sm">Tolak</Button>

// Status badges
<StatusBadge status="accepted" />
<StatusBadge status="pending" />

// Toast notifications
import { toastSuccess, toastError } from "@/components";
toastSuccess("Pengajuan berhasil dikirim!");
toastError("Gagal mengunggah dokumen.");

// Charts
<BarChart data={[{ name: "Lalu Lintas", value: 12 }]} />
<DonutChart data={breakdownData} centerValue={total} centerLabel="Total" />
<LineChart data={trendData} showArea />

// Upload
<UploadDropzone
  label="Curriculum Vitae"
  description="PDF, DOC, atau DOCX"
  value={cvFile}
  onChange={setCvFile}
/>
```

---

## 🚀 Setup & Run

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local → set NEXT_PUBLIC_API_URL
npm run dev
# → http://localhost:3000
```

---

## ✅ Next Step: Build Pages

All infrastructure is ready. The next phase is implementing the 11 page files:

1. **Auth:** Login, Register
2. **Applicant:** Dashboard, Apply (multi-step form), Status Tracking
3. **Admin:** Dashboard, Applications List, Application Detail, Quotas
4. **Head:** Analytics Dashboard, Export
