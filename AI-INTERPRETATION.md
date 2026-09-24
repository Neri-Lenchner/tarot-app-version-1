# How OpenAI Generates a Reading

## Where this method comes from

Twenty-five years ago, traveling through India, I met a tarot teacher in Manali who taught me his approach to reading, drawn from his own experience and tradition. I already had some grounding in the occult before that trip, so it wasn't one-directional — we traded perspectives while he walked me through the art of tarot reading. Back home I practiced actively for a year or two, and even after I stopped reading for others, I never stopped learning; it's a subject that keeps pulling me back in.

Everything below — the position framings, the court-card rulings, calls like "a dark card in the Positive Energy position means the hardship itself is working in your favor" — comes out of that lineage: what I was taught, what I brought to it myself, and what I've picked up in the years since. This file is effectively my reading method, written down as instructions for an AI to follow instead of instructions for a student.

## The technical breakdown

This is a deep dive into `backend/src/services/tarot.service.ts` and `backend/src/services/prompt-sections.ts` — the code that turns a set of drawn cards into the AI-written narrative. See `ARCHITECTURE.md` for the wider system; this file is just the "what happens inside `interpretSpread()`" story.

There is no fine-tuning and no retrieval/embedding store. Every reading is a single (or, for Hebrew, two) plain chat-completion call to `gpt-4o`, where **all** tarot knowledge — card meanings, combinations, health rules, position semantics, your personal overrides — is assembled as plain-text instructions inside one big prompt string, freshly built per request. The "intelligence" lives entirely in prompt engineering in `prompt-sections.ts` + `tarot.service.ts`, not in the model or any external knowledge base.

## Flow at a glance

```
┌────────────────────────┐        ┌─────────────────────────┐        ┌────────────────────────┐
│ Frontend               │───────▶│ Backend                 │───────▶│ OpenAI                 │
│ Interpret + Conclusion │  /api  │ tarot.controller.ts     │ https  │ Chat Completions API   │
│ Widgets (fetch + JWT)  │        │ -> tarot.service.ts     │        │ model: gpt-4o          │
└────────────────────────┘        │ -> prompt-sections.ts   │        └────────────────────────┘
                                  └────────────┬────────────┘
                                               │ reads on every request
                                               ▼
                                  ┌──────────────────────────────────────┐
                                  │ backend/src/data/                    │
                                  │ riderWaite.ts                        │
                                  │ combinations.ts + health-combos.ts   │
                                  │ health.ts + personal-card-notes.ts   │
                                  │ prompt-constants.ts                  │
                                  └──────────────────────────────────────┘
```

The frontend never talks to OpenAI directly — every call is proxied through `tarot.controller.ts`. The backend is a single Node process; there's no queue, cache, or vector store between the controller and OpenAI. All tarot "knowledge" (card meanings, combinations, health rules, position semantics, your own per-card overrides) lives as plain static TypeScript arrays under `backend/src/data/` + `prompt-constants.ts`, and `tarot.service.ts`/`prompt-sections.ts` read them fresh on every request to build the prompt string — nothing is embedded, indexed, or fine-tuned. OpenAI only ever sees that assembled text; it never touches the data files itself, and has no memory of past calls.

The `/translate` and `/followup` endpoints reuse the same Backend → OpenAI hop shown above, just with a narrower prompt each time: `/translate` sends the already-finished English text and asks for a faithful Hebrew translation (no new interpretation); `/followup` sends the existing interpretation plus a new question and asks for a short answer grounded only in that text. Neither one re-reads the data files in the box below.

## The three OpenAI call types

All three call `POST https://api.openai.com/v1/chat/completions` with `model: "gpt-4o"` (never `gpt-4o-mini` — see `ARCHITECTURE.md`).

| Call | Function | Purpose |
|---|---|---|
| 1 | `interpretSpread()` → `buildInterpretationMessages()` | Generates the full English (or Hebrew) reading from the drawn cards |
| 2 | `translateInterpretation()` | Translates an already-generated English reading into Hebrew, faithfully |
| 3 | `followupQuestion()` | Answers one ad-hoc question about an existing reading, grounded only in that reading's text |

## Call 1: building the interpretation prompt

`buildInterpretationMessages()` returns `{ system, user }`. The **system** message sets the reader's persona and hard rules (language, gender grammar); the **user** message is a long, assembled string containing every piece of context, in this order:

```
questionLine
pastAnchorSection        (only if no specific question was asked)
confirmedComboSection    (only if user confirmed a suggested combination)
eventBasedSection        (Celtic only, always-on mode)
thirdPersonSection       (only if asking about someone else)
healthSection            (only if question is health-related)
majorArcanaSection       (Celtic/Master only)
suitDominanceSection
courtMeetingsSection     (Master Spread only)
courtCardsSection
majorArcanaFigureSection (event-based mode only)
combinationsSection
personalNotesSection
[the card list + position guide]
[body/structure instructions]
[attention-section instructions, if combinations were found]
[conclusion marker + instructions]
```

Each of these is a self-contained `=== SECTION HEADER ===` block that either renders as an empty string (skipped entirely) or injects mandatory, very explicit instructions — the prompt is built almost like a rules engine writing English prose for the model to follow, not a loose creative-writing brief.

### The building blocks, in order

**1. Card list** — for every drawn card, `riderWaite.ts` supplies the Waite `meaning_up` text, formatted as `N. Position — CardName: meaning`. This is the only place raw card meanings enter the prompt; everything else is contextual framing around these lines.

**2. Question handling**
- If there's no specific question (or the "Tell me what I need to know" ready-question was clicked), `getPastAnchorSection()` (in `prompt-sections.ts`) anchors the *entire* reading on whatever the Past-position card is — every other card must read as a continuation of that card's story.
- If there is a question, `questionAddressInstruction` forces the model to directly answer it (timeframe and/or life domain) in the first sentences after the `**Conclusion**` marker — not just restate it.

**3. Third-person detection** — `isThirdPersonQuestion()` (prompt-sections.ts) pattern-matches pronouns ("he ", "she ", "they ") and relationship phrases ("my mother", "my boyfriend", Hebrew equivalents). If true, the whole spread is reframed as being about that other person, not the querent, with special emphasis that Celtic positions 7–10 (Inside/Outside/Fears/Potential) reveal that person's true inner self.

**4. Health detection** — `isHealthQuestion()` keyword-matches the question against `HEALTH_KEYWORDS`; if matched, `findHealthIndicators()` cross-references drawn cards against `data/health.ts` (sun-sign/body-area table). Any hits become the **highest-priority** section — the model is told to lead the whole interpretation with the health dimension.

**5. Major Arcana weighting** — `getMajorArcanaSection()` counts Major Arcana cards vs. total:
- ≥65% → "Profound Fate Reading": forces a dedicated opening paragraph about a "karmic crossroads."
- ≥40% (or 2+ of 3 cards) → "Destiny Mark Detected": a lighter version of the same framing.
- Otherwise, if any Major Arcana is present at all, a one-line note to weight it more than Minor Arcana.

**6. Suit dominance** — `getSuitDominanceSection()` counts Minor Arcana suits; if one suit has ≥2 cards and clearly leads the others, the model is told to root the *entire* interpretation in that suit's domain (Cups→emotional, Wands→inspirational, Swords→mental, Pentacles→material).

**7. Court card meetings** (Master Spread only) — `computeCourtMeetings()` looks for two royalty cards (King/Queen/Knight/Page) that are grid-adjacent (same row or same column) in the 3×3 story grid, or at the two ends of a row with a non-court card between them. These aren't read as two independent cards — they're forced into a single "two people meeting" ruling:
  - Two Queens → gossip/rumor, specifically.
  - King+Queen → peers, no age gap.
  - Queen/King + Knight/Page → an age-gap or possible boss/employee dynamic.
  - Same-tier male pairs → "two men, no hierarchy."
  - `COURT_CARD_FACING` (which way each card's figure is drawn, taken from the actual deck art) additionally triggers "in direct discourse" or "in disagreement" framing for row-adjacent pairs.
  - Cards involved in a meeting are excluded from the normal per-card court ruling below (via `excludePositions`), so they aren't interpreted twice.

**8. Court cards (per-card rulings)** — `getCourtCardsSection()` is the most elaborate section. For every King/Queen/Page/Knight not already claimed by a "meeting," it decides — and instructs the model to commit to, never leave ambiguous — whether the card is:
  - the querent themselves (same-gender court card in a Celtic "self" position: Positive/Negative Energy, Inside, Outside),
  - an impersonal energy (same self-positions, but Positive/Negative Energy specifically),
  - a real external person (opposite-gender court card, or same-gender court card outside self-positions — model must pick "this is you" or "this is [person]" and say so explicitly),
  - or, for **Knights specifically**, either a real person *or* "active thoughts" about a domain implied by the suit (Cups→emotions, Wands→ambition, Swords→conflict, Pentacles→work/money) — ambiguous in Past/Present/Near Future/Far Future/Master story positions, thoughts-only everywhere else.
  - Romantic questions add another layer: a same-gender court card in a Celtic timeline position normally *can't* be read as the querent's lover — unless The Lovers card **and** an opposite-gender Major Arcana "figure" card (Empress, Emperor, etc., via `MA_FEMALE_FIGURES`/`MA_MALE_FIGURES`) are also present, which explicitly reopens that possibility.
  - Event-based mode (see below) forces opposite-gender and unknown-gender court cards, and Knights, to always be a real person taking part in that event. A **same-gender** King/Queen/Page in an event-pair position is not forced either way — the model decides, same as outside event-based mode, between "this is the querent living through the event" and "this is a specific person taking part alongside them." The romantic-position rule (above) takes priority over this when both apply — since Celtic is always event-based and its romantic positions and event-pair positions are the same four positions, the romantic ruling effectively runs first for any romantic-question same-gender card here.

**9. Major Arcana figure cards in event-based mode** — the mirror image of the court-card rule: a Major Arcana card depicting a specific figure (The Emperor, The Empress, Temperance, etc.) landing in a Past/Present/Near Future/Far Future position is *always* the querent embodying that archetype — never an external person, regardless of the querent's own gender.

**10. Combinations** — `findMatchingCombinations()` checks `data/combinations.ts` for known card pairings, but only counts a match if the cards are **adjacent in the spread** (BFS over a per-spread-type adjacency graph — `CELTIC_ADJACENCY`, `THREE_CARDS_ADJACENCY`, `MASTER_ADJACENCY` in `prompt-constants.ts`, mirrored on the frontend in `CombinationsService.ts` — keep both in sync if either changes). Matches are deliberately withheld from the per-card paragraphs and instead pushed into a dedicated **"Things You Should Pay Attention To"** section placed after all card paragraphs and before the conclusion — one paragraph per combination, exact heading preserved even in Hebrew (translated later, not composed in Hebrew directly).
    - If the user had already been shown a suggested combination via `POST /check-combinations` and explicitly confirmed it applies to their life, `confirmedComboSection` promotes that single combination to "the central truth of the spread" — referenced throughout, not just in one section.

**11. Personal card notes** — `getPersonalNotesSection()` pulls any non-empty `note` from `data/personal-card-notes.ts` for drawn cards. These are owner-authored rules that **override general tarot tradition** for that specific card and are marked mandatory in the prompt.

### Structure instructions (the actual writing brief)

- **Celtic / Three Cards**: one paragraph per card, opening with "in the [position] position, the card is [name]," then 2–3 sentences interpreting through that position's specific lens (`positionDescriptions` — a hardcoded description per position, in first- or third-person voice depending on the third-person flag).
  - Celtic's Positions 1–2 (Positive/Negative Energy) get an extra `energyNote` block: they must be described as impersonal external forces, never the querent's feelings — and Position 1 has a specific counterintuitive rule that a *dark* card there (Death, The Tower, etc.) means the hardship itself is what's currently working in the querent's favor, stated plainly, not softened.
  - Position 10 (Potential) is explicitly told to tie back to both energy positions as the two forces driving toward that outcome.
- **Master Spread**: not one-paragraph-per-card. `masterBodyInstruction` forces exactly 4 paragraphs — Past (cards 1–3 as one continuous story), Present (cards 4–6, with card 5/center explicitly called "the most important card in the entire spread," anchoring the querent's current situation), Future (cards 7–9), and Potential (card 10 alone) — no card-name headings, just prose that names the chapter naturally.
- **Event-based mode** (Celtic only, always on — no toggle): on top of the normal 4 timeline paragraphs, two *extra* unheaded paragraphs are appended right after the `**Conclusion**` marker — one synthesizing Past+Present as a single concrete event, one synthesizing Near Future+Far Future the same way. Court cards inside these paragraphs are forced to be real people (see #8); Major Arcana figure cards are forced to be the querent (see #9). Not yet verified end-to-end beyond the one live test noted in the code comment at the top of `buildInterpretationMessages()` — check that comment before relying on further changes here.
- **Conclusion**: always ends with the literal marker `**Conclusion**` on its own line (never translated, so it can be located programmatically/consistently), followed by 2–3 sentences of direct, actionable guidance — tied back to any confirmed/detected combinations if present.

### System message

Sets the persona ("a wise and insightful tarot reader who speaks in vivid, concrete terms about real life events... never describe what a card 'symbolizes'... ground everything in human experience") and two hard constraints:
- **Language**: if Hebrew, an explicit "write your ENTIRE response in Hebrew, only card names stay in English" rule (belt-and-suspenders alongside the translate-only design below).
- **Gender grammar**: if the querent's gender is known, forces correct Hebrew grammatical gender (לשון זכר / לשון נקבה) with worked examples, since Hebrew verbs/adjectives are gendered and getting this wrong reads as a jarring error to a Hebrew speaker.

## Call 2: Hebrew translation (`translateInterpretation`)

Hebrew is **never** generated directly from the cards — see `ARCHITECTURE.md`'s note on why the two-call design was chosen over one combined call (it produced better, less-drifted Hebrew). This call's system prompt is deliberately narrow: translate the given English text faithfully, preserving structure exactly —
- card names stay in English,
- position names go through a fixed glossary (Past→עבר, Potential→פוטנציאל, etc.),
- "in the X position" always uses מיקום (not מצב),
- the `**Things You Should Pay Attention To**` heading has one fixed Hebrew translation,
- the `**Conclusion**` marker is left completely untouched,
- the same gender-grammar rule as call 1 applies here too.

No new interpretation happens in this call — it's translation only, which is what keeps the two languages from diverging in content.

## Call 3: follow-up questions (`followupQuestion`)

Simplest of the three. System prompt tells the model to answer using **only** what the already-generated `interpretation` text revealed — not to invent new card meanings — in 2–3 sentences, in whichever language was active.

## Where to look when changing behavior

| You want to change... | Edit... |
|---|---|
| A card's base meaning | `backend/src/data/riderWaite.ts` |
| A known card combination | `backend/src/data/combinations.ts` / `health-combinations.ts` |
| An owner-mandated rule for one card | `backend/src/data/personal-card-notes.ts` |
| Health-question keyword detection | `HEALTH_KEYWORDS` in `prompt-constants.ts` |
| Which cards count as "romantic" Major Arcana figures | `MA_FEMALE_FIGURES` / `MA_MALE_FIGURES` in `prompt-sections.ts` |
| Court card facing/meeting rules (Master Spread) | `COURT_CARD_FACING`, `describeCourtMeeting()`, `computeCourtMeetings()` in `prompt-sections.ts` |
| Which spread positions are adjacent (for combination detection) | `CELTIC_ADJACENCY` / `THREE_CARDS_ADJACENCY` / `MASTER_ADJACENCY` in `prompt-constants.ts` — **must stay in sync** with the frontend's `CombinationsService.ts` |
| Paragraph structure / conclusion wording | `bodyInstruction`, `masterBodyInstruction`, `conclusionInstruction` in `tarot.service.ts` |
| The model itself | `callChat()` in `tarot.service.ts` (currently hardcoded `gpt-4o` — do not downgrade to `gpt-4o-mini`) |
