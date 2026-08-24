# Arcanum — Design Specification

**Direction:** Occult Woodcut — an antique manuscript aesthetic: burnt-ink parchment tones, engraved typography, hand-cut ornament, sharp (unrounded) edges. Built as a four-screen desktop web app prototype; this document is the reference for implementing the real product.

Live prototype: https://claude.ai/code/artifact/94b46956-60fa-4af3-b6c6-9ac28456230b

---

## 1. Color

| Token | Hex / Value | Use |
|---|---|---|
| `--bg` | `#14110D` | App background |
| `--bg-2` | `#1D1811` | Panels, cards, input fields |
| `--bg-3` | `#241D14` | Card fronts/backs, elevated surfaces |
| `--ink` | `#E7DFC8` | Primary text, headings |
| `--ink-dim` | `#9C917A` | Body copy, secondary text |
| `--ink-faint` | `#6E624C` | Labels, captions, disabled text |
| `--line` | `#3A3226` | Borders, dividers |
| `--line-soft` | `#2A241A` | Subtle borders (panel edges, unselected states) |
| `--accent` | `#B5502B` | Primary actions, selected states, active nav |
| `--accent-bright` | `#D06840` | Hover states, accent icons |
| `--accent-dim` | `#6E3A21` | Disabled primary buttons |
| `--accent-wash` | `rgba(181,80,43,0.12)` | Active/selected background tints |

Single accent hue (burnt ochre/rust) — no secondary accent color. Everything else is warm neutral ink-on-parchment-dark.

## 2. Typography

- **Display / headings:** `IM Fell English SC` — an antique small-caps serif, used for the wordmark, page titles, card names, and the hero headline. Weight 400 only (the face has no bold cut — size and letter-spacing carry emphasis instead).
- **Body / UI:** `EB Garamond` — regular, italic, and semibold (500–600) cuts. Used for paragraph copy, labels, buttons, nav links, and form inputs. Italic is used specifically for taglines, subheads, and quoted content (the user's question).
- Both load from Google Fonts. No sans-serif anywhere in the system — the all-serif pairing is a deliberate part of the manuscript identity.
- Labels/eyebrows: 10.5–12px, uppercase, letter-spacing 0.14–0.22em, `--ink-faint` or `--accent-bright`.
- Body copy: 13–17px, line-height ~1.6–1.7.
- Headlines: 36–54px depending on screen weight (hero > section > screen title).

## 3. Shape & texture

- **No rounded corners.** Every panel, button, card, and input is sharp-edged (occasionally a single circular exception — see Seal button below). This is the primary thing that separates the system from a generic dark-mode SaaS look.
- **Grain overlay:** every screen has a full-bleed SVG `feTurbulence` noise layer at ~6% opacity, blend mode `overlay`, tinted toward `--ink` — simulates paper grain.
- **Corner ornaments:** thin hand-drawn-style SVG flourishes (single 1px stroke, `--line`) mark the top corners of the main content area on most screens.
- **Ornament divider:** a horizontal hairline gradient (transparent → `--line` → transparent) with a small rotated diamond at center, used to close out a screen or separate sections.
- **Deckle edge:** a jagged triangular-tooth strip (small CSS gradient pattern) under key illustrated cards, suggesting a torn/deckled paper edge.
- Card panels use a double border: an outer 1px border plus an inset second border ~6–10px in, evoking an engraved frame.

## 4. Components

**Seal button** (primary CTA, Home hero only) — a unique, circular, two-line stamp: 80px circle, 1px `--accent` border, label word over a smaller italic subtext (e.g. "BEGIN" / "the rite"). Reserved for the single most important action on the landing screen; not reused elsewhere, so it stays special.

**Primary button** (in-flow actions — Draw Cards, View Your Reading, Save to Journal) — sharp rectangle, solid `--accent` fill, `--bg` text, uppercase, letter-spaced, min-height 44px. Disabled state swaps to `--accent-dim` fill with muted text and `cursor: not-allowed`.

**Ghost button** (secondary actions — Shuffle Again, Start New Reading) — transparent fill, 1px `--line` border, hover border/text shift to accent.

**Icon button** — 44×44px square (not circular), 1px `--line` border, used for back navigation and the share action.

**Nav item** (sidebar) — 44×44px, icon only, active state gets `--accent-wash` fill + `--accent-bright` icon color.

**Chip** (Upright/Reversed tag) — sharp rectangle, 1px border, uppercase label. Upright uses `--accent`/`--accent-bright`; Reversed uses `--line`/`--ink-faint`. No red/green — orientation is a tone shift, not a warning color.

**Card back** — `--bg-3` fill, 1px `--line` border, inset secondary border, a single small rotated ink diamond centered.

**Card front** — `--bg-2` fill, 1px `--accent` border, inset secondary border, a line-icon symbol, the card name in display type, an orientation chip, and a keyword line.

**Text input / textarea** — `--bg-2` fill, 1px `--line-soft` border, italic placeholder and value text, border shifts to `--accent` on focus (no glow/shadow — kept flat and inky).

## 5. Iconography

Simple stroke-based line icons only (no filled icons, no emoji). Stroke width 1.3–1.5px, `currentColor`, drawn on a 24px grid. Each tarot card gets one representative icon rather than illustrative art: a tower for The Tower, a five-point star outline for The Star, a chalice for Ten of Cups, a hooded lantern for The Hermit. Navigation and utility icons (home, history, journal, settings, back, share) follow the same stroke weight and grid so they read as one family.

## 6. Screens

All screens are fixed 1440×900 desktop frames sharing the same left icon sidebar (Home / Past Readings / Journal / Settings) and a consistent topbar pattern (wordmark or back button + screen title).

1. **Home** — hero headline ("The Veil Thins Tonight") with the Seal CTA; a "Card of the Day" widget that flips on click to reveal a card; three static spread-type teaser tiles (Single / Three Card / Celtic Cross) previewing what's next.
2. **Choose Your Spread** — three selectable spread cards (click to select, shows an engraved position diagram + checkmark badge when active), a "Focus Your Question" textarea, and a bottom bar with a live selection summary and the Draw Cards button (disabled until a spread is chosen).
3. **Draw Your Cards** — three face-down card slots labeled Past/Present/Future; clicking a slot flips it to reveal a card (name, orientation chip, keyword); a live "X of 3 drawn" progress label; a Shuffle Again ghost button resets all reveals; View Your Reading unlocks once all three are drawn.
4. **Your Reading** — the original question recap, clickable card thumbnails (selecting one highlights its interpretation panel and dims the others), full interpretation text per card, an Overall Reflection synthesis box, and closing actions (Save to Journal, Share, Start New Reading).

## 7. Interaction notes for engineering

- Spread selection, card reveal, and result-card focus are all local component state in the prototype (no cross-screen state was wired — each `.dc.html` file is an isolated screen). In the real app these need to share state across an actual navigation flow: selected spread + question text carry into the draw screen; drawn cards + their orientations carry into results.
- Card orientation (upright/reversed) should be randomized per draw in the real app; the prototype hard-codes The Tower (reversed), The Star (upright), and Ten of Cups (upright) as sample data to demonstrate both chip states and give the results screen real interpretation copy to design around.
- The "Draw Cards" and "View Your Reading" buttons are wired to disabled/enabled visual states in the prototype but have no-op click handlers — they're presentational placeholders for real navigation.
