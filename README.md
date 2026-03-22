# GuideFlow

A clinical education platform for U.S. teaching hospitals. GuideFlow unifies surgical resident workflows — rotation dashboards, case logging, fellowship tracking, autonomy heatmaps, and program administration — into a single application.

**Live:** [guideflow-app.vercel.app](https://guideflow-app.vercel.app)

---

## Overview

Surgical residents currently juggle 3+ disconnected tools to manage case logs, EPA assessments, fellowship readiness, and clinical guidelines. GuideFlow replaces that fragmentation with a single platform where logging a case simultaneously satisfies ACGME documentation, triggers attending assessments, advances fellowship tracking, and updates the resident's autonomy profile.

Built for PMG Health Technologies. Phase 1 focuses on the front-end prototype with full page fidelity and client-side routing.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties (design tokens) |
| Components | shadcn/ui + Radix UI primitives |
| Charts | Chart.js + react-chartjs-2 |
| Fonts | DM Sans (body), Lora (headings) via `next/font` |
| Theme | Dual-theme (dark/light) via `next-themes` |
| Deployment | Vercel (auto-deploy from `main`) |

---

## Pages

| Route | Description |
|-------|-------------|
| `/rotation` | Rotation landing page — quick links, clinical guidelines, on-call info, conference deadlines, wellness check-in |
| `/case-logs` | Unified case & procedure log — ACGME progress donuts, trend charts, role breakdown, recent cases table, new case form |
| `/fellowship` | Fellowship readiness tracker — radial score, requirements grid, milestone timeline |
| `/heatmap` | Operative autonomy heatmap — Zwisch-scale color grid, divergence alerts, entrustment legend |
| `/admin` | Program administration — user management, directory, guideline uploads (tabbed) |
| `/login` | Authentication — email/phone login with OTP confirmation |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
git clone https://github.com/bilalmirza96/guideflow-app.git
cd guideflow-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/rotation` by default.

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
guideflow-project/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx          # Login page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Dashboard shell (sidebar + top nav)
│   │   │   ├── rotation/page.tsx       # Rotation landing
│   │   │   ├── case-logs/page.tsx      # Case log dashboard
│   │   │   ├── fellowship/page.tsx     # Fellowship readiness
│   │   │   ├── heatmap/page.tsx        # Autonomy heatmap
│   │   │   ├── admin/page.tsx          # Admin panel
│   │   │   └── guidelines/             # Guidelines detail (planned)
│   │   ├── globals.css                 # Design tokens + theme variables
│   │   ├── layout.tsx                  # Root layout (fonts, theme provider)
│   │   └── page.tsx                    # Root redirect → /rotation
│   ├── components/
│   │   ├── layout/                     # Sidebar, TopNav, Footer
│   │   ├── rotation/                   # QuickLinks, Guidelines, OnCall, Deadlines, Wellness, Listen
│   │   ├── case-logs/                  # ACGMEProgress, CaseLogForm, DonutChart, TrendChart, RoleChart, RecentCases
│   │   ├── fellowship/                 # ReadinessScore, RequirementsGrid, Timeline
│   │   ├── heatmap/                    # AutonomyGrid, DivergenceAlerts, LegendStrip
│   │   ├── admin/                      # AdminTabs, UsersTable, DirectoryTable, GuidelineUpload
│   │   ├── login/                      # LoginCard, ConfirmView
│   │   ├── shared/                     # Panel, PageHeader, StatCard, Tag, RoleBadge, GridOverlay
│   │   └── ui/                         # shadcn/ui primitives
│   ├── data/                           # Mock data (cases, conferences, on-call, ACGME categories)
│   ├── hooks/                          # Custom hooks (useDeadlines)
│   ├── lib/                            # Utilities (cn, fonts, theme provider)
│   ├── api/                            # API layer (planned)
│   └── persistence/                    # Data persistence layer (planned)
├── prototype/                          # Original HTML/CSS prototype reference
├── tailwind.config.ts                  # Tailwind config with design token integration
├── vercel.json                         # Vercel framework config
├── GUIDEFLOW-PRD.md                    # Full product requirements document
└── package.json
```

---

## Design System

GuideFlow uses CSS custom properties as design tokens, allowing the entire UI to be re-themed by swapping a single set of variables.

**Key tokens** defined in `globals.css`:

- `--bg-1` through `--bg-4` — background layers
- `--text-1` through `--text-4` — text hierarchy
- `--gf-accent` — primary accent (teal)
- `--gf-border-lo`, `--gf-border-hi` — border variants
- `--gf-radius` — global border radius

The dark theme is active by default. Light theme is wired via `next-themes` and togglable.

---

## Deployment

The app auto-deploys to Vercel on every push to `main`.

| Environment | URL |
|-------------|-----|
| Production | [guideflow-app.vercel.app](https://guideflow-app.vercel.app) |
| Branch previews | Auto-generated per PR |

---

## Roadmap

- **Phase 1** (current): Full front-end prototype with static data and complete page fidelity
- **Phase 2**: Backend API (Neon PostgreSQL + Drizzle ORM), authentication, multi-tenancy
- **Phase 3**: EPA assessment flow, ACGME export, attending mobile forms
- **Phase 4**: QGenda sync, ORCID integration, push notifications

---

## License

Private — PMG Health Technologies
