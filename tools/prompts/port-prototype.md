# Prompt: Port Prototype Page to Next.js

Use this prompt template when asking Claude Code to port a page from the HTML prototype to a proper Next.js React component.

---

## Template

```
Port the [PAGE_NAME] page from prototype/guideflow-app.html into a Next.js App Router page.

Reference files:
- prototype/guideflow-app.html — the complete working prototype
- docs/design-tokens.md — color tokens and typography
- docs/schema.md — database tables

Requirements:
1. Create the page at src/app/[route]/page.tsx
2. Extract reusable components into src/components/
3. Use Tailwind CSS classes mapped to our design tokens (see docs/design-tokens.md)
4. Use shadcn/ui components where they fit (Button, Card, Input, Select, Table, Badge)
5. Server components by default — only add 'use client' where interactivity requires it
6. TypeScript strict mode — no `any` types
7. Match the prototype's layout, spacing, typography, and colors exactly
8. Dark/light mode via Tailwind dark: prefix
9. Responsive — works on desktop (primary) and tablet

Don't forget:
- Lora font for headings, DM Sans for body
- Grain texture overlay
- fadeUp entrance animation
- The editorial spacing and uppercase labels
```

## Pages to Port

1. `navigate('home')` → `src/app/page.tsx` (Service Dashboard)
2. `navigate('caselogs')` → `src/app/case-logs/page.tsx`
3. `navigate('admin')` → `src/app/admin/page.tsx`
4. `navigate('login')` → `src/app/login/page.tsx`
