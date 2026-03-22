# ADR-001: Subdomain-Based Multi-Tenancy

**Status:** Accepted
**Date:** 2026-03-15

## Context

GuideFlow serves multiple hospitals. Each hospital needs isolated data (guidelines, users, case logs, directory). We need a tenancy strategy.

## Options Considered

1. **Subdomain routing** — `stmichaels.pmg.app` → middleware extracts tenant
2. **Path-based** — `pmg.app/stmichaels/guidelines` → tenant in URL path
3. **Database per tenant** — separate Neon databases per hospital

## Decision

**Subdomain routing** with single database, query-level isolation.

## Rationale

- Subdomains feel like dedicated apps — better UX for hospitals
- Single database is simpler to maintain, migrate, and back up
- Query-level scoping via `hospital_id` FK on all tables
- Middleware extracts subdomain from `Host` header, sets `hospital_id` in context
- JWT auth in middleware — no DB calls, fast edge execution on Cloudflare

## Consequences

- Must handle subdomain extraction in Cloudflare Workers middleware
- Local dev needs wildcard DNS or manual host header override
- All Drizzle queries must include `hospital_id` filter — enforce via helper function
