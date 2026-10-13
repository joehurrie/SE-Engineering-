---
version: "specialized-engineering-kenya-v4.1"
name: "Specialized Engineering Kenya Ltd. Design System"
description: "Minimal architectural system for the public website and CMS"
font: "Manrope"
colors:
  primary: "#2563EB"
  primary-hover: "#1D4ED8"
  bg-dark: "#0F0F0F"
  bg-dark-card: "#141414"
  bg-light: "#F5F5F3"
  surface-white: "#FFFFFF"
  border-dark: "rgba(255, 255, 255, 0.1)"
  border-light: "#E5E5E5"
surfaces:
  card-radius: "0"
  border: "1px solid neutral border"
  shadow: "subtle and only when it clarifies elevation"
typography:
  family: "Manrope, sans-serif"
  display-hero: "clamp(2.75rem, 6vw, 5.5rem), semibold, tight leading"
  heading-section: "clamp(2rem, 4vw, 3.5rem), semibold"
  label-tag: "11px, semibold, uppercase, 0.16em tracking"
spacing:
  home-hero: "100svh"
  inner-page-hero: "min-h-[50svh], with a 380px minimum where needed"
  section-padding: "py-20 md:py-28"
  container-max: "1280px"
  card-padding: "p-6 md:p-8"
  card-grid-gap: "gap-6 md:gap-8"
---

# Specialized Engineering Kenya Ltd. Design System

## Visual Direction
Use an architectural, editorial interface: open white and soft-gray sections, deep charcoal for selected technical moments, precise neutral borders, and blue as a deliberate action accent. Prefer clear alignment, calm whitespace, and strong content hierarchy over decorative panels or heavy shadows.

## Layout
- Public sections span the viewport; constrain their content in a centered shell no wider than 1280px.
- Center content with a consistent `w-full max-w-* mx-auto` shell and responsive horizontal padding. Use the same shell width for section headings, grids, and supporting content so they share one alignment axis.
- Do not add blanket global `margin` or `padding` resets that override utility classes. Tailwind Preflight owns the element reset; keep custom universal rules limited to properties such as `box-sizing`.
- The home hero occupies the viewport (`min-h-svh` / `min-h-screen`). Inner-page heroes target half a viewport, with enough minimum height for their content.
- Keep content sections at natural height. Use responsive vertical padding rather than forcing every section to fill the viewport.
- Align repeated grids to the same shell and use consistent gutters. At mobile sizes, reduce card padding and grid gaps without compressing text.

## Square Card Rule
- Every card surface has **zero radius**: product and project cards, testimonials, feature tiles, contact information, CMS list cards, detail panels, modals, and upload previews.
- Use square-cornered borders and restrained shadows; distinguish surfaces with spacing, background tone, and border contrast instead of curves.
- Do not use `rounded-*` utilities on card containers. Prefer `rounded-none` where a card needs an explicit utility class.
- Buttons, form controls, and compact filter controls are not cards; they may retain modest control-specific corner treatments where the established interaction benefits from them. Public calls to action remain square. Circular shapes are reserved for meaningful status or icon indicators.
- Avoid nested cards. A card should contain content, not another decorative surface.

## Typography
- Use Manrope throughout the public site and admin.
- Use sentence case for primary headings where it reads naturally. Reserve uppercase for compact metadata, labels, and action text.
- Keep headings tightly tracked but legible; body copy uses neutral color, comfortable line-height, and regular weight rather than pervasive light-weight text.
- Use consistent metadata: small uppercase labels with moderate tracking; avoid mixing multiple tracking styles in the same component.

## Spacing and Cards
- Use `p-6 md:p-8` as the default card inset and `gap-6 md:gap-8` for repeated card grids. Smaller utility tiles may use `p-4`.
- Keep section padding on the section or its inner shell, not both; avoid stacking shared shell padding with section padding unintentionally.
- Keep a clear gap between repeated question rows, feature tiles, and article items. For FAQ accordions, use at least `space-y-4`, moderate row padding, and a distinct answer divider.
- Keep image ratios and card heights stable within a grid; align card actions along the bottom when descriptions vary.
- Use borders before shadows. Hover states should be restrained and should not shift layout.

## Forms and Contact Information
- Forms use compact, consistently sized labels and square fields with clear focus states.
- Show essential reassurance once, in a compact text row near the form: location, expected response time, and emergency availability. Avoid repeating the same promise in a large badge, panel, and paragraph.
- Keep contact details in a simple aligned list when they do not need separate visual emphasis.
- Submission feedback must distinguish success from failure and remain readable without dominating the form.

## Page Patterns
- On the home page, keep the system range for standard elevator products only. Place Custom Solutions in its own image-led banner immediately below the grid, with a concise feature list and one consultation action.
- About, catalog, services, projects, news, and contact pages share the same shell, card radius, border weight, typography rhythm, and responsive spacing.
- Admin pages retain dense, task-focused layouts, but all card and modal surfaces follow the same zero-radius rule. Form fields and action controls remain compact and easy to use.

## Color and Motion
- Use blue for primary actions, focus states, and occasional meaningful emphasis; avoid blue as a default card decoration.
- Keep animation short and quiet. Motion should clarify an interaction, never become the visual focus.