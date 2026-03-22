# Implementation Plan: 4 Missing Prototype Pages

**Date:** 2026-03-16
**File:** `prototype/guideflow-app.html` (single-file HTML prototype, ~670 lines)
**Approach:** Add each page sequentially to the existing file. Each task adds CSS, HTML, sidebar section, and JS.

## Architecture Context

The prototype uses client-side routing via `navigate(pageName)`. Each page is a `<div class="page" id="page-{name}">` containing a `<div class="main">`. The sidebar swaps content per page via `sb-{name}` divs. The `navigate()` function hides all pages, shows the target, and swaps sidebar visibility.

Design system: Anthropic-inspired monochromatic (dark/light theme), Lora headings, DM Sans body, grain texture, fadeUp animations, ghost+filled buttons, editorial spacing. All CSS vars already defined.

## Task 1: Guidelines Catalog Page

**What to build:**
A full-page filterable grid of all institutional guidelines. This replaces the "Most Recent" section on the home page as the comprehensive browsing experience.

**HTML structure:**
- Page div: `<div class="page" id="page-catalog">` inside `#app-layout`, after `page-home`
- Sidebar: `<div id="sb-catalog">` with specialty filter links (same as home sidebar) + an "Evidence Strength" filter section
- Main content:
  - Page eyebrow: "St. Michael's Hospital"
  - Title: "Guidelines Catalog"
  - Subtitle: "Browse and search all institutional protocols, guidelines, and clinical resources."
  - Search bar (same pattern as home page)
  - Filter pills row: "All", "Emergency", "Surgery", "Pharmacy", "Neurology", etc. — horizontal scrollable pills that filter the grid
  - Grid: reuse `.guide-grid` + `.guide-card` pattern from home page but with MORE cards (12 total). Each card should show an evidence strength tag (Strong / Moderate / Institutional) in addition to the specialty tag.
  - The 5 existing guide cards from home can be duplicated here plus 7 new ones

**CSS to add:**
- `.filter-pills` — horizontal flex row with gap, overflow-x auto
- `.filter-pill` — styled like `.tag` but clickable, with `.active` state (filled background)
- `.evidence-tag` — small colored badge: Strong=green, Moderate=blue, Institutional=orange-dim

**JS to add:**
- Update `navigate()` to handle `'catalog'`
- Filter pills click handler: toggle active state, filter grid cards by `data-specialty` attribute
- Search input filters by title text (same pattern as home page search)
- Wire "View All" link in Guidelines dropdown to `navigate('catalog')`

**Navigation wiring:**
- Guidelines dropdown "View All" → `navigate('catalog')`
- Home page guide cards → `navigate('detail')` (prep for Task 2)

---

## Task 2: Guideline Detail Page

**What to build:**
A single-guideline view showing full content, PDF embed area, star rating, and version metadata.

**HTML structure:**
- Page div: `<div class="page" id="page-detail">` after `page-catalog`
- Sidebar: reuse `sb-catalog` (same specialty nav) — no separate sidebar needed
- Main content:
  - Breadcrumb: "Guidelines / Emergency / Sepsis Management Protocol"
  - Title: dynamic (set by JS when navigating)
  - Metadata row: Version badge, Last updated date, Author, Evidence strength tag
  - Rating section: 5 stars (clickable SVG stars) + rating count + average
  - Content area: large panel with rich text body (simulated — 3-4 paragraphs of sample clinical content with headers, bullet points)
  - PDF viewer placeholder: dashed-border box saying "PDF Preview — Sepsis_Protocol_v3.pdf" with a "Download PDF" ghost button
  - Related guidelines: 3 small guide cards at the bottom (reuse `.guide-card` but smaller)

**CSS to add:**
- `.breadcrumb` — flex row, chevron separators, text-3 links
- `.detail-meta` — flex row with gaps, metadata items
- `.star-rating` — inline flex, star SVGs, hover/active states with orange fill
- `.detail-content` — rich text container with proper heading/paragraph styles
- `.pdf-placeholder` — dashed border box, centered text
- `.related-grid` — 3-column grid, smaller cards

**JS to add:**
- `navigateToDetail(title, specialty, color)` — sets page content dynamically
- Star rating click handler (visual only — fills stars up to clicked one)
- Update `navigate()` to handle `'detail'`
- Wire all guide cards (home + catalog) to call `navigateToDetail()`

---

## Task 3: On-Call Directory Page

**What to build:**
A searchable, service-grouped directory of on-call contacts with pager numbers, phone numbers, and escalation paths.

**HTML structure:**
- Page div: `<div class="page" id="page-directory">` after `page-detail`
- Sidebar: `<div id="sb-directory">` with service filter links (General Surgery, Medicine, Emergency, etc.) + "Contact Type" section (On-Call, Attending, Fellow, Nurse Practitioner)
- Main content:
  - Page eyebrow: "St. Michael's Hospital"
  - Title: "On-Call Directory"
  - Subtitle: "Find on-call contacts, pager numbers, and escalation paths."
  - Search bar (search contacts by name, role, service)
  - "Currently On Call" section: a highlighted panel showing tonight's on-call contacts for the active service (3-4 contacts with name, role, pager, phone)
  - "All Contacts" section: full table using `.dir-table` pattern (already defined in CSS). Columns: Name, Role, Service, Pager, Phone, Status (On Call / Off Duty). ~10 sample contacts.
  - "Escalation Path" section: a simple ordered list panel showing the escalation chain for the selected service (e.g. "1. PGY-1 On Call → 2. PGY-3 Senior → 3. Chief Resident → 4. Attending on Call")

**CSS to add:**
- `.on-call-panel` — highlighted panel with subtle orange-dim border/background
- `.on-call-contact` — flex row with avatar, name, role, pager pill, phone
- `.pager-pill` — small monospace badge for pager numbers
- `.status-dot` — small colored dot (green=on call, neutral=off duty)
- `.escalation-list` — ordered list with numbered steps, connecting lines

**JS to add:**
- Update `navigate()` to handle `'directory'`
- Wire Directory nav button and dropdown items to `navigate('directory')`
- Search input filters contacts table by name/role/service
- Sidebar service filter highlights matching contacts

---

## Task 4: Register Hospital Page

**What to build:**
A developer-only tenant provisioning form. Minimal but complete — clean form to register a new hospital tenant.

**HTML structure:**
- Page div: `<div class="page" id="page-register">` after `page-directory`
- No sidebar (full-width centered form, like the login page)
- Main content (centered, max-width 560px):
  - Page eyebrow: "Platform Administration"
  - Title: "Register Hospital"
  - Subtitle: "Provision a new hospital tenant. Developer access required."
  - Form panel:
    - Hospital Name (text input)
    - Subdomain (text input with `.pmg.app` suffix shown)
    - Allowed Email Domains (text input, comma-separated)
    - Admin Email (text input — first admin user)
    - Admin Name (text input)
    - Logo URL (text input, optional)
  - "Register Hospital" primary button
  - Preview card: shows what the tenant will look like (subdomain.pmg.app, hospital name, logo placeholder)

**CSS to add:**
- `.register-wrap` — centered container, max-width 560px
- `.subdomain-input` — input with `.pmg.app` suffix attached
- `.preview-card` — small card showing tenant preview

**JS to add:**
- Update `navigate()` to handle `'register'`
- Subdomain field: auto-slugify hospital name input
- Preview card updates live as form is filled
- Submit button: validate fields, show loading state, then success toast
- This page should NOT show sidebar (like login page)

---

## Shared Changes

Each task must also update:
1. The `navigate()` function to add the new page name
2. Any nav links that should point to the new page
3. The sidebar visibility logic in `navigate()`

## File Organization

All changes go in `prototype/guideflow-app.html`:
- CSS: add new rules before `</style>`
- HTML: add page divs inside `#app-layout`, after existing pages but before the footer
- JS: add new functions and update existing ones in the `<script>` block
