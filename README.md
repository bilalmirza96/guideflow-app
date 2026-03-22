# GuideFlow — PMG Platform

A multi-tenant clinical guidelines platform for hospitals. Residents and clinicians can search and browse institutional protocols, log operative cases against ACGME requirements, and access on-call directories — all scoped per hospital via subdomain.

## Quick Start

```bash
npm install
npm run dev        # Next.js dev server
npm run db:push    # Push Drizzle schema to Neon
npm run db:studio  # Open Drizzle Studio
```

## Stack

Next.js (App Router) · Cloudflare Workers · Neon PostgreSQL · Drizzle ORM · Tailwind CSS · shadcn/ui

## Multi-Tenancy

Each hospital gets its own subdomain (e.g. `stmichaels.pmg.app`). Middleware extracts the subdomain and scopes all queries to that tenant.

## Prototype

Open `prototype/guideflow-app.html` in a browser for the full UI reference. It contains 4 complete pages: Home Dashboard, Case Log Dashboard, Admin Panel, and Login.

## License

Private — PMG Health Technologies
