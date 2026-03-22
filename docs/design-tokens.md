# Design Tokens

Full reference for porting the prototype to Tailwind CSS + shadcn/ui.

## Color Palette

### Base (Dark Mode → Light Mode)
| Token | Dark | Light | Tailwind Custom |
|---|---|---|---|
| `--bg` | `#131313` | `#FFFFFF` | `bg-background` |
| `--bg-raised` | `#1A1A1A` | `#FFFFFF` | `bg-card` |
| `--bg-hover` | `#222222` | `#F5F3F0` | `hover:bg-muted` |
| `--border` | `#2A2A2A` | `#E8E2D9` | `border-border` |
| `--border-hi` | `#363636` | `#D6CFC4` | `border-border/80` |
| `--text-1` | `#F0EBE3` | `#141210` | `text-foreground` |
| `--text-2` | `#C4BDB4` | `#6B6560` | `text-muted-foreground` |
| `--text-3` | `#666260` | `#9E9890` | `text-muted-foreground/60` |

### Accents (Anthropic palette, brightened 50%)
| Token | Dark | Light | Usage |
|---|---|---|---|
| `--ac-orange` | `#E8956F` | `#D07040` | Primary action, SC role, CTA buttons |
| `--ac-blue` | `#8BB8E0` | `#5585B0` | Info, SJ role, focus rings, links |
| `--ac-green` | `#9AB87A` | `#688548` | Success, TA role, met thresholds |

### Shadows
| Token | Dark | Light |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.5)` | `0 1px 3px rgba(0,0,0,0.06)` |
| `shadow-md` | `0 8px 32px rgba(0,0,0,0.65)` | `0 8px 32px rgba(0,0,0,0.09)` |
| `shadow-lg` | `0 24px 80px rgba(0,0,0,0.8)` | `0 24px 80px rgba(0,0,0,0.11)` |

## Typography

| Element | Font | Size | Weight | Spacing |
|---|---|---|---|---|
| Page title | Lora | 38px | 500 | -0.8px |
| Card title | Lora | 17px | 500 | -0.3px |
| Section label | DM Sans | 12px | 600 | 0.12em, uppercase |
| Eyebrow | DM Sans | 13px | 500 | 0.11em, uppercase |
| Body | DM Sans | 16px | 300–400 | normal |
| Subtitle | DM Sans | 17px | 300 | normal |
| Tag/badge | DM Sans | 13px | 500 | normal |
| Table header | DM Sans | 10.5px | 600 | 0.1em, uppercase |

## Component Patterns

### Cards
- Background: `--bg-raised`
- Border: `1px solid var(--border)`
- Radius: `12px`
- Shadow: `shadow-sm`
- Hover: `border-color: --border-hi`, `shadow-md`, `translateY(-2px)`

### Guide Tiles (Claude Blog Style)
- Outer card: 16px radius, `--bg-raised`
- Color header: inset 10px margin, 14px radius, 200px height
- Contains two tilted `#faf9f5` paper rects + hand-drawn sketch SVG
- Body: Lora 17px title, date, tag pill

### Form Fields
- `.field` wrapper with `.field-label` (uppercase)
- Input: `--bg` background, `--border-hi` border, 8px radius
- Focus: `--ac-blue` border + 3px `--ac-blue-dim` ring

### Buttons
- Primary (filled): `--ac-orange` bg, white text, 8px radius
- Ghost: transparent bg, `--border-hi` border, `--text-2` text

### Role Badges
- SC: orange dim bg + orange text
- SJ: blue dim bg + blue text
- TA: green dim bg + green text
- FA: neutral dim bg + text-3

## Grain Texture

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,...feTurbulence fractalNoise...");
  opacity: var(--grain-op); /* 0.035 dark, 0.018 light */
  pointer-events: none;
  z-index: 9998;
}
```

## Animation

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(13px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Usage: animation: fadeUp 0.38s ease both */
```
