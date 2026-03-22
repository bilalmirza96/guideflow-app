# API Module

## Purpose
Next.js App Router API routes (`app/api/`). All endpoints are REST, return JSON.

## Conventions
- Every route validates input with Zod
- Every route checks auth via `getSession()` helper
- Every query scopes by `hospital_id` from session context
- Before any query: `SET LOCAL app.tenant_id = $1` (RLS enforcement)
- Admin-only routes check `session.role === 'hospital_admin'`
- Every mutating action appends to `audit_logs` table
- Errors return `{ error: string }` with appropriate HTTP status

## Routes

### Auth
```
POST   /api/auth/magic-link     — send magic link email
GET    /api/auth/verify          — verify token, issue session JWT
POST   /api/auth/logout          — clear session cookie
```

### Guidelines
```
GET    /api/guidelines           — list guidelines (filterable by specialty, status, search)
GET    /api/guidelines/:id       — get single guideline with rating stats
POST   /api/guidelines           — create guideline (admin)
PATCH  /api/guidelines/:id       — update guideline (admin) → creates version record
DELETE /api/guidelines/:id       — soft-delete guideline (admin)
POST   /api/guidelines/upload    — upload PDF to R2 (admin)
GET    /api/guidelines/:id/versions — list version history
GET    /api/guidelines/:id/versions/:v — get specific version content (for diff)
GET    /api/guidelines/search    — ⌘K search endpoint (ILIKE → tsvector → pgvector)
```

### Ratings
```
POST   /api/guidelines/:id/rate  — submit/update rating (healthcare_professional)
GET    /api/guidelines/:id/ratings — get ratings for a guideline
```

### Case Logs
```
GET    /api/case-logs            — list user's case logs (filterable by attending, category, date range)
POST   /api/case-logs            — create case log entry
PATCH  /api/case-logs/:id        — update (e.g. complete a quick-log)
GET    /api/case-logs/stats      — ACGME progress stats (totals, by-category, by-role)
GET    /api/case-logs/by-attending — cases grouped by attending (for attending filter)
GET    /api/case-logs/autonomy   — progressive autonomy data (per-attending, per-procedure)
GET    /api/case-logs/autonomy-heatmap — operative autonomy heatmap data (category × Zwisch × EPA)
POST   /api/case-logs/import     — CSV import (admin uploads OR schedule CSV)
```

### EPA Requests
```
POST   /api/epa/request           — send EPA request to attending (auto after case log)
GET    /api/epa/requests          — list EPA requests for user (filterable by status)
GET    /api/epa/requests/:id      — get single EPA request with assessment
```

### EPA Assessments (Attending — magic link auth)
```
GET    /api/epa/assess/:token     — load assessment form (validates magic link token)
POST   /api/epa/assess/:token     — submit EPA assessment (pre-op/intra-op/post-op + Zwisch)
```

### Rotations
```
GET    /api/rotations             — list user's rotations
POST   /api/rotations             — set current rotation (onboarding or manual switch)
GET    /api/rotations/current     — get current rotation context
GET    /api/rotations/landing     — rotation landing page data (cases, EPAs, guidelines, podcasts, deadlines, on-call)
```

### Fellowship Tracking
```
GET    /api/fellowship            — get user's fellowship goal + readiness score
POST   /api/fellowship            — set fellowship goal (onboarding)
PATCH  /api/fellowship            — update fellowship goal
GET    /api/fellowship/readiness  — detailed gap analysis (cases, research, EPAs vs. matched applicant avg)
GET    /api/fellowship/benchmarks — matched applicant benchmark data for selected fellowship
```

### Research Tracking
```
GET    /api/research/publications — list user's publications (from ORCID + PubMed)
POST   /api/research/sync         — trigger ORCID sync
GET    /api/research/stats        — research intelligence (velocity, first-author ratio, momentum score)
GET    /api/research/coauthors    — co-author network data
```

### Wellness
```
GET    /api/wellness/checkins     — list user's wellness check-ins (paginated)
POST   /api/wellness/checkins     — submit weekly check-in (sleep, mood, stress, instruments)
GET    /api/wellness/trends       — trend data for charts (PHQ-9, GAD-7, Epworth over time)
GET    /api/wellness/resources    — evidence-backed protocol cards by domain
```

### Bedside Procedures
```
GET    /api/bedside-procedures         — list user's bedside procedures
POST   /api/bedside-procedures         — log bedside procedure
PATCH  /api/bedside-procedures/:id     — update procedure
GET    /api/bedside-procedures/stats   — counts by type, supervision status
GET    /api/bedside-procedures/export  — credentialing PDF certificate
```

### Podcast Feed
```
GET    /api/podcasts              — rotation-aware episode list (ranked by case gap relevance)
GET    /api/podcasts/sources      — list available podcast sources
```

### Conference Deadlines
```
GET    /api/deadlines             — upcoming deadlines (filtered by fellowship goal + rotation)
POST   /api/deadlines/:id/correct — community correction (resident flags changed date)
```

### Benchmarking
```
GET    /api/benchmarks/personal   — personal trend data (case velocity, EPA trajectory, autonomy)
GET    /api/benchmarks/cohort     — cohort comparison (same PGY, rotation, program)
GET    /api/benchmarks/attending  — attending feedback patterns (response rate, time, richness)
```

### Onboarding
```
POST   /api/onboarding            — complete 4-step onboarding (program, rotation, fellowship, ORCID)
GET    /api/onboarding/status     — check onboarding completion status
```

### Exports
```
GET    /api/exports/acgme-csv     — ACGME ADS-formatted CSV export of all case logs
GET    /api/exports/credentialing — bedside procedure credentialing PDF
GET    /api/exports/ccc-report    — CCC report auto-generation (program director only)
GET    /api/exports/rotation-debrief — smart rotation debrief (auto-generated at rotation end)
```

### QGenda Sync (Internal — Cloudflare Worker cron)
```
POST   /api/internal/qgenda/sync  — triggered by Worker cron every 5 minutes
GET    /api/internal/qgenda/status — last sync timestamp and health
```

### Attending Feedback (Phase 2)
```
POST   /api/case-logs/:id/feedback — submit attending feedback (3-field Likert)
GET    /api/case-logs/:id/feedback — get feedback for a case
```

### Directory
```
GET    /api/directory            — list contacts (filterable by service, role)
POST   /api/directory            — add contact (admin)
PATCH  /api/directory/:id        — update contact (admin)
DELETE /api/directory/:id        — delete contact (admin)
GET    /api/directory/on-call    — current on-call schedule
GET    /api/directory/escalation — escalation paths by service
```

### Users
```
GET    /api/users                — list users (admin)
POST   /api/users/invite         — send invite email (admin)
PATCH  /api/users/:id/role       — change role (admin)
```

### Audit (Admin)
```
GET    /api/audit-logs           — query audit logs (admin, filterable)
```

### Hospitals (Developer)
```
POST   /api/hospitals            — provision new tenant (developer)
GET    /api/hospitals/:subdomain — check subdomain availability
```
