# Prototype Fixes Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 21 issues in `prototype/guideflow-app.html` to bring the desktop prototype to 100% functional.

**Architecture:** Single HTML file with inline CSS and JS. All edits are patches to existing code blocks — CSS additions go at the end of the `<style>` block, JS additions go at the end of the `<script>` block, HTML attribute changes are in-place edits.

**Tech Stack:** Vanilla HTML/CSS/JS, Chart.js 4.4.1

**Spec:** `docs/superpowers/specs/2026-03-15-prototype-fixes-design.md`

---

## File Map

**Single file modified:** `prototype/guideflow-app.html`

Changes organized by location within the file:

| Location | Lines (approx) | Changes |
|---|---|---|
| CSS `<style>` block | 10–282 | Add `.closing` class for dropdown, empty-search-state styles |
| HTML nav element | 284–286 | Add aria attributes to nav buttons, logo |
| HTML drop-zone | 397–402 | Add `role`, `tabindex`, `aria-label` to drop-zone and file input |
| HTML guideline action buttons | 422–427 | Add `aria-label` to edit/delete buttons |
| HTML theme toggle | ~285 | Add `aria-label` |
| HTML footer links | 519–521, 529 | Add `onclick` handlers |
| JS variables block | 581 | Add `ALLOWED_DOMAINS` const, `chartsNeedRefresh` flag |
| JS `handleFileSelect` | 624 | Add file size validation |
| JS `handleGuidelineUpload` | 625 | Complete the function |
| JS `switchAdminTab` | end of script | Add sidebar sync logic |
| JS `toggleTheme` | 622 | Add chartsNeedRefresh flag |
| JS `navigate` | 595–600 | Check chartsNeedRefresh on caselogs |
| JS service items | 618 | Add dropdown auto-close |
| JS new code (end of script) | after 625 | DOMContentLoaded, drag-drop, directory nav, search filter, accessibility listeners, loading states |

---

## Chunk 1: Critical JS Fixes + Navigation

### Task 1: Add CSS for new features

**Files:** Modify `prototype/guideflow-app.html` — CSS `<style>` block (before `</style>` tag around line 282)

- [ ] **Step 1: Add CSS for dropdown closing, empty search state, and loading button**

Add before the closing `</style>` tag:

```css
.service-dropdown.closing{pointer-events:none;opacity:0;visibility:hidden;transition:opacity .15s,visibility .15s;}
.empty-search{padding:40px 20px;text-align:center;color:var(--text-3);font-size:15px;font-weight:300;}
.btn-primary:disabled{opacity:.55;cursor:not-allowed;}
```

- [ ] **Step 2: Verify** — Open file in browser, confirm no visual regressions on any page.

---

### Task 2: Add ALLOWED_DOMAINS const and chartsNeedRefresh flag

**Files:** Modify `prototype/guideflow-app.html` — JS variables block (line 581)

- [ ] **Step 1: Add constants at the top of the script block**

Find the line:
```javascript
let totalCases=127,roleCounts={SC:0,SJ:98,TA:4,FA:25},submittedEmail='',resendTimerInterval=null,resendSeconds=30,isLoggedIn=true;
```

Add directly BEFORE it:
```javascript
const ALLOWED_DOMAINS=['stmichaels.org','stmichaels.com','stmichaels.ca'];
let chartsNeedRefresh=false;
```

- [ ] **Step 2: Update validateEmail to use ALLOWED_DOMAINS**

Find:
```javascript
if(!['stmichaels.org','stmichaels.com','stmichaels.ca'].includes(d))return"This email domain isn't associated with St. Michael's Hospital.";
```

Replace with:
```javascript
if(!ALLOWED_DOMAINS.includes(d))return"This email domain isn't associated with St. Michael's Hospital.";
```

- [ ] **Step 3: Verify** — Navigate to Login, test email validation still works with valid/invalid domains.

---

### Task 3: Fix handleFileSelect with size validation

**Files:** Modify `prototype/guideflow-app.html` — `handleFileSelect` function (line 624)

- [ ] **Step 1: Replace handleFileSelect**

Find:
```javascript
function handleFileSelect(input){if(input.files.length){const f=input.files[0];document.getElementById('admin-title').value=f.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');showToast('File selected: '+f.name)}}
```

Replace with:
```javascript
function handleFileSelect(input){if(input.files.length){const f=input.files[0];if(f.size>25*1024*1024){showToast('File too large — 25 MB limit');input.value='';return}document.getElementById('admin-title').value=f.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');showToast('File selected: '+f.name)}}
```

- [ ] **Step 2: Verify** — Navigate to Admin > Guidelines tab, click "Choose File", confirm file selection still works and title auto-populates.

---

### Task 4: Complete handleGuidelineUpload

**Files:** Modify `prototype/guideflow-app.html` — `handleGuidelineUpload` function (line 625)

- [ ] **Step 1: Find and replace the existing truncated function**

Find the existing `handleGuidelineUpload` function (starts at line 625, may be truncated). Replace the entire function with:

```javascript
function handleGuidelineUpload(){
  const title=document.getElementById('admin-title').value.trim();
  const specialty=document.getElementById('admin-specialty').value;
  const version=document.getElementById('admin-version').value.trim()||'1.0';
  const status=document.getElementById('admin-status').value;
  const fileInput=document.getElementById('file-input');
  const content=document.getElementById('admin-content').value.trim();
  const url=document.getElementById('admin-url').value.trim();
  if(!title||!specialty){showToast('Title and Specialty are required');return}
  if(!fileInput.files.length&&!content&&!url){showToast('Please upload a file, paste content, or enter a URL');return}
  const btn=document.querySelector('#admin-guidelines .btn-primary');
  btn.disabled=true;btn.textContent='Publishing...';
  setTimeout(()=>{
    let iconType='txt',fileName=title;
    if(fileInput.files.length){
      fileName=fileInput.files[0].name;
      const ext=fileName.split('.').pop().toLowerCase();
      if(ext==='pdf')iconType='pdf';
      else if(['doc','docx'].includes(ext))iconType='doc';
    }
    const list=document.getElementById('guidelines-list');
    const row=document.createElement('div');
    row.className='gl-row';
    const today=new Date();
    const dateStr=today.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    const statusClass=status==='Published'?'live':'draft';
    const statusText=status==='Published'?'Live':'Draft';
    row.innerHTML='<div class="gl-icon '+iconType+'">'+iconType.toUpperCase()+'</div><div class="gl-body"><div class="gl-name">'+title+'</div><div class="gl-meta">'+specialty+' · v'+version+' · Updated '+dateStr+'</div></div><span class="gl-status '+statusClass+'">'+statusText+'</span><div class="gl-actions"><button class="gl-action-btn" title="Edit" aria-label="Edit guideline"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button class="gl-action-btn" title="Delete" aria-label="Delete guideline"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div>';
    list.insertBefore(row,list.firstChild);
    const stats=document.querySelectorAll('#admin-guidelines .admin-stat-num');
    stats[0].textContent=parseInt(stats[0].textContent)+1;
    if(status==='Published')stats[1].textContent=parseInt(stats[1].textContent)+1;
    else stats[2].textContent=parseInt(stats[2].textContent)+1;
    fileInput.value='';
    document.getElementById('admin-title').value='';
    document.getElementById('admin-specialty').value='';
    document.getElementById('admin-version').value='';
    document.getElementById('admin-status').value='Draft';
    document.getElementById('admin-tags').value='';
    document.getElementById('admin-content').value='';
    document.getElementById('admin-url').value='';
    btn.disabled=false;btn.textContent='Publish Guideline';
    showToast('Guideline published: '+title);
  },800);
}
```

- [ ] **Step 2: Verify** — Navigate to Admin > Guidelines. Fill in Title + Specialty, click "Publish Guideline". Confirm: button shows "Publishing..." for 800ms, new row appears at top of list, stats increment, form resets, toast shows.

---

### Task 5: Add drag-and-drop handlers

**Files:** Modify `prototype/guideflow-app.html` — end of `<script>` block

- [ ] **Step 1: Add drag-and-drop event listeners**

Add at end of script (before `</script>`):

```javascript
(function(){const dz=document.getElementById('drop-zone');if(!dz)return;dz.addEventListener('dragover',function(e){e.preventDefault();e.stopPropagation();dz.classList.add('dragover')});dz.addEventListener('dragleave',function(e){e.preventDefault();e.stopPropagation();dz.classList.remove('dragover')});dz.addEventListener('drop',function(e){e.preventDefault();e.stopPropagation();dz.classList.remove('dragover');if(e.dataTransfer.files.length){const f=e.dataTransfer.files[0];if(f.size>25*1024*1024){showToast('File too large — 25 MB limit');return}const fi=document.getElementById('file-input');const dt=new DataTransfer();dt.items.add(f);fi.files=dt.files;document.getElementById('admin-title').value=f.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');showToast('File dropped: '+f.name)}})})();
```

- [ ] **Step 2: Verify** — Navigate to Admin > Guidelines. Drag a file over the drop zone — confirm `.dragover` style appears. Drop the file — confirm title auto-populates and toast shows.

---

### Task 6: Add DOMContentLoaded initialization

**Files:** Modify `prototype/guideflow-app.html` — end of `<script>` block

- [ ] **Step 1: Add init listener**

Add at end of script (before `</script>`):

```javascript
document.addEventListener('DOMContentLoaded',function(){buildACGMEBars();navigate('home');const lb=document.getElementById('nav-login-btn');lb.textContent=isLoggedIn?'Logout':'Login';document.getElementById('nav-avatar').style.display=isLoggedIn?'':'none'});
```

- [ ] **Step 2: Verify** — Hard refresh the page. Confirm Home dashboard loads immediately with ACGME bars populated, login button shows "Logout", avatar shows.

---

### Task 7: Fix Directory nav button and dropdown items

**Files:** Modify `prototype/guideflow-app.html` — HTML nav and JS

- [ ] **Step 1: Add onclick to Directory nav button**

Find in HTML:
```html
<button class="nav-btn" id="nav-directory">Directory
```

Replace with:
```html
<button class="nav-btn" id="nav-directory" onclick="showToast('On-Call Directory — coming soon')">Directory
```

- [ ] **Step 2: Wire Directory dropdown items**

Find the two Directory dropdown items:
```html
<a class="dd-item" href="#"><span class="dd-dot"></span>On-Call Directory</a><a class="dd-item" href="#"><span class="dd-dot"></span>Service Contacts</a>
```

Replace with:
```html
<a class="dd-item" href="#" onclick="showToast('On-Call Directory — coming soon');return false;"><span class="dd-dot"></span>On-Call Directory</a><a class="dd-item" href="#" onclick="showToast('Service Contacts — coming soon');return false;"><span class="dd-dot"></span>Service Contacts</a>
```

- [ ] **Step 3: Verify** — Click the "Directory" nav button — toast should appear. Hover to open dropdown, click each item — toasts should appear.

---

### Task 8: Fix admin sidebar ↔ tab sync

**Files:** Modify `prototype/guideflow-app.html` — `switchAdminTab` function

- [ ] **Step 1: Update switchAdminTab**

Find:
```javascript
function switchAdminTab(tab){document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));document.getElementById('admin-'+tab).classList.add('active');document.querySelectorAll('.admin-tab').forEach(t=>{if(t.textContent.toLowerCase()===tab)t.classList.add('active')})}
```

Replace with:
```javascript
function switchAdminTab(tab){document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));document.getElementById('admin-'+tab).classList.add('active');document.querySelectorAll('.admin-tab').forEach(t=>{if(t.textContent.toLowerCase()===tab)t.classList.add('active')});const sbLinks=document.querySelectorAll('#sbl-admin-nav .sb-link');sbLinks.forEach(l=>{l.classList.remove('active');if(l.textContent.trim().toLowerCase()===tab.toLowerCase())l.classList.add('active')})}
```

- [ ] **Step 2: Verify** — Navigate to Admin. Click "Directory" tab button — sidebar should highlight "Directory". Click "Users" tab — sidebar should highlight "Users". Click sidebar links — tabs should switch (this already worked).

---

### Task 9: Commit Chunk 1

- [ ] **Step 1: Commit**

```bash
git add prototype/guideflow-app.html
git commit -m "fix: critical JS fixes and navigation for prototype

- Complete handleGuidelineUpload() with form validation, row creation, stat updates
- Add drag-and-drop event listeners on upload drop zone
- Add DOMContentLoaded init to render home page on load
- Wire Directory nav button and dropdown items (coming soon toasts)
- Sync admin sidebar active state with tab switches
- Add file size validation (25MB limit)
- Extract email domains to ALLOWED_DOMAINS const
- Add CSS for dropdown closing, empty search, disabled buttons"
```

---

## Chunk 2: Theme, Charts, Accessibility, UX Polish

### Task 10: Fix chart color persistence after theme toggle

**Files:** Modify `prototype/guideflow-app.html` — `toggleTheme` and `navigate` functions

- [ ] **Step 1: Update toggleTheme**

Find:
```javascript
function toggleTheme(){document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';if(document.getElementById('page-caselogs').classList.contains('active'))setTimeout(initCharts,80);buildACGMEBars()}
```

Replace with:
```javascript
function toggleTheme(){document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';if(document.getElementById('page-caselogs').classList.contains('active'))setTimeout(initCharts,80);else chartsNeedRefresh=true;buildACGMEBars()}
```

- [ ] **Step 2: Update navigate('caselogs') branch**

Find within the `navigate` function:
```javascript
else if(page==='caselogs'){document.getElementById('page-caselogs').classList.add('active');document.getElementById('sb-caselogs').style.display='';document.getElementById('nav-analytics').classList.add('active');document.getElementById('dd-caselogs').classList.add('dd-active');setTimeout(initCharts,80)}
```

Replace with:
```javascript
else if(page==='caselogs'){document.getElementById('page-caselogs').classList.add('active');document.getElementById('sb-caselogs').style.display='';document.getElementById('nav-analytics').classList.add('active');document.getElementById('dd-caselogs').classList.add('dd-active');setTimeout(initCharts,80);chartsNeedRefresh=false}
```

- [ ] **Step 3: Verify** — Go to Home, toggle theme (dark→light), navigate to Case Logs — charts should render with light theme colors. Toggle back, navigate away and return — colors should be correct.

---

### Task 11: Fix service dropdown auto-close

**Files:** Modify `prototype/guideflow-app.html` — service item click handler

- [ ] **Step 1: Update service item handler**

Find:
```javascript
document.querySelectorAll('.service-item').forEach(i=>{i.addEventListener('click',e=>{e.preventDefault();const n=i.dataset.service;document.getElementById('service-label').textContent=n;document.getElementById('home-title').textContent=n+' Dashboard';document.querySelectorAll('.service-item').forEach(x=>x.classList.remove('dd-active'));i.classList.add('dd-active')})});
```

Replace with:
```javascript
document.querySelectorAll('.service-item').forEach(i=>{i.addEventListener('click',e=>{e.preventDefault();const n=i.dataset.service;document.getElementById('service-label').textContent=n;document.getElementById('home-title').textContent=n+' Dashboard';document.querySelectorAll('.service-item').forEach(x=>x.classList.remove('dd-active'));i.classList.add('dd-active');const dd=i.closest('.service-switcher').querySelector('.service-dropdown');dd.classList.add('closing');setTimeout(()=>dd.classList.remove('closing'),300)})});
```

- [ ] **Step 2: Verify** — Click on "General Surgery" service dropdown, select "Emergency Medicine" — dropdown should close smoothly, title should update.

---

### Task 12: Add ARIA attributes to HTML elements

**Files:** Modify `prototype/guideflow-app.html` — multiple HTML locations

- [ ] **Step 1: Add aria-label to theme toggle**

Find:
```html
<button class="theme-toggle" onclick="toggleTheme()">
```

Replace with:
```html
<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark/light theme">
```

- [ ] **Step 2: Add role and tabindex to nav logo**

Find:
```html
<div class="nav-logo" onclick="navigate('home')">
```

Replace with:
```html
<div class="nav-logo" onclick="navigate('home')" role="button" tabindex="0">
```

- [ ] **Step 3: Add aria-expanded to nav dropdown buttons**

Find each `nav-btn` that has a dropdown chevron and add `aria-expanded="false"`. There are 4 nav buttons with dropdowns:

Find: `<button class="nav-btn" id="nav-guidelines" onclick="navigate('home')">Guidelines`
Replace: `<button class="nav-btn" id="nav-guidelines" onclick="navigate('home')" aria-expanded="false">Guidelines`

Find: `<button class="nav-btn" id="nav-directory" onclick="showToast('On-Call Directory — coming soon')">Directory`
Replace: `<button class="nav-btn" id="nav-directory" onclick="showToast('On-Call Directory — coming soon')" aria-expanded="false">Directory`

Find: `<button class="nav-btn" id="nav-analytics">Analytics`
Replace: `<button class="nav-btn" id="nav-analytics" aria-expanded="false">Analytics`

Find: `<button class="nav-btn" id="nav-admin" onclick="navigate('admin')">Admin`
Replace: `<button class="nav-btn" id="nav-admin" onclick="navigate('admin')" aria-expanded="false">Admin`

Find: `<button class="service-btn">`
Replace: `<button class="service-btn" aria-expanded="false">`

- [ ] **Step 4: Add role and aria-label to drop zone and file input**

Find:
```html
<div class="drop-zone" id="drop-zone" onclick="document.getElementById('file-input').click()">
```

Replace with:
```html
<div class="drop-zone" id="drop-zone" onclick="document.getElementById('file-input').click()" role="button" tabindex="0">
```

Find:
```html
<input type="file" id="file-input" accept=".pdf,.doc,.docx,.txt,.rtf" style="display:none" onchange="handleFileSelect(this)"/>
```

Replace with:
```html
<input type="file" id="file-input" accept=".pdf,.doc,.docx,.txt,.rtf" style="display:none" onchange="handleFileSelect(this)" aria-label="Choose file to upload"/>
```

- [ ] **Step 5: Add aria-labels to all existing guideline action buttons**

For each `.gl-action-btn` with title="Edit", add `aria-label="Edit guideline"`.
For each `.gl-action-btn` with title="Delete", add `aria-label="Delete guideline"`.

There are 6 guidelines × 2 buttons = 12 edits. Use find-and-replace:

Find: `class="gl-action-btn" title="Edit"`
Replace all: `class="gl-action-btn" title="Edit" aria-label="Edit guideline"`

Find: `class="gl-action-btn" title="Delete"`
Replace all: `class="gl-action-btn" title="Delete" aria-label="Delete guideline"`

**Note:** Task 4's `handleGuidelineUpload()` already generates new rows with `aria-label` attributes, so dynamically added guidelines are covered.

- [ ] **Step 6: Verify** — Inspect elements in browser DevTools, confirm ARIA attributes are present.

---

### Task 13: Add accessibility JS (keyboard support + aria-expanded toggling)

**Files:** Modify `prototype/guideflow-app.html` — end of `<script>` block

- [ ] **Step 1: Add accessibility event listeners**

Add at end of script (before `</script>`):

```javascript
// Keyboard support for role="button" elements and sidebar toggles
document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&(e.target.getAttribute('role')==='button'||e.target.classList.contains('sb-toggle'))){e.preventDefault();e.target.click()}});
// aria-expanded toggling for nav dropdowns
document.querySelectorAll('.nav-item').forEach(function(item){var btn=item.querySelector('.nav-btn');if(!btn)return;item.addEventListener('mouseenter',function(){btn.setAttribute('aria-expanded','true')});item.addEventListener('mouseleave',function(){btn.setAttribute('aria-expanded','false')})});
document.querySelectorAll('.service-switcher').forEach(function(sw){var btn=sw.querySelector('.service-btn');if(!btn)return;sw.addEventListener('mouseenter',function(){btn.setAttribute('aria-expanded','true')});sw.addEventListener('mouseleave',function(){btn.setAttribute('aria-expanded','false')})});
```

- [ ] **Step 2: Verify** — Tab to the nav logo, press Enter — should navigate to Home. Hover over a nav dropdown — inspect the button, `aria-expanded` should be `"true"`. Move mouse away — should be `"false"`.

---

### Task 14: Wire working footer links

**Files:** Modify `prototype/guideflow-app.html` — footer HTML (~lines 519–530)

- [ ] **Step 1: Update Platform footer links**

Find:
```html
<a class="ft-link" href="#" onclick="navigate('home');return false;">Guidelines</a>
```
This one already works. ✓

Find:
```html
<a class="ft-link" href="#" onclick="navigate('caselogs');return false;">Case Logs</a>
```
This one already works. ✓

Find the ACGME Tracker link in the Residency column:
```html
<a class="ft-link" href="#" onclick="navigate('caselogs');return false;">ACGME Tracker</a>
```
This one already works. ✓

- [ ] **Step 2: Verify** — Scroll to footer, click "Guidelines" → Home page. Click "Case Logs" → Case Logs page. Click "ACGME Tracker" → Case Logs page. Confirm all three work.

**Note:** Audit showed these were already wired in the HTML. Mark as verified — no changes needed.

---

### Task 15: Add admin form loading states

**Files:** Modify `prototype/guideflow-app.html` — JS

- [ ] **Step 1: Update "Add Contact" button handler**

Find in the Admin Directory section HTML:
```html
<button class="btn-primary" onclick="showToast('Contact added')">Add Contact</button>
```

Replace with:
```html
<button class="btn-primary" onclick="handleAddContact(this)">Add Contact</button>
```

- [ ] **Step 2: Add handleAddContact function**

Add at end of script:

```javascript
function handleAddContact(btn){btn.disabled=true;btn.textContent='Adding...';setTimeout(function(){btn.disabled=false;btn.textContent='Add Contact';showToast('Contact added')},800)}
```

- [ ] **Step 3: Verify** — Navigate to Admin > Directory tab. Click "Add Contact" — button should show "Adding..." for 800ms, then reset and show toast.

---

### Task 16: Add search filtering on home page

**Files:** Modify `prototype/guideflow-app.html` — end of `<script>` block

- [ ] **Step 1: Add search filter listener**

Add at end of script:

```javascript
(function(){var si=document.querySelector('.search-input');if(!si)return;si.addEventListener('input',function(){var q=si.value.trim().toLowerCase();var listRows=document.querySelectorAll('#list-view .list-row');var gridCards=document.querySelectorAll('#grid-view .guide-card');var matchCount=0;listRows.forEach(function(r){var name=r.querySelector('.list-name');var show=!q||name.textContent.toLowerCase().includes(q);r.style.display=show?'':'none';if(show)matchCount++});gridCards.forEach(function(c){var title=c.querySelector('.guide-title');var show=!q||title.textContent.toLowerCase().includes(q);c.style.display=show?'':'none'});var lv=document.getElementById('list-view');var gv=document.getElementById('grid-view');var existingEmpty=document.querySelectorAll('.empty-search');existingEmpty.forEach(function(e){e.remove()});if(q&&matchCount===0){var msg=document.createElement('div');msg.className='empty-search';msg.textContent='No guidelines found for "'+si.value.trim()+'"';lv.appendChild(msg.cloneNode(true));gv.appendChild(msg)}})})();
```

- [ ] **Step 2: Verify** — On Home page, type "sepsis" in search bar — only "Sepsis Management Protocol" should show in both list and grid views. Type "xyz" — "No guidelines found" message should appear. Clear input — all items should restore. Switch between List/Grid views — filtering should persist.

---

### Task 17: Commit Chunk 2

- [ ] **Step 1: Commit**

```bash
git add prototype/guideflow-app.html
git commit -m "fix: theme, accessibility, and UX polish for prototype

- Fix chart color persistence after theme toggle (chartsNeedRefresh flag)
- Auto-close service dropdown after selection
- Add ARIA attributes (role, tabindex, aria-expanded, aria-label)
- Add keyboard support for role=button elements
- Add aria-expanded toggling on nav dropdown hover
- Add loading states on admin form buttons (800ms feedback)
- Add search filtering on home page (list + grid views)
- Add empty search state message"
```

---

## Chunk 3: Final Verification

### Task 18: Full manual verification

- [ ] **Step 1:** Hard refresh page — Home dashboard loads with ACGME bars, correct login state
- [ ] **Step 2:** Click all nav items — Guidelines (→home), Directory (→toast), Analytics>Case Logs (→caselogs), Admin (→admin)
- [ ] **Step 3:** On Admin, switch between Guidelines/Directory/Users tabs — sidebar syncs
- [ ] **Step 4:** On Admin>Guidelines, fill Title+Specialty, click Publish — row appears, stats update, form resets
- [ ] **Step 5:** On Admin>Guidelines, drag a file to drop zone — title populates, toast shows
- [ ] **Step 6:** Toggle theme on Home, navigate to Case Logs — charts render with correct theme colors
- [ ] **Step 7:** On Home, select a service from dropdown — dropdown closes, title updates
- [ ] **Step 8:** Login flow: enter `dr@stmichaels.org`, submit, see spinner, see confirm view, wait for timer, click "Use different email", double-click confirm to sign in
- [ ] **Step 9:** Search "stroke" on Home — only matching guideline shows. Clear — all restore. Switch to Grid view — same behavior
- [ ] **Step 10:** Tab through page with keyboard — all interactive elements reachable, Enter/Space activates them
- [ ] **Step 11:** On Case Logs, submit a case (fill procedure + role) — counters update, charts update, new row in table
- [ ] **Step 12:** Inspect ARIA attributes in DevTools — aria-expanded toggles, aria-labels present on buttons
- [ ] **Step 13:** Test file size rejection — drag or select a file >25MB on Admin>Guidelines drop zone, confirm error toast and no file is loaded

- [ ] **Step 14: Final commit if any fixes needed**

```bash
git add prototype/guideflow-app.html
git commit -m "fix: address issues found during verification"
```
