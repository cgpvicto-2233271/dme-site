# DME Sitewide Product Audit

Date: 2026-05-06

## Main Problems

1. The visual system is fragmented. Public pages, team pages, auth, shop, hall of fame and scouting each define their own rhythm.
2. DME identity is diluted. The site uses black and red, but not with a consistent brand rule. Several pages feel like generic dark SaaS templates.
3. Typography is overused as spectacle. Large headings appear in small panels, and old display choices make the product feel cheap.
4. Text density is too high. Many pages explain instead of showing. A premium esport product should be understood fast.
5. Private product language leaks into public surfaces. Scouting must be staff-only; public pages can imply performance culture without exposing tools.
6. Motion is inconsistent. Some pages have heavy reveal animation, others static cards. Motion should be reserved for entrance, hover affordance and route transition.
7. Dashboards are dense but not sufficiently structured. Tables, cards, filters and empty states need one shared command language.
8. Responsive rules are uneven. Several pages rely on huge display text, tight grids or fixed decorative elements that risk overlap.

## Restored Direction

**DME Command / Champions-ready**

Black is the environment. Red is the command signal. White is information. Video and imagery carry atmosphere; UI stays disciplined.

## Design System Rules

- Colors: `#050505`, `#080808`, `#0d0d0d`, DME red `#e1192d`, white alpha scale.
- Typography: Inter for body, Manrope for display, IBM Plex Mono for metadata. No cheap esport display font.
- Type hierarchy: hero 56-112px, page title 40-80px, section 28-56px, cards 18-24px, body 14-17px.
- Text: short by default. One idea per block. No explanatory paragraphs in grids.
- Layout: max width 118rem, gutters 20-64px, section padding 72-112px desktop, 56-72px mobile.
- Components: sharp panels, restrained borders, red line accents, no nested cards, no decorative glow stacks.
- Motion: 180-500ms, opacity/y reveal only, no random animation loops except intentional media.
- Public/private: no scouting UI on public pages. Staff routes remain guarded by layout cookie role checks.

## Page Priorities

1. Global shell, header, footer, typography, buttons, cards, inputs.
2. Homepage and public command pages.
3. Teams and result pages.
4. Auth and account entry.
5. Scouting dashboard, tables, player profiles, watchlists, pipeline.
6. Cleanup stale home components and old visual helpers.
