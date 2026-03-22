# Architecture Overview

## System Diagram

```
Browser (subdomain: stmichaels.pmg.app)
    │
    ▼
Cloudflare Workers (Next.js via @opennextjs/cloudflare)
    │
    ├── Middleware: extract subdomain → hospital_id (JWT only, no DB)
    ├── App Router: pages + API routes
    ├── Cloudflare R2: PDF storage (guideline uploads + versioned content)
    ├── Cloudflare Durable Objects: WebSocket connections (real-time)
    ├── Cloudflare Worker Cron: scheduled jobs (QGenda sync, abstract deadlines, podcast cache)
    │
    ├── OpenAI Whisper API: Voice STT (dictation → transcript)
    ├── Claude API: NLP extraction (transcript → structured case fields)
    ├── QGenda REST API: On-call sync (5-min Cloudflare Worker cron)
    ├── ORCID + PubMed API: Research tracking (OAuth + free API)
    ├── BTK RSS + Listen Notes API: Podcast feed (cached in Workers KV)
    ├── Resend: SMS + email for EPA magic links
    │
    ▼
Neon PostgreSQL (serverless, connection pooling)
    ├── Drizzle ORM (type-safe queries, all scoped by hospital_id)
    ├── Row-Level Security (SET LOCAL app.tenant_id per session)
    ├── tsvector + GIN index (Phase 2 full-text search)
    └── pgvector (Phase 3 semantic RAG — natively supported on Neon)
    │
    ▼
React Native (iOS + Android)
    └── SQLite local cache → background sync on reconnect
```

## Observability Stack

| Layer | Tool |
|---|---|
| Error tracking | Sentry |
| Log aggregation | Logflare |
| HIPAA audit | Immutable `audit_logs` table (see schema.md) |
| Search analytics | Derived from audit log + query timing |

## Request Flow

1. User visits `stmichaels.pmg.app/guidelines`
2. Cloudflare Worker receives request
3. Middleware extracts `stmichaels` from `Host` header
4. JWT cookie validated (no DB call) — user's `hospital_id` set in context
5. App Router renders page, server components fetch data scoped to `hospital_id`
6. PostgreSQL session: `SET LOCAL app.tenant_id = $1` before any query
7. Row-Level Security enforces tenant isolation at database layer
8. Drizzle queries include `where(eq(table.hospital_id, ctx.hospitalId))`

## Auth Flow (Magic Link)

1. User enters email on login page
2. Server validates email domain against hospital's allowed domains
3. `resend` sends email with tokenized link (JWT, 15min expiry)
4. User clicks link → server validates token via `jose` → issues session JWT cookie
5. Session JWT contains: `user_id`, `hospital_id`, `role`, `tenant_id`

## JWT + RLS Security Model

The JWT payload contains `tenant_id` and `role`. Every API call sets `SET LOCAL app.tenant_id = $1` at the Postgres session level before executing any query. Row-Level Security policies enforce the same constraint at the database layer independently of the application. This means a misconfigured query cannot leak cross-tenant data even if the application layer has a bug.

## Multi-Tenancy

- Subdomain-based: `stmichaels.pmg.app`, `cityhospital.pmg.app`
- Middleware extracts subdomain, rewrites URL internally
- Auth guards use JWT only — no DB calls in middleware
- All data scoped per tenant at query layer
- PostgreSQL RLS provides defense-in-depth beyond application layer
- Multi-tenancy reduces infrastructure costs by 30–50% vs single-tenant
- Single HIPAA compliance audit covers all tenants

## File Storage

- Guideline PDFs uploaded to Cloudflare R2 via presigned URLs
- Parsed server-side with `unpdf` for full-text indexing
- R2 bucket scoped per hospital: `guidelines/{hospital_id}/{guideline_id}/v{version}.pdf`
- Version history stored in R2; `guideline_versions` table tracks metadata

## Search Strategy

- **Phase 1:** PostgreSQL `ILIKE` on title + content columns
- **Phase 2:** `tsvector` column with GIN index, `ts_rank` for relevance scoring
  - Target: < 200ms perceived latency for ⌘K search
- **Phase 3:** pgvector on same Neon instance (extension already supported)
  - Dual-index alongside tsvector — keyword for navigational queries, vector for natural language
  - Tenant-scoped RAG: "what's our massive transfusion protocol?" returns THIS hospital's answer
  - No migration required; pgvector is additive

## Voice Dictation Pipeline

1. Resident taps mic → browser MediaRecorder captures audio
2. Audio blob sent to OpenAI Whisper API → returns transcript text
3. Transcript sent to Claude API with structured JSON schema prompt
4. Claude extracts: procedure, attending (matched from program roster), role (inferred from PGY + context), defined category, date, rotation
5. Pre-filled form returned to resident for review and submit
6. Edge cases:
   - Unrecognized attending → dropdown fallback
   - Ambiguous role → confirm prompt (or default to SJ for PGY 1–3)
   - Multiple procedures → split prompt

## EPA Assessment Flow

1. Resident submits operative case log
2. Post-submission modal suggests relevant EPA(s) based on defined category
3. One-tap send → fires email + SMS to attending via Resend
4. Attending receives single-use magic link (72-hour expiry)
5. Mobile-optimized 3-phase form: Pre-op / Intra-op / Post-op (ABS 1–5 entrustment scale)
6. Attending confirms or adjusts resident's self-reported Zwisch autonomy level
7. Case table status: Pending → Sent → Received
8. If no response in 72 hours, resident self-report stands

## QGenda Integration

- REST API: `api.qgenda.com/v2`
- Auth: company key + username + password → bearer token
- Cloudflare Worker cron polls every 5 minutes
- Data: Staff (provider) + Task (shift start/end) → `on_call_assignments` table per tenant
- Credentials stored per tenant in encrypted config
- Fallback: last synced data with timestamp if API unavailable
- Today's attending surfaced on rotation landing page — no navigation needed

## Research & Publication Tracking

- ORCID OAuth 2.0 — resident authorizes once at onboarding
- ORCID Public API (free): works, employment, education, peer review, funding
- PubMed API (free): impact factors, citation counts, full metadata
- Auto-updates when resident publishes new work
- Research Intelligence: publication velocity, first-author ratio, journal prestige trajectory, co-author network, mentor concentration risk, momentum score

## Abstract Deadline Engine

- Seed database of 40+ surgical society conferences with typical deadline windows
- Cloudflare Worker cron scrapes deadline pages weekly
- Claude extracts current deadline date from HTML
- Three matching signals: fellowship goal → relevant societies; rotation → topical relevance; PGY year → eligibility
- Community corrections — resident flags changed deadline in one tap
- Lives as a card on rotation landing page; turns red under 4 weeks

## Rotation-Aware Podcast Feed

- BTK RSS feed (public, Libsyn-hosted) — episodes already tagged by specialty
- Listen Notes API — secondary source, full surgery podcast ecosystem
- Episode metadata cached in Cloudflare Workers KV — no live fetch on page load
- Episodes ranked by case gap relevance, not recency (0 liver cases → liver episodes first)
- Sources Phase 1: BTK, Surgeons Cut, SurgOnc Today, SSAT Podcast, Trauma Voice

## Mobile Architecture

| Platform | Approach | Rationale |
|---|---|---|
| iOS + Android | React Native | Single codebase, native performance, App Store |
| Web | Next.js App Router | Same backend, same auth, responsive |
| Offline | SQLite local cache | Cases logged in poor OR connectivity, synced on reconnect |

The mobile app is the primary surface for residents. Voice dictation, case logging, EPA requests, and the rotation landing page are optimized for one-handed use between cases. Shared auth/session model between web and mobile via JWT.

## Real-Time Features (Durable Objects)

Live on-call status updates, guideline co-editing, and real-time notifications all require stateful WebSocket connections. Cloudflare Durable Objects integrate natively with the existing Workers layer and add no new infrastructure dependency.

## EHR Integration Strategy

EHR integration is a progressive enhancement, not a core dependency. GuideFlow works well without it and improves further when available.

### Tier 1 — Standalone (every hospital on day one)
Manual logging with UX improvements (CPT typeahead, quick-log, templates, voice-to-log). Records `source: 'manual'`.

### Tier 2 — CSV Import (no IT partnership required)
Admin upload UI ingests weekly OR scheduling CSV exports → populates resident's "cases this week" confirmation queue. Records `source: 'csv_import'`.

### Tier 3 — FHIR R4 Auto-Sync (Epic App Orchard / Cerner SMART on FHIR)
When resident appears as operating surgeon in EHR, case record auto-drafted in GuideFlow for one-tap confirmation. 6–18 months hospital IT engagement. Records `source: 'fhir_auto'`.

### Architecture Note
The `case_log` submission pipeline is source-agnostic. The `source` enum (`manual | csv_import | fhir_auto`) is stored but downstream ACGME progress calculation ignores it. Adding FHIR later means writing a new ingestion adapter — not redesigning the data model.

## Notification Architecture

Notifications must be role-scoped and service-scoped. Broadcast alerts have near-zero engagement and contribute to alert fatigue (4–51% typical range). The system targets 49%+ acceptance via patient-specific, clinically valid triggers.

- Admin targets by role (e.g. "all General Surgery residents") and service
- Users configure per-service preferences
- Phase 3: A/B test infrastructure for notification format experiments

## Competitive Positioning

| Tool | Case Log | EPA | Benchmarking | Fellowship | Procedures | Heatmap | Podcasts | Research | Guidelines | Wellness |
|---|---|---|---|---|---|---|---|---|---|---|
| **GuideFlow** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SIMPL / ABS EPA App | – | ✓ | – | – | – | – | – | – | – | – |
| Firefly | – | ✓ | – | – | – | – | – | – | – | – |
| New Innovations | ✓ | Partial | – | – | Partial | – | – | – | – | – |
| MedHub | ✓ | Partial | – | – | Partial | – | – | – | – | – |
| PolicyStat | – | – | – | – | – | – | – | – | ✓ | – |
| ACGME ADS | ✓ | – | – | – | – | – | – | – | – | – |

**Key insight:** GuideFlow is the only platform connecting case logging to EPA, autonomy tracking, fellowship readiness, research tracking, and educational content in one workflow contextualized to the resident's current rotation.

GuideFlow does not compete with UpToDate on content breadth. The correct positioning: GuideFlow is the operating system for the residency program and clinical operations. Admins can embed UpToDate deep-links inside guidelines, positioning GuideFlow as the institutional home that organizes external knowledge.

## Integrations Summary

| Integration | API | Auth | Sync | Purpose |
|---|---|---|---|---|
| QGenda | REST v2 | Bearer token | 5-min cron | On-call schedule |
| ORCID | REST | OAuth 2.0 | On-demand | Research tracking |
| PubMed | REST | None (free) | On-demand | Citation data |
| OpenAI Whisper | REST | API key | Per-request | Voice STT |
| Claude API | REST | API key | Per-request | NLP extraction |
| Resend | REST | API key | Per-request | Email + SMS |
| BTK RSS | RSS/XML | None | Cached in KV | Podcast feed |
| Listen Notes | REST | API key | Cached in KV | Podcast search |
| ACGME ADS | CSV export | N/A | Manual upload | Case log export |

## Research References

| Topic | Source | Key Takeaway |
|---|---|---|
| EHR case logging adoption | Implementation Science Communications (2020), DOI: 10.1186/s43058-020-00039-z | Reducing logging friction recovers most compliance benefit |
| Alert fatigue in CDS | Computer Methods and Programs in Biomedicine (2023), DOI: 10.1016/j.cmpb.2023.107869 | Role-scoped, service-filtered notifications only |
| A/B testing CDS UX | JMIR (2021), DOI: 10.2196/16651 | Build A/B test infrastructure into admin layer |
| Point-of-care UX | Thieme Connect (2022), DOI: 10.1055/s-0041-1742216 | ⌘K search must return < 200ms perceived latency |
| Guideline platform challenges | MJPUMCH (2025), DOI: 10.12290/xhyxzz.2024-0496 | Tenant-scoped search addresses utilization problem |
| Co-design guidelines platforms | Pediatric Research (2025), DOI: 10.1038/s41390-025-04503-1 | Deploy in one hospital service for 90 days before scaling |
