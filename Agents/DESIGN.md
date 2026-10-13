---
version: "specialized-engineering-kenya-v3.1"
name: "Specialized Engineering Kenya Ltd. Design System"
description: "Minimal Architectural Elevator Design System — Minimal Blue Touchpoint Standard"
font: "Manrope"
colors:
  primary: "#2563EB"       # Preserved strictly for primary action buttons & contact submissions
  primary-hover: "#1D4ED8" # Subtle dark blue on hover
  bg-dark: "#0F0F0F"       # Deep technical dark background
  bg-dark-card: "#141414"  # Dark section surfaces
  bg-dark-elevated: "#1A1A1A" # Elevated cards & inquiry form containers
  bg-light: "#F5F5F5"      # Clean minimal light background
  surface-white: "#FFFFFF" # Crisp white surfaces
  border-dark: "rgba(255, 255, 255, 0.1)" # Minimal borders for dark components
  border-light: "#E5E5E5"  # Subtle light borders
typography:
  family: "Manrope, sans-serif"
  display-hero:
    fontSize: "clamp(2.75rem, 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: "0.9"
    letterSpacing: "-0.04em"
    textTransform: "uppercase"
  heading-section:
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 600
    lineHeight: "1.0"
    letterSpacing: "-0.03em"
    textTransform: "uppercase"
  label-tag:
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.18em"
    textTransform: "uppercase"
    color: "#A3A3A3" # Neutral monochrome
spacing:
  landing-hero: "h-screen (100vh)"
  inner-page-hero: "min-h-[50vh] (50% view height)"
  section-padding: "py-20 md:py-28 px-6 md:px-12"
  container-max: "max-w-7xl (1440px)"
  contact-cards: "p-6 md:p-8 rounded-2xl gap-5 md:gap-6"
---

# Specialized Engineering Kenya Ltd. Design System — Minimal Standard

## 1. Core Directives

### A. Viewport Heights
- **Landing Page Hero:** `h-screen` (100% viewport height) bottom-anchored composition with circular CTA.
- **Inner Page Heroes:** Strictly `min-h-[50vh]` / `min-h-[50svh]` (50% view height) across `/about`, `/contact`, `/elevators`, `/projects`, `/news`, and `/lift-services`.
- **Inner Content Sections:** Natural responsive heights with comfortable vertical breathing room (`py-20 md:py-28`), not forced to 100vh.

### B. Element Alignment
- Centered presentation for philosophical and quote sections (e.g. **Fulfil Your Vision** is aligned in the center both horizontally and vertically with centered text, badge, and leadership metadata).

### C. Universal Typography
- **Manrope Font (`'Manrope', sans-serif`)** applied universally across the entire application via `next/font/google` directly on `html`, `body`, and all child components. No font mismatch.

### D. Minimal, Non-Distracting Motion
- Distracting animations removed: no slow image zooming, no 45-degree spinning on circular buttons, no aggressive bounce.
- Micro-interactions are kept subtle, calm, and professional: standard gentle opacity transitions and subtle hover scales (`scale-103`).

### E. Spacious Contact Cards
- Contact cards are given ample padding (`p-6` to `p-8`), larger 12×12 icon containers, high-contrast readable typography (`text-sm md:text-base font-medium`), and clear label metadata (`font-mono text-xs uppercase tracking-widest text-neutral-400`).

### F. Minimized Blue Accent Philosophy
- **Where Blue IS used:**
  1. Primary call-to-action buttons (`Contact Us`, `Send Message`, `Request Technical Drawing Review`).
  2. Selected radio pill active state (`.custom-radio:checked + div`).
- **Where Blue is NOT used:**
  - Neutralized all section subtitle labels, category tags, period dots, decorative borders, social hover pills, and list arrows. The site maintains a clean, architectural monochrome aesthetic, allowing the blue to act as an intentional, high-contrast action beacon.