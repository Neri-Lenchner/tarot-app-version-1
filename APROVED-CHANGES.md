# Approved changes — for the CLI

Only the items the user approved — display review items **02, 05, 06, 09, 10**.
**Do not touch anything else**, including the unapproved review items (01, 03,
04, 07, 08) and the withdrawn step 4 in `CSS-CHANGES.md`.

## Already done — skip these

The user ticked CSS steps 1, 2 and 7, but I checked the live codebase and all
three are already applied:

- **Step 1** — legacy tokens gone from `index.css`; no `--gold` / `--purple` /
  `--no-glow` / `--deck-glow` references remain.
- **Step 2** — all 6 `100vh` are now `100dvh` (`App.css` ×3, `Auth.css`,
  both spread modules).
- **Step 7** — `general-components/CardModal/` exists and all four call sites
  (CardCarousel, TarotDeck, CelticSpread, ThreeCardsSpread) use
  `<CardModal>` + `cardModalText`.

Also already done though not ticked: **step 3** (`--page-bg`, `--danger-wash`)
and **step 6** (both spread files are `.module.css`).

So there are **five things left**, all from the display review.

---

## ⚠ Order matters — do item 5 (09) before item 2 (05)

**09 is now approved** and it must land *first*. Shipping the focus rings while
`onFocus` still clears the spread turns an unlucky-click bug into one a keyboard
user hits on the way past. Do 09, verify it, then add the rings.

There is no longer any need for a focus-ring exemption on
`.spread-question-input` — once 09 is done that input is safe to focus, so it
should get the same ring as every other field.

---

## 1 · Item 02 — neon green → gold

`#39FF14` is the only screen-native colour in an antique palette. Replace with
the existing `--accent-glow`.

**Two files, identical change.**

`celtic-spread-components/CelticSpread.module.css` around line 223, and
`three-cards-spread-components/ThreeCardsSpread.module.css` around line 103 —
the `.readyQuestionWarning` rule (check the actual class name in each file; the
CLI's own conversion may have named it differently).

```css
/* was:
   color: #39FF14;
   text-shadow: 0 0 6px rgba(57, 255, 20, 0.8);
*/
color: var(--accent-glow);
text-shadow: 0 0 10px rgba(var(--accent-glow-rgb), 0.45);
```

Also set the heading face on the same rule, so it reads as an inscription rather
than a system message:

```css
font-family: var(--font-heading);
letter-spacing: 0.06em;
```

Leave the `font-size`, positioning and `z-index` alone.

**Verify:** trigger it by clicking a ready-question while a spread is already
drawn. Gold text on the dark ground, no green anywhere. Grep `39FF14` → 0 hits.

---

## 2 · Item 05 — keyboard focus rings

Nothing in the app has a visible keyboard focus state. Inputs set
`outline: none` and signal focus only by shifting the border to red, which is
nearly invisible against `--line`; buttons and nav links have nothing at all.

Gold is the right ring colour: it's the one hue in the palette that never means
hover or danger, so it can't be misread.

**Add to `src/index.css`**, after the `body::before` grain block:

```css
/* ── Keyboard focus ───────────────────────────────────
   :focus-visible only — mouse and touch users never see these.
   Gold is used because it carries no other meaning in this palette
   (red = accent/hover, muted brick = danger). */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible,
[tabindex]:focus-visible {
    outline: 2px solid var(--accent-glow);
    outline-offset: 2px;
}

/* Elements with their own border get a ring instead, so the outline
   doesn't sit awkwardly outside a 1px box. */
.header-lang-btn:focus-visible,
.header-login:focus-visible,
.header-logout:focus-visible,
.auth-form input:focus-visible,
.spread-question-input:focus-visible {
    outline: none;
    border-color: var(--accent-glow);
    box-shadow: 0 0 0 2px rgba(var(--accent-glow-rgb), 0.28);
}
```

`.spread-question-input` is included deliberately — it is safe to focus **only
once item 5 (09) below is done**. If for any reason you skip 09, remove that
selector from the list above and give the input no ring.

**Also give the card images a focus state.** They're clickable `<img>` elements
with no keyboard path at all. If you want them reachable, they need
`tabIndex={0}` and an `onKeyDown` for Enter/Space — that's a behaviour change, so
**ask the user before adding it**. Don't do it silently.

**Verify:** Tab from the top of the Celtic route with a spread already drawn.
You should see a gold ring on the hamburger, lang toggle, login/logout, the
sidebar links, the Clear button and the question input — and **the spread must
still be on screen** when the ring reaches that input. If it vanishes, 09 wasn't
applied correctly.

---

## 3 · Item 06 — mobile header title

At `max-width: 768px` the title is `font-size: 0.65rem` ≈ 14.3px — the smallest
text on screen, in a display face, with `text-overflow: ellipsis` already
conceding it doesn't fit. Below 480px the logo is hidden and this is the only
thing carrying the brand.

The fix is to shorten the string first, then enlarge it.

**3a. `Header.css`**, in the `@media (max-width: 768px)` block, replace the
`.Header h1` rule:

```css
.Header h1 {
    position: absolute;
    left: 50px;
    right: 125px;
    margin: 0;
    text-align: center;
    /* Was 0.65rem (~14px) with ellipsis — the full title cannot be set at a
       readable size in this strip, so the short brand mark is used instead
       (see Header.tsx headerTitleShort). No ellipsis needed at this length. */
    font-size: 21px;
    letter-spacing: 0.14em;
    white-space: nowrap;
    overflow: visible;
    text-overflow: clip;
}

.Header h1[dir="rtl"] {
    font-size: 21px;
}
```

Note `font-size` is px, not rem — deliberately exempt from the
`html[data-lang="he"]` root bump, consistent with the existing pattern in this
file.

**3b. `Header.tsx`** — the title needs to differ by viewport. Cleanest without
adding a resize listener is to render both and let CSS choose:

```tsx
<h1 dir={lang === 'he' ? 'rtl' : 'ltr'}>
    <span className="header-title-full">{t('headerTitle')}</span>
    <span className="header-title-short">{t('headerTitleShort')}</span>
</h1>
```

**3c. `Header.css`** — add at the top level (outside any media query):

```css
.header-title-short {
    display: none;
}
```

and inside `@media (max-width: 768px)`:

```css
.header-title-full {
    display: none;
}

.header-title-short {
    display: inline;
}
```

**3d. `state/translations.ts`** — add a `headerTitleShort` key. English `Berta`.
For Hebrew use the equivalent single word from the existing `headerTitle` value —
**read what's there and pick the brand word; don't invent a transliteration.** If
it isn't obvious from the existing string, ask the user rather than guessing.

**3e.** The `@media (max-width: 480px)` rule
`.Header h1 { max-width: calc(100% - 90px) }` can stay — harmless — but it's now
inert, since the short title can't reach that width. Leave it or delete it, your
call; note it in your summary either way.

**Verify:** at 767px and at 420px the title should be the largest text in the
bar, fully visible, no ellipsis, in both languages.

---

## 4 · Item 10 — Celtic breakpoint 768px → 1000px

Between 769px and 1000px the Celtic ready-questions column has roughly 75px of
real width — the existing comment in `CelticSpread.module.css` says so directly.
The stacked mobile layout already handles this well; it just switches on too
late.

**4a.** In `celtic-spread-components/CelticSpread.module.css`, change the media
query at ~line 239:

```css
/* was: @media (max-width: 768px) */
/* The ten-card cross plus the ready-questions column plus the sidebar do not
   fit below ~1000px — the stacked layout takes over there rather than at the
   phone breakpoint. */
@media (max-width: 1000px) {
```

**4b.** Same change in `celtic-spread-route/celtic-spread/CelticSpreadGlobal.css`
at ~line 56, so the question header and the spread body switch together.

**4c. ThreeCards** has the same class of problem — `min-width: 700px` on
`.container` forces horizontal scroll on portrait tablets. Raise its breakpoint
too, for consistency:

- `three-cards-spread-components/ThreeCardsSpread.module.css` ~line 115 →
  `@media (max-width: 1000px)`
- `three-cards-spread/ThreeCardsSpreadGlobal.css` ~line 56 → same

**4d. Do NOT change** the other `@media (max-width: 768px)` blocks —
`App.css` (sidebar/nav), `Header.css`, `SideBar.css`, `HomePage.css`,
`MySpreadsPage.css`, `SpreadHeader.css`, `InterpretWidget.css`,
`CombinationsModal.css`, `ConclusionModal.css`. Those govern chrome, not the
cross geometry, and the mobile nav should still appear at 768px. **The spread
layout and the nav breakpoint are now deliberately different numbers** — add a
one-line comment at each of the four changed queries saying so, or the next
person will "fix" the inconsistency.

**4e.** Once this lands, check whether `App.css`'s `.side-bar` desktop rules
still behave at 800–1000px with the spread stacked. Report anything that looks
wrong rather than fixing it — that's outside what was approved.

**Verify:** at 850px the Celtic cross is stacked with full-width ready-question
buttons and no 75px column. At 1100px the cross layout is unchanged from today.
At 850px on ThreeCards, no horizontal scrollbar.

---

## 5 · Item 09 — move the spread-clear off `onFocus` — **DO THIS FIRST**

At `CelticSpreadGlobal.tsx:158` and `ThreeCardsSpreadGlobal.tsx:158`:

```tsx
onFocus={() => { if (isSpread3) clearSpread3(); }}
```

`onFocus` fires on click, on tab, and on programmatic focus. So merely touching
the question box destroys the cards, the question, the interpretation and the
saved combination — no confirmation, no undo.

The intent is right (a new question should mean a fresh spread); the trigger is
wrong. Focus means *"I might type something"*, not *"I've decided"*. Move it to
submit.

**5a. `ThreeCardsSpreadGlobal.tsx`** — delete the `onFocus` prop from
`.spread-question-input` entirely.

**5b.** Same file — clear at the point of drawing instead. `spreadThem3` is
already passed to `SpreadHeader`; wrap it:

```tsx
const handleDraw: () => void = (): void => {
    if (isSpread3) clearSpread3();
    spreadThem3();
};
```

Pass `handleDraw` where `spreadThem3` currently goes into `SpreadHeader`
(line ~149). **Read the existing `spreadThem3` body first** — if it already
clears or resets state internally, don't double up; adjust so the clear happens
exactly once, before the new draw.

If the input has its own submit path (Enter key / form `onSubmit`), route that
through `handleDraw` too, so both ways in behave identically.

**5c. `CelticSpreadGlobal.tsx`** — identical change, with `clearSpread` /
`spreadThem` (no `3` suffix).

**5d.** Add one line of copy under the question field, so the consequence is
stated before it happens rather than discovered after:

> Drawing again will replace the spread below.

Add it as a new key in `state/translations.ts` (English + Hebrew) — do not
hardcode the string. Style it with the muted, italic treatment already used for
secondary text: `color: var(--text-faint)`, `font-style: italic`, and one step
down in size. Put the rule in whichever stylesheet already owns
`.spread-question-input` (`CelticSpreadGlobal.css` /
`ThreeCardsSpreadGlobal.css`) — and **only show the line when a spread is
currently drawn** (`isSpread` / `isSpread3`), otherwise it's describing
something that can't happen.

**Do not** add a confirmation dialog. The explicit **Clear spread** button in
`SpreadHeader` already covers the deliberate-destruction case, and the warning
line covers the accidental one.

**Verify:** with a spread drawn — click into the question box, type, click away,
Tab through it. The cards must survive all of it. Then press Draw: the old
spread is replaced by a new one. Confirm in both routes and both languages.

---

## Not approved — do not implement

- **01** hover `--accent-hover` red→yellow — leave `#F0C230` as-is
- **03** glow on floating panels — leave all four panels glowing
- **04** green/blue spread badges — leave the colours
- **07** empty state on My Spreads — leave the single sentence
- **08** three floating panels → docked rail (this is the 38px overlap at
  1280×800; still present, still unaddressed)

## Summary to report back

For each of the five items: files touched, and whether verification passed.
Call out explicitly (a) what you chose for the Hebrew `headerTitleShort` value,
(b) what the existing `spreadThem` / `spreadThem3` already did, and whether
avoiding a double-clear needed any adjustment, and (c) anything in 4e that
looked off.