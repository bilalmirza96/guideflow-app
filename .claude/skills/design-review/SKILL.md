# Skill: Design Review

## When to Use
When creating or modifying any UI component, page, or layout.

## Process

1. **Reference the prototype** — Open `prototype/guideflow-app.html` and compare against the design tokens in `docs/design-tokens.md`
2. **Check color tokens** — Never hardcode hex values. Always use CSS variables or Tailwind custom colors mapped to our tokens
3. **Typography check** — Headings use Lora serif. Body uses DM Sans. Verify font sizes and weights match the reference
4. **Dark/Light mode** — Every color must work in both themes. Test by toggling `data-theme`
5. **Component patterns** — Cards, buttons, badges, form fields must match the prototype's exact spacing, radius, and shadow values
6. **Animation** — New elements entering view should use `fadeUp` animation (0.38s ease, 13px Y offset)
7. **Grain overlay** — Verify the grain texture `body::before` is not blocked by new elements (z-index 9998)

## Checklist
- [ ] Uses design token variables, not hardcoded colors
- [ ] Lora for headings, DM Sans for body
- [ ] Consistent with prototype spacing and radius
- [ ] Works in both dark and light mode
- [ ] Cards have proper shadow and hover states
- [ ] Monochromatic base — accents only where specified
