# GuideFlow Next.js + shadcn/ui Migration Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the GuideFlow HTML prototype into a production Next.js 14 app with shadcn/ui components, preserving the exact design system and all 7 pages.

**Architecture:** Hybrid scaffold + page-by-page port. Stand up the Next.js skeleton first (layout shell, sidebar, nav, theme provider, design tokens mapped to Tailwind), then migrate one page at a time from the prototype. Each page becomes a route with React components using shadcn/ui primitives. Static mock data initially — database integration comes after all pages are ported.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS v3, shadcn/ui, Lora + DM Sans (Google Fonts via `next/font`), Chart.js via react-chartjs-2, Zod (validation), Neon PostgreSQL + Drizzle ORM (Phase 2)

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, ThemeProvider, metadata
│   ├── globals.css                   # Tailwind directives + custom design tokens
│   ├── page.tsx                      # Redirect to /rotation (default landing)
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page (magic link flow)
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard shell: nav + sidebar + main
│   │   ├── rotation/
│   │   │   └── page.tsx              # Rotation dashboard (home)
│   │   ├── case-logs/
│   │   │   └── page.tsx              # Case log dashboard
│   │   ├── fellowship/
│   │   │   └── page.tsx              # Fellowship readiness tracker
│   │   ├── heatmap/
│   │   │   └── page.tsx              # Operative autonomy heatmap
│   │   ├── guidelines/
│   │   │   └── page.tsx              # Guidelines catalog (home page in prototype)
│   │   └── admin/
│   │       └── page.tsx              # Admin panel
├── components/
│   ├── ui/                           # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tooltip.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   ├── textarea.tsx
│   │   ├── checkbox.tsx
│   │   ├── label.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   ├── layout/
│   │   ├── top-nav.tsx               # Fixed top navigation bar
│   │   ├── sidebar.tsx               # Left sidebar with page-specific sections
│   │   ├── sidebar-section.tsx       # Reusable sidebar section group
│   │   ├── service-switcher.tsx      # Service dropdown in nav
│   │   └── footer.tsx                # Site footer
│   ├── shared/
│   │   ├── page-header.tsx           # Eyebrow + title + subtitle pattern
│   │   ├── panel.tsx                 # Panel wrapper (bg-raised, rounded, no border)
│   │   ├── panel-header.tsx          # Panel title + subtitle/action
│   │   ├── stat-card.tsx             # Metric card with label, number, bar
│   │   ├── search-bar.tsx            # Command-K search bar
│   │   ├── role-badge.tsx            # SC/SJ/TA/FA colored badges
│   │   ├── tag.tsx                   # Neutral stone pill tag
│   │   └── grid-overlay.tsx          # CSS grid overlay (body::after equivalent)
│   ├── rotation/
│   │   ├── quick-links-grid.tsx      # Top cards (Case Logs, On-Call, etc.)
│   │   ├── guidelines-list.tsx       # Recent guidelines list view
│   │   ├── guidelines-grid.tsx       # Guidelines card/grid view with SVG illos
│   │   ├── on-call-panel.tsx         # On-call directory panel
│   │   ├── listen-panel.tsx          # Podcast panel with BTK logo
│   │   ├── deadlines-panel.tsx       # Abstract deadlines (dynamic engine)
│   │   └── wellness-panel.tsx        # Wellness check-in panel
│   ├── case-logs/
│   │   ├── donut-chart.tsx           # Total cases doughnut
│   │   ├── trend-chart.tsx           # Monthly case volume bar chart
│   │   ├── role-chart.tsx            # Role breakdown doughnut
│   │   ├── acgme-progress.tsx        # ACGME category progress bars
│   │   ├── case-log-form.tsx         # Log a Case form (operative + bedside toggle)
│   │   ├── bedside-form.tsx          # Bedside procedure form
│   │   ├── recent-cases-table.tsx    # Recent cases table
│   │   └── metrics-strip.tsx         # SC / PGY-3 / TA / This Month metrics row
│   ├── fellowship/
│   │   ├── readiness-score.tsx       # Overall readiness percentage
│   │   ├── timeline.tsx              # Fellowship milestone timeline
│   │   └── requirements-grid.tsx     # Fellowship requirements cards
│   ├── heatmap/
│   │   ├── autonomy-grid.tsx         # Procedure autonomy heatmap cards
│   │   ├── legend-strip.tsx          # Color legend
│   │   └── divergence-alerts.tsx     # Divergence signal alerts
│   ├── admin/
│   │   ├── admin-tabs.tsx            # Guidelines / Directory / Users tabs
│   │   ├── guideline-upload.tsx      # Upload form + dropzone
│   │   ├── directory-table.tsx       # On-call directory management
│   │   └── users-table.tsx           # User management table
│   └── login/
│       ├── login-card.tsx            # Email input + magic link button
│       └── confirm-view.tsx          # "Check your email" confirmation
├── lib/
│   ├── theme-provider.tsx            # next-themes ThemeProvider wrapper
│   ├── utils.ts                      # cn() helper (shadcn standard)
│   └── fonts.ts                      # Lora + DM Sans via next/font/google
├── data/
│   ├── conferences.ts                # Conference database (typed from JSON)
│   ├── acgme-categories.ts           # ACGME category data + benchmarks
│   ├── mock-cases.ts                 # Mock case log entries
│   └── mock-oncall.ts               # Mock on-call directory data
└── hooks/
    ├── use-deadlines.ts              # Abstract deadline calculation engine
    └── use-toast.ts                  # Toast notification hook (shadcn)
```

---

## Chunk 1: Project Scaffold + Design System

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd /path/to/guideflow-project
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Expected: Project scaffold created with `src/app/` structure. If it prompts about existing files, answer yes to proceed (it won't overwrite CLAUDE.md or docs/).

- [ ] **Step 2: Verify scaffold runs**

```bash
npm run dev
```

Expected: Dev server starts on localhost:3000, default Next.js page renders.

- [ ] **Step 3: Commit scaffold**

```bash
git add src/ package.json package-lock.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js .eslintrc.json
git commit -m "chore: scaffold Next.js 14 project with TypeScript and Tailwind"
```

---

### Task 2: Install shadcn/ui and core components

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/*.tsx` (15+ components)

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn-ui@latest init
```

When prompted:
- Style: Default
- Base color: Slate (we'll override with our tokens)
- CSS variables: Yes
- `tailwind.config.ts` location: default
- Components path: `@/components/ui`
- Utils path: `@/lib/utils`
- React Server Components: Yes

- [ ] **Step 2: Install all needed components**

```bash
npx shadcn-ui@latest add button card input select badge table tabs dialog dropdown-menu tooltip progress separator textarea checkbox label toast
```

Expected: Each component created in `src/components/ui/`

- [ ] **Step 3: Verify components installed**

```bash
ls src/components/ui/
```

Expected: 15+ .tsx files present

- [ ] **Step 4: Commit**

```bash
git add components.json src/components/ui/ src/lib/utils.ts
git commit -m "chore: install shadcn/ui with 15 core components"
```

---

### Task 3: Map design tokens to Tailwind + CSS variables

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Create: `src/lib/fonts.ts`

- [ ] **Step 1: Configure Google Fonts via next/font**

Create `src/lib/fonts.ts`:

```typescript
import { Lora, DM_Sans } from 'next/font/google';

export const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
  display: 'swap',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});
```

- [ ] **Step 2: Write globals.css with GuideFlow design tokens**

Replace `src/app/globals.css` with the full token set from the prototype. Map dark/light tokens to shadcn's `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring` variables. Also keep our custom tokens (`--bg`, `--bg-raised`, `--text-1/2/3`, `--ac-orange/blue/green`, `--grid-line`, etc.) for components that need them directly.

Key mappings:
```css
@layer base {
  :root {
    /* shadcn required variables mapped to GuideFlow light tokens */
    --background: 0 0% 100%;        /* #FFFFFF */
    --foreground: 18 8% 8%;          /* #141210 */
    --card: 0 0% 100%;               /* #FFFFFF */
    --card-foreground: 18 8% 8%;
    --primary: 22 65% 53%;           /* --ac-orange #D07040 */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 37% 52%;        /* --ac-blue #5585B0 */
    --secondary-foreground: 0 0% 100%;
    --muted: 30 12% 95%;             /* --bg-hover #F5F3F0 */
    --muted-foreground: 18 4% 40%;   /* --text-2 #6B6560 */
    --accent: 30 12% 95%;
    --accent-foreground: 18 8% 8%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 30 12% 90%;            /* --border #E8E2D9 */
    --input: 30 12% 85%;             /* --border-hi #D6CFC4 */
    --ring: 22 65% 53%;              /* --ac-orange focus ring */
    --radius: 0.75rem;

    /* GuideFlow custom tokens (light) */
    --bg: #FFFFFF;
    --bg-raised: #FFFFFF;
    --bg-hover: #F5F3F0;
    --gf-border: #E8E2D9;
    --gf-border-hi: #D6CFC4;
    --text-1: #141210;
    --text-2: #6B6560;
    --text-3: #9E9890;
    --ac-orange: #D07040;
    --ac-blue: #5585B0;
    --ac-green: #688548;
    --ac-orange-dim: rgba(208,112,64,0.09);
    --ac-blue-dim: rgba(85,133,176,0.09);
    --ac-green-dim: rgba(104,133,72,0.09);
    --grid-line: rgba(0,0,0,0.04);
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md: 0 8px 32px rgba(0,0,0,0.09);
    --shadow-lg: 0 24px 80px rgba(0,0,0,0.11);
    --grain-op: 0.018;
    --prog-bg: rgba(20,18,16,0.07);
    --prog-fill: rgba(20,18,16,0.65);
  }

  .dark {
    /* shadcn required variables mapped to GuideFlow dark tokens */
    --background: 0 0% 7%;            /* #131313 */
    --foreground: 30 18% 92%;         /* #F0EBE3 */
    --card: 0 0% 10%;                 /* #1A1A1A */
    --card-foreground: 30 18% 92%;
    --primary: 22 73% 67%;            /* --ac-orange #E8956F */
    --primary-foreground: 0 0% 7%;
    --secondary: 207 55% 71%;         /* --ac-blue #8BB8E0 */
    --secondary-foreground: 0 0% 7%;
    --muted: 0 0% 13%;                /* --bg-hover #222222 */
    --muted-foreground: 30 8% 74%;    /* --text-2 #C4BDB4 */
    --accent: 0 0% 13%;
    --accent-foreground: 30 18% 92%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 30 18% 92%;
    --border: 0 0% 16%;               /* --border #2A2A2A */
    --input: 0 0% 21%;                /* --border-hi #363636 */
    --ring: 22 73% 67%;
    --radius: 0.75rem;

    /* GuideFlow custom tokens (dark) */
    --bg: #131313;
    --bg-raised: #1A1A1A;
    --bg-hover: #222222;
    --gf-border: #2A2A2A;
    --gf-border-hi: #363636;
    --text-1: #F0EBE3;
    --text-2: #C4BDB4;
    --text-3: #666260;
    --ac-orange: #E8956F;
    --ac-blue: #8BB8E0;
    --ac-green: #9AB87A;
    --ac-orange-dim: rgba(232,149,111,0.13);
    --ac-blue-dim: rgba(139,184,224,0.13);
    --ac-green-dim: rgba(154,184,122,0.13);
    --grid-line: rgba(255,255,255,0.03);
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5);
    --shadow-md: 0 8px 32px rgba(0,0,0,0.65);
    --shadow-lg: 0 24px 80px rgba(0,0,0,0.8);
    --grain-op: 0.035;
    --prog-bg: rgba(240,235,227,0.08);
    --prog-fill: rgba(240,235,227,0.55);
  }
}
```

Also add the grain overlay, grid overlay, fadeUp animation, scrollbar styles, and zoom as Tailwind utilities or plain CSS.

- [ ] **Step 3: Extend tailwind.config.ts**

Add font families, extend colors to reference CSS variables, add custom animations:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-lora)', 'Lora', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      colors: {
        'gf-orange': 'var(--ac-orange)',
        'gf-blue': 'var(--ac-blue)',
        'gf-green': 'var(--ac-green)',
        'gf-orange-dim': 'var(--ac-orange-dim)',
        'gf-blue-dim': 'var(--ac-blue-dim)',
        'gf-green-dim': 'var(--ac-green-dim)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(13px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.38s ease both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
```

- [ ] **Step 4: Update root layout.tsx with fonts and ThemeProvider**

```typescript
import type { Metadata } from 'next';
import { lora, dmSans } from '@/lib/fonts';
import { ThemeProvider } from '@/lib/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'GuideFlow',
  description: 'Clinical guidelines and residency tracking platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} ${dmSans.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Install next-themes**

```bash
npm install next-themes
```

Create `src/lib/theme-provider.tsx`:

```typescript
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 6: Verify dev server renders with correct fonts and dark theme**

```bash
npm run dev
```

Visit localhost:3000 — should render dark background (#131313) with DM Sans body text.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/lib/fonts.ts src/lib/theme-provider.tsx tailwind.config.ts
git commit -m "feat: map GuideFlow design tokens to Tailwind + shadcn CSS vars"
```

---

### Task 4: Build layout shell (nav + sidebar + footer)

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/components/layout/top-nav.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/sidebar-section.tsx`
- Create: `src/components/layout/service-switcher.tsx`
- Create: `src/components/layout/footer.tsx`
- Create: `src/components/shared/grid-overlay.tsx`
- Create: `src/components/shared/search-bar.tsx`

- [ ] **Step 1: Create TopNav component**

Port the `<nav>` element from prototype lines 51-89. Use shadcn `Button`, `DropdownMenu` for service switcher and nav dropdowns. Include:
- Logo mark (G) + "GuideFlow" + divider + service switcher
- Center nav items: Guidelines, Directory, Analytics (each with dropdown)
- Right: search bar (cmd+K), theme toggle, login/logout, avatar
- Fixed position, 52px height, backdrop blur, z-index 200
- Use `useTheme()` from next-themes for the toggle
- Use `usePathname()` to highlight active nav item

- [ ] **Step 2: Create Sidebar component**

Port sidebar from prototype lines 92-813. Sidebar is context-dependent — shows different sections based on current route. Use `usePathname()` to conditionally render sidebar sections.

Routes and their sidebar content:
- `/rotation` → Quick Links, Guidelines, On-Call
- `/case-logs` → Views (Dashboard, Trends), Filters (This month, Rotation, All)
- `/fellowship` → Goal, Timeline, Requirements
- `/heatmap` → Legend, Compare
- `/guidelines` → same as rotation
- `/admin` → Guidelines, Directory, Users

Each section uses `SidebarSection` with a label and list of `sb-link` buttons.

Props: `{ activePage: string }` — determines which sections to show.

- [ ] **Step 3: Create GridOverlay component**

```typescript
export function GridOverlay() {
  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-[220px] pointer-events-none z-0"
      style={{
        backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  );
}
```

- [ ] **Step 4: Create Footer component**

Simple footer: `© 2026 PMG Health Technologies` + Privacy / Terms / Support / HIPAA links.

- [ ] **Step 5: Create dashboard layout**

`src/app/(dashboard)/layout.tsx` wires it all together:

```typescript
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <GridOverlay />
      <div className="flex pt-[52px] min-h-screen relative z-[1]">
        <Sidebar />
        <main className="ml-[220px] flex-1 px-14 py-7 max-w-[1040px] relative z-[2]">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Create a placeholder rotation page to test layout**

```typescript
// src/app/(dashboard)/rotation/page.tsx
export default function RotationPage() {
  return (
    <div>
      <span className="block text-xs font-medium tracking-[0.11em] uppercase text-[var(--text-3)] mb-3">
        General Surgery Rotation
      </span>
      <h1 className="font-serif text-[38px] font-medium text-[var(--text-1)] tracking-[-0.8px] leading-[1.15] mb-3">
        Rotation Dashboard
      </h1>
      <p className="text-[17px] font-light text-[var(--text-2)] leading-[1.65] mb-9 max-w-[500px]">
        Placeholder — panels will be ported next.
      </p>
    </div>
  );
}
```

- [ ] **Step 7: Set root page.tsx to redirect**

```typescript
import { redirect } from 'next/navigation';
export default function Home() { redirect('/rotation'); }
```

- [ ] **Step 8: Verify in browser**

```bash
npm run dev
```

Navigate to localhost:3000 — should see dark theme, fixed nav at top, sidebar on left, "Rotation Dashboard" text in main area, grid overlay behind content, footer at bottom.

- [ ] **Step 9: Commit**

```bash
git add src/app/ src/components/layout/ src/components/shared/
git commit -m "feat: build dashboard layout shell with nav, sidebar, grid overlay, and footer"
```

---

## Chunk 2: Port Rotation Dashboard (Home)

### Task 5: Build shared components used across pages

**Files:**
- Create: `src/components/shared/page-header.tsx`
- Create: `src/components/shared/panel.tsx`
- Create: `src/components/shared/panel-header.tsx`
- Create: `src/components/shared/stat-card.tsx`
- Create: `src/components/shared/role-badge.tsx`
- Create: `src/components/shared/tag.tsx`

- [ ] **Step 1: Create PageHeader**

Reusable component rendering the eyebrow + title + subtitle pattern:

```typescript
interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}
```

Uses `font-serif text-[38px] font-medium tracking-[-0.8px]` for title, `text-xs font-medium tracking-[0.11em] uppercase text-[var(--text-3)]` for eyebrow.

- [ ] **Step 2: Create Panel and PanelHeader**

Panel: `bg-[var(--bg-raised)] rounded-xl relative z-[2] overflow-hidden` (no border, no shadow — matches prototype).

PanelHeader: `px-[22px] pt-4 pb-[14px] flex items-center justify-between` with title (14px font-semibold) and optional subtitle/action slot.

- [ ] **Step 3: Create StatCard, RoleBadge, Tag**

- StatCard: metric label (10px uppercase), number (Lora 26px), optional denominator, optional progress bar
- RoleBadge: SC (orange), SJ (blue), TA (green), FA (neutral) — uses `--ac-*-dim` backgrounds
- Tag: neutral stone pill with `--accent-dim` bg and `--border-hi` border

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add shared components — PageHeader, Panel, StatCard, RoleBadge, Tag"
```

---

### Task 6: Port Rotation Dashboard page

**Files:**
- Create: `src/components/rotation/quick-links-grid.tsx`
- Create: `src/components/rotation/guidelines-list.tsx`
- Create: `src/components/rotation/guidelines-grid.tsx`
- Create: `src/components/rotation/on-call-panel.tsx`
- Create: `src/components/rotation/listen-panel.tsx`
- Create: `src/components/rotation/deadlines-panel.tsx`
- Create: `src/components/rotation/wellness-panel.tsx`
- Create: `src/data/mock-oncall.ts`
- Create: `src/data/conferences.ts`
- Create: `src/hooks/use-deadlines.ts`
- Modify: `src/app/(dashboard)/rotation/page.tsx`

- [ ] **Step 1: Create QuickLinksGrid**

Port the 2-column cards grid (Case Logs, On-Call Directory) from prototype line 818. Use shadcn `Card` with custom styling to match `.card` class. Each card has icon (SVG), stat line, title, description, arrow.

- [ ] **Step 2: Create GuidelinesList and GuidelinesGrid**

Port both views — list view (`.list-card` with `.list-row` items) and grid view (`.guide-grid` with `.guide-card` items including the hand-drawn SVG illustrations on colored backgrounds). Include the view toggle (list/grid).

- [ ] **Step 3: Create OnCallPanel**

Port the on-call directory panel. Use mock data from `src/data/mock-oncall.ts`. Show service, attending name, phone/pager. Uses Panel + PanelHeader.

- [ ] **Step 4: Create ListenPanel with BTK logo**

Port the podcast "Listen" panel. Inline the exact BTK SVG logo (from prototype line 1267-1275) with `fill="currentColor"` for text paths and `fill="#CE002F"` for blood drop. Wrap in `<a href="https://behindtheknife.org/" target="_blank">` with hover color transition.

- [ ] **Step 5: Create conference data and deadline engine**

Create `src/data/conferences.ts` — typed TypeScript version of the JSON database (20 conferences with id, name, abbr, fellowships, deadlineMonth, confMonth, awards, url).

Create `src/hooks/use-deadlines.ts` — port the deadline calculation engine:
- `getNextDeadline(month)`: calculates next occurrence of the 15th of that month
- `daysUntil(date)`: days from today
- `getConferencesForFellowship(goal)`: filters by 'all' or matching fellowship
- Returns sorted deadline rows with urgency color coding
- Export as a React hook: `useDeadlines(fellowship: string)`

- [ ] **Step 6: Create DeadlinesPanel**

Port the Abstract Deadlines panel. Calls `useDeadlines('HPB')`, renders sorted rows with clickable links, color-coded urgency (red < 30d, orange < 90d, green > 90d), award indicators.

- [ ] **Step 7: Create WellnessPanel**

Port the wellness check-in reminder panel (simpler panel with check-in button).

- [ ] **Step 8: Wire rotation/page.tsx**

Compose all components:
```typescript
export default function RotationPage() {
  return (
    <div className="animate-fade-up">
      <PageHeader eyebrow="General Surgery Rotation" title="Rotation Dashboard" />
      <div className="text-xs text-[var(--text-3)] mb-6">Jan 6 – Mar 27, 2026</div>
      <QuickLinksGrid />
      <SectionDivider label="Most Recent" />
      <GuidelinesList />
      <div className="grid grid-cols-2 gap-5 mt-5">
        <OnCallPanel />
        <ListenPanel />
      </div>
      <div className="grid grid-cols-2 gap-5 mt-5">
        <DeadlinesPanel />
        <WellnessPanel />
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Verify visually — compare with prototype**

```bash
npm run dev
```

Open localhost:3000/rotation and compare with prototype at localhost:8766. Check: cards, guidelines list/grid, on-call panel, BTK logo, deadlines, theme toggle.

- [ ] **Step 10: Commit**

```bash
git add src/components/rotation/ src/data/ src/hooks/ src/app/\(dashboard\)/rotation/
git commit -m "feat: port Rotation Dashboard with guidelines, on-call, deadlines, podcasts"
```

---

## Chunk 3: Port Case Log Dashboard

### Task 7: Port Case Log page

**Files:**
- Create: `src/components/case-logs/donut-chart.tsx`
- Create: `src/components/case-logs/trend-chart.tsx`
- Create: `src/components/case-logs/role-chart.tsx`
- Create: `src/components/case-logs/acgme-progress.tsx`
- Create: `src/components/case-logs/case-log-form.tsx`
- Create: `src/components/case-logs/bedside-form.tsx`
- Create: `src/components/case-logs/recent-cases-table.tsx`
- Create: `src/components/case-logs/metrics-strip.tsx`
- Create: `src/data/acgme-categories.ts`
- Create: `src/data/mock-cases.ts`
- Modify: `src/app/(dashboard)/case-logs/page.tsx`

- [ ] **Step 1: Install chart dependencies**

```bash
npm install react-chartjs-2 chart.js
```

- [ ] **Step 2: Create chart components**

Port the three Chart.js instances from prototype lines 1933-1940:
- `DonutChart`: total cases (127/850), cutout 78%, orange fill on dark bg
- `TrendChart`: monthly bar chart (12 months), blue bars
- `RoleChart`: role breakdown doughnut (SJ/FA/TA/SC)

All charts must use `useTheme()` to read CSS variables for colors, re-render on theme change.

Wrap Chart.js registration in a client component:
```typescript
'use client';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);
```

- [ ] **Step 3: Create MetricsStrip**

Port the 4-column metrics row: SC (0/200), PGY-3 Cutoff (127/250), Teaching Asst (4/25), This Month (14 cases). Use `StatCard` component with colored progress bars.

- [ ] **Step 4: Create ACGMEProgress**

Port the ACGME category progress bars from prototype line 1926-1931. Use `acgme-categories.ts` data (14 categories with name, min, logged, benchmark). Render rows with name, progress bar (color-coded by percentage), count, percentage, delta vs benchmark.

- [ ] **Step 5: Create CaseLogForm**

Port the "Log a Case" panel with operative/bedside toggle. Use shadcn `Select`, `Input`, `Textarea`, `Checkbox`, `Button`. Include:
- Toggle between Operative Case and Bedside Procedure (tab-style)
- Operative form: Case ID, Date, PGY, Rotation, Role, Site, Attending, Patient Type, Autonomy (Zwisch), Category (optgroups), Procedure/CPT, Trauma checkbox, Comments
- Bedside form: Procedure Type, Site/Laterality, Ultrasound-Guided, Supervision, Complications, Date, Attending, Comments
- Submit button updates case count (client state for now)

- [ ] **Step 6: Create RecentCasesTable**

Port the recent cases table. Use shadcn `Table` with columns: Procedure, Date, Role (RoleBadge), Category. Mock data from `mock-cases.ts`.

- [ ] **Step 7: Wire case-logs/page.tsx**

Layout: hero row (donut + trend), metrics strip, charts row (role + ACGME), two-col (form + recent table).

- [ ] **Step 8: Verify charts render correctly in both themes**

Toggle dark/light — all chart colors should update.

- [ ] **Step 9: Commit**

```bash
git add src/components/case-logs/ src/data/ src/app/\(dashboard\)/case-logs/
git commit -m "feat: port Case Log Dashboard with charts, ACGME progress, and log form"
```

---

## Chunk 4: Port Remaining Pages

### Task 8: Port Fellowship Readiness page

**Files:**
- Create: `src/components/fellowship/readiness-score.tsx`
- Create: `src/components/fellowship/timeline.tsx`
- Create: `src/components/fellowship/requirements-grid.tsx`
- Create: `src/app/(dashboard)/fellowship/page.tsx`

- [ ] **Step 1: Port fellowship page from prototype + page-snippets/fellowship.html**

Read `page-snippets/fellowship.html` (222 lines) and `page-snippets/fellowship-sidebar.html` for the full fellowship page content. Build:
- Readiness score (large percentage display)
- Fellowship milestone timeline (horizontal with dots/connectors)
- Requirements cards grid (research, cases, letters, etc.)

- [ ] **Step 2: Verify and commit**

```bash
git add src/components/fellowship/ src/app/\(dashboard\)/fellowship/
git commit -m "feat: port Fellowship Readiness page"
```

---

### Task 9: Port Operative Autonomy Heatmap page

**Files:**
- Create: `src/components/heatmap/autonomy-grid.tsx`
- Create: `src/components/heatmap/legend-strip.tsx`
- Create: `src/components/heatmap/divergence-alerts.tsx`
- Create: `src/app/(dashboard)/heatmap/page.tsx`

- [ ] **Step 1: Port heatmap page from prototype lines 1722-1904 + page-snippets**

Build:
- Color legend strip (5 levels: near independent → not yet done)
- 4-column grid of procedure cards, each with:
  - Background color based on EPA level (green-dim, blue-dim, orange-dim, red-dim)
  - Procedure name, level, assessment count
  - Inner dot (bottom-right) colored by autonomy given
- Divergence alerts: orange warning cards for mismatches between assessment and autonomy

- [ ] **Step 2: Verify and commit**

```bash
git add src/components/heatmap/ src/app/\(dashboard\)/heatmap/
git commit -m "feat: port Operative Autonomy Heatmap page"
```

---

### Task 10: Port Admin page

**Files:**
- Create: `src/components/admin/admin-tabs.tsx`
- Create: `src/components/admin/guideline-upload.tsx`
- Create: `src/components/admin/directory-table.tsx`
- Create: `src/components/admin/users-table.tsx`
- Create: `src/app/(dashboard)/admin/page.tsx`

- [ ] **Step 1: Port admin page from prototype lines 945-end**

Use shadcn `Tabs` for Guidelines / Directory / Users sections. Build:
- Guidelines tab: stat cards (3-col), file upload dropzone, published guidelines list
- Directory tab: on-call directory management table
- Users tab: invite form + users table with roles

- [ ] **Step 2: Verify and commit**

```bash
git add src/components/admin/ src/app/\(dashboard\)/admin/
git commit -m "feat: port Admin page with guidelines upload, directory, and users management"
```

---

### Task 11: Port Login page

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/components/login/login-card.tsx`
- Create: `src/components/login/confirm-view.tsx`

- [ ] **Step 1: Port login page from prototype lines 1919-1960**

Login page has its own layout — no sidebar, no dashboard nav. Full-screen centered with:
- Grid background (40px squares using `--border` color)
- Radial gradient fade overlay
- Hospital badge (icon + "St. Michael's Hospital")
- Login card: title, email input, magic link button, "Or" divider, footer link
- Confirm view: email icon, "Check your email" title, resend timer

Use the `(auth)` route group so it doesn't inherit the dashboard layout.

Create `src/app/(auth)/layout.tsx` with just the nav (simplified — no sidebar) and grid background.

- [ ] **Step 2: Verify email validation works**

Test domain validation: only `stmichaels.org`, `stmichaels.com`, `stmichaels.ca` accepted.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(auth\)/ src/components/login/
git commit -m "feat: port Login page with magic link flow and email validation"
```

---

## Chunk 5: Polish + Verification

### Task 12: Wire sidebar navigation and page transitions

**Files:**
- Modify: `src/components/layout/sidebar.tsx`
- Modify: `src/components/layout/top-nav.tsx`

- [ ] **Step 1: Wire sidebar links to Next.js Link**

Replace button `onclick` handlers with `<Link href="/rotation">` etc. Use `usePathname()` to set `.active` class on current page link.

- [ ] **Step 2: Wire nav dropdown links**

Nav dropdowns should link to real routes:
- Analytics → Case Logs: `/case-logs`
- Analytics → Fellowship: `/fellowship`
- Analytics → Heatmap: `/heatmap`
- Guidelines: `/guidelines` (or `/rotation` for now)
- Admin: `/admin`

- [ ] **Step 3: Add page transition animation**

Each page should animate in with `fadeUp` (0.38s). Add `animate-fade-up` class to the main content wrapper of each page.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/ src/app/
git commit -m "feat: wire sidebar and nav links with Next.js routing and page transitions"
```

---

### Task 13: Visual regression check

- [ ] **Step 1: Run dev server and compare all 7 pages**

For each page, open both:
- Prototype: `http://localhost:8766/guideflow-app.html`
- Next.js: `http://localhost:3000/<route>`

Check:
- [ ] Rotation Dashboard — cards, guidelines, on-call, BTK logo, deadlines
- [ ] Case Logs — charts, metrics, ACGME bars, form, table
- [ ] Fellowship — readiness score, timeline, requirements
- [ ] Heatmap — grid colors, divergence alerts
- [ ] Admin — tabs, upload, directory, users
- [ ] Login — grid bg, card, validation, confirm flow
- [ ] Theme toggle — all pages render correctly in both dark and light

- [ ] **Step 2: Fix any visual discrepancies found**

Focus on: spacing, font sizes, colors, border-radius, shadow values.

- [ ] **Step 3: Commit fixes**

```bash
git add -A
git commit -m "fix: visual polish — match prototype spacing, colors, and typography"
```

---

### Task 14: Build verification

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors

- [ ] **Step 2: Run ESLint**

```bash
npm run lint
```

Expected: 0 errors

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: Build succeeds, all pages statically renderable.

- [ ] **Step 4: Fix any build errors and commit**

```bash
git add -A
git commit -m "chore: fix build errors and type issues"
```

---

## Summary

| Task | What | Commit |
|------|------|--------|
| 1 | Scaffold Next.js 14 | `chore: scaffold Next.js 14 project` |
| 2 | Install shadcn/ui (15 components) | `chore: install shadcn/ui` |
| 3 | Design tokens → Tailwind + CSS vars | `feat: map GuideFlow design tokens` |
| 4 | Layout shell (nav + sidebar + footer) | `feat: build dashboard layout shell` |
| 5 | Shared components | `feat: add shared components` |
| 6 | Rotation Dashboard | `feat: port Rotation Dashboard` |
| 7 | Case Log Dashboard | `feat: port Case Log Dashboard` |
| 8 | Fellowship Readiness | `feat: port Fellowship Readiness` |
| 9 | Operative Autonomy Heatmap | `feat: port Heatmap` |
| 10 | Admin | `feat: port Admin page` |
| 11 | Login | `feat: port Login page` |
| 12 | Navigation wiring | `feat: wire sidebar and nav links` |
| 13 | Visual regression check | `fix: visual polish` |
| 14 | Build verification | `chore: fix build errors` |

**Total: 14 tasks, ~14 commits, 50+ files created**
