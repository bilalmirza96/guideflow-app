# Architecture — GuideFlow Front-End (Phase 1)

This document describes the current Phase 1 front-end architecture. For the full planned system architecture (backend, mobile, integrations), see `docs/architecture.md`.

---

## Application Structure

GuideFlow is a Next.js 14 App Router application using TypeScript, Tailwind CSS, and shadcn/ui. Phase 1 is a fully functional front-end prototype with mock data — no backend or database connected yet.

### Rendering Strategy

All pages currently use `"use client"` directives since Phase 1 has no server data. When the backend arrives in Phase 2, pages will migrate to server components with selective client islands for interactive sections.

### Route Groups

Next.js route groups apply different layouts to different sections:

```
src/app/
├── (auth)/           # Auth layout — no sidebar, centered card
│   └── login/        # Login + OTP confirmation
├── (dashboard)/      # Dashboard layout — sidebar + top nav
│   ├── rotation/     # Rotation landing page (default)
│   ├── case-logs/    # Case log dashboard + new case form
│   ├── fellowship/   # Fellowship readiness tracker
│   ├── heatmap/      # Operative autonomy heatmap
│   ├── admin/        # Program administration panel
│   └── guidelines/   # Guidelines detail (planned)
├── layout.tsx        # Root layout — fonts, theme provider, metadata
├── page.tsx          # Root redirect → /rotation
└── globals.css       # Design tokens, theme variables, base styles
```

### Component Organization

Components are organized by domain rather than by type. Each page has its own component folder:

```
src/components/
├── layout/       # App chrome — Sidebar, TopNav, Footer
├── rotation/     # QuickLinks, GuidelinesList, OnCallPanel, Deadlines, Wellness, Listen
├── case-logs/    # ACGMEProgress, CaseLogForm, DonutChart, TrendChart, RoleChart, RecentCases
├── fellowship/   # ReadinessScore, RequirementsGrid, Timeline
├── heatmap/      # AutonomyGrid, DivergenceAlerts, LegendStrip
├── admin/        # AdminTabs, UsersTable, DirectoryTable, GuidelineUpload
├── login/        # LoginCard, ConfirmView
├── shared/       # Panel, PageHeader, StatCard, Tag, RoleBadge, GridOverlay
└── ui/           # shadcn/ui primitives (Button, Dialog, Tabs, etc.)
```

Each component is a single `.tsx` file, self-contained with Tailwind utility classes. No separate CSS files.

### Navigation

The sidebar and top nav both use Next.js `<Link>` components for client-side routing. The sidebar uses `usePathname()` to highlight the active route. Pages use `animate-fade-up` for entry transitions.

---

## Design Token System

The UI uses CSS custom properties as design tokens defined in `globals.css`. The entire theme can be swapped by redefining one set of variables.

### Token Categories

| Category | Tokens | Purpose |
|----------|--------|---------|
| Backgrounds | `--bg-1` through `--bg-4` | Visual depth hierarchy (deepest → surface) |
| Text | `--text-1` through `--text-4` | Reading hierarchy (primary → muted) |
| Accent | `--gf-accent`, `--gf-accent-muted` | Brand color (teal) |
| Borders | `--gf-border-lo`, `--gf-border-hi` | Subtle vs prominent borders |
| Utility | `--gf-radius`, `--gf-shadow` | Shared radius and elevation |

### Usage in Components

Reference tokens directly in Tailwind arbitrary values:

```tsx
<div className="bg-[var(--bg-2)] text-[var(--text-1)] border border-[var(--gf-border-lo)]">
```

### Theming

Dark theme is default. Light theme is defined under `.light` in `globals.css` and toggled via `next-themes` ThemeProvider.

---

## Data Layer

All data in Phase 1 is static mock data in `src/data/`:

| File | Contents |
|------|----------|
| `mock-cases.ts` | Sample case log entries |
| `mock-oncall.ts` | On-call schedule |
| `acgme-categories.ts` | ACGME category definitions and targets |
| `conferences.ts` / `.json` | Conference deadline data |

### Phase 2 Migration Path

When the backend is added, the migration is straightforward:

1. TypeScript interfaces from mock files become API response types
2. Mock imports become `fetch()` calls or server component data fetching
3. Interactive sections (forms, charts) remain client components
4. Server-fetched pages drop `"use client"` directives
5. API routes are added in `src/app/api/`

---

## Charts

Chart.js via `react-chartjs-2` powers all data visualizations:

| Component | Type | Page |
|-----------|------|------|
| `DonutChart` | Doughnut | Case Logs — ACGME category progress |
| `TrendChart` | Line | Case Logs — monthly volume trend |
| `RoleChart` | Doughnut | Case Logs — operative role breakdown |

Charts read design tokens for colors to stay theme-consistent.

---

## Key Dependencies

| Library | Purpose |
|---------|---------|
| `next` 14 | App Router framework |
| `next-themes` | Dark/light theme management |
| `@radix-ui/*` | Accessible UI primitives |
| `class-variance-authority` | Component variant management |
| `tailwind-merge` + `clsx` | Class composition and deduplication |
| `lucide-react` | Icon set |
| `chart.js` + `react-chartjs-2` | Data visualization |

---

## Deployment

Vercel handles builds and hosting:

- `vercel.json` sets `"framework": "nextjs"`
- Auto-deploy on push to `main`
- Branch deploys for PR previews
- No environment variables needed in Phase 1
