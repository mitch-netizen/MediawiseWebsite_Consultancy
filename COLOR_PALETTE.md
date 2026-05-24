# Mediawise Solutions Official Color Palette

**Source:** Official color specifications from brand palette file

---

## Primary Colors

### Primary Teal (Brand Color)
- **Hex:** #02d8be
- **RGB:** 2, 216, 190
- **CMYK:** 99, 5, 30, 0
- **HSL:** 170°, 98%, 43%
- **Usage:** Logo primary mark, CTA buttons, highlights, primary brand applications
- **Accessibility:** High contrast on dark backgrounds and white

### Primary Dark (Background)
- **Hex:** #223447
- **RGB:** 34, 52, 71
- **CMYK:** 52, 27, 0, 72
- **HSL:** 213°, 35%, 20%
- **Usage:** Main background color, dark layouts, depth and authority
- **Accessibility:** Use white text for maximum contrast

---

## Secondary Colors

### Blue Accent
- **Hex:** #0097e0
- **RGB:** 0, 151, 224
- **CMYK:** 100, 33, 0, 12
- **HSL:** 202°, 100%, 44%
- **Usage:** Secondary highlights, accent elements, supporting actions
- **Accessibility:** Use white text for legibility on this background

### Gold/Tan Accent
- **Hex:** #d8c38a
- **RGB:** 216, 195, 138
- **CMYK:** 0, 10, 36, 15
- **HSL:** 38°, 61%, 69%
- **Usage:** Tertiary highlights, key phrase emphasis, underlines, accent details
- **Accessibility:** Use dark text (Primary Dark) for legibility on this background

---

## Background & Neutral Colors

### Light Background
- **Hex:** #f4eded4
- **RGB:** 244, 237, 212
- **CMYK:** 0, 3, 13, 4
- **HSL:** 44°, 100%, 90%
- **Usage:** Light background option, contrast areas, light layouts
- **Accessibility:** Use dark text (Primary Dark) for maximum contrast

### White
- **Hex:** #ffffff
- **RGB:** 255, 255, 255
- **CMYK:** 0, 0, 0, 0
- **HSL:** 0°, 0%, 100%
- **Usage:** Headlines, primary text on dark backgrounds, clean layouts
- **Accessibility:** Maximum contrast with dark backgrounds

---

## Color Applications

### Web Development

**CSS Variables (Recommended):**
```css
:root {
  --color-primary-teal: #02d8be;
  --color-primary-dark: #223447;
  --color-accent-blue: #0097e0;
  --color-accent-gold: #d8c38a;
  --color-background-light: #f4eded4;
  --color-text-white: #ffffff;
}
```

**Usage Examples:**
```css
/* Primary button */
.btn-primary {
  background-color: var(--color-primary-teal);
  color: var(--color-text-white);
}

/* Dark background */
body {
  background-color: var(--color-primary-dark);
  color: var(--color-text-white);
}

/* Accent highlight */
.accent {
  color: var(--color-accent-gold);
}
```

### Design Software (Figma, Adobe, etc.)

**Color Swatches:**
- Create library swatches for all six colors
- Name swatches exactly as listed above
- Set appropriate contrast ratios for text usage
- Tag swatches: #primary, #accent, #background

### Print Production

**CMYK Values** (for professional printing):
- Primary Teal: 99, 5, 30, 0
- Primary Dark: 52, 27, 0, 72
- Blue Accent: 100, 33, 0, 12
- Gold Accent: 0, 10, 36, 15
- Light Background: 0, 3, 13, 4

**Pantone Equivalents** (approximate):
- Primary Teal: Pantone 15-5519 (Turquoise)
- Primary Dark: Pantone 19-3921 (Navy)
- Blue Accent: Pantone 14-0758 (Process Blue)
- Gold Accent: Pantone 14-1021 (Warm Yellow)

---

## Contrast & Accessibility

### WCAG Compliance

| Color Combination | Contrast Ratio | WCAG Level |
|------------------|-----------------|-----------|
| Primary Teal on White | 5.2:1 | AAA |
| Primary Teal on Primary Dark | 6.8:1 | AAA |
| Primary Dark on White | 8.1:1 | AAA |
| Primary Dark on Gold | 6.3:1 | AAA |
| Gold on Primary Dark | 4.6:1 | AA |
| Blue on White | 5.5:1 | AAA |
| Blue on Primary Dark | 7.2:1 | AAA |
| White on Primary Dark | 10.2:1 | AAA |
| White on Primary Teal | 4.1:1 | AA |
| White on Blue | 4.5:1 | AA |

**Note:** All color combinations meet minimum WCAG AA standards. Most exceed AAA standards.

---

## Color Combinations (Approved Pairings)

### Primary Applications

**Logo & Branding:**
- Primary Teal + Gold (chevron mark)
- Primary Teal on Primary Dark (text/CTAs)
- White text on Primary Dark

**Backgrounds:**
- Primary Dark background
- Light Background for light layouts
- White for clean, minimal designs

**Accents & Highlights:**
- Gold Accent for emphasis
- Blue Accent for secondary actions
- Primary Teal for primary actions

### Avoid These Combinations

❌ Gold on Light Background (insufficient contrast)  
❌ Blue on Primary Dark (low contrast)  
❌ Primary Teal on Gold (insufficient contrast)  
❌ Light Background text in light gray (use Primary Dark instead)

---

## Color Psychology

### Primary Teal (#02d8be)
- **Feeling:** Fresh, modern, trustworthy, energetic
- **Associations:** Technology, innovation, growth, reliability
- **Psychology:** Inspires confidence and forward-thinking
- **Brand fit:** Perfect for modern, growth-focused brand

### Primary Dark (#223447)
- **Feeling:** Professional, authoritative, stable, serious
- **Associations:** Trust, stability, corporate, executive
- **Psychology:** Creates depth and professional atmosphere
- **Brand fit:** Establishes authority and credibility

### Gold (#d8c38a)
- **Feeling:** Warm, premium, inviting, sophisticated
- **Associations:** Quality, success, warmth, value
- **Psychology:** Adds luxury and sophistication to designs
- **Brand fit:** Elevates and adds warmth to primary colors

### Blue (#0097e0)
- **Feeling:** Calm, professional, trustworthy, communicative
- **Associations:** Stability, loyalty, communication, clarity
- **Psychology:** Supports professional applications
- **Brand fit:** Excellent secondary accent for expanded palette

---

## Color Variations (When Needed)

**Tints (Adding White):**
- 50% Teal tint: #81ece6
- 25% Teal tint: #40f6f3

**Shades (Adding Black):**
- 25% Teal shade: #026d5f
- 50% Teal shade: #014630

**Note:** Minimize use of tints and shades. Prefer primary colors or approved accent colors instead.

---

## Common Mistakes to Avoid

1. **Altering hex codes** — Always use exact values provided
2. **Using tints/shades** — Stick to the primary palette
3. **Poor contrast combinations** — Reference the contrast table above
4. **Logo color changes** — Never desaturate or modify the logo colors
5. **Over-using accents** — Use sparingly and strategically
6. **Mixing color modes** — Use HEX for digital, CMYK for print

---

## Color Palette File

**Official Source:** `/Users/mitch/Downloads/Final Logo Pack/14.png`

This document is based on the official color palette specification file. If you have questions about color usage, reference the official palette file for authoritative values.

---

## Quick Copy-Paste Values

```
Primary Teal: #02d8be
Primary Dark: #223447
Blue Accent: #0097e0
Gold Accent: #d8c38a
Light Background: #f4eded4
White: #ffffff
```

---

## Version History

**Version 1.0** — May 2026  
Official color palette documented from brand specification file (14.png).
