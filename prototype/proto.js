#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const MONOLITH = path.join(__dirname, 'guideflow-app.html');
const PAGES_DIR = path.join(__dirname, 'pages');

const PAGE_KEYS = ['home', 'caselogs', 'admin', 'rotation', 'fellowship', 'heatmap', 'login'];

const FILENAME_MAP = {
  home: 'guidelines.html',
  caselogs: 'caselogs.html',
  admin: 'admin.html',
  rotation: 'rotation.html',
  fellowship: 'fellowship.html',
  heatmap: 'heatmap.html',
  login: 'login.html',
};

const NAV_ACTIVE_MAP = {
  home: 'nav-guidelines',
  caselogs: 'nav-analytics',
  admin: 'nav-admin',
  rotation: 'nav-rotation',
  fellowship: 'nav-analytics',
  heatmap: 'nav-analytics',
  login: null,
};

const [,, command, pageArg] = process.argv;

if (!command || !['extract', 'import', 'split'].includes(command)) {
  console.log('Usage: node proto.js <extract|import|split> [page]');
  console.log('Pages:', PAGE_KEYS.join(', '));
  process.exit(1);
}

if (command !== 'split' && (!pageArg || !PAGE_KEYS.includes(pageArg))) {
  console.error(`Error: Invalid page "${pageArg}". Valid: ${PAGE_KEYS.join(', ')}`);
  process.exit(1);
}

// ──────────────────────────────────────────────
// Section Extraction / Replacement Helpers
// ──────────────────────────────────────────────

// Three marker formats:
//   HTML: <!-- SECTION:name START --> ... <!-- SECTION:name END -->
//   CSS:  /* SECTION:name START */  ... /* SECTION:name END */
//   JS:   // SECTION:name START     ... // SECTION:name END

function makePatterns(sectionName) {
  return [
    // HTML comments
    {
      start: `<!-- SECTION:${sectionName} START -->`,
      end:   `<!-- SECTION:${sectionName} END -->`,
    },
    // CSS comments
    {
      start: `/* SECTION:${sectionName} START */`,
      end:   `/* SECTION:${sectionName} END */`,
    },
    // JS comments
    {
      start: `// SECTION:${sectionName} START`,
      end:   `// SECTION:${sectionName} END`,
    },
  ];
}

function extractSection(src, sectionName) {
  const patterns = makePatterns(sectionName);
  for (const p of patterns) {
    const startIdx = src.indexOf(p.start);
    if (startIdx === -1) continue;
    const contentStart = startIdx + p.start.length;
    const endIdx = src.indexOf(p.end, contentStart);
    if (endIdx === -1) continue;
    // Content between markers, strip leading newline if present
    let content = src.substring(contentStart, endIdx);
    if (content.startsWith('\n')) content = content.substring(1);
    if (content.endsWith('\n')) content = content.substring(0, content.length - 1);
    return content;
  }
  return null;
}

function replaceSection(src, sectionName, newContent) {
  const patterns = makePatterns(sectionName);
  for (const p of patterns) {
    const startIdx = src.indexOf(p.start);
    if (startIdx === -1) continue;
    const contentStart = startIdx + p.start.length;
    const endIdx = src.indexOf(p.end, contentStart);
    if (endIdx === -1) continue;
    // Preserve markers, replace content between them
    const before = src.substring(0, contentStart);
    const after = src.substring(endIdx);
    return before + '\n' + newContent + '\n' + after;
  }
  return null;
}

// ──────────────────────────────────────────────
// Nav active state helper
// ──────────────────────────────────────────────

function setActiveNav(navHtml, navId) {
  if (!navId) return navHtml;
  // Strip 'active' from all nav-btn classes
  let result = navHtml.replace(/class="([^"]*)"/g, function(match, classes) {
    if (classes.indexOf('nav-btn') === -1) return match;
    const cleaned = classes.replace(/\bactive\b/g, '').replace(/\s+/g, ' ').trim();
    return 'class="' + cleaned + '"';
  });

  // Now add active to the button with the target ID
  // Handle id="nav-id" class="nav-btn" or class="nav-btn" id="nav-id"
  // Pattern 1: id="navId" ... class="nav-btn"
  const idPattern1 = new RegExp(
    '(<button\\s[^>]*id="' + navId + '"[^>]*class=")(nav-btn)(")',
    'g'
  );
  result = result.replace(idPattern1, '$1nav-btn active$3');

  // Pattern 2: class="nav-btn" ... id="navId" (no match needed if pattern 1 worked)
  if (result.indexOf('id="' + navId + '"') !== -1) {
    // Check if we already added active
    const checkPattern = new RegExp('id="' + navId + '"[^>]*class="nav-btn active"');
    if (!checkPattern.test(result)) {
      // Try the reverse order
      const idPattern2 = new RegExp(
        '(<button\\s[^>]*class=")(nav-btn)("[^>]*id="' + navId + '")',
        'g'
      );
      result = result.replace(idPattern2, '$1nav-btn active$3');
    }
  }

  return result;
}

// ──────────────────────────────────────────────
// Extract Command
// ──────────────────────────────────────────────

function extractPage(pageKey) {
  const src = fs.readFileSync(MONOLITH, 'utf8');

  // Shared sections
  const styles = extractSection(src, 'styles');
  const nav = extractSection(src, 'nav');
  const footer = extractSection(src, 'footer');
  const scripts = extractSection(src, 'scripts');

  if (!styles) { console.error('ERROR: Could not extract styles section'); process.exit(1); }
  if (!nav) { console.error('ERROR: Could not extract nav section'); process.exit(1); }
  if (!scripts) { console.error('ERROR: Could not extract scripts section'); process.exit(1); }

  // Page-specific sections
  const sidebar = extractSection(src, 'sidebar:' + pageKey);
  const page = extractSection(src, 'page:' + pageKey);
  const pageStyles = extractSection(src, 'styles:' + pageKey);
  const pageScripts = extractSection(src, 'scripts:' + pageKey);
  const modals = extractSection(src, 'modals:' + pageKey);

  if (!page) { console.error(`ERROR: Could not extract page:${pageKey} section`); process.exit(1); }

  // Set nav active state
  const activeNav = setActiveNav(nav, NAV_ACTIVE_MAP[pageKey]);

  // Build the standalone HTML
  const isLogin = pageKey === 'login';
  const needsChartJs = pageKey === 'caselogs';

  let html = '';
  html += '<!DOCTYPE html>\n';
  html += '<html lang="en" data-theme="dark">\n';
  html += '<head>\n';
  html += '<meta charset="UTF-8"/>\n';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>\n';
  html += '<title>GuideFlow — ' + pageKey.charAt(0).toUpperCase() + pageKey.slice(1) + '</title>\n';
  html += '<link rel="preconnect" href="https://fonts.googleapis.com"/>\n';
  html += '<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>\n';

  if (needsChartJs) {
    html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"><\/script>\n';
  }

  // Styles
  html += '<style>\n';
  // The shared styles section includes its own <style> tag content (between the markers)
  // but the markers are inside <style>...</style> in the monolith, so the extracted content
  // is the CSS itself (no <style> tags)
  // Actually, looking at the monolith: <!-- SECTION:styles START --> wraps <style>...</style>
  // So styles content includes the <style> and </style> tags. Let's check.
  // Line 10: <!-- SECTION:styles START -->
  // Line 11: <style>
  // ...
  // Line 638: </style>
  // Line 639: <!-- SECTION:styles END -->
  // So yes, the extracted styles includes <style>...</style>

  // Wait - we're extracting between markers, so content starts at line 11 (the <style> tag)
  // We need to strip the <style> and </style> wrapper since we're putting it in our own <style>
  let styleContent = styles;
  styleContent = styleContent.replace(/^\s*<style>\s*/, '').replace(/\s*<\/style>\s*$/, '');

  // Strip nested page-specific markers from shared styles to avoid duplication
  styleContent = styleContent.replace(/\/\* SECTION:styles:\w+ START \*\/[\s\S]*?\/\* SECTION:styles:\w+ END \*\//g, '');

  html += styleContent + '\n';

  // Page-specific styles if they exist
  if (pageStyles) {
    html += '\n/* SECTION:styles:' + pageKey + ' START */\n';
    html += pageStyles + '\n';
    html += '/* SECTION:styles:' + pageKey + ' END */\n';
  }

  // Multi-page override
  html += '\n/* Multi-page override */\n';
  html += '.page { display: block !important; animation: fadeUp .38s ease both; }\n';

  html += '</style>\n';
  html += '</head>\n';

  // Body
  if (isLogin) {
    html += '<body class="on-login">\n';
  } else {
    html += '<body>\n';
  }

  html += '<div class="toast" id="toast"></div>\n';

  // Nav with markers so import can find it if needed (but we won't import shared)
  html += '<!-- SECTION:nav START -->\n';
  html += activeNav + '\n';
  html += '<!-- SECTION:nav END -->\n';

  if (!isLogin) {
    html += '<div class="layout" id="app-layout"><aside class="sidebar">\n';

    // Sidebar with markers
    if (sidebar) {
      html += '<!-- SECTION:sidebar:' + pageKey + ' START -->\n';
      html += sidebar + '\n';
      html += '<!-- SECTION:sidebar:' + pageKey + ' END -->\n';
    }

    html += '</aside>\n';

    // Page content with markers
    html += '<!-- SECTION:page:' + pageKey + ' START -->\n';
    html += page + '\n';
    html += '<!-- SECTION:page:' + pageKey + ' END -->\n';

    // Modals if they exist
    if (modals) {
      html += '\n<!-- SECTION:modals:' + pageKey + ' START -->\n';
      html += modals + '\n';
      html += '<!-- SECTION:modals:' + pageKey + ' END -->\n';
    }

    html += '</div><!-- /app-layout -->\n';

    // Footer
    if (footer) {
      html += '\n<!-- SECTION:footer START -->\n';
      html += footer + '\n';
      html += '<!-- SECTION:footer END -->\n';
    }
  } else {
    // Login page: no layout wrapper, no sidebar
    html += '<!-- SECTION:page:' + pageKey + ' START -->\n';
    html += page + '\n';
    html += '<!-- SECTION:page:' + pageKey + ' END -->\n';
  }

  // Scripts
  html += '\n<!-- SECTION:scripts START -->\n';
  html += '<script>\n';

  // Extract the JS content from the scripts section (strip <script>/<\/script> wrapper)
  let scriptContent = scripts;
  scriptContent = scriptContent.replace(/^\s*<script>\s*/, '').replace(/\s*<\/script>\s*$/, '');

  // Strip nested page-specific markers from shared scripts to avoid duplication
  scriptContent = scriptContent.replace(/\/\/ SECTION:scripts:\w+ START[\s\S]*?\/\/ SECTION:scripts:\w+ END/g, '');

  html += scriptContent + '\n';

  html += '<\/script>\n';
  html += '<!-- SECTION:scripts END -->\n';

  html += '</body>\n';
  html += '</html>\n';

  // Ensure pages dir exists
  if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });

  const outFile = path.join(PAGES_DIR, FILENAME_MAP[pageKey]);
  fs.writeFileSync(outFile, html);
  console.log('  extracted: ' + FILENAME_MAP[pageKey]);
}

// ──────────────────────────────────────────────
// Import Command
// ──────────────────────────────────────────────

function importPage(pageKey) {
  const pageFile = path.join(PAGES_DIR, FILENAME_MAP[pageKey]);
  if (!fs.existsSync(pageFile)) {
    console.error(`ERROR: Page file not found: ${pageFile}`);
    process.exit(1);
  }

  const pageSrc = fs.readFileSync(pageFile, 'utf8');
  let monolith = fs.readFileSync(MONOLITH, 'utf8');

  // Page-specific section names to import
  const sections = [
    'sidebar:' + pageKey,
    'page:' + pageKey,
    'styles:' + pageKey,
    'scripts:' + pageKey,
    'modals:' + pageKey,
  ];

  let imported = 0;
  let skipped = 0;

  for (const sectionName of sections) {
    const content = extractSection(pageSrc, sectionName);
    if (content === null) {
      // Section not in page file — skip silently (it may not exist for this page)
      continue;
    }

    const updated = replaceSection(monolith, sectionName, content);
    if (updated === null) {
      console.warn(`  WARN: Section "${sectionName}" not found in monolith — skipped`);
      skipped++;
      continue;
    }

    monolith = updated;
    imported++;
    console.log(`  imported: ${sectionName}`);
  }

  fs.writeFileSync(MONOLITH, monolith);
  console.log(`\n  Summary: ${imported} section(s) imported, ${skipped} skipped`);
}

// ──────────────────────────────────────────────
// Split Command
// ──────────────────────────────────────────────

function splitAll() {
  console.log('Splitting monolith into standalone pages...\n');

  // Ensure pages dir exists
  if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });

  // Extract every page
  for (const key of PAGE_KEYS) {
    extractPage(key);
  }

  const src = fs.readFileSync(MONOLITH, 'utf8');

  // Generate shared.css
  let styles = extractSection(src, 'styles');
  if (styles) {
    styles = styles.replace(/^\s*<style>\s*/, '').replace(/\s*<\/style>\s*$/, '');
    const css = '/* GuideFlow Shared Styles — extracted from guideflow-app.html */\n' +
      styles + '\n\n' +
      '/* Multi-page overrides */\n' +
      '.page { display: block !important; animation: fadeUp .38s ease both; }\n';
    fs.writeFileSync(path.join(PAGES_DIR, 'shared.css'), css);
    console.log('  generated: shared.css');
  }

  // Generate shared.js
  let scripts = extractSection(src, 'scripts');
  if (scripts) {
    scripts = scripts.replace(/^\s*<script>\s*/, '').replace(/\s*<\/script>\s*$/, '');

    // Replace the navigate function for multi-page navigation
    scripts = scripts.replace(
      /function navigate\(page\)\{[\s\S]*?window\.scrollTo\(0,0\)\}/,
      `function navigate(page) {\n` +
      `  var pageMap = { home:'guidelines.html', caselogs:'caselogs.html', admin:'admin.html', rotation:'rotation.html', fellowship:'fellowship.html', heatmap:'heatmap.html', login:'login.html' };\n` +
      `  if (pageMap[page]) window.location.href = pageMap[page];\n` +
      `}`
    );

    const js = '/* GuideFlow Shared Scripts — extracted from guideflow-app.html */\n' + scripts + '\n';
    fs.writeFileSync(path.join(PAGES_DIR, 'shared.js'), js);
    console.log('  generated: shared.js');
  }

  console.log('\nDone. ' + PAGE_KEYS.length + ' pages + shared.css + shared.js');
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

switch (command) {
  case 'extract':
    console.log(`Extracting page: ${pageArg}`);
    extractPage(pageArg);
    break;
  case 'import':
    console.log(`Importing page: ${pageArg}`);
    importPage(pageArg);
    break;
  case 'split':
    splitAll();
    break;
}
