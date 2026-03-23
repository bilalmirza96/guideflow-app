# Prototype Restructure — Marker-Based Extract/Import System

**Date:** 2026-03-22
**Status:** Approved

## Problem

The GuideFlow prototype has three disconnected locations for page content:

1. **Monolith** (`prototype/guideflow-app.html`) — single-file SPA with all pages, ~4000+ lines
2. **Split pages** (`prototype/pages/`) — auto-generated standalone pages via `split-prototype.js`
3. **Page snippets** (`page-snippets/`) — enhancement fragments (caselog modals, fellowship, heatmap) not yet integrated

Edits to individual pages don't flow back into the monolith. The split pages are auto-generated so edits there get overwritten. The page snippets have never been fully integrated.

## Solution

A marker-based extract/import system that keeps the monolith as the source of truth while enabling individual page editing.

### 1. Marker System

Add HTML comment markers in `guideflow-app.html` to delimit every extractable section:

```html
<!-- SECTION:styles START -->
<style>...all shared CSS (merged into one block)...</style>
<!-- SECTION:styles END -->

<!-- SECTION:styles:caselogs START -->
<style>/* caselog-specific styles */</style>
<!-- SECTION:styles:caselogs END -->

<!-- SECTION:nav START -->
<nav>...</nav>
<!-- SECTION:nav END -->

<!-- SECTION:cmd START -->
<div class="cmd-overlay">...</div>
<!-- SECTION:cmd END -->

<!-- SECTION:sidebar:home START -->
<div id="sb-home">...</div>
<!-- SECTION:sidebar:home END -->

<!-- SECTION:page:home START -->
<div class="page" id="page-home">...</div>
<!-- SECTION:page:home END -->

<!-- SECTION:modals:caselogs START -->
<!-- dictation + EPA modals -->
<!-- SECTION:modals:caselogs END -->

<!-- SECTION:footer START -->
<footer>...</footer>
<!-- SECTION:footer END -->

<!-- SECTION:scripts START -->
<script>...shared JS...</script>
<!-- SECTION:scripts END -->

<!-- SECTION:scripts:caselogs START -->
<script>/* caselog-specific JS */</script>
<!-- SECTION:scripts:caselogs END -->
```

**Section naming convention:** `SECTION:<type>:<page?>` where:
- `type` = `styles`, `nav`, `cmd`, `sidebar`, `page`, `modals`, `footer`, `scripts`
- `page` = optional page name, always matching the page key exactly: `home`, `caselogs`, `admin`, `rotation`, `fellowship`, `heatmap`, `login`

**Important:** Page-specific section names always use the page key (e.g., `styles:caselogs`, NOT `styles:caselog`). This ensures the CLI can derive section names mechanically from the page key.

**Shared sections** (no page suffix): `styles`, `nav`, `cmd`, `footer`, `scripts` — these are included in every extracted page.

**Stray style blocks:** The monolith currently has a second `<style>` block in the `<body>` between the rotation and fellowship pages (containing pulse animations, cmd-overlay styles, table striping, etc.). During marker insertion, this block must be **merged into the main `SECTION:styles`** block in `<head>`. There should be exactly one shared `<style>` block.

### 2. CLI Tool — `prototype/proto.js`

Single Node.js script with three commands.

#### Filename Mapping

The `home` page maps to `guidelines.html` (not `home.html`) to match the existing URL convention. All other pages use their page key as the filename:

```js
const filenameMap = {
  home: 'guidelines.html',
  caselogs: 'caselogs.html',
  admin: 'admin.html',
  rotation: 'rotation.html',
  fellowship: 'fellowship.html',
  heatmap: 'heatmap.html',
  login: 'login.html',
};
```

#### `node proto.js extract <page>`

Extracts a page from the monolith into a standalone HTML file.

**Input:** Page name (e.g., `caselogs`)
**Output:** `prototype/pages/<mapped-filename>` — fully functional standalone page

Process:
1. Read `guideflow-app.html`
2. Extract shared sections: `styles`, `nav`, `cmd`, `footer`, `scripts`
3. Extract page-specific sections: `sidebar:<page>`, `page:<page>`, and optionally `styles:<page>`, `scripts:<page>`, `modals:<page>`
4. Assemble into standalone HTML with:
   - Shared styles + page-specific styles in `<head>`
   - Nav bar (with active state set for this page)
   - Layout wrapper with sidebar + page content (except login — see below)
   - Footer (except login)
   - Command palette overlay
   - Shared scripts + page-specific scripts
5. Page-specific sections wrapped with the same markers so `import` can find them
6. Write to `prototype/pages/<mapped-filename>`

**Login page special handling:** The login page has no sidebar and no layout wrapper. The `page-login` div sits outside the `<div class="layout">` structure. When extracting login:
- No `<aside class="sidebar">` or `<div class="layout">` wrapper
- No footer (hidden via `body.on-login`)
- Body gets `class="on-login"`

**Nav active state:** For each extracted page, set `class="nav-btn active"` on the appropriate nav button:
| Page | Active nav ID |
|---|---|
| `home` | `nav-guidelines` |
| `caselogs` | `nav-analytics` |
| `admin` | `nav-admin` |
| `rotation` | `nav-rotation` |
| `fellowship` | `nav-analytics` |
| `heatmap` | `nav-analytics` |
| `login` | none |

**Chart.js CDN:** Only include the Chart.js `<script>` tag for the `caselogs` page.

#### `node proto.js import <page>`

Imports edits from a standalone page file back into the monolith.

**Input:** Page name (e.g., `caselogs`)
**Source:** `prototype/pages/<mapped-filename>`

Process:
1. Read the standalone page file
2. Extract marker-delimited sections from it: `sidebar:<page>`, `page:<page>`, and any `styles:<page>`, `scripts:<page>`, `modals:<page>` present
3. Read `guideflow-app.html`
4. For each extracted section:
   - If the corresponding marker exists in the monolith → **replace** content between markers
   - If the marker does NOT exist in the monolith → **skip with a warning** (e.g., "Warning: SECTION:modals:rotation not found in monolith, skipping")
5. Write updated `guideflow-app.html`
6. Print summary: "Updated N sections in guideflow-app.html: sidebar:caselogs, page:caselogs, ..."

**Only page-specific sections are imported.** Shared sections (`styles`, `nav`, `cmd`, `footer`, `scripts`) are never imported from a page file — they belong to the monolith.

#### `node proto.js split`

Regenerates all standalone pages from the monolith (replaces current `split-prototype.js`).

Process:
1. Run `extract` for every page
2. Also generate `prototype/pages/shared.css` and `prototype/pages/shared.js` for the split multi-page mode (where each page links to shared assets instead of inlining)

### 3. Page-Snippet Integration

Before building the tooling, integrate `page-snippets/` content into the monolith. Some snippets are already partially present — the integration must reconcile differences:

| Snippet | Status | Integration action |
|---|---|---|
| `caselog-additions.html` | **Partially integrated** — log-toggle and bedside-form HTML exist in monolith but may differ | Compare and merge; ensure toggle, bedside form, autonomy field, and dictate button are all present |
| `caselog-modals.html` | **Not integrated** — no modal HTML elements exist in monolith | Insert as new `SECTION:modals:caselogs` after the caselogs page section |
| `caselog-css.css` | **Not integrated** — modal/toggle/dictation styles not present | Insert as new `SECTION:styles:caselogs` block |
| `caselog-js.js` | **Not integrated** — `switchLogType`, `openDictation`, EPA modal functions not defined | Insert as new `SECTION:scripts:caselogs` block before `</body>` |
| `fellowship.html` | **Already integrated** — content exists in monolith | Compare snippet vs monolith; keep monolith version if equivalent, merge any snippet additions |
| `fellowship-sidebar.html` | **Partially integrated** — monolith sidebar similar but may differ | Compare and reconcile; snippet has societies section that may be missing |
| `heatmap.html` | **Already integrated** — content exists in monolith | Compare snippet vs monolith; keep monolith version if equivalent |
| `heatmap-sidebar.html` | **Partially integrated** — monolith sidebar similar but may differ | Compare and reconcile |
| `heatmap-css.css` | **Not integrated** — responsive grid and hover styles not present | Insert as new `SECTION:styles:heatmap` block |

After integration and verification, delete `page-snippets/` directory.

### 4. Pages

| Page name | Filename | Sections |
|---|---|---|
| `home` | `guidelines.html` | `sidebar:home`, `page:home` |
| `caselogs` | `caselogs.html` | `sidebar:caselogs`, `page:caselogs`, `styles:caselogs`, `scripts:caselogs`, `modals:caselogs` |
| `admin` | `admin.html` | `sidebar:admin`, `page:admin` |
| `rotation` | `rotation.html` | `sidebar:rotation`, `page:rotation` |
| `fellowship` | `fellowship.html` | `sidebar:fellowship`, `page:fellowship` |
| `heatmap` | `heatmap.html` | `sidebar:heatmap`, `page:heatmap`, `styles:heatmap` |
| `login` | `login.html` | `page:login` (no sidebar, no layout wrapper, `body.on-login`) |

Additional `styles:<page>` or `scripts:<page>` sections can be added to any page as needed. The CLI handles their absence gracefully (skips with no error during extract; skips with warning during import).

### 5. File Structure After

```
prototype/
├── guideflow-app.html       ← Source of truth (with markers)
├── proto.js                 ← CLI tool (extract/import/split)
├── split-prototype.js       ← Deprecated (replaced by proto.js split)
└── pages/                   ← Generated standalone pages
    ├── guidelines.html      ← home page (mapped from 'home')
    ├── caselogs.html
    ├── admin.html
    ├── rotation.html
    ├── fellowship.html
    ├── heatmap.html
    ├── login.html
    ├── shared.css           ← For multi-page mode
    └── shared.js            ← For multi-page mode
```

`page-snippets/` directory removed after integration.

## Implementation Order

1. Integrate page-snippets into the monolith (reconcile already-present content, add missing content)
2. Merge the stray body `<style>` block into the main `<head>` style block
3. Add SECTION markers throughout the monolith
4. Build `proto.js` with extract/import/split commands
5. Run `split` to verify all pages generate correctly
6. Remove `page-snippets/` and deprecate `split-prototype.js`

## Non-Goals

- No watch mode (can be added later)
- No changes to the visual design or functionality
- No framework migration — this is purely structural tooling
