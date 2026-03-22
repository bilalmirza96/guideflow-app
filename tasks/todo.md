# TODO — Sprint Plan

## Completed

### Prototypes
- [x] HTML prototype: Service Dashboard (Home)
- [x] HTML prototype: Case Log Dashboard with ACGME tracking
- [x] HTML prototype: Admin page (3 tabs)
- [x] HTML prototype: Login page (magic link flow)
- [x] HTML prototype: Guidelines Catalog (filterable grid, evidence tags, 12 guide cards)
- [x] HTML prototype: Guideline Detail (breadcrumb, metadata, rating, content, related)
- [x] HTML prototype: On-Call Directory (on-call grid, escalation path, contacts table)
- [x] HTML prototype: Register Hospital (form, live preview, subdomain slugify)
- [x] HTML prototype: Wellness Module (5 tabs)

### Documentation & Requirements
- [x] PRD v2.0 authored (GUIDEFLOW-PRD.md)
- [x] ACGME categories reference document (docs/acgme-categories.md)
- [x] PRD v2.0 doc sync — all architecture docs updated
- [x] Project architecture docs (CLAUDE.md, architecture.md, schema.md, design-tokens.md)

### Research & Reference
- [x] Market research: UpToDate, DynaMed, Hypercare, ACGME tools
- [x] Research: OPRS, Zwisch Scale, ABS EPAs for progressive autonomy tracking
- [x] Fix admin page layout bug (extra </div> closing layout wrapper)
- [x] Remove list view from guidelines, keep grid-only
- [x] Tighten header spacing

---

## Phase 1 — Launch

### Prototype Pages (Remaining)
- [ ] Rotation Landing Page (case/procedure progress, guidelines, EPA entrustment, podcast feed, conference deadlines, on-call today)
- [ ] Unified Case & Procedure Log (enhanced form, operative autonomy capture, procedure type selection)
- [ ] Post-Case EPA Modal (modal trigger, EPA suggestion, one-tap send to attending)
- [ ] Benchmarking Dashboard (personal + cohort, PGY cohort comparison, case gap analysis)
- [ ] Operative Autonomy Heatmap (Zwisch by attending/procedure, trend visualization)
- [ ] Fellowship Goal Tracking (readiness score, matched applicant benchmarks, case category comparison)
- [ ] Research Tracking page (ORCID publications, co-authors, citation metrics, research intelligence)
- [ ] Attending Feedback Patterns (EPA response time, completion rate, comment patterns, teaching quality index)
- [ ] Smart Rotation Debrief (case summary, learning points, comparative analysis)
- [ ] Onboarding flow (4-step: program → rotation → fellowship → ORCID)

### Backend — Core Infrastructure
- [ ] Next.js scaffold with App Router
- [ ] Configure `@opennextjs/cloudflare` for Workers deployment
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Configure Drizzle ORM + Neon connection
- [ ] Set up environment variables (.env.local)
- [ ] Implement magic link auth (JWT + Resend)
- [ ] Implement subdomain middleware with tenant_id injection
- [ ] Create Drizzle schema (users, hospitals, case_logs, guidelines, directories, rotations, epa_requests, epa_assessments, bedside_procedures, fellowship_goals, publications, conference_deadlines, on_call_assignments, wellness_checkins, etc.)
- [ ] Push schema to Neon + enable RLS
- [ ] Implement R2 file upload for PDFs
- [ ] Build HIPAA audit log middleware (append on every action)
- [ ] Build guideline versioning (versions table + diff endpoint)

### Backend — EPA Assessment Pipeline
- [ ] EPA request API (case → attending email/SMS trigger)
- [ ] EPA assessment API (3-phase form: pre-op/intra-op/post-op with ABS 1–5 scale)
- [ ] Magic link token generation + 72-hour expiry
- [ ] Attending EPA response form (mobile-optimized)
- [ ] Case table status updates (Pending → Sent → Received → Completed)
- [ ] Self-report fallback if no attending response in 72 hours

### Backend — QGenda Integration
- [ ] QGenda sync worker (REST API polling, 5-min cron)
- [ ] QGenda token management (company key + username/password → bearer token)
- [ ] On-call assignment table + sync logic
- [ ] Schedule sync error handling + fallback to last known data
- [ ] Today's attending surfacing on rotation landing page

### Backend — Research & Publication Tracking
- [ ] ORCID OAuth 2.0 integration (resident onboarding)
- [ ] ORCID Public API sync (works, employment, education, peer review, funding)
- [ ] PubMed API integration (impact factors, citation counts, metadata)
- [ ] Auto-update on new resident publications
- [ ] Research Intelligence calculations (publication velocity, first-author ratio, journal prestige trajectory, co-author network, mentor concentration risk, momentum score)

### Backend — Abstract Deadline Engine
- [ ] Seed conference database (40+ surgical societies with typical deadline windows)
- [ ] Cloudflare Worker cron weekly deadline scraper
- [ ] Claude extraction of deadline dates from HTML
- [ ] Three-signal matching (fellowship goal → relevant societies; rotation → topical; PGY → eligibility)
- [ ] Community correction flow (resident flags changed deadline)
- [ ] Deadline cards on rotation landing page (red alert under 4 weeks)

### Backend — Podcast Feed Aggregator
- [ ] BTK RSS feed (Libsyn public feed, specialty-tagged episodes)
- [ ] Listen Notes API integration (secondary source)
- [ ] Episode metadata caching in Cloudflare Workers KV
- [ ] Episode ranking by case gap relevance (not recency)
- [ ] Phase 1 sources: BTK, Surgeons Cut, SurgOnc Today, SSAT Podcast, Trauma Voice

### Backend — Wellness & Check-In API
- [ ] Wellness check-in form (sleep hours, mood/stress score, exercise minutes)
- [ ] PHQ-9 + GAD-7 validated instrument scoring
- [ ] Historical wellness data storage + trend visualization
- [ ] Distress proxy calculation (case velocity + wellness scores + shift density)

### Backend — Procedure Logging
- [ ] Bedside procedure types (central line, arterial line, chest tube, thoracentesis, paracentesis, wound VAC, abscess I&D, tracheostomy, G/J-tube, drain management)
- [ ] Procedure variants + site/laterality tracking
- [ ] Ultrasound-guided flag
- [ ] Supervision level (supervised/independent)
- [ ] Complication tracking (none/minor/major)

### Backend — ACGME & Credentialing Exports
- [ ] ACGME CSV export (case log formatted for ADS submission)
- [ ] Credentialing PDF export (case summary, attending verification, HIPAA audit trail)
- [ ] CCC report generation (Competency-based Clinical Care readiness)
- [ ] CSV import pipeline (admin upload → confirmation queue)

### Backend — Voice Dictation Pipeline
- [ ] OpenAI Whisper API integration (resident audio → transcript)
- [ ] Claude API NLP extraction (transcript → structured JSON case fields)
- [ ] Field mapping: procedure, attending (roster match), role (PGY + context inference), defined category, date, rotation
- [ ] Edge case handling (unrecognized attending dropdown fallback, ambiguous role confirm prompt, multiple procedures split prompt)
- [ ] Web Audio API + MediaRecorder for browser capture

### Backend — Rotation Context System
- [ ] Rotation model (user, rotation_name, start_date, end_date, hospital)
- [ ] Automatic context switch on date change
- [ ] Rotation-aware category filtering (ACGME + fellowship-specific)
- [ ] Rotation-driven EPA suggestion logic
- [ ] Rotation scope on podcast feed, guidelines, conference deadlines

### Core Pages (Port from Prototype)
- [ ] Port Home/Dashboard page to React
- [ ] Port Case Log Dashboard page (with Chart.js)
- [ ] Port Admin page (3 tabs: Guidelines, Directory, Users)
- [ ] Port Login page (magic link flow)
- [ ] Port Guidelines Catalog page
- [ ] Port Guideline Detail page
- [ ] Port On-Call Directory page
- [ ] Port Register Hospital page

### Backend API Routes
- [ ] Build guidelines CRUD API routes
- [ ] Build case log API routes (+ stats endpoint)
- [ ] Build directory CRUD API routes
- [ ] Build user management API routes
- [ ] Build rotation API routes
- [ ] Build fellowship goals API routes
- [ ] Build publications sync API routes
- [ ] Build wellness check-in API routes

### Search
- [ ] ILIKE search on guidelines (title + content)
- [ ] ⌘K search bar integration (< 200ms perceived latency)
- [ ] Full-text search with tsvector + GIN index

### Case Log UX
- [ ] CPT typeahead autocomplete from ACGME CPT list
- [ ] Quick-log / fast mode (5-field minimal form)
- [ ] Recent cases template (tap to pre-fill)
- [ ] Voice-to-log (Web Audio API → Whisper → Claude)
- [ ] CSV import pipeline (admin upload → confirmation queue)
- [ ] Add attending filter (view all cases with a specific attending)
- [ ] Add progressive autonomy tracking UI (per-attending, per-procedure breakdown)

### Compliance & PWA
- [ ] Offline PWA (Service Worker + IndexedDB for directory + 20 recent guidelines)
- [ ] HIPAA audit log queries (admin dashboard view)
- [ ] CSV export formatted for ACGME ADS submission

---

## Phase 2 — Scale

### National Benchmarking
- [ ] National benchmarking dashboard (50+ programs, anonymized case distributions)
- [ ] Program-to-program comparison (case counts, EPA response patterns, resident publication velocity)
- [ ] Institutional analytics dashboard (Program Director view)

### Advanced Search & Knowledge
- [ ] pgvector semantic RAG search for guidelines (tenant-scoped)
- [ ] Safety filter for guidelines (contraindications, black box warnings)
- [ ] Guideline update notification system

### Schedule & On-Call Management
- [ ] Schedule upload (PDF/iCal file processing)
- [ ] Full QGenda auto-sync with schedule management
- [ ] Rotation context automation (schedule → rotation category switching)

### API Integrations
- [ ] ACGME Cloud API integration (when available)
- [ ] ABS EPA alternate tool approval pathway (contact after 5+ pilots)
- [ ] FHIR R4 auto-sync adapter (Epic/Cerner)

### Fellowship & Mentorship
- [ ] Fellowship crowdsourced match data layer (opt-in from matched residents)
- [ ] Mentorship matching engine (EPA response patterns, publications, case overlap)
- [ ] Fellowship-specific readiness benchmarks (specialty society partnership data)

### Clinical & Learning Tools
- [ ] Complication log (private, feeds M&M prep, ACGME competency domain mapping)
- [ ] Board exam countdown (personalized study roadmap tied to case log gaps)
- [ ] Simulation milestone tracker (FLS, FES, robotic credentialing)
- [ ] CME credit tracking

### Wellness & Institution
- [ ] Anonymous program pulse (monthly 3-question cohort check-in for PDs)
- [ ] Financial literacy module (PSLF tracker, loan repayment tools)
- [ ] Masked Caller (SIP bridge)
- [ ] Hospital Maps

### Intelligence & Notifications
- [ ] Notification A/B test infrastructure
- [ ] Competency milestone radar chart
- [ ] Role-based content restrictions
- [ ] Case velocity + cross-program rotation yield models → graduation gap alerts

---

## Mobile App (React Native)

### Core Infrastructure
- [ ] React Native scaffold (iOS + Android)
- [ ] Shared auth/session model between web and mobile
- [ ] JWT-based session persistence

### Offline & Data Management
- [ ] SQLite local cache (cases, directory, guidelines)
- [ ] Background sync on reconnect
- [ ] Offline case logging + queue for submission

### Features — Case & Procedure Logging
- [ ] Case logging optimized for one-handed use
- [ ] Voice dictation (native mic → Whisper → Claude)
- [ ] Procedure logging with fast template selection
- [ ] Recent cases template feature

### Features — EPA & Assessments
- [ ] EPA request flow
- [ ] Attending EPA assessment form (mobile-optimized 3-phase)
- [ ] Magic link handling in mobile app

### Features — Navigation & Context
- [ ] Rotation landing page (mobile layout)
- [ ] Case log timeline view
- [ ] On-call directory (mobile list view)
- [ ] Conference deadline alerts

### Platform & Distribution
- [ ] App Store submission (iOS)
- [ ] Google Play submission (Android)
- [ ] Push notifications infrastructure
- [ ] Mobile-specific onboarding flow

---

## Phase 3: Intelligence + Integrations (Planned)
- [ ] CME credit integration
- [ ] Competency milestone radar chart
- [ ] Role-based content restrictions
- [ ] Advanced behavioral analytics

## Phase 4: Ambitious (Future)
- [ ] AI guideline draft assistant
- [ ] Cohort benchmarking (anonymized national percentiles)
- [ ] Board exam Q-bank linked to case logs
- [ ] Multi-hospital analytics dashboard
