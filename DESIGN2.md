# Berta's Tarot — Design Document v2

**Theme: Arcanum (Occult Woodcut).** Antique manuscript / old grimoire: dark warm parchment tones, serif typography throughout (no sans-serif anywhere), sharp cut edges, no glow, a subtle full-page paper grain. The intent is "old occult book," not "modern app with a dark theme."

The concept in v1 was right. What had drifted were the tokens: a rule stating *"single accent — vivid saturated red, no secondary accent color anywhere"* was in practice carrying five hues — a red, two near-identical yellows, an antique gold, and a red-brown — each introduced as a documented exception to the rule it was breaking. v2 keeps the aesthetic and replaces that rule with one the app can actually obey.

> **The law: a colour may only carry its own role.** Vermilion acts. Gold illuminates. Ash warns. Nothing else colours anything.
>
> Vermilion never gilds; gold never acts; ash never emphasises. That is checkable in review, which "single accent, plus two exceptions" was not.

---

## 1. Colour

All colours are CSS custom properties defined once in `:root` (`frontend/src/index.css`) and consumed by reference — no hardcoded hex in component CSS.

### Paper & ink — unchanged from v1

| Token | Value | Use |
|---|---|---|
| `--paper` | `#0C0A08` | Page background |
| `--paper-2` | `#110E0A` | Panels, header, sidebar |
| `--paper-3` | `#16110C` | Nested surfaces — list items, pills |
| `--paper-wash` | `rgba(231,223,200,0.03)` | Faint ink-wash surface |
| `--ink` | `#E7DFC8` | Primary text |
| `--ink-dim` | `#9C917A` | Secondary text, captions, supporting body copy |
| `--ink-faint` | `#6E624C` | Disabled and metadata only — never running body copy |
| `--line` | `#3A3226` | Rules, borders |
| `--line-soft` | `#2A241A` | Dividers |

### Three signal families — one job each

**Vermilion — it acts.** Every interactive and every active state. If it can be clicked, chosen, or is currently selected, it is vermilion. Nothing decorative is.

| Token | Value |
|---|---|
| `--act` | `#F02B2B` |
| `--act-bright` | `#FF5C4D` — hover/emphasis |
| `--act-deep` | `#5C0F0F` — muted fills |
| `--act-wash` | `rgba(240,43,43,0.12)` |

**Gold — it illuminates.** Gilding, not action: the masthead, edges of floating panels, rules marking a passage as significant, hover on gold-bordered things. Never a button fill.

| Token | Value |
|---|---|
| `--gild` | `#C9A667` — sampled from the Berta's logo artwork |
| `--gild-bright` | `#F0C230` |
| `--gild-deep` | `#6B5426` |
| `--gild-wash` | `rgba(201,166,103,0.10)` |

**Ash — it warns.** Destruction only: delete a reading, log out. Deliberately duller than vermilion so it reads as a different *kind* of act, not a louder one.

| Token | Value |
|---|---|
| `--ash` | `#7A3226` |
| `--ash-bright` | `#9C4534` |
| `--ash-wash` | `rgba(122,50,38,0.14)` |

### Four contradictions, resolved

| Was | Now |
|---|---|
| Three separate yellows: `#FFD447` for panel glow, `#F0C230` for hover, `#C9A667` for the masthead only. | One gold family. `#C9A667` is the base (it came from the artwork, so it earns the seat); `#F0C230` is its bright. **`#FFD447` retired** — indistinguishable from the bright at panel-border scale. |
| Hover moved red → yellow, described as "distinct from the amber accent" — but the accent is red, not amber. The note outlived the palette it described. | Hover stays inside its own family and moves one step brighter: vermilion → `--act-bright`, gold → `--gild-bright`. Hue jumps on hover made the palette feel accidental. |
| The accent was `#F02B2B`, but its own dim and wash tints were mixed from a different red (`#C41E1E`) — a slightly cooler shade under every hover fill. | Every tint derives from its family base. `--act-wash` is the same red at 12%, so washes read as the accent dissolved into paper rather than a fourth colour. |
| Hierarchy carried entirely by fill vs. outline in one colour, with no way to mark "this is the primary act on the page." | Three tiers, still one colour — see §3, Buttons. |

---

## 2. Typography

All-serif, no sans-serif anywhere.

- **Latin headings:** `'IM Fell English SC'` → Palatino / Book Antiqua / Georgia
- **Latin body:** `'EB Garamond'` → Georgia / Times New Roman
- **Hebrew headings:** `'Noto Rashi Hebrew'` — semi-cursive script historically used for Kabbalistic and Talmudic commentary; reads as "mysterious old manuscript" rather than generic UI Hebrew
- **Hebrew body:** `'Frank Ruhl Libre'` — literary serif

Scale: body 17px / 1.6 · secondary 15px · label 13px at 0.2em tracking, uppercase · section heads 27px · page titles 40–44px.

The switch is automatic: any element (or descendant) with `dir="rtl"` picks up the Hebrew pairing via one global rule. Components never set fonts — they set `dir` from the current language.

**Hebrew density — changed.** v1 scaled *every* rem by 108% (`html[data-lang="he"]`), which moved layout as well as text and forced a handful of measurements to be pinned to px to survive the toggle. Hebrew now takes **+0.15 line-height and +1px body size on text elements only**. The density difference is a leading problem, not a scale problem; nothing in the frame moves when the language changes, and rem measurements come back.

---

## 3. Parts

**Buttons — three tiers, one colour.** Flat, bordered, uppercase, letter-spaced.

- **Primary:** solid `--act`, `--paper` label. Rationed to one per view. Hover → `--act-bright`.
- **Secondary:** transparent, 1px `--act` rule, `--ink` label. Hover → `--act-wash` fill, `--act-bright` label.
- **Tertiary:** no rule at all, `--ink-dim` label. Hover → `--ink`.
- **Destructive:** `--ash` rule, `--ash-bright` label, `--ash-wash` on hover. Otherwise identical in weight.
- **Disabled:** `--line-soft` rule, `--ink-faint` label.

Tertiary carrying no rule is what makes the secondary outline legible as a *rank* rather than as decoration.

**Nav.** Vertical stack: Home, Celtic Spread, Old Gypsy Spread (Three Cards), Tarot Deck, My Spreads (when logged in). Hidden on the logged-out home route. Active state is a 2px `--act` left rule plus `--act-wash` — the same pair used for every "currently selected" thing in the app.

**Floating widgets** (InterpretWidget, ConclusionModal, CombinationsModal). One shape: a `position: fixed` circular toggle that opens an adjacent panel; panel and toggle are independent siblings — not flexed together — so the toggle never moves when the panel opens. Panels take a `--gild` edge to mark them as floating over the page. **The controls inside stay vermilion:** the panel is gilded, its actions are not.

**Cards — the only rounded objects in the app.** Card faces get a radial vignette (transparent to `rgba(0,0,0,0.72)` at the edge) and `--radius-card: 4px`, identically across deck browser, homepage carousel, spread positions, and combination previews.

- `--line` rule = at rest
- `--gild` rule = chosen or open
- 55% opacity = not yet drawn

Keeping 4px only on card faces reads as intentional because it is tied to a *thing*, not a size: the frame is cut paper, the cards are objects sitting on it.

**Modals.** Dimmed overlay `rgba(0,0,0,0.75)`, centered box at `width: 90%` capped by a max-width. Used for card detail across deck, carousel, and both spreads.

**Background.** Fixed full-viewport SVG fractal-noise texture at `opacity: 0.06`, `mix-blend-mode: overlay`, `z-index: 9999` above page content — this is the aged-paper grain on every screen.

**Shape & motion.**

| Token | Value |
|---|---|
| `--radius` | `0` — sharp corners everywhere by default |
| `--radius-card` | `4px` — card faces only, no other exceptions |
| `--transition` | `0.2s` — the one shared duration |

---

## 4. Frame & breakpoints

Fixed header (`--header-height: max(7vh, 70px)`) over a two-column body: permanent left sidebar plus main content. App is `height: 100vh`, `overflow: hidden` at top level; pages scroll internally.

Header: circular logo mark top-left, title centered in `--gild`, language toggle + auth top-right. The title is pinned between the two side clusters with an ellipsis fallback, so it can never collide with either.

**Three tiers — a middle tier is new.**

| Tier | Width | Behaviour |
|---|---|---|
| Desk | ≥ 1024px | Sidebar 15%, min 190px. Full Celtic cross. |
| Table | 768–1023px | Sidebar becomes a 52px glyph rail. Cross staff moves under the cross as a 4-across row. |
| Hand | < 768px | Off-canvas nav below the header, near-full-width floating panels, cross as a vertical list below 560px. |

v1's single 768px cutoff is what made a 769px-wide "desktop" the hardest case in the app and drove several brittle hybrid `calc()` fixes. The middle tier costs one media query and retires them: the grid handles proportion, the tier handles the sidebar.

---

## 5. The Celtic cross — a grid, not formulas

v1 positioned the ten cards absolutely with hand-derived `calc(X% ± Ypx)` formulas, each tuned so gaps held as the window narrowed. It was named the most fragile part of the system. It does map onto a grid.

```
grid-template-columns: 1fr 1fr 1fr 0.3fr 0.72fr;   /* arms · arms · arms · breath · staff */
grid-template-rows: auto auto auto;
gap: 18px;
align-items: stretch;
```

- **Cross:** V above (r1c2), IV past (r2c1), I self (r2c2), VI future (r2c3), III below (r3c2). Cards hold shape with `aspect-ratio: 2/3`.
- **Crossing card (II)** is the only absolute element, positioned against its own parent at `top/left: 50%`, `width: 66%`, `rotate(90deg)` — not against the page.
- **Staff:** column 5 spanning all three rows, `flex-direction: column-reverse` (VII at the bottom, X at the top), `align-self: stretch`, children `flex: 1 1 0; min-height: 0` and **no aspect-ratio**. The staff fits the cross's height rather than driving it — the narrower track and flex-fill are what keep the cross tight; give the staff its own aspect-ratio cards and it inflates the rows.
- **Gaps** are a single `gap` value, so they cannot drift out of proportion with each other — which was the entire failure mode the hand-derived formulas were compensating for.

Narrow: at Table the staff becomes a 4-across row under the cross (two line changes). Only below 560px does it become the vertical list. The cross shape survives much further down than in v1.

---

## 6. Migration — what the codebase should retire

The per-page accent aliases already all resolve to one value, so they cost nothing at runtime — but they are *why* the palette drifted, because each one still reads like a licence to add a colour. One find-and-replace pass, then delete them.

| Retire | Replace with | Note |
|---|---|---|
| `--celtic-accent`, `--threecards-accent`, `--deck-accent` | `--act` | Pages are distinguished by content, not hue. |
| `--gold`, `--berta-gold`, `--accent-glow`, `--accent-hover` | `--gild`, `--gild-bright` | Four tokens, two distinguishable colours. |
| `--purple` and other dead hues | delete | No reference should survive the pass. |
| `--no-glow` and every `box-shadow` using it | delete the declaration | A token whose job is to be invisible hides how many shadows remain. |
| `html[data-lang="he"] { font-size: 108% }` and the px pins it forced | per-element leading (§2) | Frame stops moving on language toggle; rem measurements come back. |
| `--accent-dim` / `--accent-wash` mixed from `#C41E1E` | `--act-deep` / `--act-wash` | Tints must derive from their family base. |

---

## 7. Review checklist

Five questions that catch the drift v1 accumulated:

1. Does every coloured element belong to exactly one family, doing that family's job?
2. Is there exactly one primary (solid vermilion) action in the view?
3. Does anything hover across hue families?
4. Is any rounded corner not a card face?
5. Does any running body copy use `--ink-faint`?
