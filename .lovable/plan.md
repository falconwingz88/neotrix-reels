## Goal
Make the "See More" panel on the homepage feel irresistible to click — add anticipation, motion, and a clearer reward signal so the eye is pulled in and the cursor follows.

## Changes (all scoped to the See More card in `src/pages/Index.tsx`)

### 1. Resting state — already hints at interactivity
- Add a subtle, always-on shimmer sweep across the panel (slow diagonal light streak every ~6s) so it never looks static.
- Soft pulsing ring around the card border (uses primary/cyan glow at low opacity) to draw the eye.
- Add a small "↓ 60+ projects" counter chip in a corner so users feel there's real volume waiting.

### 2. Hover state — strong reward feedback
- Card scales up subtly (1.02) with a smooth spring ease.
- Brightness/saturation boost on the grid (keep existing) + speed up the scroll animation 2× on hover so it feels alive and reactive to the cursor.
- Replace static "See More" text with a stacked reveal: "See More" slides up slightly while a new line "Explore the full portfolio →" fades in below.
- The arrow icon detaches and animates rightward repeatedly (chevron nudge loop) instead of sitting still.
- Add a glowing CTA pill button rendered inside the overlay ("View All Projects") with the brand gradient — a real button-shaped target, not just text, which dramatically increases click intent.
- The animated rainbow gradient stays but intensifies (opacity 0 → 85%) and slows its cycle for a more premium feel.

### 3. Micro-details
- Cursor changes to a custom "→" style on hover (via cursor utility).
- Add a soft vignette that retracts on hover, revealing the brightened grid underneath like curtains opening.
- Tiny "NEW" / sparkle indicator if any of the previewed projects were added in the last 30 days (pulls from existing `createdAt`).

## Technical notes
- Pure presentation changes in `src/pages/Index.tsx`; no new dependencies, no backend changes.
- New keyframes (`shimmer-sweep`, `chevron-nudge`, `ring-pulse`) added inline alongside the existing `<style>` block in Index.tsx or promoted to `src/index.css` if reused.
- Reuse existing semantic tokens (primary, accent, glow) — no hardcoded colors.
- Respects `prefers-reduced-motion`: shimmer, pulse, and chevron nudge disabled when set.

## Out of scope
- No layout changes elsewhere on the page.
- No copy changes outside the See More panel.
- No routing/data changes.
