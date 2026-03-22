# GuideFlow — Product Requirements Document v2.0

**Company:** PMG Health Technologies  
**Version:** 2.0 — Phase 1 (Refined)  
**Date:** March 2026  
**Status:** Pre-launch — Prototype  
**Repo:** github.com/danishyasin33/pmg (private)

---

## 1. Overview

GuideFlow is a multi-tenant SaaS platform and mobile application for U.S. teaching hospitals. It serves surgical residents by unifying six workflows currently fragmented across three or more separate tools: clinical guidelines, case and procedure logging, EPA assessment, fellowship readiness tracking, research tracking, and educational content.

The core insight: a single 10-second action — logging a case or procedure — simultaneously satisfies ACGME documentation, triggers an attending EPA assessment, advances fellowship readiness tracking, and updates the resident's operative autonomy profile. No competing product connects these outcomes.

---

## 2. The Core Loop

| Step | Action | Outcome |
|---|---|---|
| 1 | Resident dictates or logs a case/procedure | Saved to unified log — operative case or bedside procedure |
| 2 | EPA request fires automatically | Attending receives SMS + email with mobile assessment link |
| 3 | Attending confirms operative autonomy | Zwisch scale response updates autonomy heatmap |
| 4 | Dashboard updates in real time | Progress vs. cohort and national average recalculated |
| 5 | Fellowship readiness updates | Gap to matched applicant profile recalculated |
| 6 | ACGME export ready on demand | CSV formatted for ADS upload; credentialing log updated |

---

## 3. Target Users

| Role | Primary Need | Key Action |
|---|---|---|
| Surgical Resident | Track cases/procedures, EPA feedback, plan fellowship, research | Log case, view dashboard, check rotation page |
| Program Director | Monitor resident progress, CCC prep, benchmark program | Program analytics, autonomy heatmaps, export reports |
| GME Coordinator | Manage rotations, directory, onboard residents | Admin panel, schedule upload, user management |
| Attending Surgeon | Provide timely EPA and autonomy feedback | Complete mobile form via SMS/email link |
| Hospital Admin | Provision new hospital tenants | Register Hospital page |

---

## 4. Resident Onboarding — 4 Questions, 60 Seconds

| Step | Question | Effect |
|---|---|---|
| 1 | What program are you in? | Sets ACGME requirements, cohort benchmarks, program roster |
| 2 | What rotation are you on? | Sets rotation landing page, surfaced guidelines, relevant EPAs, podcast feed |
| 3 | What fellowship are you interested in? | Sets fellowship readiness tracking and matched applicant benchmarks |
| 4 | Connect your ORCID (optional) | Pulls publications, co-authors, research metrics, citation counts |

---

## 5. Feature Specifications

### 5.1 Rotation Landing Page

The first screen a resident sees when opening GuideFlow. Everything contextualized to their current rotation. Never a generic dashboard.

| Section | Content |
|---|---|
| Case & Procedure Progress | Counts for the 3–4 ACGME categories and bedside procedures most relevant to this rotation vs. national average for same PGY year |
| Clinical Guidelines | Top 5 guidelines most relevant to this rotation, sorted by recency |
| EPA Entrustment | Current entrustment level on the EPAs tied to this rotation, trend over time |
| Podcast Feed | BTK and other surgery podcast episodes tagged to this rotation's specialty, ranked by relevance to logged case gaps |
| Conference Deadlines | Upcoming abstract deadlines for societies relevant to fellowship goal, sorted by proximity — turns red under 4 weeks |
| On-Call Today | Today's attending on this service from QGenda sync, escalation contacts |

**How Rotation Context Is Set**
- Phase 1: Resident picks rotation from dropdown on first open, sets start/end dates. 30 seconds.
- Phase 2: Schedule upload (PDF or iCal) or QGenda auto-sync.
- Context switches automatically when dates change.

---

### 5.2 Unified Case & Procedure Log

One log. One timeline. One submit button. Resident selects the type first — operative case or bedside procedure — and the form adapts. Voice dictation works for both.

#### 5.2.1 Voice Dictation

Resident dictates one or two sentences. GuideFlow transcribes via OpenAI Whisper, then Claude parses the transcript into structured fields. Resident reviews the pre-filled form and submits.

**Example:** *"Lap chole with Dr. Patel today, I was primary surgeon, straightforward biliary case"*

| Field | Parsed Value | Source |
|---|---|---|
| Procedure | Laparoscopic Cholecystectomy | NLP extraction |
| Attending | Dr. Patel | Matched from program roster |
| Role | SJ | Inferred from PGY year + "primary surgeon" |
| Defined Category | Biliary | Inferred from procedure |
| Date | Today | Automatic |
| Rotation | Hepatobiliary | From rotation context |

**Edge cases:**
- Unrecognized attending → dropdown fallback
- Ambiguous role → default to SJ for PGY 1–3, confirm prompt
- Multiple procedures → prompt to split into separate logs

#### 5.2.2 Operative Case Fields

| Field | Type | Notes |
|---|---|---|
| Case ID | Text | E-code prefix supported for vascular |
| Case Date | Date | Auto-filled to today |
| PGY Year | Select 1–5 | Auto-filled from profile |
| Rotation | Select | Defaults to current rotation context |
| Role | Select | SC / SJ / TA / FA |
| Operative Autonomy Given | Select | Zwisch scale: Show & Tell / Active Assistance / Passive Help / Supervision Only / Solo |
| Site | Select | Per-tenant list |
| Attending | Select | Pre-populated from QGenda |
| Patient Type | Select | Adult / Pediatric |
| Defined Category | Grouped select | All ACGME categories with subcategories |
| Procedure / CPT | Text | Free text |
| Involved Trauma | Checkbox | |
| Comments | Textarea | Optional |

The Operative Autonomy field is resident self-reported at submission. Attending confirms or adjusts via the EPA modal. If attending does not respond, resident self-report stands.

#### 5.2.3 Bedside Procedure Fields

| Field | Type | Notes |
|---|---|---|
| Procedure Type | Select | Central Line (IJ/SC/Femoral), Arterial Line (Radial/Femoral), Chest Tube, Thoracentesis, Paracentesis, Wound VAC, Abscess I&D, Tracheostomy Care, G/J-Tube, Drain Management |
| Site / Laterality | Select | Right / Left / N/A |
| Ultrasound-Guided | Checkbox | |
| Supervised or Independent | Select | Supervised / Independent |
| Complications | Select | None / Minor / Major |
| Date | Date | Auto-filled to today |
| Attending | Select | Pre-populated from QGenda |
| Rotation | Select | From rotation context |
| Comments | Textarea | Optional |

**Credentialing export:** at graduation, one-click PDF certificate documenting all bedside procedures by type with dates, supervision status, and attending names — formatted for hospital privileges applications.

#### 5.2.4 Post-Submission EPA Modal (Operative Cases Only)

- Appears immediately after operative case is logged
- Shows case summary and suggests the most relevant EPA(s) based on defined category
- Attending pre-filled from case form
- One tap to send — fires email and SMS to attending with single-use magic link (72-hour expiry)
- Attending sees mobile-optimized 3-phase form: Pre-op / Intra-op / Post-op, each scored on ABS 1–5 entrustment scale
- Attending also confirms or adjusts the Zwisch autonomy level the resident self-reported
- Cases table status column: Pending / Sent / Received

---

### 5.3 Benchmarking Dashboard

Three layers of comparison on every case count, procedure count, and EPA metric.

| Layer | Comparison | Available |
|---|---|---|
| 1 — Personal | Resident's own trend over time — case velocity, EPA score trajectory, autonomy progression | Day 1 |
| 2 — Cohort | Same PGY year, same rotation, same program | Day 1 (within program) |
| 3 — National | Same PGY year, same rotation, across all GuideFlow programs | Phase 2 (50+ programs) |

Layer 3 is the moat. Once cross-program data exists, no competitor can replicate it without years of data collection from scratch.

**Program Director View**
- Cohort-level case and procedure distribution by PGY year and rotation
- EPA completion rates by attending — response time, comment richness, score variance, discrimination index
- Residents at risk — below-pace alerts for ACGME category minimums
- Autonomy utilization alerts — residents assessed as competent but given low autonomy
- Program benchmarked against national average (anonymized, aggregated)
- CCC report auto-generation — one export with all resident data formatted for committee review

---

### 5.4 Operative Autonomy Heatmap

Visual grid of every ACGME procedure category and bedside procedure, colored by the resident's achieved entrustment and autonomy level. Two data sources drive each cell.

| Layer | Source | Meaning |
|---|---|---|
| Outer color | EPA competency score (attending assessment) | What the attending thinks the resident can do |
| Inner ring | Zwisch autonomy scale (actual intraoperative autonomy given) | What actually happened in the OR |

| Color | Level | Meaning |
|---|---|---|
| Dark green | Level 5 / Supervision only | Near-independent, practice-ready |
| Light green | Level 4 / Passive help | Minimal assistance needed |
| Amber | Level 3 / Active assistance | Getting there |
| Orange | Level 2 | Needs significant help |
| Red | Level 1 / Show and tell | Never done or very early |

**Divergence Signals**
- High competency + low autonomy → resident underutilized, flag to PD
- Low competency + high autonomy → safety signal, flag to PD
- Both signals visible on the PD's cohort heatmap across all residents

Procedure weighting: cells are weighted by their PGY-level discriminatory power (derived from SIMPL national data — high-volume, high-discrimination procedures carry more weight in the overall readiness score).

---

### 5.5 Fellowship Goal Tracking

Resident selects target fellowship at onboarding. GuideFlow tracks progress against the benchmark profile of applicants who matched into that fellowship — not ACGME minimums, actual match data.

#### Fellowship Intelligence Dashboard

| Metric | Source | Updates |
|---|---|---|
| Average case counts of matched applicants by category | Fellowship Council annual stats + crowdsourced from GuideFlow users who matched | Annually |
| Research output — publications, presentations, abstracts at application | ORCID + PubMed + crowdsourced | Real-time |
| Board score ranges | Fellowship Council + specialty society surveys | Annually |
| Rotation profile — which rotations matched applicants typically completed | Crowdsourced from GuideFlow matched users | Continuously |
| Application timeline — when to apply, interview season | Fellowship Council + program websites | Annually |
| Match rate by program tier | Fellowship Council annual match statistics | Annually |

#### Readiness Score

A single composite score updated in real time. Example output:

> *"Matched HPB fellows averaged 68 biliary cases, 2.1 publications, 1 major society presentation. You have 31 cases, 0 publications, 0 presentations. You are applying in 22 months."*

Gap analysis with specific components:
- Case count vs. matched applicant average by fellowship and category
- EPA entrustment level on fellowship-relevant procedures
- Research output vs. matched applicant average
- Rotation profile completeness vs. matched applicants

#### Supported Fellowships — Phase 1

| Fellowship | Society | Key Case Categories |
|---|---|---|
| Colorectal Surgery (CRS) | ASCRS / Fellowship Council | Large Intestine, Anorectal, Laparoscopic Complex |
| Hepatobiliary (HPB) | AHPBA / Fellowship Council | Biliary, Liver, Pancreas |
| Minimally Invasive (MIS/Bariatric) | SAGES / Fellowship Council | Laparoscopic Basic, Laparoscopic Complex, Upper Endoscopy |
| Surgical Oncology | SSO / ACS | Breast, Head & Neck, Skin/Soft Tissue, Abdominal |
| Vascular Surgery | SVS / ABS | Vascular — Access, Anastomosis/Repair |
| Thoracic Surgery | STS / AATS | Thoracic, Thoracotomy |
| Breast Surgery | ASBrS | Breast — Mastectomy, Axilla |
| Pediatric Surgery | APSA / ABS | Pediatric Surgery |
| Surgical Critical Care | SCCM / ABS | Surgical Critical Care, Trauma, Bedside Procedures |
| Transplant Surgery | ASTS / AATS | Liver, Pancreas, Vascular Access |

---

### 5.6 Research Tracking — ORCID Integration

Resident connects their ORCID profile via OAuth on onboarding step 4.

**Data Sources**
- ORCID API (free, official) — publications, co-authors, employment, peer review, funding
- PubMed API (free) — impact factors, citation counts, full metadata
- SerpApi Google Scholar endpoint (optional, paid) — h-index, i10-index

**Research Intelligence Layer**
- Publication velocity — accelerating or stalling vs. matched applicant trajectory
- First-author vs. co-author ratio
- Journal prestige trajectory — moving up or down in impact factor
- Co-author network map — which attendings they've published with
- Single mentor concentration risk — flag if research is dependent on one relationship
- Research momentum score — composite of velocity, prestige, citation growth, time since last publication

---

### 5.7 Abstract Deadline Engine

Surfaces upcoming conference abstract deadlines relevant to the resident's fellowship goal, rotation, and PGY year. Lives as a card on the rotation landing page. Sorted by proximity. Turns red under 4 weeks.

**How It Works**
- Seed database of 40+ surgical society conferences with typical deadline windows and submission URLs
- Cloudflare Worker cron scrapes deadline pages weekly; Claude extracts current deadline date from HTML
- Three matching signals: fellowship goal → relevant societies; rotation → topical relevance; PGY year → eligibility filtering
- Community corrections — resident can flag a changed deadline in one tap

**Conference Database — Phase 1**

| Conference | Society | Fellowship Target | Typical Deadline |
|---|---|---|---|
| Academic Surgical Congress (ASC) | AAS/SUS | All | August |
| SAGES Annual Meeting | SAGES | MIS / Bariatric | October |
| AHPBA Annual Meeting | AHPBA | HPB | September |
| ASCRS Annual Meeting | ASCRS | Colorectal | October |
| SSO Annual Meeting | SSO | Surgical Oncology | November |
| AAST Annual Meeting | AAST | Trauma | February |
| ASBrS Annual Meeting | ASBrS | Breast | November |
| ACS Clinical Congress | ACS | All | March |
| APSA Annual Meeting | APSA | Pediatric | January |
| SVS Annual Meeting | SVS | Vascular | December |
| Southern Surgical Association | SSA | All | June |
| ASTS Annual Meeting | ASTS | Transplant | October |

---

### 5.8 Rotation-Aware Podcast Feed

Resident switches to Transplant rotation — GuideFlow surfaces BTK transplant episodes and relevant episodes from other surgery podcasts automatically. Episodes ranked by relevance to logged case gaps, not recency.

**Implementation**
- BTK RSS feed (public, Libsyn-hosted) parsed directly — episodes already tagged by specialty
- Listen Notes API as secondary source — full surgery podcast ecosystem, topic search
- Episodes ranked by case gap relevance — 0 liver cases → liver episodes surface first
- New episodes auto-appear when published

**Podcast Sources — Phase 1**
- Behind the Knife (BTK) — primary, specialty-tagged
- Surgeons Cut — Royal College of Surgeons
- SurgOnc Today — surgical oncology
- SSAT Podcast — HPB / GI
- Trauma Voice — EAST / trauma

---

### 5.9 Attending Feedback Patterns

Resident-facing only. Never shared with attendings or program directors.

- Response rate per attending — percentage of EPA requests completed
- Average response time — hours from request to completion
- Feedback richness — comment length and specificity trend
- Score pattern — do they tend to rate high, low, or use the full scale

Helps residents optimize who they request EPAs from and when.

---

### 5.10 Smart Rotation Debrief

Auto-generated when a rotation ends. Zero effort from anyone. Sent to resident automatically. Optionally shared with PD.

- Cases logged — by category, role, and autonomy level
- Bedside procedures completed
- EPA assessments received — count, average score, trend
- Coverage gaps — categories short of rotation-expected pace
- Milestone EPAs — entrustment levels achieved vs. target for this rotation
- Compared to cohort average for the same rotation

Feeds directly into semi-annual review portfolio.

---

### 5.11 Clinical Guidelines

- Filterable catalog by specialty, category, and recency
- Full-content detail page with PDF viewer (Cloudflare R2)
- Star rating widget — Healthcare Professional role
- Admin CRUD — rich text editor, PDF upload, category tagging, metadata, review scheduling
- Default review cadence: 36 months with category-specific overrides
- Top 5 guidelines for current rotation surfaced on landing page automatically
- Phase 2: pgvector semantic RAG search with pre-output safety filter

---

### 5.12 On-Call Directory

- QGenda REST API sync — Cloudflare Worker cron every 5 minutes
- Today's on-call attending per service with pager and phone
- Escalation paths and service contacts
- Manual coordinator override for last-minute swaps
- Fallback: last synced data with timestamp if API unavailable
- Today's attending surfaced directly on rotation landing page — no navigation needed

---

### 5.13 Wellness Module

Five sub-tabs: Sleep / Nutrition / Exercise / Mental Health / Crisis & Support.

- Weekly check-in — sliders for sleep, mood, stress (persisted per resident)
- Validated instruments: Epworth Sleepiness Scale, PHQ-9, GAD-7, AUDIT-C
- PHQ-9 Item 9 crisis modal — cannot be dismissed without seeing 988 and Physician Support Line
- PHQ-9 / GAD-7 scored and interpreted with trend over time
- Weekly movement tracker
- Persistent crisis banner: 988 Suicide & Crisis Lifeline + Physician Support Line 1-888-409-0141
- Evidence-backed protocol cards per domain with peer-reviewed citations
- Financial literacy section: loan repayment overview, PSLF explainer, moonlighting income considerations

---

## 6. Mobile Application

| Platform | Approach | Rationale |
|---|---|---|
| iOS + Android | React Native | Single codebase, native performance, App Store discoverability |
| Web | Next.js App Router | Same backend, same auth, responsive for coordinators and PDs |
| Offline | SQLite local cache, sync on reconnect | Cases logged in poor OR connectivity, synced when back online |

The mobile app is the primary surface for residents. Voice dictation, case logging, EPA requests, and the rotation landing page are all optimized for one-handed use between cases.

---

## 7. Architecture & Tech Stack

### 7.1 Multi-Tenancy

- Each hospital gets its own subdomain: `stmichaels.pmg.app`
- Middleware extracts subdomain, rewrites internally — no database calls in middleware
- Row-Level Security at Postgres session level — all data scoped per tenant
- JWT hardened with tenant-scoped claims; magic link auth via Resend

### 7.2 Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router (web) + React Native (mobile) |
| Backend / Edge | Cloudflare Workers |
| Database | Neon PostgreSQL + Drizzle ORM |
| Auth | Magic link — JWT + Resend |
| File Storage | Cloudflare R2 (PDFs, guidelines) |
| Real-time | Cloudflare Durable Objects |
| UI — Web | Tailwind CSS + shadcn/ui |
| Voice STT | OpenAI Whisper API |
| NLP Parse | Claude API (structured JSON extraction from dictation) |
| Scheduling Sync | QGenda REST API — Cloudflare Worker cron (5 min) |
| Research | ORCID REST API + PubMed API (free) + SerpApi (optional) |
| Podcast | BTK RSS feed (direct) + Listen Notes API |
| Search Phase 1 | PostgreSQL ILIKE |
| Search Phase 2 | pgvector (semantic RAG) + pre-output safety filter |
| Offline (Mobile) | SQLite local cache + background sync |

---

## 8. Integrations

### 8.1 QGenda
- REST API: `api.qgenda.com/v2`
- Auth: company key + username + password → bearer token
- Poll every 5 minutes via Cloudflare Worker cron
- Data: Staff (provider) + Task (shift start/end) → `on_call_assignments` table per tenant
- Credentials stored per tenant

### 8.2 ACGME ADS — Case Log Export
- No public API — ADS does not support bulk import
- GuideFlow exports ACGME-formatted CSV; residents upload to ADS manually
- Field mapping is 1:1 with all ADS case log fields
- ACGME Cloud (2025) is the future API pathway — contact cloud@acgme.org

### 8.3 EPA — ABS / SIMPL
- GuideFlow EPA is formative — no ABS approval required for formative use
- SIMPL is an independent 501(c)(3) nonprofit contractor, not owned by the ABS — alternatives explicitly permitted
- Alternate tool pathway: build adoption → contact epas@absurgery.org → formal review process
- Firefly precedent: ABS selected a different tool for specialty surgical programs when SIMPL wasn't the right fit

### 8.4 ORCID
- OAuth 2.0 authorization — resident authorizes once
- ORCID Public API — free, official, well-documented
- Pulls: works (publications), employment, education, peer review, funding
- Cross-referenced with PubMed API for impact factors and citation counts
- Auto-updates when resident publishes new work

### 8.5 Podcast — RSS + Listen Notes
- BTK RSS feed: `behindtheknife.libsyn.com/rss` — parsed directly, no API key
- Listen Notes API: secondary source, full surgery podcast ecosystem, topic search
- Episode metadata cached in Cloudflare Workers KV — no live fetch on every page load

---

## 9. ACGME Graduation Requirements — General Surgery

Total: 850 major cases as Surgeon (SC + SJ), minimum 200 as Chief (SC). PGY-3 cutoff: 250 cases. Teaching Assistant minimum: 25 TA cases.

| Category | Minimum | Key Subcategory Minimums |
|---|---|---|
| Abdominal | 250 | Biliary ≥85, Hernia ≥85, Liver ≥5, Pancreas ≥5 |
| Alimentary Tract | 180 | Esophagus ≥5, Stomach ≥15, Small Intestine ≥25, Large Intestine ≥40, Appendix ≥40, Anorectal ≥20 |
| Laparoscopic Basic | 100 | |
| Laparoscopic Complex | 75 | |
| Endoscopy | 85 | Upper ≥35, Colonoscopy ≥50 |
| Skin / Soft Tissue | 25 | |
| Breast | 40 | Mastectomy ≥5, Axilla ≥5 |
| Head and Neck | 25 | |
| Vascular | 50 | Access ≥10, Anastomosis/Repair ≥10 |
| Endocrine | 15 | Thyroid/Parathyroid ≥10 |
| Operative Trauma | 10 | |
| Non-Operative Trauma | 40 | Resuscitations as Team Leader ≥10 |
| Thoracic Surgery | 20 | Thoracotomy ≥5 |
| Pediatric Surgery | 20 | |
| Plastic Surgery | 10 | |
| Surgical Critical Care | 40 | |

---

## 10. Roles & Permissions

| Role | Guidelines | Case Log | EPA | Directory | Analytics | Admin |
|---|---|---|---|---|---|---|
| Resident | Read | Own only | Request / view own | Read | Personal | None |
| Attending | Read | None | Complete | Read | None | None |
| Program Director | Read | All residents | View all | Read | Full program | Limited |
| GME Coordinator | Read/Write | All residents | View all | Read/Write | Full program | Full |
| Hospital Admin | Full CRUD | All | View all | Full CRUD | Full | Full |
| Developer | None | None | None | None | None | Tenant provision |

---

## 11. Phases & Roadmap

### Phase 1 — Launch

| Feature | Status |
|---|---|
| Service Dashboard (Home) | ✅ Complete — HTML prototype |
| Case Log Dashboard | ✅ Complete — HTML prototype |
| Wellness Module (5 tabs) | ✅ Complete — HTML prototype |
| Unified Case & Procedure Log | 🔲 Spec complete |
| Voice Dictation → Auto-parse | 🔲 Spec complete |
| Post-Case EPA Modal | 🔲 Spec complete |
| Operative Autonomy (Zwisch) capture | 🔲 Spec complete |
| Benchmarking Dashboard (personal + cohort) | 🔲 Spec complete |
| Operative Autonomy Heatmap | 🔲 Spec complete |
| Fellowship Goal Tracking + Readiness Score | 🔲 Spec complete |
| ORCID Integration + Research Tracking | 🔲 Spec complete |
| Abstract Deadline Engine | 🔲 Spec complete |
| Rotation-Aware Podcast Feed | 🔲 Spec complete |
| Attending Feedback Patterns | 🔲 Spec complete |
| Smart Rotation Debrief | 🔲 Spec complete |
| Rotation Landing Page | 🔲 Spec complete |
| Clinical Guidelines Catalog + Detail | 🔲 Spec complete |
| On-Call Directory (QGenda) | 🔲 Spec complete |
| Login (magic link, tenant-aware) | 🔲 Spec complete |
| React Native Mobile App (iOS + Android) | 🔲 Spec complete |
| ACGME CSV Export + Credentialing Export | 🔲 Spec complete |
| Register Hospital (Dev) | 🔲 Spec complete |

### Phase 2 — Scale

- National benchmarking dashboard — requires 50+ programs
- pgvector semantic RAG search for guidelines with safety filter
- Schedule upload (PDF / iCal) and full QGenda auto-sync for rotation context
- ACGME Cloud API integration (when available — contact cloud@acgme.org)
- ABS EPA alternate tool approval pathway (contact epas@absurgery.org after 5+ pilots)
- Fellowship crowdsourced match data layer — opt-in from matched residents
- Mentorship matching engine — based on EPA response patterns, publications, case overlap
- Complication log — private, feeds M&M prep, maps to ACGME competency domains
- Board exam countdown — personalized study roadmap tied to case log gaps
- Anonymous program pulse — monthly 3-question cohort check-in for PDs
- Simulation milestone tracker — FLS, FES, robotic credentialing
- Financial literacy module inside Wellness — PSLF tracker, loan repayment tools
- Masked Caller + Hospital Maps

---

## 12. Design System

### 12.1 Principles
- Monochromatic — no color accents in chrome; accent colors used only for data visualization
- Grain texture overlay — SVG fractal noise, opacity 0.035 dark / 0.018 light
- Staggered fadeUp entrance animations — 0.38s, 14px Y offset
- Ghost + filled button pattern
- Editorial spacing — generous padding, 12px uppercase section labels

### 12.2 Color Tokens

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| `--bg` | `#131313` | `#FFFFFF` | Page background |
| `--bg-raised` | `#1A1A1A` | `#FFFFFF` | Cards, panels |
| `--bg-hover` | `#222222` | `#F5F3F0` | Hover states |
| `--border` | `#2A2A2A` | `#E8E2D9` | Default borders |
| `--border-hi` | `#363636` | `#D6CFC4` | Elevated borders |
| `--text-1` | `#F0EBE3` | `#141210` | Primary text |
| `--text-2` | `#C4BDB4` | `#6B6560` | Secondary text |
| `--text-3` | `#666260` | `#9E9890` | Muted / labels |
| `--ac-orange` | `#E8956F` | `#D07040` | SC role, EPA scores |
| `--ac-blue` | `#8BB8E0` | `#5585B0` | SJ role, charts |
| `--ac-green` | `#9AB87A` | `#688548` | TA role, met goals |

### 12.3 Typography
- Display / headings: Lora serif, italic numerals in lists
- Body / UI: DM Sans
- Base body: 16px, weight 300–400
- Page titles: 38px, Lora 500, letter-spacing −0.8px

---

## 13. Competitive Positioning

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

## 14. Monetization

| Tier | Price | Residents | Notes |
|---|---|---|---|
| Starter | $149/month | ≤10 residents | Single program |
| Program | $349/month | Unlimited | Full feature set |
| Institution | Custom | Multi-program | Enterprise contract, HIPAA BAA, custom branding |

- **TAM:** ~9,000 U.S. programs × $350/month = $38M+ ARR at full penetration
- **Year 1 target:** 25 programs = $105K ARR
- **Phase 2 revenue:** anonymized national benchmarking reports sold to fellowship programs and specialty societies; guideline content marketplace; CME credit delivery

---

## 15. Patent Pipeline

File all 7 provisionals now ($320/each, USPTO micro-entity rate) to lock priority dates. Full utility filings for top 3 after pilot validation.

| # | Concept | Priority |
|---|---|---|
| 1 | Case log temporal metadata + wellness scores + shift density → resident distress proxy → confidential intervention | High |
| 2 | Rotation context change (QGenda) → auto-reconfigure guidelines, search, case categories + gap analysis | High |
| 3 | Case logs + EPA + rotation history + ORCID → fellowship readiness score + application portfolio assembly | High |
| 4 | Cross-program case distribution → rarity flag → EPA request suggestion + attending teaching signal | Medium |
| 5 | Case linked to guideline → pre/post update behavioral analysis → protocol adoption signal | Medium |
| 6 | EPA response time + completion rate + comment richness + score discrimination → attending teaching quality index | Medium |
| 7 | Case velocity + cross-program rotation yield models → graduation gap alerts + rotation recommendations | High |

---

## 16. Go-to-Market

### Primary Buyers
- **Program Director** — ACGME compliance, CCC efficiency, resident benchmarking
- **GME Coordinator** — admin burden reduction, scheduling integration
- **DIO / CMO** — institutional compliance, risk management

### GTM Phases

| Phase | Action | Goal |
|---|---|---|
| 1 | 5 free pilot programs — founders' network | Validate core loop, gather testimonials, collect match outcome data |
| 2 | Resident viral loop — rotating residents spread across programs | Organic multi-program awareness, App Store downloads |
| 3 | ACGME Annual Conference + abstract submission on GuideFlow outcomes data | PD and coordinator awareness |
| 4 | Institutional upsell when 3+ programs at same hospital | Push to Institution tier |
| 5 | BTK partnership — GuideFlow featured on platform after usage data collected | Resident acquisition at scale |

---

## 17. Open Questions

- **ACGME Cloud API:** contact cloud@acgme.org — timeline and data model for v1 API access
- **ABS EPA alternate tool:** contact epas@absurgery.org after 5+ pilot programs — initiate formal alternate tool review
- **Patent filing:** engage USPTO Pro Bono Program or file provisionals independently; IP counsel before Phase 2
- **Fellowship match data:** Fellowship Council data sharing agreement; specialty society survey partnerships
- **HIPAA BAA:** required before institutional contracts — confirm Cloudflare, Neon, Resend BAA status
- **BTK partnership:** approach after App Store launch with usage data — co-marketing or featured integration
- **Crowdsourced match data:** design opt-in flow for matched residents; define anonymization standards
- **React Native build:** confirm shared auth/session model between web and mobile before scaffold

---

*© 2026 PMG Health Technologies. Confidential.*
