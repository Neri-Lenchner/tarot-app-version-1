# tarot-app CSS — full change plan

Everything in one file. Each step is self-contained: **file path → action → exact
content**. Do them in order; stop anywhere and the app still works.

I can read your folder but not write to it, so this is copy-paste. Steps 1–4 are
find-and-replace only (no new files) — start there.

---

- [Step 1 — delete the dead token layer](#step-1) · ~30 lines, 0 risk
- [Step 2 — `100vh` → `100dvh`](#step-2) · 6 edits
- [Step 3 — extract the repeated page background](#step-3) · 5 files
- [Step 4 — fix the grain-overlay z-index stack](#step-4) · removes 3 hacks
- [Step 5 — give scrollbars back](#step-5) · 2 edits
- [Step 6 — CSS Modules](#step-6) · the big one, new files
- [Step 7 — shared CardModal](#step-7) · removes ~150 lines
- [Step 8 — palette decisions](#step-8) · needs your judgment

---

<a id="step-1"></a>
## Step 1 — delete the dead token layer

**File: `src/index.css`**

I grepped every legacy alias. Results:

**Provably unused — zero references anywhere in the app:**

```
--bg-dark        --gold            --celtic-accent      --threecards-accent
--bg-mid         --gold-rgb        --celtic-accent-rgb  --threecards-accent-rgb
--purple         --gold-glow       --celtic-glow        --threecards-glow
--purple-dark                      --celtic-border      --threecards-border
--purple-bg                        --celtic-bg-dark     --threecards-bg-dark
--purple-surface                   --celtic-bg-mid      --threecards-bg-mid
--purple-border
--deck-accent    --deck-accent-rgb  --deck-border  --deck-bg-dark  --deck-bg-mid
```

**Still referenced, 4 lines total:**

| Token | Where | Fix |
|---|---|---|
| `--deck-glow` | `TarotCardContainer.css` :52, :58 | delete the `, 0 0 6px var(--deck-glow)` / `, 0 0 18px var(--deck-glow)` segment from each box-shadow |
| `--no-glow` | `ConclusionModal.css` :26 | delete the `--conclusion-glow: var(--no-glow);` line |
| `--no-glow` | `InterpretWidget.css` :18 | delete the `--glow-color: var(--no-glow);` line |

Neither `--conclusion-glow` nor `--glow-color` is read by anything after those
lines go, so they can just disappear.

**Keep** `--text-primary`, `--text-muted`, `--text-faint`, `--card-desc-color` —
those are genuine semantic aliases used in 30+ places, not legacy cruft.

### Do this

**1a.** In `src/index.css`, delete everything from the comment
`/* ── Legacy semantic aliases ── */` down to (but not including) the
`/* Destructive actions only... */` comment — **except** these four lines, which
you keep:

```css
    --text-primary: var(--ink);
    --text-muted: var(--ink-dim);
    --text-faint: var(--ink-faint);
    --card-desc-color: var(--ink);
```

**1b.** Also delete the `--no-glow` declaration and its 4-line comment higher up:

```css
    /* Arcanum is flat and inky — no glow. Kept as a token (rather than
       stripping every box-shadow reference across every component file)
       so every existing var(--x-glow) usage resolves to nothing. */
    --no-glow: rgba(0, 0, 0, 0);
```

**1c.** `src/components/tarot-card/TarotCardContainer.css` — two box-shadows:

```css
/* was: box-shadow: 0 2px 12px rgba(0, 0, 0, 0.7), 0 0 6px var(--deck-glow); */
box-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);

/* was: box-shadow: 0 10px 28px rgba(0, 0, 0, 0.85), 0 0 18px var(--deck-glow); */
box-shadow: 0 10px 28px rgba(0, 0, 0, 0.85);
```

**1d.** `ConclusionModal.css` — delete line 26. The rule becomes:

```css
.conclusion-modal.theme-green,
.conclusion-modal.theme-blue {
    --conclusion-accent: var(--accent);
    --conclusion-accent-rgb: 240, 43, 43;
    --conclusion-border: var(--line);
}
```

**1e.** `InterpretWidget.css` — delete line 18. The rule becomes:

```css
.interpret-widget.theme-green,
.interpret-widget.theme-blue {
    --accent-rgb: 240, 43, 43;
    --bg: var(--bg-2);
    --border: var(--line);
    --header-bg: var(--bg-3);
}
```

**Verify:** nothing should change visually. Search the project for `--no-glow`,
`--gold`, `--purple`, `--celtic-accent`, `--deck-glow` — all should return zero hits.

---

<a id="step-2"></a>
## Step 2 — `100vh` → `100dvh`

On mobile Safari, `100vh` includes the browser chrome, so the bottom of the
page gets cut off. `dvh` is the dynamic version that accounts for it.

Replace in these 6 places:

| File | Rule | Change |
|---|---|---|
| `App.css` | `.App` | `height: 100vh` → `100dvh` |
| `App.css` | `section` | `calc(100vh - ...)` → `calc(100dvh - ...)` |
| `App.css` | `.side-bar` (mobile) | `max-height: calc(100vh - ...)` → `calc(100dvh - ...)` |
| `Auth.css` | `.auth-page` | `calc(100vh - ...)` → `calc(100dvh - ...)` |
| `CelticSpread.css` | `.spread-container` | `min-height: calc(100vh - ...)` → `calc(100dvh - ...)` |
| `ThreeCardsSpread.css` | `.three-cards-spread-container` | `height: calc(100vh - ...)` → `calc(100dvh - ...)` |

Leave `85vh` / `80vh` / `75vh` / `35vh` on the modals — those are intentional
proportions, not full-height layout, and `vh` is fine there.

---

<a id="step-3"></a>
## Step 3 — extract the repeated page background

This exact block appears in **5 files**:

```css
background:
    radial-gradient(ellipse at center, rgba(12, 10, 8, 0.35) 0%, rgba(12, 10, 8, 0.97) 75%),
    url('/mystic-image-3.png') center/cover no-repeat;
```

**3a.** Add to `src/index.css`, inside `:root`, near the background tokens:

```css
    /* The shared "mystic" page background — HomePage, MySpreads,
       SpreadDetails, TarotDeck, Celtic and ThreeCards all use this. */
    --page-bg:
        radial-gradient(ellipse at center, rgba(12, 10, 8, 0.35) 0%, rgba(12, 10, 8, 0.97) 75%),
        url('/mystic-image-3.png') center/cover no-repeat;

    /* Danger hover wash — was hardcoded as rgba(122, 50, 38, 0.18) in 4 places */
    --danger-wash: rgba(122, 50, 38, 0.18);
```

**3b.** Replace the 3-line block with `background: var(--page-bg);` in:

- `home-route/HomePage.css` → `.home-page-container`
- `my-spreads/MySpreadsPage.css` → the `.my-spreads-page, .spread-details-page` rule
- `tarot-deck-route/tarot-deck/TarotDeck.css` → `.tarot-deck-container`
- `celtic-spread-route/.../CelticSpread.css` → `.spread-container`
- `three-cards-spread-route/.../ThreeCardsSpread.css` → `.three-cards-spread-container`

In `MySpreadsPage.css` this also lets you merge the two stacked
`.my-spreads-page, .spread-details-page` rules into one.

**3c.** Replace `background: rgba(122, 50, 38, 0.18);` with
`background: var(--danger-wash);` in 4 places:

- `MySpreadsPage.css` → `.my-spread-delete-btn:hover`
- `Header.css` → `.header-logout:hover`
- `SideBar.css` → `.sidebar-logout:hover`
- (grep `122, 50, 38` to catch any I missed)

---

<a id="step-4"></a>
## Step 4 — fix the grain-overlay z-index stack

`body::before` (the paper grain) sits at `z-index: 9999` with
`mix-blend-mode: overlay`. Because it's above everything, the mobile nav had to
fight it — that's where `z-index: 10000`, `isolation: isolate` and
`transform: translateZ(0)` in `App.css` came from.

At `opacity: 0.06` the grain gains nothing from being above the UI.

**4a.** `src/index.css` — in `body::before`, change:

```css
    z-index: 9999;
```

to:

```css
    /* Below the UI, not above it. At 0.06 opacity there's no visible
       difference, and it stops the blend mode reaching into fixed
       layers above it (see App.css .side-bar). */
    z-index: 0;
```

**4b.** `src/App.css` — in the mobile `.side-bar` rule, delete these three
declarations and their comments:

```css
    z-index: 10000;          /* → change to z-index: 10 */
    transform: translateZ(0);  /* delete */
    isolation: isolate;        /* delete */
```

Keep `background: var(--bg-2);` — an opaque background on the overlay is
correct regardless.

**Verify:** open the mobile nav over the Celtic spread. The h5 position labels
should not bleed through. If they do, put `z-index: 10000` back on `.side-bar`
(but you should still be able to drop `isolation` and `translateZ`).

---

<a id="step-5"></a>
## Step 5 — give scrollbars back where content is long

`index.css` currently hides every scrollbar app-wide:

```css
*::-webkit-scrollbar { display: none; }
html { scrollbar-width: none; }
```

That's then re-declared redundantly on ~8 more elements. The cost: on the
78-card deck and the spread-details page, users get no cue that content
continues.

I'd keep it hidden on the carousel (ambient, non-interactive) and restore it
where content actually scrolls.

**5a.** `src/index.css` — replace the global hide with a scoped one:

```css
/* Hidden only where a scrollbar would be visual noise — the ambient
   carousel and the small floating panels. Long-form scrollers keep theirs. */
.carousel-viewport::-webkit-scrollbar,
.conclusion-body::-webkit-scrollbar,
.iw-body::-webkit-scrollbar {
    display: none;
}

.carousel-viewport,
.conclusion-body,
.iw-body {
    scrollbar-width: none;
}
```

**5b.** Then delete the now-redundant per-element hides in:
`Routing.css`, `MySpreadsPage.css`, `TarotDeck.css`, `CardCarousel.css`
(`.card-modal`), `CelticSpread.css`, `ThreeCardsSpread.css`,
`CombinationsModal.css`.

**5c.** Optional — style the restored scrollbar so it reads as part of the
palette rather than an OS default. Add to `index.css`:

```css
html {
    scrollbar-width: thin;
    scrollbar-color: var(--line) transparent;
}

*::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

*::-webkit-scrollbar-track {
    background: transparent;
}

*::-webkit-scrollbar-thumb {
    background: var(--line);
    border: 2px solid transparent;
    background-clip: content-box;
}

*::-webkit-scrollbar-thumb:hover {
    background: var(--ink-faint);
    background-clip: content-box;
}
```

---

<a id="step-6"></a>
## Step 6 — CSS Modules

**The actual bug fix.** Vite flattens every imported CSS file into one global
stylesheet, and you have the same class names with *different values* in
multiple files:

| Class | Defined in | Conflict |
|---|---|---|
| `.card` | Celtic, ThreeCards | `height: 130px` vs unset |
| `.card-vignette` | Celtic, ThreeCards, + wrappers | identical, but 3 copies |
| `.card-modal` + 6 children | Carousel, Deck, Celtic, ThreeCards | 4 copies |
| `.ready-question*` | Celtic, ThreeCards | different padding/width/wrap |
| `.card-container` | ThreeCards | vs Celtic's `.card-container-1..10` |

Last-one-wins in bundle order decides which route gets which. **You already hit
this** — the `transform: none` blocker in `CelticSpread.css` with its 8-line
comment is a hand-patch for exactly this leak. It won't be the last one.

Renaming to `*.module.css` hashes each class per-file. No Vite config needed.

### The pattern

```tsx
// before
import './ThreeCardsSpread.css';
<div className="ready-question">

// after
import styles from './ThreeCardsSpread.module.css';
<div className={styles.readyQuestion}>
```

### Three gotchas

**1. Bare element selectors are still global.** Only class names get hashed. So
`h2 { }` in a module still hits every `h2` in the app. Always give it a local
ancestor:

```css
/* wrong — still global */
h2 { color: var(--accent); }

/* right */
.container h2 { color: var(--accent); }
```

**2. Classes matched from outside must stay unhashed.** `modal-widget-root` is
queried from elsewhere, so keep it as a plain string:

```tsx
<div className={`${styles.overlay} modal-widget-root`}>
```

(Or write `:global(.modal-widget-root)` in the CSS.)

**3. Dynamic class names need bracket access.** Celtic builds its class name
from the loop index:

```tsx
// before
className={`card-container-${i + 1}`}

// after
className={styles[`cardContainer${i + 1}`]}
```

That works, but it's stringly-typed — TypeScript won't catch a typo. Safer:

```tsx
const CARD_POSITIONS = [
    styles.cardContainer1, styles.cardContainer2, styles.cardContainer3,
    styles.cardContainer4, styles.cardContainer5, styles.cardContainer6,
    styles.cardContainer7, styles.cardContainer8, styles.cardContainer9,
    styles.cardContainer10,
];
// then
className={CARD_POSITIONS[i]}
```

### What you get to delete afterwards

Once **both** spread routes are modules:

- `CelticSpread.css`: the `transform: none` declaration + its 8-line comment
- `CelticSpread.css`: every `.spread-container ` specificity prefix (11 rules) —
  they exist only to out-specify ThreeCards
- `CelticSpread.css`: the 8-line comment block explaining bundle order
- ThreeCards' and Celtic's duplicate `.card-vignette` / `.card-modal*` blocks
  (see step 7)

### Conversion order

1. **ThreeCardsSpread** — smallest of the two, do it first as a dry run
2. **CelticSpread** — this is what unlocks the deletions above
3. **TarotDeck** + **CardCarousel** — mostly deletion once step 7 lands
4. **Header, SideBar, Auth, MySpreads, SpreadHeader, InterpretWidget,
   CombinationsModal, ConclusionModal** — unique names, so this is hygiene not
   bug-fixing. Whenever.

**Leave global:** `index.css` (tokens, resets, `body::before`) and `App.css`
(app shell). Those *should* be global.

### Renaming map — ThreeCardsSpread

```
.three-cards-spread-container  → .container
.card-container                → .cardContainer
.card-vignette                 → .cardVignette
.card                          → .card
.ready-questions-stack         → .readyQuestionsStack
.ready-questions-title         → .readyQuestionsTitle
.ready-question                → .readyQuestion
.ready-question-warning        → .readyQuestionWarning
h2 (bare)                      → .container h2
.card-modal*                   → deleted, see step 7
```

### Renaming map — CelticSpread

```
.spread-container              → .container
.card-container-1 … -10        → .cardContainer1 … .cardContainer10
.card-vignette                 → .cardVignette
.card                          → .card
.spread-container h5           → .container h5
.spread-container .ready-*     → .readyQuestionsStack / .readyQuestionsTitle
                                 / .readyQuestion / .readyQuestionWarning
                                 (drop the .spread-container prefix)
.card-modal*                   → deleted, see step 7
```

Note `CelticSpreadGlobal.css` keeps its `.spread-question-*` rules — those are
scoped to `.celtic-spread-container` and don't collide once the inner file is a
module. Convert it later in pass 4 if you like.

---

<a id="step-7"></a>
## Step 7 — one shared CardModal

Four copies of the same ~50-line modal live in `CardCarousel.css`,
`TarotDeck.css`, `CelticSpread.css` and `ThreeCardsSpread.css`. They differ only
in which optional parts they use:

| | header row | position line | EN/HE toggle |
|---|---|---|---|
| Carousel, Deck | – | – | – |
| Celtic, ThreeCards | ✓ | ✓ | ✓ |

Those are props, not stylesheets.

### New file: `src/components/general-components/CardModal/CardModal.module.css`

```css
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: var(--bg-2);
    border: 1px solid var(--line);
    padding: 32px;
    max-width: 480px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    color: var(--text-primary);
    position: relative;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.langBtn {
    background: none;
    border: 1px solid var(--line);
    color: var(--accent);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 3px 8px;
    cursor: pointer;
    transition: border-color var(--transition), color var(--transition);
}

.langBtn:hover {
    border-color: var(--accent-hover);
    color: var(--accent-hover);
}

.close {
    position: absolute;
    top: 12px;
    right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--accent);
    font-size: 18px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity var(--transition);
}

.close:hover {
    opacity: 1;
}

.name {
    margin: 0 0 4px;
    color: var(--accent-bright);
    font-size: 28px;
}

.position {
    margin: 0 0 20px;
    color: var(--text-muted);
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.meaning {
    margin: 0 0 16px;
    line-height: 1.7;
    font-size: 19px;
    color: var(--card-desc-color);
}

.desc {
    margin: 0;
    line-height: 1.7;
    font-size: 18px;
    color: var(--text-primary);
}
```

### New file: `src/components/general-components/CardModal/CardModal.tsx`

```tsx
import { JSX, ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./CardModal.module.css";

interface Props {
    /** Card title shown at the top. */
    name?: string;
    /** Optional uppercase position line under the name (Celtic / ThreeCards). */
    position?: string;
    /** Body text direction — 'rtl' when showing Hebrew. */
    dir?: "ltr" | "rtl";
    /** Render the EN/HE toggle. Omit both to hide it (Carousel / Deck). */
    langLabel?: string;
    onLangToggle?: () => void;
    onClose: () => void;
    children: ReactNode;
}

export function CardModal({
    name,
    position,
    dir = "ltr",
    langLabel,
    onLangToggle,
    onClose,
    children,
}: Props): JSX.Element {
    return (
        // `modal-widget-root` stays a plain global string — it is matched
        // from outside this component, so it must NOT be hashed.
        <div className={`${styles.overlay} modal-widget-root`} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <button className={styles.close} onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                    {langLabel && onLangToggle && (
                        <button className={styles.langBtn} onClick={onLangToggle}>
                            {langLabel}
                        </button>
                    )}
                </div>
                {name && <h3 className={styles.name}>{name}</h3>}
                {position && (
                    <p className={styles.position} dir={dir}>
                        {position}
                    </p>
                )}
                <div dir={dir}>{children}</div>
            </div>
        </div>
    );
}

/** Body-text classes, so callers style their paragraphs from this file
 *  instead of re-declaring .card-modal-meaning / -desc per route. */
export const cardModalText = {
    meaning: styles.meaning,
    desc: styles.desc,
};
```

### Call site — Celtic / ThreeCards

Replace the whole `{selectedIndex !== null && ( ... )}` block with:

```tsx
{selectedIndex !== null && (
    <CardModal
        name={selectedCard?.name}
        position={translatePosition(positions[selectedIndex], modalLang)}
        dir={modalLang === 'he' ? 'rtl' : 'ltr'}
        langLabel={hasBoth ? (modalLang === 'en' ? 'HE' : 'EN') : undefined}
        onLangToggle={hasBoth ? () => setModalLang(l => l === 'en' ? 'he' : 'en') : undefined}
        onClose={() => setSelectedIndex(null)}
    >
        {cardSection ? (
            <p className={cardModalText.desc}>{cardSection}</p>
        ) : selectedApiCard ? (
            <>
                <p className={cardModalText.meaning}>
                    <strong>{translate('meaning', modalLang)}</strong>{' '}
                    {modalLang === 'he'
                        ? (selectedApiCard.meaning_up_he ?? selectedApiCard.meaning_up)
                        : selectedApiCard.meaning_up}
                </p>
                <p className={cardModalText.desc}>
                    {modalLang === 'he'
                        ? (selectedApiCard.desc_he ?? selectedApiCard.desc)
                        : selectedApiCard.desc}
                </p>
            </>
        ) : (
            <p className={cardModalText.meaning}>{translate('noDetails', modalLang)}</p>
        )}
    </CardModal>
)}
```

You can then drop `import {X} from "lucide-react"` from both spread files if
nothing else in them uses it.

### Call site — Carousel / Deck

Same, minus the optional props:

```tsx
<CardModal name={card.name} onClose={() => setSelected(null)}>
    <p className={cardModalText.meaning}>…</p>
    <p className={cardModalText.desc}>…</p>
</CardModal>
```

### Then delete

All `.card-modal`, `.card-modal-overlay`, `.card-modal-header`,
`.card-modal-close`, `.card-modal-lang-btn`, `.card-modal-name`,
`.card-modal-position`, `.card-modal-meaning`, `.card-modal-desc` rules from
**all four** of `CardCarousel.css`, `TarotDeck.css`, `CelticSpread.css`,
`ThreeCardsSpread.css`. That's roughly 150 lines gone.

---

<a id="step-8"></a>
## Step 8 — palette decisions (your call, not mechanical)

`index.css` says *"Single accent — vivid saturated red. No secondary accent
color anywhere."* The app actually ships:

| Value | Role | Where |
|---|---|---|
| `#F02B2B` | accent | everywhere |
| `#FF5C4D` | accent-bright (coral) | titles, links |
| `#FFD447` | accent-glow (yellow) | **every** floating panel's border + glow |
| `#F0C230` | accent-hover (gold) | every hover state |
| `#C9A667` | berta-gold | header title only |
| `#7A3226` / `#9C4534` | danger | logout, delete |
| `#4A7C59` | green | `.my-spread-type.celtic` |
| `#3A6EA5` | blue | `.my-spread-type.three-cards` |
| `#39FF14` | neon green | `.ready-question-warning` |

Nothing wrong with a wider palette — but the comments claim a discipline the
code doesn't keep, which is worse than not claiming it. Four things I'd change:

**8a. `--accent-hover: #F0C230` is the clearest bug.** Its own comment says
*"hovering an orange button visibly shifts toward gold-leaf yellow"* — but the
accent is pure red, not orange. So every hover jumps red → yellow, which reads
as a *different button*, not a hover state. Conventional fix is a lighter or
desaturated version of the accent:

```css
--accent-hover: #FF6B5A;   /* lighter red — same hue family */
```

**8b. `#39FF14` is the one value that genuinely breaks the aesthetic.** A
video-game neon green with a glow, in an antique-manuscript palette. Use the
gold instead — it still reads as "alert" against the red UI without leaving the
period:

```css
color: var(--accent-glow);
text-shadow: 0 0 6px rgba(var(--accent-glow-rgb), 0.6);
```

**8c. `--accent-glow` yellow on *every* floating panel border.** InterpretWidget,
ConclusionModal, CombinationsModal and the `.my-spread-item` list rows all get
the same yellow border + double glow. Nothing is emphasised because everything
is. I'd keep the glow on the *toggle buttons* only (they're the call to action)
and give the panels a plain `1px solid var(--line)` like the card modal has.

**8d. The green/blue spread badges** are the only two hues in the app with no
token and no system. Either promote them to real tokens with names
(`--spread-celtic` / `--spread-three`), or drop the color and distinguish them
typographically — they're already uppercase letterspaced labels, which is
enough.

Then rewrite the top-of-file comment to describe what's actually there.

---

## Not recommended yet

**Celtic cross → CSS grid.** 10 absolutely-positioned containers with
hand-measured widths and `right: calc(35% - 126px)`. A grid with named areas
would express the shape declaratively — but it currently works, it's the highest
effort item here, and the comments are genuinely good. Revisit only when you
change the layout or add a spread.

**The Hebrew px pinning.** `font-size: 35.2px`, `11.2px`, `min-width: 205px /
278px / 90px` — a dozen brittle "measured" numbers, all caused by
`html[data-lang="he"] { font-size: 108% }` scaling everything by rem so each
element that mustn't grow needs a px escape hatch. The right fix is a
`--font-scale` token applied to body-text selectors only, so nothing needs
exempting. But it touches every file, and the current version works. Fold it in
next time you touch typography.

**The centering transform.** `.home-hero` and `.my-spreads-title` use
`translateX(calc(var(--sidebar-width) / -2))` to fake viewport-centering from
inside `main`. It's already been copy-pasted once, and it can push text under
the sidebar at narrow desktop widths. But the fix depends on a question only you
can answer: **should the hero center on the viewport, or on the content column
next to the sidebar?** Decide that first — then it's a one-line change and the
transform disappears. Don't refactor before deciding.

---

## Suggested sessions

**Session 1 (~1 hour, zero risk):** steps 1, 2, 3, 4, 5. All find-and-replace,
no new files, nothing should look different except the scrollbars.

**Session 2 (half a day):** step 6 on ThreeCards, then step 7, then step 6 on
Celtic — in that order, so the modal is already extracted when you convert the
file with the most duplication.

**Session 3 (whenever):** step 6 on the remaining 8 files, step 8 when you feel
like making palette calls.
