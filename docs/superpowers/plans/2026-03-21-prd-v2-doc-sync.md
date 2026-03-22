# PRD v2.0 Full Doc Sync — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize all 6 project architecture documents with the expanded PRD v2.0, adding new tables, API routes, roles, integrations, and a restructured roadmap.

**Architecture:** Each task updates one file independently. Tasks 1–6 can run in parallel (different files, no dependencies). Task 7 is a cross-file consistency verification.

**Tech Stack:** Markdown documentation files, Drizzle ORM schema definitions (TypeScript in markdown), REST API route definitions.

**Source of Truth:** `/GUIDEFLOW-PRD.md` (649 lines, v2.0)

---

## Chunk 1: Core Document Updates

### Task 1: Update CLAUDE.md — Project Memory

**Files:**
- Modify: `CLAUDE.md` (root of guideflow-project)
- Reference: `GUIDEFLOW-PRD.md` sections 1–4, 7, 10–14

**What changes:**

The current CLAUDE.md has 3 roles. PRD v2.0 defines 6 roles. The tech stack is missing 6 new technologies. The phases are structured differently. The competitive positioning table is narrower. Pages built table is outdated (shows 4 new pages as "Next" but they were already built). Core Loop concept is absent.

- [ ] **Step 1: Update Project Overview paragraph**

Replace the first paragraph to include the Core Loop concept from PRD §1–2. Add: "The core insight: a single 10-second action — logging a case or procedure — simultaneously satisfies ACGME documentation, triggers an attending EPA assessment, advances fellowship readiness tracking, and updates the resident's operative autonomy profile."

- [ ] **Step 2: Update Roles table**

Replace the 3-role table with 6 roles from PRD §10:

```markdown
## Roles

| Role | Access |
|---|---|
| Resident | Read guidelines/directory; own case logs; request/view own EPAs; personal analytics |
| Attending Surgeon | Read guidelines/directory; complete EPA assessments via magic link |
| Program Director | Read guidelines; view all resident case logs/EPAs; full program analytics |
| GME Coordinator | Read/Write guidelines & directory; all resident data; full admin |
| Hospital Admin | Full CRUD all resources; full analytics; full admin |
| Developer | Tenant provisioning (Register Hospital page) |
```

- [ ] **Step 3: Update Tech Stack table**

Add these rows to the tech stack table:

```
| Voice STT | OpenAI Whisper API |
| NLP Parse | Claude API (structured JSON extraction from dictation) |
| Scheduling Sync | QGenda REST API — Cloudflare Worker cron (5 min) |
| Research | ORCID REST API + PubMed API (free) |
| Podcast | BTK RSS feed (direct) + Listen Notes API |
| Mobile | React Native (iOS + Android) + SQLite offline cache |
```

- [ ] **Step 4: Add Core Loop section**

Add new section after "## Multi-Tenancy" block:

```markdown
## Core Loop

| Step | Action | Outcome |
|---|---|---|
| 1 | Resident dictates or logs a case/procedure | Saved to unified log |
| 2 | EPA request fires automatically | Attending receives SMS + email magic link |
| 3 | Attending confirms operative autonomy | Zwisch scale updates autonomy heatmap |
| 4 | Dashboard updates in real time | Progress vs. cohort recalculated |
| 5 | Fellowship readiness updates | Gap to matched applicant recalculated |
| 6 | ACGME export ready on demand | CSV formatted for ADS upload |
```

- [ ] **Step 5: Add Resident Onboarding section**

Add after Core Loop:

```markdown
## Resident Onboarding — 4 Questions, 60 Seconds

| Step | Question | Effect |
|---|---|---|
| 1 | What program are you in? | Sets ACGME requirements, cohort benchmarks |
| 2 | What rotation are you on? | Sets rotation landing page, surfaced guidelines, relevant EPAs |
| 3 | What fellowship are you interested in? | Sets fellowship readiness tracking |
| 4 | Connect your ORCID (optional) | Pulls publications, research metrics |
```

- [ ] **Step 6: Restructure Product Phases**

Replace the current 4-phase block with PRD-aligned phases:

Phase 1 — Launch: List all items from PRD §11 with their status markers (✅/🔲).
Phase 2 — Scale: List all items from PRD §11 Phase 2.

- [ ] **Step 7: Update Pages Built table**

Mark Guidelines Catalog, Guideline Detail, On-Call Directory, and Register Hospital as ✅ Complete (they were built in prior session). Add new pages from PRD as 🔲:
- Rotation Landing Page
- Unified Case & Procedure Log (enhanced)
- Post-Case EPA Modal
- Benchmarking Dashboard
- Operative Autonomy Heatmap
- Fellowship Goal Tracking
- Research Tracking
- Wellness Module (✅ already built per PRD)

- [ ] **Step 8: Update Competitive Positioning table**

Replace the 5-row text comparison with the full 7-tool × 10-feature matrix from PRD §13.

- [ ] **Step 9: Add Monetization section**

Add new section before File Structure:

```markdown
## Monetization

| Tier | Price | Residents | Notes |
|---|---|---|---|
| Starter | $149/month | ≤10 | Single program |
| Program | $349/month | Unlimited | Full feature set |
| Institution | Custom | Multi-program | Enterprise, HIPAA BAA, custom branding |
```

- [ ] **Step 10: Update Database Schema summary**

Update the "## Database Schema" section to list all new tables (total will grow from 9 to ~20). Reference schema.md for full definitions.

- [ ] **Step 11: Verify and commit**

Read the updated file. Verify all PRD sections are represented. Ensure no broken markdown tables.

---

### Task 2: Update architecture.md — System Architecture

**Files:**
- Modify: `docs/architecture.md`
- Reference: `GUIDEFLOW-PRD.md` sections 5.1–5.12, 6, 7, 8

**What changes:**

Current architecture.md covers: system diagram, auth, multi-tenancy, file storage, search, real-time, EHR integration, notifications, competitive positioning. Missing: voice dictation pipeline, EPA flow, QGenda sync, ORCID integration, podcast feed, abstract deadline engine, mobile architecture, rotation context system.

- [ ] **Step 1: Update System Diagram**

Add to the existing ASCII diagram:

```
    ├── OpenAI Whisper API: Voice STT (dictation → transcript)
    ├── Claude API: NLP extraction (transcript → structured case fields)
    ├── QGenda REST API: On-call sync (5-min Cloudflare Worker cron)
    ├── ORCID + PubMed API: Research tracking (OAuth + free API)
    ├── BTK RSS + Listen Notes API: Podcast feed (cached in Workers KV)
    ├── Resend: SMS + email for EPA magic links
    │
    ▼
React Native (iOS + Android)
    └── SQLite local cache → background sync on reconnect
```

- [ ] **Step 2: Add Voice Dictation Pipeline section**

New section after "## Search Strategy":

```markdown
## Voice Dictation Pipeline

1. Resident taps mic → browser MediaRecorder captures audio
2. Audio blob sent to OpenAI Whisper API → returns transcript text
3. Transcript sent to Claude API with structured JSON schema prompt
4. Claude extracts: procedure, attending (matched from program roster), role (inferred from PGY + context), defined category, date, rotation
5. Pre-filled form returned to resident for review and submit
6. Edge cases: unrecognized attending → dropdown fallback; ambiguous role → confirm prompt; multiple procedures → split prompt
```

- [ ] **Step 3: Add EPA Assessment Flow section**

New section:

```markdown
## EPA Assessment Flow

1. Resident submits operative case log
2. Post-submission modal suggests relevant EPA(s) based on defined category
3. One-tap send → fires email + SMS to attending via Resend
4. Attending receives single-use magic link (72-hour expiry)
5. Mobile-optimized 3-phase form: Pre-op / Intra-op / Post-op (ABS 1–5 entrustment scale)
6. Attending confirms or adjusts resident's self-reported Zwisch autonomy level
7. Case table status: Pending → Sent → Received
8. If no response in 72 hours, resident self-report stands
```

- [ ] **Step 4: Add QGenda Integration section**

New section:

```markdown
## QGenda Integration

- REST API: `api.qgenda.com/v2`
- Auth: company key + username + password → bearer token
- Cloudflare Worker cron polls every 5 minutes
- Data: Staff (provider) + Task (shift start/end) → `on_call_assignments` table per tenant
- Credentials stored per tenant in encrypted config
- Fallback: last synced data with timestamp if API unavailable
- Today's attending surfaced on rotation landing page — no navigation needed
```

- [ ] **Step 5: Add Research & Publication Tracking section**

New section:

```markdown
## Research & Publication Tracking

- ORCID OAuth 2.0 — resident authorizes once at onboarding
- ORCID Public API (free): works, employment, education, peer review, funding
- PubMed API (free): impact factors, citation counts, full metadata
- Auto-updates when resident publishes new work
- Research Intelligence: publication velocity, first-author ratio, journal prestige trajectory, co-author network, mentor concentration risk, momentum score
```

- [ ] **Step 6: Add Abstract Deadline Engine section**

```markdown
## Abstract Deadline Engine

- Seed database of 40+ surgical society conferences with typical deadline windows
- Cloudflare Worker cron scrapes deadline pages weekly
- Claude extracts current deadline date from HTML
- Three matching signals: fellowship goal → relevant societies; rotation → topical relevance; PGY year → eligibility
- Community corrections — resident flags changed deadline in one tap
- Lives as a card on rotation landing page; turns red under 4 weeks
```

- [ ] **Step 7: Add Podcast Feed Architecture section**

```markdown
## Rotation-Aware Podcast Feed

- BTK RSS feed (public, Libsyn-hosted) — episodes already tagged by specialty
- Listen Notes API — secondary source, full surgery podcast ecosystem
- Episode metadata cached in Cloudflare Workers KV — no live fetch on page load
- Episodes ranked by case gap relevance, not recency (0 liver cases → liver episodes first)
- Sources Phase 1: BTK, Surgeons Cut, SurgOnc Today, SSAT Podcast, Trauma Voice
```

- [ ] **Step 8: Add Mobile Architecture section**

```markdown
## Mobile Architecture

| Platform | Approach | Rationale |
|---|---|---|
| iOS + Android | React Native | Single codebase, native performance, App Store |
| Web | Next.js App Router | Same backend, same auth, responsive |
| Offline | SQLite local cache | Cases logged in poor OR connectivity, synced on reconnect |

The mobile app is the primary surface for residents. Voice dictation, case logging, EPA requests, and the rotation landing page are optimized for one-handed use between cases. Shared auth/session model between web and mobile via JWT.
```

- [ ] **Step 9: Update Competitive Positioning table**

Replace the 5-row table with the full 7-tool × 10-feature matrix from PRD §13.

- [ ] **Step 10: Add Integrations Summary section**

Add a consolidated integrations table referencing PRD §8:

```markdown
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
```

- [ ] **Step 11: Verify and commit**

Read the updated file. Verify all new sections are properly formatted.

---

### Task 3: Update schema.md — Database Schema

**Files:**
- Modify: `docs/schema.md`
- Reference: `GUIDEFLOW-PRD.md` sections 5.2–5.13, 8, 10

**What changes:**

Current schema has 9 tables. PRD v2.0 requires ~20 tables total. New tables needed: `rotations`, `epa_requests`, `epa_assessments`, `bedside_procedures`, `fellowship_goals`, `publications`, `conference_deadlines`, `podcast_episodes`, `wellness_checkins`, `on_call_assignments`. Existing tables need field updates.

- [ ] **Step 1: Update `users` table**

Add fields to users table:

```typescript
  current_rotation_id: uuid('current_rotation_id'), // FK to rotations, nullable
  fellowship_goal: varchar('fellowship_goal', { length: 100 }), // e.g. 'Colorectal Surgery'
  orcid_id: varchar('orcid_id', { length: 50 }), // ORCID identifier
  program_name: varchar('program_name', { length: 255 }), // e.g. 'General Surgery'
```

- [ ] **Step 2: Update `case_logs` table**

Add operative autonomy field:

```typescript
  operative_autonomy: varchar('operative_autonomy', { length: 30 }),
  // 'show_and_tell' | 'active_assistance' | 'passive_help' | 'supervision_only' | 'solo'
  // Zwisch scale — resident self-reported, attending confirms via EPA
```

- [ ] **Step 3: Update `attending_feedback` table to EPA model**

Rename conceptually to EPA assessments. Replace the 3-field Likert model with ABS EPA 1–5 scale:

```typescript
export const epaAssessments = pgTable('epa_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  epa_request_id: uuid('epa_request_id').references(() => epaRequests.id).notNull(),
  case_log_id: uuid('case_log_id').references(() => caseLogs.id).notNull(),
  // ABS EPA 1-5 entrustment scale per phase
  preop_score: integer('preop_score'), // 1-5
  intraop_score: integer('intraop_score'), // 1-5
  postop_score: integer('postop_score'), // 1-5
  // Attending confirms/adjusts Zwisch autonomy
  confirmed_autonomy: varchar('confirmed_autonomy', { length: 30 }),
  // 'show_and_tell' | 'active_assistance' | 'passive_help' | 'supervision_only' | 'solo'
  comments: text('comments'),
  submitted_by: uuid('submitted_by').references(() => users.id).notNull(),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

- [ ] **Step 4: Add `epa_requests` table**

```typescript
export const epaRequests = pgTable('epa_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  case_log_id: uuid('case_log_id').references(() => caseLogs.id).notNull(),
  attending_email: varchar('attending_email', { length: 255 }).notNull(),
  attending_name: varchar('attending_name', { length: 255 }).notNull(),
  magic_token: varchar('magic_token', { length: 255 }).unique().notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  // 'pending' | 'sent' | 'received' | 'expired'
  sent_at: timestamp('sent_at'),
  completed_at: timestamp('completed_at'),
  expires_at: timestamp('expires_at').notNull(), // 72-hour expiry
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

- [ ] **Step 5: Add `bedside_procedures` table**

```typescript
export const bedsideProcedures = pgTable('bedside_procedures', {
  id: uuid('id').primaryKey().defaultRandom(),
  procedure_type: varchar('procedure_type', { length: 100 }).notNull(),
  // 'central_line_ij' | 'central_line_sc' | 'central_line_femoral' | 'arterial_line_radial' |
  // 'arterial_line_femoral' | 'chest_tube' | 'thoracentesis' | 'paracentesis' |
  // 'wound_vac' | 'abscess_id' | 'tracheostomy_care' | 'gj_tube' | 'drain_management'
  site_laterality: varchar('site_laterality', { length: 10 }),
  // 'right' | 'left' | 'na'
  ultrasound_guided: boolean('ultrasound_guided').default(false),
  supervision: varchar('supervision', { length: 20 }).notNull(),
  // 'supervised' | 'independent'
  complications: varchar('complications', { length: 10 }).notNull().default('none'),
  // 'none' | 'minor' | 'major'
  procedure_date: date('procedure_date').notNull(),
  attending: varchar('attending', { length: 255 }),
  rotation: varchar('rotation', { length: 100 }),
  comments: text('comments'),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

- [ ] **Step 6: Add `rotations` table**

```typescript
export const rotations = pgTable('rotations', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  rotation_name: varchar('rotation_name', { length: 100 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userDate: unique().on(table.user_id, table.start_date),
}));
```

- [ ] **Step 7: Add `fellowship_goals` table**

```typescript
export const fellowshipGoals = pgTable('fellowship_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  fellowship_name: varchar('fellowship_name', { length: 100 }).notNull(),
  // e.g. 'Colorectal Surgery', 'HPB', 'MIS/Bariatric', etc.
  target_apply_date: date('target_apply_date'),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueGoal: unique().on(table.user_id, table.fellowship_name),
}));
```

- [ ] **Step 8: Add `publications` table**

```typescript
export const publications = pgTable('publications', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  orcid_work_id: varchar('orcid_work_id', { length: 100 }),
  pmid: varchar('pmid', { length: 20 }), // PubMed ID
  title: text('title').notNull(),
  journal: varchar('journal', { length: 255 }),
  publication_date: date('publication_date'),
  is_first_author: boolean('is_first_author').default(false),
  citation_count: integer('citation_count').default(0),
  impact_factor: real('impact_factor'),
  doi: varchar('doi', { length: 255 }),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  synced_at: timestamp('synced_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

- [ ] **Step 9: Add `conference_deadlines` table**

```typescript
export const conferenceDeadlines = pgTable('conference_deadlines', {
  id: uuid('id').primaryKey().defaultRandom(),
  conference_name: varchar('conference_name', { length: 255 }).notNull(),
  society: varchar('society', { length: 100 }).notNull(),
  fellowship_target: varchar('fellowship_target', { length: 100 }),
  // which fellowship this conference is relevant to
  deadline_date: date('deadline_date'),
  submission_url: text('submission_url'),
  typical_month: varchar('typical_month', { length: 20 }),
  // fallback when exact date not yet scraped
  last_scraped_at: timestamp('last_scraped_at'),
  is_community_corrected: boolean('is_community_corrected').default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
// NOTE: This is a global table, not tenant-scoped. Same deadlines for all programs.
```

- [ ] **Step 10: Add `on_call_assignments` table**

```typescript
export const onCallAssignments = pgTable('on_call_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider_name: varchar('provider_name', { length: 255 }).notNull(),
  provider_email: varchar('provider_email', { length: 255 }),
  provider_phone: varchar('provider_phone', { length: 50 }),
  provider_pager: varchar('provider_pager', { length: 50 }),
  service: varchar('service', { length: 100 }).notNull(),
  shift_start: timestamp('shift_start').notNull(),
  shift_end: timestamp('shift_end').notNull(),
  qgenda_task_id: varchar('qgenda_task_id', { length: 100 }),
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  synced_at: timestamp('synced_at').defaultNow().notNull(),
});
```

- [ ] **Step 11: Add `wellness_checkins` table**

```typescript
export const wellnessCheckins = pgTable('wellness_checkins', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  checkin_date: date('checkin_date').notNull(),
  sleep_hours: real('sleep_hours'),
  mood_score: integer('mood_score'), // 1-10
  stress_score: integer('stress_score'), // 1-10
  exercise_minutes: integer('exercise_minutes'),
  // Validated instruments (scored per standard)
  phq9_score: integer('phq9_score'), // 0-27
  gad7_score: integer('gad7_score'), // 0-21
  epworth_score: integer('epworth_score'), // 0-24
  phq9_item9_flagged: boolean('phq9_item9_flagged').default(false),
  // Crisis flag — Item 9 response > 0
  hospital_id: uuid('hospital_id').references(() => hospitals.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  weeklyUnique: unique().on(table.user_id, table.checkin_date),
}));
```

- [ ] **Step 12: Add `podcast_episodes` table**

```typescript
export const podcastEpisodes = pgTable('podcast_episodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  source: varchar('source', { length: 50 }).notNull(),
  // 'btk' | 'surgeons_cut' | 'surgonc_today' | 'ssat' | 'trauma_voice'
  title: text('title').notNull(),
  description: text('description'),
  audio_url: text('audio_url'),
  published_at: timestamp('published_at'),
  specialty_tags: text('specialty_tags').array(),
  duration_seconds: integer('duration_seconds'),
  external_id: varchar('external_id', { length: 255 }),
  synced_at: timestamp('synced_at').defaultNow().notNull(),
});
// NOTE: Global table, not tenant-scoped. Same episodes for all programs.
```

- [ ] **Step 13: Add new indexes**

```sql
-- EPA tracking
CREATE INDEX idx_epa_requests_case ON epa_requests(case_log_id);
CREATE INDEX idx_epa_requests_status ON epa_requests(hospital_id, status);
CREATE INDEX idx_epa_assessments_case ON epa_assessments(case_log_id);

-- Bedside procedures
CREATE INDEX idx_bedside_user ON bedside_procedures(user_id);
CREATE INDEX idx_bedside_hospital ON bedside_procedures(hospital_id);

-- Rotations
CREATE INDEX idx_rotations_user ON rotations(user_id, start_date DESC);
CREATE INDEX idx_rotations_current ON rotations(user_id, start_date, end_date);

-- Fellowship
CREATE INDEX idx_fellowship_user ON fellowship_goals(user_id);

-- Publications
CREATE INDEX idx_publications_user ON publications(user_id);
CREATE INDEX idx_publications_date ON publications(user_id, publication_date DESC);

-- On-call
CREATE INDEX idx_oncall_hospital ON on_call_assignments(hospital_id, shift_start, shift_end);
CREATE INDEX idx_oncall_service ON on_call_assignments(hospital_id, service, shift_start);

-- Wellness
CREATE INDEX idx_wellness_user ON wellness_checkins(user_id, checkin_date DESC);

-- Podcast (global)
CREATE INDEX idx_podcast_specialty ON podcast_episodes USING gin(specialty_tags);
CREATE INDEX idx_podcast_source ON podcast_episodes(source, published_at DESC);
```

- [ ] **Step 14: Add RLS policies for new tenant-scoped tables**

```sql
ALTER TABLE epa_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE epa_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bedside_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE on_call_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_checkins ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies (same pattern as existing tables)
CREATE POLICY tenant_isolation ON epa_requests
  USING (hospital_id = current_setting('app.tenant_id')::uuid);
-- ... repeat for all new tenant-scoped tables

-- NOTE: conference_deadlines and podcast_episodes are GLOBAL tables — no RLS needed.
```

- [ ] **Step 15: Verify and commit**

Read updated file. Verify table count matches (~20 total). Verify all FK references are valid.

---

### Task 4: Update API Spec — src/api/CLAUDE.md

**Files:**
- Modify: `src/api/CLAUDE.md`
- Reference: `GUIDEFLOW-PRD.md` sections 5.1–5.13, 8

**What changes:**

Current API spec has 28 endpoints across 7 route groups. PRD v2.0 requires ~15 new route groups covering EPA, rotations, fellowship, research, wellness, QGenda, podcasts, conference deadlines, benchmarking, onboarding, and exports.

- [ ] **Step 1: Add EPA Routes**

```markdown
### EPA Requests
\```
POST   /api/epa/request           — send EPA request to attending (auto after case log)
GET    /api/epa/requests          — list EPA requests for user (filterable by status)
GET    /api/epa/requests/:id      — get single EPA request with assessment
\```

### EPA Assessments (Attending — magic link auth)
\```
GET    /api/epa/assess/:token     — load assessment form (validates magic link token)
POST   /api/epa/assess/:token     — submit EPA assessment (pre-op/intra-op/post-op + Zwisch)
\```
```

- [ ] **Step 2: Add Rotation Routes**

```markdown
### Rotations
\```
GET    /api/rotations             — list user's rotations
POST   /api/rotations             — set current rotation (onboarding or manual switch)
GET    /api/rotations/current     — get current rotation context
GET    /api/rotations/landing     — rotation landing page data (cases, EPAs, guidelines, podcasts, deadlines, on-call)
\```
```

- [ ] **Step 3: Add Fellowship Routes**

```markdown
### Fellowship Tracking
\```
GET    /api/fellowship            — get user's fellowship goal + readiness score
POST   /api/fellowship            — set fellowship goal (onboarding)
PATCH  /api/fellowship            — update fellowship goal
GET    /api/fellowship/readiness  — detailed gap analysis (cases, research, EPAs vs. matched applicant avg)
GET    /api/fellowship/benchmarks — matched applicant benchmark data for selected fellowship
\```
```

- [ ] **Step 4: Add Research / Publication Routes**

```markdown
### Research Tracking
\```
GET    /api/research/publications — list user's publications (from ORCID + PubMed)
POST   /api/research/sync         — trigger ORCID sync
GET    /api/research/stats        — research intelligence (velocity, first-author ratio, momentum score)
GET    /api/research/coauthors    — co-author network data
\```
```

- [ ] **Step 5: Add Wellness Routes**

```markdown
### Wellness
\```
GET    /api/wellness/checkins     — list user's wellness check-ins (paginated)
POST   /api/wellness/checkins     — submit weekly check-in (sleep, mood, stress, instruments)
GET    /api/wellness/trends       — trend data for charts (PHQ-9, GAD-7, Epworth over time)
GET    /api/wellness/resources    — evidence-backed protocol cards by domain
\```
```

- [ ] **Step 6: Add Bedside Procedure Routes**

```markdown
### Bedside Procedures
\```
GET    /api/bedside-procedures         — list user's bedside procedures
POST   /api/bedside-procedures         — log bedside procedure
PATCH  /api/bedside-procedures/:id     — update procedure
GET    /api/bedside-procedures/stats   — counts by type, supervision status
GET    /api/bedside-procedures/export  — credentialing PDF certificate
\```
```

- [ ] **Step 7: Add Podcast Routes**

```markdown
### Podcast Feed
\```
GET    /api/podcasts              — rotation-aware episode list (ranked by case gap relevance)
GET    /api/podcasts/sources      — list available podcast sources
\```
```

- [ ] **Step 8: Add Conference Deadline Routes**

```markdown
### Conference Deadlines
\```
GET    /api/deadlines             — upcoming deadlines (filtered by fellowship goal + rotation)
POST   /api/deadlines/:id/correct — community correction (resident flags changed date)
\```
```

- [ ] **Step 9: Add Benchmarking Routes**

```markdown
### Benchmarking
\```
GET    /api/benchmarks/personal   — personal trend data (case velocity, EPA trajectory, autonomy)
GET    /api/benchmarks/cohort     — cohort comparison (same PGY, rotation, program)
GET    /api/benchmarks/attending  — attending feedback patterns (response rate, time, richness)
\```
```

- [ ] **Step 10: Add Onboarding Routes**

```markdown
### Onboarding
\```
POST   /api/onboarding            — complete 4-step onboarding (program, rotation, fellowship, ORCID)
GET    /api/onboarding/status     — check onboarding completion status
\```
```

- [ ] **Step 11: Add Export Routes**

```markdown
### Exports
\```
GET    /api/exports/acgme-csv     — ACGME ADS-formatted CSV export of all case logs
GET    /api/exports/credentialing — bedside procedure credentialing PDF
GET    /api/exports/ccc-report    — CCC report auto-generation (program director only)
GET    /api/exports/rotation-debrief — smart rotation debrief (auto-generated at rotation end)
\```
```

- [ ] **Step 12: Add QGenda Sync Routes (internal)**

```markdown
### QGenda Sync (Internal — Cloudflare Worker cron)
\```
POST   /api/internal/qgenda/sync  — triggered by Worker cron every 5 minutes
GET    /api/internal/qgenda/status — last sync timestamp and health
\```
```

- [ ] **Step 13: Update existing Case Logs routes**

Add to existing case-logs section:

```
GET    /api/case-logs/autonomy-heatmap — operative autonomy heatmap data (category × Zwisch × EPA)
```

- [ ] **Step 14: Verify and commit**

Read updated file. Count total endpoints. Verify route naming consistency.

---

### Task 5: Restructure todo.md — Roadmap

**Files:**
- Modify: `tasks/todo.md`
- Reference: `GUIDEFLOW-PRD.md` §11, all prior completed work

**What changes:**

Current todo.md has Phases 1–4 with outdated status. Need to: mark 4 prototype pages as complete, restructure to match PRD phases, add all new PRD features.

- [ ] **Step 1: Update Completed section**

Add to completed:
```markdown
- [x] HTML prototype: Guidelines Catalog (filterable grid, evidence tags, 12 guide cards)
- [x] HTML prototype: Guideline Detail (breadcrumb, metadata, rating, content, related)
- [x] HTML prototype: On-Call Directory (on-call grid, escalation path, contacts table)
- [x] HTML prototype: Register Hospital (form, live preview, subdomain slugify)
- [x] PRD v2.0 authored (GUIDEFLOW-PRD.md)
- [x] ACGME categories reference document (docs/acgme-categories.md)
- [x] PRD v2.0 doc sync — all architecture docs updated
```

- [ ] **Step 2: Rewrite Phase 1 — Launch**

Replace entire Phase 1 with PRD §11 features, properly categorized:

**Prototype Pages (remaining):**
- Rotation Landing Page
- Unified Case & Procedure Log (enhanced form)
- Post-Case EPA Modal
- Benchmarking Dashboard
- Operative Autonomy Heatmap
- Fellowship Goal Tracking
- Research Tracking page
- Attending Feedback Patterns
- Smart Rotation Debrief
- Onboarding flow (4-step)

**Backend (new from PRD):**
- EPA request/assessment pipeline
- QGenda sync worker
- ORCID OAuth + PubMed sync
- Abstract deadline scraper
- Podcast feed aggregator
- Wellness check-in API
- Bedside procedure logging
- ACGME CSV export
- Credentialing PDF export
- CCC report generation

- [ ] **Step 3: Rewrite Phase 2 — Scale**

From PRD §11 Phase 2:
- National benchmarking (50+ programs)
- pgvector semantic RAG search
- Schedule upload (PDF/iCal) + full QGenda auto-sync
- ACGME Cloud API integration
- ABS EPA alternate tool approval
- Fellowship crowdsourced match data
- Mentorship matching engine
- Complication log
- Board exam countdown
- Anonymous program pulse
- Simulation milestone tracker
- Financial literacy module
- Masked Caller + Hospital Maps

- [ ] **Step 4: Add Mobile section**

```markdown
## Mobile App (React Native)
- [ ] Shared auth/session model between web and mobile
- [ ] React Native scaffold (iOS + Android)
- [ ] SQLite offline cache + background sync
- [ ] Voice dictation (native mic → Whisper)
- [ ] Case logging optimized for one-handed use
- [ ] EPA request flow
- [ ] Rotation landing page
```

- [ ] **Step 5: Verify and commit**

Read updated file. Ensure all PRD features are represented. No orphaned items.

---

### Task 6: Update acgme-categories.md — Reference Data

**Files:**
- Modify: `docs/acgme-categories.md`
- Reference: `GUIDEFLOW-PRD.md` sections 5.2.3, 5.4, 5.5, 9

**What changes:**

Current file has graduation requirements + 16 defined categories + role definitions. PRD adds: bedside procedure types, Zwisch scale reference, ABS EPA entrustment scale, fellowship-specific case categories (10 fellowships).

- [ ] **Step 1: Add Zwisch Scale Reference**

New section after Role Definitions:

```markdown
## Zwisch Scale — Operative Autonomy

| Level | Label | Meaning |
|---|---|---|
| 1 | Show and Tell | Attending performs, resident observes |
| 2 | Active Assistance | Resident assists with significant attending guidance |
| 3 | Passive Help | Resident performs with attending providing minor corrections |
| 4 | Supervision Only | Resident performs independently, attending present but not scrubbed |
| 5 | Solo | Resident performs without attending in room |

Resident self-reports at case submission. Attending confirms or adjusts via EPA assessment. If attending does not respond within 72 hours, resident self-report stands.
```

- [ ] **Step 2: Add ABS EPA Entrustment Scale**

```markdown
## ABS EPA Entrustment Scale (1–5)

Three-phase assessment: Pre-operative / Intra-operative / Post-operative. Each scored independently.

| Score | Label | Description |
|---|---|---|
| 1 | Not yet assessable | Has not had sufficient opportunity |
| 2 | Requires direct supervision | Performs with significant guidance |
| 3 | Requires indirect supervision | Performs with attending available but not directly involved |
| 4 | Independent | Performs independently in routine situations |
| 5 | Aspirational | Can supervise others performing this activity |
```

- [ ] **Step 3: Add Bedside Procedure Types**

```markdown
## Bedside Procedure Types

| Procedure | Variants |
|---|---|
| Central Line | Internal Jugular (IJ), Subclavian (SC), Femoral |
| Arterial Line | Radial, Femoral |
| Chest Tube | — |
| Thoracentesis | — |
| Paracentesis | — |
| Wound VAC | — |
| Abscess I&D | — |
| Tracheostomy Care | — |
| G/J-Tube | Gastrostomy, Jejunostomy |
| Drain Management | — |

Each procedure tracks: site/laterality, ultrasound-guided (Y/N), supervised/independent, complications (none/minor/major).
```

- [ ] **Step 4: Add Fellowship Case Categories**

```markdown
## Fellowship-Specific Case Categories

| Fellowship | Society | Key Case Categories |
|---|---|---|
| Colorectal Surgery (CRS) | ASCRS / Fellowship Council | Large Intestine, Anorectal, Laparoscopic Complex |
| Hepatobiliary (HPB) | AHPBA / Fellowship Council | Biliary, Liver, Pancreas |
| MIS / Bariatric | SAGES / Fellowship Council | Laparoscopic Basic, Laparoscopic Complex, Upper Endoscopy |
| Surgical Oncology | SSO / ACS | Breast, Head & Neck, Skin/Soft Tissue, Abdominal |
| Vascular Surgery | SVS / ABS | Vascular — Access, Anastomosis/Repair |
| Thoracic Surgery | STS / AATS | Thoracic, Thoracotomy |
| Breast Surgery | ASBrS | Breast — Mastectomy, Axilla |
| Pediatric Surgery | APSA / ABS | Pediatric Surgery |
| Surgical Critical Care | SCCM / ABS | Surgical Critical Care, Trauma, Bedside Procedures |
| Transplant Surgery | ASTS / AAAT | Liver, Pancreas, Vascular Access |

These categories drive the Fellowship Goal Tracking readiness score — comparing resident's case counts in relevant categories against matched applicant benchmarks.
```

- [ ] **Step 5: Verify and commit**

Read updated file. Verify all new sections are consistent with PRD.

---

## Chunk 2: Cross-File Verification

### Task 7: Cross-File Consistency Check

**Files:**
- Read: All 6 updated files + `GUIDEFLOW-PRD.md`

**Depends on:** Tasks 1–6 complete

- [ ] **Step 1: Verify role consistency**

All files should reference the same 6 roles: Resident, Attending Surgeon, Program Director, GME Coordinator, Hospital Admin, Developer.

- [ ] **Step 2: Verify table count**

schema.md should have ~20 tables. CLAUDE.md database summary should list all of them. API spec should have routes for all data entities.

- [ ] **Step 3: Verify integration coverage**

architecture.md integrations table should match all APIs referenced in schema.md (QGenda → on_call_assignments, ORCID → publications, etc.)

- [ ] **Step 4: Verify PRD feature coverage**

Every feature in PRD §5 (5.1–5.13) should be traceable to at least one: schema table, API route, and todo item.

- [ ] **Step 5: Report findings**

List any gaps or inconsistencies found. Fix inline or note for follow-up.

---

## Execution Notes

- **Tasks 1–6 can run in parallel** — each modifies a different file
- **Task 7 must run after Tasks 1–6** — it reads all updated files
- The old `attending_feedback` table definition should be preserved with a deprecation note (it may have been referenced in prior prototype code), while the new `epa_assessments` table is the replacement
- After this plan completes, **Plan B: PRD v2.0 Prototype Build** should be written to add new prototype pages (Rotation Landing, EPA Modal, Fellowship Tracking, Benchmarking Dashboard, Operative Autonomy Heatmap, etc.)
