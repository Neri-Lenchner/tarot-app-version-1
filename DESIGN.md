# Berta's Tarot — Design Document

A tarot reading web app: a 10-card Celtic cross spread, a 3-card spread, a full 78-card deck browser, AI-generated readings (English + Hebrew), and saved reading history. Frontend is React 19 + TypeScript + Vite; this document covers the **visual/UI design system only**, not application architecture.

## 1. Concept

The visual theme is called **"Arcanum (Occult Woodcut)"** — an antique manuscript / old grimoire aesthetic: dark warm parchment tones, serif typography throughout (no sans-serif anywhere), sharp flat edges (no rounded corners, no glow), and a subtle full-page paper-grain texture. The intent is "old occult book," not "modern app with a dark theme."

## 2. Color System

All colors are CSS custom properties defined once in `:root` (`frontend/src/index.css`), consumed everywhere else by reference — no hardcoded hex values in component CSS.

**Backgrounds** (near-black, warm, three levels of depth):
- `--bg: #0C0A08` — page background
- `--bg-2: #110E0A` — panels, header, sidebar
- `--bg-3: #16110C` — nested surfaces (list items, pills)
- `--bg-surface: rgba(231, 223, 200, 0.03)` — faint ink-wash surface

**Text** ("ink on parchment"):
- `--ink: #E7DFC8` — primary text
- `--ink-dim: #9C917A` — secondary/muted text
- `--ink-faint: #6E624C` — disabled/faint text

**Lines/borders:**
- `--line: #3A3226`
- `--line-soft: #2A241A`

**Accent — deliberately singular.** The design rule, stated directly in the CSS comments, is: *"Single accent — vivid saturated red. No secondary accent color anywhere."*
- `--accent: #F02B2B` — the one accent color, used for all interactive/highlighted elements
- `--accent-bright: #FF5C4D` — brighter variant (titles, emphasis)
- `--accent-glow: #FFD447` — a vivid yellow, used *only* for floating panel borders/glow (modals, widgets)
- `--accent-hover: #F0C230` — hover feedback, a true yellow distinct from the amber accent, so hovering visibly shifts warmer
- `--accent-dim: #5C0F0F`, `--accent-wash: rgba(196, 30, 30, 0.12)` — muted/background tints of the accent

Two **deliberate, documented exceptions** to the single-accent rule:
- `--berta-gold: #C9A667` — an antique gold sampled directly from the Berta's logo artwork, used *only* for the header title text.
- `--danger` / `--danger-bright` (`#7A3226` / `#9C4534`) — muted red-browns for destructive actions (logout, delete), kept deliberately duller than the main accent so they read as a different signal without introducing a second bright color.

**Legacy aliases:** the codebase was originally written with per-page accent tokens (`--celtic-accent`, `--threecards-accent`, `--deck-accent`, `--gold`, `--purple`, etc.), left over from an earlier multi-color design. Rather than rename every reference across every component file, all of these now simply resolve through `var(--accent)` (or `var(--no-glow)` for what used to be page-specific glow colors). Functionally there is only one accent color in the app today; the old names are just plumbing.

**Shape & motion:**
- `--radius: 0` — sharp corners everywhere by default
- `--radius-sm: 4px` — the one exception: a small rounding applied specifically to tarot card images (deck browser, carousel, spread cards, combination previews) for a slightly softer card-object feel
- `--transition: 0.2s` — the one shared transition duration
- `--no-glow: rgba(0,0,0,0)` — kept as a token specifically so old `box-shadow: var(--x-glow)` references across many files resolve to nothing, without having to strip every box-shadow declaration individually

## 3. Typography

All-serif pairing, no sans-serif anywhere in the app:
- **Headings:** `'IM Fell English SC'` (a blackletter-adjacent display serif) → falls back to Palatino/Book Antiqua/Georgia
- **Body:** `'EB Garamond'` → Georgia/Times New Roman

**Hebrew typography** gets its own dedicated pairing rather than reusing the Latin fonts with a Hebrew fallback:
- **Hebrew heading:** `'Noto Rashi Hebrew'` — a semi-cursive script historically used for Kabbalistic/Talmudic commentary, chosen specifically to read as "mysterious old manuscript" rather than generic UI Hebrew
- **Hebrew body:** `'Frank Ruhl Libre'`, a literary serif

The font switch is fully automatic: any element (or descendant of an element) with `dir="rtl"` picks up the Hebrew font pairing via a single global CSS rule — components never set fonts directly, they just set `dir` based on the current language.

**Hebrew sizing compensation:** Hebrew text visually reads smaller than Latin at an identical `rem` size, so the root `html[data-lang="he"]` gets `font-size: 108%`, scaling every `rem`-based measurement app-wide together. (A handful of specific measurements — e.g. the header title, Celtic spread card-position labels — are deliberately pinned to fixed `px` instead of `rem` where this bump previously caused layout shifts on language toggle.)

## 4. Layout

**Frame:** fixed-height header (`--header-height: max(7vh, 70px)`) + a two-column body below it — a permanent left sidebar (`--sidebar-width: 15%`) and a main content area filling the rest. The whole app is `height: 100vh` with `overflow: hidden` at the top level; individual pages scroll internally where needed.

**Header:** Berta's circular logo mark (top-left, absolutely positioned), the app title centered, and a language toggle + auth controls (top-right, absolutely positioned). Below ~900px-wide desktop windows the title is pinned between the two side clusters (rather than naively centered against the full width) with an ellipsis fallback, so it can never run into either side.

**Sidebar:** a vertical stack of nav links (Home, Celtic Spread, Old Gypsy Spread [Three Cards], Tarot Deck, My Spreads when logged in). Hidden entirely on the logged-out home route.

**Responsive breakpoint: a single hard cutoff at 768px.** Above it is "desktop" (permanent sidebar, absolutely-positioned hand-tuned layouts). At or below it, the app switches to a mobile presentation:
- Sidebar becomes a hamburger-triggered off-canvas overlay (slides down below the header, full width)
- The 10-card Celtic cross (see §6) collapses from its absolute cross layout into a simple vertical stacked list
- Floating widgets (see §5) go from fixed small panels to near-full-viewport-width panels
- Header title/logo/auth shrink and reflow

There is intentionally **no intermediate tablet-specific breakpoint** — the desktop layout (769px and up) is expected to hold together on its own down to that boundary, which has driven several of the more fiddly CSS fixes (see §7).

## 5. Component Patterns

**Floating widgets** (InterpretWidget, ConclusionModal, CombinationsModal) share one shape: a `position: fixed` circular toggle button (bottom-right / bottom-center / center-left respectively) that opens an adjacent panel. The panel and the toggle button are independent siblings — not flexed together — so the toggle button never moves when the panel opens or closes. Panels use the yellow `--accent-glow` for their border/glow treatment, distinguishing them as "floating over the page" rather than being page content.

**Cards:** tarot card images get a consistent vignette treatment (radial-gradient dark fade at the edges) plus the `--radius-sm` rounding, used identically across the deck browser, the homepage carousel, spread positions, and combination previews.

**Modals:** a dimmed full-screen overlay (`rgba(0,0,0,0.75)`) with a centered content box, `width: 90%` capped at a `max-width`, used for card-detail popups across the deck browser, carousel, and both spreads.

**Buttons:** flat, bordered, uppercase, letter-spaced labels — no fills except on hover/active (accent-wash background) or for a couple of primary CTAs (solid accent background, e.g. Register). Destructive actions (logout/delete) use the muted `--danger` palette instead of the main accent, and are otherwise styled identically to keep visual weight consistent.

**Background:** a fixed, full-viewport, very low-opacity (`0.06`) SVG fractal-noise texture with `mix-blend-mode: overlay`, sitting at the very top of the stacking order (`z-index: 9999`) above all normal page content — this is what gives the "aged paper" texture across every screen. Several spread/page containers additionally use a radial-gradient + starfield/mystic background image combination for a "cosmic" depth effect behind the cards.

## 6. The Celtic Cross — a special case

The 10-card Celtic cross layout is hand-tuned, absolutely-positioned pixel/percentage-hybrid CSS (not a grid or flex layout) — each of the 10 card positions and the "ready questions" panel has its own bespoke `top`/`right` formula, because the traditional Celtic cross shape (a 6-card cross plus a 4-card vertical "staff" column, offset to the side) doesn't map cleanly onto any standard CSS layout primitive.

This has been the single most fragile part of the design system this session: naive percentage-only positioning looks fine at one viewport width but silently overlaps or drifts at another, since different elements' offsets don't scale proportionally against each other by default. The current approach uses `calc(X% ± Ypx)` hybrid formulas specifically derived so that the *gap* between adjacent elements stays roughly constant in pixels regardless of container width, rather than the raw percentages (which would shrink toward zero, and eventually overlap, as the window narrows). Below 768px this entire layout is abandoned in favor of a plain vertical stacked list — it was judged not worth trying to make the cross shape itself responsive.

## 7. Known Tensions / Open Questions

Things a design review might reasonably push back on:

- **Single hard breakpoint, no tablet tier.** Several fixes this session existed specifically to make the desktop layout hold together all the way down to 769px (a very narrow "desktop" window). This works today via hybrid calc() formulas rather than a cleaner intermediate layout, and is inherently a bit brittle to future content changes (e.g. longer translated strings).
- **Bespoke absolute positioning for the Celtic cross** is hard to maintain and doesn't generalize — any future change to the cross's proportions requires re-deriving several interlocking formulas by hand.
- **The single-accent rule** (one red, used for everything interactive) is a strong, consistent choice, but means there's no visual differentiation between e.g. "primary action" and "secondary action" beyond fill vs. outline — worth a second opinion on whether that's enough hierarchy.
- **Two exceptions already exist** to the single-accent rule (the berta-gold header title, the muted danger palette) — worth asking whether a design system that already has two hand-picked exceptions actually wants a slightly larger, deliberate secondary palette instead of ad-hoc one-offs.
- **Sharp corners everywhere except card images** is a confident aesthetic choice (fits the "woodcut" concept) but is unusual for a modern web app and worth a fresh set of eyes on whether it reads as "intentional and antique" or "unfinished."
