# Lessons Learned

Self-improvement log. After any correction, document the pattern here to prevent repeating mistakes.

---

## Design

- **Chart.js bar overflow:** `maintainAspectRatio:false` requires a wrapper div with constrained height (`flex:1; min-height:0`), not just a canvas height. The parent must be a flex column.
- **Theme toggle + charts:** Charts must be destroyed and recreated on theme change since they cache colors at render time. Use `setTimeout(initCharts, 80)` to let CSS transition complete.
- **Guide tiles:** Follow Claude blog format exactly — inset colored header (10px margin, 14px border-radius) with tilted `#faf9f5` paper rects and hand-drawn stroke-based SVG illustrations. NOT solid fills.

## Architecture

- _(empty — add lessons as they come)_

## Code Quality

- _(empty — add lessons as they come)_
