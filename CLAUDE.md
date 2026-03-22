# GuideFlow — PMG Platform

## Project Overview

GuideFlow is a multi-tenant SaaS platform and mobile application for U.S. teaching hospitals that unifies six workflows currently fragmented across three or more separate tools: clinical guidelines, case and procedure logging, EPA assessment, fellowship readiness tracking, research tracking, and educational content.

The core insight: a single 10-second action — logging a case or procedure — simultaneously satisfies ACGME documentation, triggers an attending EPA assessment, advances fellowship readiness tracking, and updates the resident's operative autonomy profile. No competing product connects these outcomes.

**Positioning:** GuideFlow fills a gap no existing tool covers. UpToDate and DynaMed answer "what does the world's medical literature say?" — GuideFlow answers "what does THIS hospital say to do tonight, who is on call, and how many cases has this resident logged?" GuideFlow is the operating system for the residency program and clinical operations; UpToDate is a reference library that coexists alongside it.

**Repository:** `github.com/danishyasin33/pmg` (private)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Deployment | Cloudflare Workers via `@opennextjs/cloudflare` |
| Database | Neon PostgreSQL (serverless) + Drizzle ORM |
| Auth | Magic link (JWT via `jose` + email via `resend`) |
| File storage | Cloudflare R2 (PDF uploads + versioned guidelines) |
| Real-time | Cloudflare Durable Objects (WebSockets) |
| PDF parsing | `unpdf` |
| UI | Tailwind CSS + shadcn/ui |
| Validation | Zod |
| Search (Phase 1) | PostgreSQL ILIKE |
| Search (Phase 2) | tsvector + GIN index (full-text) |
| Search (Phase 3) | pgvector + semantic RAG (tenant-scoped) |
| Observability | Sentry + Logflare + HIPAA audit log table |
| Voice STT | OpenAI Whisper API |
| NLP Parse | Claude API (structured JSON extraction from dictation) |
| Scheduling Sync | QGenda REST API — Cloudflare Worker cron (5 min) |
| Research | ORCID REST API + PubMed API (free) |
| Podcast | BTK RSS feed (direct) + Listen Notes API |
| Mobile | React Native (iOS + Android) + SQLite offline cache |

## Multi-Tenancy

- Subdomain-based: `stmichaels.pmg.app`, `cityhospital.pmg.app`
- Middleware extracts subdomain, rewrites URL internally
- Auth guards use JWT only — no DB calls in middleware
- JWT payload embeds `tenant_id` and `role`
- PostgreSQL Row-Level Security: `SET LOCAL app.tenant_id = ...` before every query
- All data scoped per tenant at query layer — defense-in-depth beyond application layer
- Multi-tenancy reduces infrastructure costs 30–50% vs single-tenant
- Single HIPAA compliance audit covers all tenants

---

## Core Loop

| Step | Action | Outcome |
|---|---|---|
| 1 | Resident dictates or logs a case/procedure | Saved to unified log |
| 2 | EPA request fires automatically | Attending receives SMS + email magic link |
| 3 | Attending confirms operative autonomy | Zwisch scale updates autonomy heatmap |
| 4 | Dashboard updates in real time | Progress vs. cohort recalculated |
| 5 | Fellowship readiness updates | Gap to matched applicant recalculated |
| 6 | ACGME export ready on demand | CSV formatted for ADS upload |

---

## Resident Onboarding — 4 Questions, 60 Seconds

| Step | Question | Effect |
|---|---|---|
| 1 | What program are you in? | Sets ACGME requirements, cohort benchmarks |
| 2 | What rotation are you on? | Sets rotation landing page, surfaced guidelines, relevant EPAs |
| 3 | What fellowship are you interested in? | Sets fellowship readiness tracking |
| 4 | Connect your ORCID (optional) | Pulls publications, research metrics |

---

## Roles

| Role | Access |
|---|---|
| Resident | Read guidelines/directory; own case logs; request/view own EPAs; personal analytics |
| Attending Surgeon | Read guidelines/directory; complete EPA assessments via magic link |
| Program Director | Read guidelines; view all resident case logs/EPAs; full program analytics |
| GME Coordinator | Read/Write guidelines & directory; all resident data; full admin |
| Hospital Admin | Full CRUD all resources; full analytics; full admin |
| Developer | Tenant provisioning (Register Hospital page) |

## ACGME Role Definitions

| Code | Meaning |
|---|---|
| SC | Surgeon Chief — cases credited during 12 months of Chief experience |
| SJ | Surgeon Junior — cases credited as Surgeon prior to Chief year |
| TA | Teaching Assistant — Chief working with junior who takes credit as SJ |
| FA | First Assistant — assisting another surgeon; does NOT count toward total major cases |

## ACGME Graduation Requirements

- **Total:** 850 major cases as Surgeon (SC + SJ combined), ≥200 as Chief (SC)
- **PGY-3 cutoff:** 250 cases before starting PGY-3, ≥200 in defined categories
- **TA minimum:** 25 TA cases (PGY-4/5 only; count toward total but not 200 Chief minimum)
- See `docs/acgme-categories.md` for full defined category minimums

---

## Product Phases

### Phase 1 — Launch

**Pages & Prototype:**
- ✅ Service Dashboard (Home) — HTML prototype complete
- ✅ Case Log Dashboard — HTML prototype complete
- ✅ Wellness Module (5 tabs) — HTML prototype complete
- 🔲 Rotation Landing Page
- 🔲 Unified Case & Procedure Log (enhanced form)
- 🔲 Post-Case EPA Modal
- 🔲 Benchmarking Dashboard (personal + cohort)
- 🔲 Operative Autonomy Heatmap
- 🔲 Fellowship Goal Tracking + Readiness Score
- 🔲 Research Tracking page
- 🔲 Attending Feedback Patterns
- 🔲 Smart Rotation Debrief
- 🔲 Rotation Landing Page
- ✅ Clinical Guidelines Catalog + Detail — specs complete
- ✅ On-Call Directory (QGenda) — specs complete
- 🔲 Login (magic link, tenant-aware)
- 🔲 React Native Mobile App (iOS + Android)
- 🔲 ACGME CSV Export + Credentialing Export
- 🔲 Register Hospital (Dev)

**Backend & Core Features:**
- Voice Dictation (Whisper API + Claude NLP extraction)
- EPA request/assessment pipeline (magic link flow, 72-hour expiry)
- QGenda sync (Cloudflare Worker cron every 5 min)
- ORCID OAuth + PubMed sync for research tracking
- Abstract deadline scraper (40+ conferences)
- Podcast feed aggregator (BTK RSS + Listen Notes API)
- Wellness check-in module with validated instruments (PHQ-9, GAD-7, Epworth)
- Bedside procedure logging
- Zwisch autonomy scale (5 levels) + operative autonomy heatmap

### Phase 2 — Scale

- National benchmarking dashboard (50+ programs)
- pgvector semantic RAG search for guidelines with safety filter
- Schedule upload (PDF/iCal) and full QGenda auto-sync
- ACGME Cloud API integration (when available)
- ABS EPA alternate tool approval (after 5+ pilots)
- Fellowship crowdsourced match data layer
- Mentorship matching engine
- Complication log + M&M prep
- Board exam countdown
- Anonymous program pulse survey
- Simulation milestone tracker (FLS, FES, robotic)
- Financial literacy module
- Masked Caller + Hospital Maps

---

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

1. **Plan First:** Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan:** Check in before starting implementation
3. **Track Progress:** Mark items complete as you go
4. **Explain Changes:** High-level summary at each step
5. **Document Results:** Add review section to `tasks/todo.md`
6. **Capture Lessons:** Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First:** Make every change as simple as possible. Impact minimal code.
- **No Laziness:** Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact:** Changes should only touch what's necessary. Avoid introducing bugs.
- **Test Everything:** If it compiles, it should also pass. Write tests alongside features.
- **Document Decisions:** Any architectural choice goes in `docs/decisions/`

---

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

---

## Monetization

| Tier | Price | Residents | Notes |
|---|---|---|---|
| Starter | $149/month | ≤10 | Single program |
| Program | $349/month | Unlimited | Full feature set |
| Institution | Custom | Multi-program | Enterprise, HIPAA BAA, custom branding |

---

## Design System

Reference `prototype/guideflow-app.html` for the complete working UI prototype.
Full token reference in `docs/design-tokens.md`.

### Color Tokens (Dark / Light)

```
--bg:         #0C0C0C / #F8F8F8
--bg-raised:  #141414 / #FFFFFF
--bg-hover:   #1C1C1C / #F2F2F2
--border:     #232323 / #E8E2D9
--border-hi:  #303030 / #D6CFC4
--text-1:     #F0EBE3 / #141210
--text-2:     #C4BDB4 / #6B6560
--text-3:     #555250 / #9E9890
```

### Accent Colors (Anthropic palette, brightened 50%)

```
--ac-orange:  #E8956F / #D07040   (primary action, SC role, CTA buttons)
--ac-blue:    #8BB8E0 / #5585B0   (info, SJ role, focus rings, links)
--ac-green:   #9AB87A / #688548   (success, TA role, met thresholds)
```

### Typography

- **Headings:** Lora (serif), 500 weight, negative letter-spacing
- **Body / UI:** DM Sans, 300–400 weight
- **Page titles:** 38px Lora 500, letter-spacing −0.8px
- **Eyebrows:** 13px DM Sans 500, uppercase, 0.11em tracking

### Design Principles

- Fully monochromatic base — color only via accent tokens
- Grain texture overlay (SVG noise, `body::before`)
- `fadeUp` entrance animations (0.38s ease, 14px Y offset)
- Ghost + filled button pattern
- Editorial spacing (generous padding, 12px uppercase section labels)
- Tag/badge style: neutral stone pills, `border: 1px solid var(--border-hi)`
- Cards: `--bg-raised`, 1px border, 12px radius, `shadow-sm`
- Guide tiles: Anthropic blog style — inset colored header (10px margin, 14px radius) with hand-drawn sketch SVG on `#faf9f5` paper rects

---

## Database Schema

See `docs/schema.md` for full Drizzle definitions (TypeScript ORM). Total: 20 tables across 9 categories.

**Core Infrastructure:**
- `hospitals` — tenant registry
- `users` — email, role, pgy_year, current_rotation_id, fellowship_goal, orcid_id, program_name, hospital_id
- `magic_links` — token, email, expires_at, hospital_id
- `audit_logs` — immutable HIPAA audit trail (append-only)

**Guidelines & Protocols:**
- `guidelines` — title, content, specialty, version, status, pdf_url, evidence_strength, hospital_id
- `ratings` — guideline_id, user_id, score, comment
- `guideline_versions` — version history with content snapshots + change summaries

**Case & Procedure Logging:**
- `case_logs` — all ACGME fields, operative_autonomy (Zwisch 1–5), source enum, is_complete flag, user_id, hospital_id
- `bedside_procedures` — procedure_type, site_laterality, ultrasound_guided, supervision, complications, procedure_date, user_id, hospital_id
- `attending_feedback` — autonomy_level, case_complexity, teaching_value (Likert 1–5) [deprecated; replaced by epa_assessments]

**EPA & Assessment:**
- `epa_requests` — case_log_id, attending_email, attending_name, magic_token, status (pending/sent/received/expired), sent_at, completed_at, expires_at (72h), hospital_id
- `epa_assessments` — epa_request_id, case_log_id, preop_score (1–5), intraop_score (1–5), postop_score (1–5), confirmed_autonomy, comments, submitted_by, hospital_id

**Rotation & Fellowship:**
- `rotations` — user_id, rotation_name, start_date, end_date, hospital_id
- `fellowship_goals` — user_id, fellowship_name, target_apply_date, hospital_id

**Research & Publications:**
- `publications` — user_id, orcid_work_id, pmid, title, journal, publication_date, is_first_author, citation_count, impact_factor, doi, hospital_id, synced_at

**Wellness & Mental Health:**
- `wellness_checkins` — user_id, checkin_date, sleep_hours, mood_score, stress_score, exercise_minutes, phq9_score, gad7_score, epworth_score, phq9_item9_flagged, hospital_id

**On-Call Integration:**
- `on_call_assignments` — provider_name, provider_email, provider_phone, provider_pager, service, shift_start, shift_end, qgenda_task_id, hospital_id, synced_at

**Global Tables (not tenant-scoped):**
- `conference_deadlines` — conference_name, society, fellowship_target, deadline_date, submission_url, typical_month, last_scraped_at, is_community_corrected
- `podcast_episodes` — source (btk/surgeons_cut/surgonc_today/ssat/trauma_voice), title, description, audio_url, published_at, specialty_tags (array), duration_seconds, external_id, synced_at

---

## Pages Built (Prototype)

| Page | Status | Route |
|---|---|---|
| Service Dashboard (Home) | ✅ Complete | `navigate('home')` |
| Case Log Dashboard | ✅ Complete | `navigate('caselogs')` |
| Guidelines Catalog | ✅ Complete | — |
| Guideline Detail | ✅ Complete | — |
| On-Call Directory | ✅ Complete | — |
| Register Hospital | ✅ Complete | — |
| Rotation Landing Page | 🔲 To Build | — |
| Unified Case & Procedure Log (enhanced) | 🔲 To Build | — |
| Post-Case EPA Modal | 🔲 To Build | — |
| Benchmarking Dashboard | 🔲 To Build | — |
| Operative Autonomy Heatmap | 🔲 To Build | — |
| Fellowship Goal Tracking | 🔲 To Build | — |
| Research Tracking | 🔲 To Build | — |
| Wellness Module | ✅ Complete | — |

---

## Navigation Structure

```
GuideFlow / [Service ▾]    Guidelines ▾    Directory ▾    Analytics ▾
                                                           └─ Case Logs
                                                           └─ Search Analytics
```

- Left: Logo mark (G) + GuideFlow / [Service switcher dropdown]
- Center: Guidelines (specialty dropdown), Directory (contacts dropdown), Analytics (reports dropdown)
- Right: Search (⌘K), Theme toggle (sun/moon), Login, Avatar (DR)

---

## File Structure

```
guideflow-project/
├── CLAUDE.md                    ← This file (project memory + instructions)
├── README.md                    ← Public project overview
├── docs/
│   ├── architecture.md          ← System architecture + EHR strategy + competitive positioning
│   ├── schema.md                ← Database schema (Drizzle) — 9 tables
│   ├── design-tokens.md         ← Full color/typography reference
│   ├── decisions/               ← Architecture Decision Records
│   │   └── 001-subdomain-tenancy.md
│   └── runbooks/                ← Operational procedures
│       └── deploy.md
├── .claude/
│   ├── settings.json            ← Claude Code configuration
│   ├── hooks/                   ← Automation and guardrails
│   │   └── pre-commit.md
│   └── skills/                  ← Reusable AI workflows
│       ├── design-review/
│       │   └── SKILL.md
│       ├── guideline-upload/
│       │   └── SKILL.md
│       └── schema-migration/
│           └── SKILL.md
├── tools/
│   ├── scripts/                 ← Utility scripts
│   └── prompts/                 ← Reusable prompt templates
│       └── port-prototype.md
├── tasks/
│   ├── todo.md                  ← Current sprint tasks
│   └── lessons.md               ← Self-improvement log
├── prototype/
│   └── guideflow-app.html       ← Complete UI reference (single-file, 4 pages)
└── src/                         ← Next.js application (to be scaffolded)
    ├── api/
    │   └── CLAUDE.md            ← API module context
    ├── persistence/
    │   └── CLAUDE.md            ← Database module context
    ├── components/              ← React components
    └── pages/                   ← App Router pages
```
