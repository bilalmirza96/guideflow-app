# Contributing to GuideFlow

Guidelines for contributing to the GuideFlow project.

---

## Getting Set Up

```bash
git clone https://github.com/bilalmirza96/guideflow-app.git
cd guideflow-app
npm install
npm run dev
```

Verify the app runs at `http://localhost:3000` before making changes.

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to Vercel |
| `MBM_03/22/26` | Active development branch |
| Feature branches | Branch off `main`, PR back in |

### Naming Convention

Feature branches: `feature/short-description`
Bug fixes: `fix/short-description`
Docs: `docs/short-description`

---

## Development Workflow

1. Create a feature branch from `main`
2. Make changes, ensuring `npm run lint` and `npm run build` pass
3. Commit with a clear message describing **what** and **why**
4. Push and open a pull request against `main`
5. Vercel generates a preview deploy automatically for the PR

---

## Code Conventions

### TypeScript

All code is TypeScript. No `any` types unless absolutely necessary and documented with a comment explaining why.

### Components

Components live in `src/components/` organized by domain:

- One component per file
- File name matches the component name in kebab-case (e.g., `quick-links-grid.tsx` exports `QuickLinksGrid`)
- `"use client"` directive at the top of any component using hooks or browser APIs
- Props are typed with interfaces, not inline types

### Styling

Tailwind CSS with design tokens. Do not use:

- Inline `style` attributes (use Tailwind arbitrary values instead)
- Separate CSS files per component
- Hardcoded color values — always reference design tokens via `var(--token-name)`

Example:
```tsx
// Good
<div className="bg-[var(--bg-2)] text-[var(--text-1)]">

// Bad
<div className="bg-gray-900 text-white">
<div style={{ backgroundColor: '#1a1a2e' }}>
```

### Imports

Order imports consistently:

1. React / Next.js
2. Third-party libraries
3. Components (from `@/components/`)
4. Data / hooks / utils (from `@/data/`, `@/hooks/`, `@/lib/`)

### File Structure

When adding a new page:

1. Create the route in `src/app/(dashboard)/your-page/page.tsx`
2. Create a component folder in `src/components/your-page/`
3. Add navigation links in `sidebar.tsx` and `top-nav.tsx`
4. Use the `animate-fade-up` class on the page's `<main>` element

---

## Quality Checks

Before pushing, ensure both pass:

```bash
npm run lint    # ESLint with next/core-web-vitals
npm run build   # Full production build
```

---

## Design Tokens

If you need to add new design tokens:

1. Define the CSS custom property in `src/app/globals.css` under both `:root` (dark) and `.light` selectors
2. Document the token's purpose with a comment
3. Reference it in components via `var(--your-token)`

---

## Adding Dependencies

Before adding a new package:

- Check if an existing dependency already covers the need
- Prefer packages that are already in the shadcn/ui ecosystem (Radix UI)
- Keep bundle size in mind — this is a clinical tool that needs to load fast

---

## Questions

Open an issue on the repo or reach out to the team directly.
