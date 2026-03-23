#!/usr/bin/env node
// DEPRECATED: Use proto.js instead (node proto.js split)
// This file is kept for reference only.
/**
 * Split guideflow-app.html into individual page files
 * Run: node split-prototype.js
 */

const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, 'guideflow-app.html'), 'utf8');
const outDir = path.join(__dirname, 'pages');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ── Extract CSS ──
const styleMatch = src.match(/<style>([\s\S]*?)<\/style>/);
// Also grab the duplicate style block inside the rotation page
const allStyleBlocks = [...src.matchAll(/<style>([\s\S]*?)<\/style>/g)];
let allCSS = allStyleBlocks.map(m => m[1]).join('\n\n');

// Add multi-page overrides
allCSS += `\n
/* Multi-page overrides */
.page { display: block !important; animation: fadeUp .38s ease both; }
`;

fs.writeFileSync(path.join(outDir, 'shared.css'), `/* GuideFlow Shared Styles - extracted from guideflow-app.html */\n${allCSS}`);
console.log('✓ shared.css');

// ── Extract JS ──
// Get the main script block (after the last </style> or after page-login)
const scriptMatches = [...src.matchAll(/<script(?:\s[^>]*)?>(?!.*cloudflare)([\s\S]*?)<\/script>/g)];
// Filter out the cloudflare email decode script and Chart.js CDN
const jsBlocks = scriptMatches.filter(m =>
  !m[0].includes('cloudflare') &&
  !m[0].includes('cdnjs.cloudflare') &&
  m[1].trim().length > 100
);

let jsCode = jsBlocks.map(m => m[1]).join('\n\n');

// Replace navigate function for multi-page
jsCode = jsCode.replace(
  /function navigate\(page\)\{[\s\S]*?window\.scrollTo\(0,0\)\}/,
  `function navigate(page) {
  var pageMap = {
    'home': 'guidelines.html',
    'caselogs': 'caselogs.html',
    'admin': 'admin.html',
    'rotation': 'rotation.html',
    'fellowship': 'fellowship.html',
    'heatmap': 'heatmap.html',
    'login': 'login.html'
  };
  if (pageMap[page]) {
    window.location.href = pageMap[page];
  }
}`
);

// Fix DOMContentLoaded to not force-navigate
jsCode = jsCode.replace(
  /document\.addEventListener\('DOMContentLoaded',function\(\)\{[\s\S]*?\}\);/,
  `document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('acgme-bars')) buildACGMEBars();
  if (document.getElementById('deadlines-body')) buildDeadlines();
  if (document.getElementById('chart-donut')) { setTimeout(initCharts, 80); setTimeout(animateBars, 200); }
  var lb = document.getElementById('nav-login-btn');
  if (lb) { lb.textContent = isLoggedIn ? 'Logout' : 'Login'; }
  var av = document.getElementById('nav-avatar');
  if (av) { av.style.display = isLoggedIn ? '' : 'none'; }
});`
);

// Fix login btn click to redirect
jsCode = jsCode.replace(
  /document\.getElementById\('nav-login-btn'\)\.addEventListener\('click',\(\)=>\{if\(isLoggedIn\)\{isLoggedIn=false;navigate\('login'\);showToast\('Logged out'\)\}else\{navigate\('login'\)\}\}\);/,
  `(function() {
  var nlb = document.getElementById('nav-login-btn');
  if (nlb) nlb.addEventListener('click', function() {
    if (isLoggedIn) { isLoggedIn = false; window.location.href = 'login.html'; }
    else { window.location.href = 'login.html'; }
  });
})();`
);

// Fix confirm-view dblclick to redirect
jsCode = jsCode.replace(
  /document\.getElementById\('confirm-view'\)\.addEventListener\('dblclick',\(\)=>\{isLoggedIn=true;navigate\('home'\);showToast\('Signed in as '\+submittedEmail\)\}\);/,
  `(function() {
  var cv = document.getElementById('confirm-view');
  if (cv) cv.addEventListener('dblclick', function() {
    isLoggedIn = true;
    showToast('Signed in as ' + submittedEmail);
    setTimeout(function() { window.location.href = 'guidelines.html'; }, 800);
  });
})();`
);

// Guard login-email listeners
jsCode = jsCode.replace(
  /document\.getElementById\('login-email'\)\.addEventListener\('keydown'/,
  `(document.getElementById('login-email') || document.createElement('div')).addEventListener('keydown'`
);
jsCode = jsCode.replace(
  /document\.getElementById\('login-email'\)\.addEventListener\('input'/,
  `(document.getElementById('login-email') || document.createElement('div')).addEventListener('input'`
);

fs.writeFileSync(path.join(outDir, 'shared.js'), `// GuideFlow Shared Scripts - extracted from guideflow-app.html\n${jsCode}`);
console.log('✓ shared.js');

// ── Extract HTML sections ──

// Nav bar
const navMatch = src.match(/<nav>[\s\S]*?<\/nav>/);
const navHTML = navMatch[0]
  .replace(/onclick="navigate\('home'\)"/g, 'onclick="window.location.href=\'guidelines.html\'"')
  .replace(/onclick="navigate\('caselogs'\);return false;"/g, 'onclick="window.location.href=\'caselogs.html\';return false;"')
  .replace(/onclick="navigate\('caselogs'\)"/g, 'onclick="window.location.href=\'caselogs.html\'"')
  .replace(/onclick="navigate\('admin'\)"/g, 'onclick="window.location.href=\'admin.html\'"')
  .replace(/onclick="navigate\('admin'\);return false;"/g, 'onclick="window.location.href=\'admin.html\';return false;"')
  .replace(/onclick="navigate\('rotation'\)"/g, 'onclick="window.location.href=\'rotation.html\'"')
  .replace(/onclick="navigate\('rotation'\);return false;"/g, 'onclick="window.location.href=\'rotation.html\';return false;"')
  .replace(/onclick="navigate\('fellowship'\);return false;"/g, 'onclick="window.location.href=\'fellowship.html\';return false;"')
  .replace(/onclick="navigate\('heatmap'\);return false;"/g, 'onclick="window.location.href=\'heatmap.html\';return false;"');

// Footer
const footerMatch = src.match(/<footer[\s\S]*?<\/footer>/);
const footerHTML = footerMatch[0];

// Command palette overlay
const cmdMatch = src.match(/<div class="cmd-overlay"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
const cmdHTML = cmdMatch ? cmdMatch[0] : '';

// Sidebar sections
function extractById(id) {
  const re = new RegExp(`<div id="${id}"[^>]*>[\\s\\S]*?(?=<div id="sb-|<\\/aside>)`);
  const m = src.match(re);
  if (!m) return '';
  // Remove display:none
  return m[0].replace(/style="display:none"/, '').replace(/style="display: none"/, '');
}

const sidebars = {
  home: extractById('sb-home'),
  caselogs: extractById('sb-caselogs'),
  rotation: extractById('sb-rotation'),
  fellowship: extractById('sb-fellowship'),
  heatmap: extractById('sb-heatmap'),
  admin: extractById('sb-admin'),
};

// Page content sections
function extractPage(id) {
  // Find the opening div with this id
  const startRe = new RegExp(`<div class="page[^"]*" id="${id}">`);
  const startMatch = src.match(startRe);
  if (!startMatch) return '';
  const startIdx = src.indexOf(startMatch[0]);

  // Count div nesting to find the closing tag
  let depth = 0;
  let i = startIdx;
  let foundFirst = false;
  while (i < src.length) {
    if (src.substring(i, i + 4) === '<div') {
      depth++;
      foundFirst = true;
    }
    if (src.substring(i, i + 6) === '</div>') {
      depth--;
      if (foundFirst && depth === 0) {
        return src.substring(startIdx, i + 6);
      }
    }
    i++;
  }
  return src.substring(startIdx);
}

const pages = {
  'page-home': extractPage('page-home'),
  'page-caselogs': extractPage('page-caselogs'),
  'page-admin': extractPage('page-admin'),
  'page-rotation': extractPage('page-rotation'),
  'page-fellowship': extractPage('page-fellowship'),
  'page-heatmap': extractPage('page-heatmap'),
  'page-login': extractPage('page-login'),
};

// Fix navigate calls in page content
function fixNavigate(html) {
  return html
    .replace(/onclick="navigate\('home'\);return false;"/g, 'onclick="window.location.href=\'guidelines.html\';return false;"')
    .replace(/onclick="navigate\('home'\)"/g, 'onclick="window.location.href=\'guidelines.html\'"')
    .replace(/onclick="navigate\('caselogs'\);return false;"/g, 'onclick="window.location.href=\'caselogs.html\';return false;"')
    .replace(/onclick="navigate\('caselogs'\)"/g, 'onclick="window.location.href=\'caselogs.html\'"')
    .replace(/onclick="navigate\('admin'\);return false;"/g, 'onclick="window.location.href=\'admin.html\';return false;"')
    .replace(/onclick="navigate\('admin'\)"/g, 'onclick="window.location.href=\'admin.html\'"')
    .replace(/onclick="navigate\('rotation'\);return false;"/g, 'onclick="window.location.href=\'rotation.html\';return false;"')
    .replace(/onclick="navigate\('rotation'\)"/g, 'onclick="window.location.href=\'rotation.html\'"')
    .replace(/onclick="navigate\('fellowship'\);return false;"/g, 'onclick="window.location.href=\'fellowship.html\';return false;"')
    .replace(/onclick="navigate\('fellowship'\)"/g, 'onclick="window.location.href=\'fellowship.html\'"')
    .replace(/onclick="navigate\('heatmap'\);return false;"/g, 'onclick="window.location.href=\'heatmap.html\';return false;"')
    .replace(/onclick="navigate\('heatmap'\)"/g, 'onclick="window.location.href=\'heatmap.html\'"')
    .replace(/onclick="navigate\('login'\)"/g, 'onclick="window.location.href=\'login.html\'"');
}

// Set active nav button per page
function setActiveNav(navHtml, navId) {
  // Remove any existing active class from nav-btns
  let result = navHtml.replace(/class="nav-btn active"/g, 'class="nav-btn"');
  // Add active to the right one
  if (navId) {
    result = result.replace(
      new RegExp(`id="${navId}" (aria-expanded)`),
      `id="${navId}" class="nav-btn active" $1`
    ).replace(
      new RegExp(`class="nav-btn" id="${navId}"`),
      `class="nav-btn active" id="${navId}"`
    );
  }
  return result;
}

// ── Build page files ──

const pageConfig = [
  { file: 'guidelines.html', title: 'Guidelines', pageId: 'page-home', sidebarKey: 'home', navActive: 'nav-guidelines', chartjs: false },
  { file: 'caselogs.html', title: 'Case Logs', pageId: 'page-caselogs', sidebarKey: 'caselogs', navActive: 'nav-analytics', chartjs: true },
  { file: 'admin.html', title: 'Admin', pageId: 'page-admin', sidebarKey: 'admin', navActive: 'nav-admin', chartjs: false },
  { file: 'rotation.html', title: 'Rotation', pageId: 'page-rotation', sidebarKey: 'rotation', navActive: 'nav-rotation', chartjs: false },
  { file: 'fellowship.html', title: 'Fellowship', pageId: 'page-fellowship', sidebarKey: 'fellowship', navActive: 'nav-analytics', chartjs: false },
  { file: 'heatmap.html', title: 'Autonomy Map', pageId: 'page-heatmap', sidebarKey: 'heatmap', navActive: 'nav-analytics', chartjs: false },
];

for (const cfg of pageConfig) {
  const pageNav = setActiveNav(navHTML, cfg.navActive);
  const sidebar = fixNavigate(sidebars[cfg.sidebarKey] || '');
  let pageContent = fixNavigate(pages[cfg.pageId] || '');
  // Make sure page div is always visible
  pageContent = pageContent.replace(/class="page"/, 'class="page active"');
  if (!pageContent.includes('class="page active"')) {
    pageContent = pageContent.replace(/class="page [^"]*"/, 'class="page active"');
  }

  const chartjsTag = cfg.chartjs
    ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>\n'
    : '';

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>GuideFlow — ${cfg.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
${chartjsTag}<link rel="stylesheet" href="shared.css"/>
</head>
<body>
<div class="toast" id="toast"></div>

${pageNav}

<div class="layout" id="app-layout">
<aside class="sidebar">
${sidebar}
</aside>

${pageContent}

</div>

${footerHTML}

${cmdHTML}

<script src="shared.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, cfg.file), html);
  console.log(`✓ ${cfg.file}`);
}

// ── Login page (special — no sidebar, no layout) ──
const loginNav = navHTML;
let loginContent = fixNavigate(pages['page-login'] || '');
loginContent = loginContent.replace(/class="page"/, 'class="page active"');

const loginHTML = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>GuideFlow — Sign In</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="shared.css"/>
</head>
<body class="on-login">
<div class="toast" id="toast"></div>

${loginNav}

${loginContent}

<script src="shared.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'login.html'), loginHTML);
console.log('✓ login.html');

console.log('\nDone! All pages written to prototype/pages/');
