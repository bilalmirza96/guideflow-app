# Prototype Fixes — Design Spec

**Date:** 2026-03-15
**Scope:** Fix all issues in `prototype/guideflow-app.html` (desktop only)
**Approach:** Patch existing file in place

## Context

The HTML prototype has 4 pages (Home, Case Logs, Admin with 3 tabs, Login) in a single 624-line file. An audit found 21 issues across 5 categories. This spec covers fixing all of them while keeping the single-file structure intact.

## Section 1: Critical JS Fixes

### 1a. Complete `handleGuidelineUpload()`

The function is truncated/incomplete at line 625. Implement it to:

- Validate that Title and Specialty fields are filled (show toast if not)
- Read file input, content textarea, or URL field (at least one must be provided)
- Determine icon type from file extension: PDF → `pdf`, DOC/DOCX → `doc`, all others → `txt`. Default to `txt` for pasted content or URL import. Only PDF/DOC/DOCX/TXT/RTF are accepted (matches the file input's `accept` attribute)
- If file size exceeds 25MB (validated in 5a), reject — do NOT fall back to URL/textarea
- Add a new `.gl-row` to `#guidelines-list` with correct icon, title, meta, status, and action buttons
- Increment the "Total Guidelines" and "Published" or "Drafts" stat counters based on selected status
- Reset form fields (file input, title, specialty, version, status, tags, content, URL)
- Show success toast

### 1b. Add drag-and-drop event listeners

The `#drop-zone` element has CSS for `.dragover` state but no JS handlers. Add:

- `dragover` event: prevent default, add `.dragover` class
- `dragleave` event: remove `.dragover` class
- `drop` event: prevent default, remove `.dragover` class, extract first file, populate title field (reuse `handleFileSelect` logic), show toast

### 1c. Add `DOMContentLoaded` initialization

Add a listener that:

- Calls `navigate('home')` to render the home page
- Calls `buildACGMEBars()` to populate ACGME progress rows
- Sets initial login button state based on `isLoggedIn` flag

## Section 2: Navigation Fixes

### 2a. Directory nav button and dropdown items

- The Directory nav button (`#nav-directory`) has no onclick. Add a handler that shows toast: "On-Call Directory — coming soon"
- Wire both dropdown items ("On-Call Directory", "Service Contacts") to show similar toasts

### 2b. Admin sidebar ↔ tab sync

`switchAdminTab()` updates tab buttons and section visibility but doesn't update the sidebar. Modify it to:

- Find the matching `.sb-link` in `#sbl-admin-nav` by text content
- Remove `.active` from all sidebar links in that group
- Add `.active` to the matching link

## Section 3: Theme & Chart Fixes

### 3a. Chart color persistence after theme toggle

Current behavior: `toggleTheme()` only reinits charts if Case Logs is currently active. If user toggles theme on Home page then navigates to Case Logs, charts show stale colors.

Fix: Add a `chartsNeedRefresh` flag. Set it to `true` in `toggleTheme()` when Case Logs is NOT active. In `navigate('caselogs')`, check the flag — if true, reinit charts and reset flag.

### 3b. Service dropdown auto-close

After clicking a service item, the dropdown stays open because CSS `:hover` keeps it visible. Fix by adding `pointer-events: none` to `.service-dropdown` for 300ms after selection, then removing it. Implementation: add a `.closing` class that sets `pointer-events: none; opacity: 0; visibility: hidden`, apply it on click, remove after 300ms via setTimeout.

## Section 4: Accessibility

### 4a. ARIA attributes

- Add `role="button"` and `tabindex="0"` to: `.nav-logo`, `#drop-zone`, `.list-row` elements, `.guide-card` elements
- Add `aria-expanded="false"` to all `.nav-btn` and `.service-btn` elements that trigger dropdowns
- Update aria-expanded dynamically on hover (via JS mouseenter/mouseleave on `.nav-item` and `.service-switcher`)

### 4b. Keyboard support

- Add `keydown` listeners for Enter and Space on elements with `role="button"`
- Add keyboard support for sidebar toggle buttons (`.sb-toggle`)
- Ensure `.admin-tab` buttons are keyboard accessible (they're already `<button>` elements, so this should work)

### 4c. Labels and descriptions

- Add `aria-label` to `.gl-action-btn` elements ("Edit guideline", "Delete guideline")
- Add `aria-label="Choose file to upload"` to the hidden `#file-input`
- Add `aria-label` to the theme toggle button ("Toggle dark/light theme")

## Section 5: Minor UX Polish

### 5a. File size validation

In `handleFileSelect()`, check `file.size > 25 * 1024 * 1024`. If too large, show error toast and clear the input.

### 5b. Working footer links

Wire footer links that have corresponding pages:

- "Guidelines" → `navigate('home')`
- "Case Logs" and "ACGME Tracker" → `navigate('caselogs')`
- Leave all other links as-is (they're for future pages)

### 5c. Admin form loading states

On "Publish Guideline" and "Add Contact" button clicks:

- Disable the button and change text to "Publishing..." / "Adding..."
- After 800ms (simulated with setTimeout), re-enable and reset button text
- This gives visual feedback that the action was processed

### 5d. Empty search state

Add a listener on `.search-input` that filters the guidelines list/grid:

- On input, filter visible rows/cards by title match (case-insensitive)
- If no matches, show a "No guidelines found for [query]" message inside the `#list-view` / `#grid-view` containers (replacing the hidden rows/cards)
- On clear (empty input), restore all items to visible

### 5e. Configurable email domains

Move the hardcoded domain check in `validateEmail()` to a const array at the top of the script block:

```javascript
const ALLOWED_DOMAINS = ['stmichaels.org', 'stmichaels.com', 'stmichaels.ca'];
```

Reference this array in validation logic.

## Out of Scope

- Responsive/mobile design (deferred to Next.js port)
- New pages (Guidelines Catalog, Guideline Detail, On-Call Directory, Register Hospital)
- Backend integration (all interactions remain client-side simulations)
- Performance optimization (file is small enough that this isn't needed)

## Testing

After all fixes, manually verify:

1. Page loads correctly showing Home dashboard
2. All nav links and dropdown items respond (navigate or toast)
3. Admin tabs switch and sidebar stays in sync
4. Guideline upload form submits, adds row, updates stats
5. Drag-and-drop on upload zone works
6. Theme toggle preserves chart colors across page navigations
7. Login flow: enter email → submit → 1.5s spinner → confirm view shows email → 30s resend countdown → "Use different email" returns to form → double-click confirm view simulates sign-in (existing behavior)
8. Search filters guidelines in both list view (`#list-view` rows) and grid view (`#grid-view` cards) — toggle between views with the List/Grid buttons and verify filtering persists
9. All interactive elements are keyboard accessible
10. Case log form submits and updates all counters/charts
