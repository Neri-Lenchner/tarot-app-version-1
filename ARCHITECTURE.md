# Architecture

## Overview

Monorepo with two independent apps, run together via the root `npm run dev` (uses `concurrently` to start both):

```
tarot-app/
├── frontend/   # React 19 + TypeScript + Vite — port 3000
└── backend/    # Express + TypeScript — port 4000
```

Frontend calls the backend over HTTP (CORS-enabled) at `http://localhost:4000`. There is no server-side rendering or shared build step between the two — they are separate npm projects, separately started (`npm run dev` in frontend, `npm start` in backend).

## Backend

**Stack:** Express, TypeScript, compiled with `tsc` and run via `nodemon` in dev (`nodemon --watch src --ext ts --exec "tsc && node dist/app.js"`).

**Entry point:** `backend/src/app.ts` — builds the Express app, applies `cors()` and `express.json()` globally, mounts each controller's router, then error middleware last.

### Layers

- **Controllers** (`src/controllers/`) — route registration + request/response handling only, delegate to services.
  - `auth.controller.ts` — `POST /api/auth/register`, `POST /api/auth/login`
  - `reading.controller.ts` — `POST/GET /api/readings`, `GET/DELETE /api/readings/:id` (all behind `tokenMiddleware`)
  - `tarot.controller.ts` — `POST /api/tarot/interpret`, `/check-combinations`, `/followup`, `/translate`
- **Services** (`src/services/`) — business logic.
  - `auth.service.ts` — register/login, talks to MySQL via `dal`, hashes passwords, issues JWTs
  - `security.service.ts` — bcrypt hashing, JWT sign/verify/extract (`jsonwebtoken`)
  - `reading.service.ts` — CRUD for saved readings (MySQL)
  - `tarot.service.ts` — the `TarotService` class: assembles the OpenAI prompt (`buildInterpretationMessages()`) and calls `gpt-4o` for interpretation, translation, and follow-up Q&A
  - `prompt-sections.ts` — standalone helper functions used by `tarot.service.ts` to build individual prompt sections (combinations, health, third-person framing, court cards, suit dominance, major arcana weighting, personal card-note overrides)
- **Data** (`src/data/`) — static tarot knowledge fed into prompts: `riderWaite.ts` (78 cards' Waite text), `combinations.ts`, `health-combinations.ts`, `card-body-map.ts`, `health.ts`, `personal-card-notes.ts` (owner-authored mandatory rules per card).
- **Models** (`src/models/`) — `User`, `Credentials` (with `.validate()`), `client-error.ts` (typed error classes: `ValidationError`, `AuthorizationError`, etc.), `enums.ts`.
- **Middleware** (`src/middleware/`) — `token.middleware.ts` (JWT auth guard), `logger.middleware.ts` (console request logging), `error.middleware.ts` (maps thrown errors → HTTP status + catch-all).
- **DTOs** (`src/dto/tarot.dto.ts`) — `ISpreadCard`, `IInterpretRequest`, `ICombinationMatch`.
- **Utils** (`src/utils/`) — `app-config.ts` (env var access), `dal.ts` (MySQL connection pool via `mysql2`, `.execute(sql, params)`), `prompt-constants.ts`.

### Persistence

MySQL (via `mysql2` connection pool, `dal.ts`). Two known tables:
- `users` — id, firstName, lastName, email, password (bcrypt hash), gender
- `readings` — id, user_id, spread_type, question, question_he, cards (JSON), interpretation_en, interpretation_he, followup_question, followup_answer, created_at

Config is env-driven (`backend/.env`): `PORT`, `OPENAI_API_KEY`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`.

### Auth flow

Register/login return a JWT (30-day expiry, `jsonwebtoken`) containing a sanitized user object (password stripped). Protected routes use `tokenMiddleware.validateToken` (checks `Authorization: Bearer <token>` is present and verifies signature); controllers that need the user re-decode the token via `securityService.extractUser()` rather than a shared `req.user`.

### AI interpretation flow

1. Frontend sends drawn cards (+ question, spread type, flags) to `POST /api/tarot/interpret`.
2. `tarot.service.ts` builds one prompt (system + user message) per `buildInterpretationMessages()`, pulling in Waite card text, detected combinations, health/suit/major-arcana framing, and any personal card-note overrides, then calls OpenAI (`gpt-4o`) once — output is a single flowing narrative ending in a `**Conclusion**` marker.
3. Hebrew is **not** generated independently — `POST /api/tarot/translate` takes the finished English text and makes a second `gpt-4o` call whose only job is faithful translation (preserves card names, structure, combinations). This two-call design intentionally trades a slower Hebrew fetch for consistency between languages.
4. `POST /api/tarot/followup` answers ad-hoc questions about an existing interpretation.
5. `POST /api/tarot/check-combinations` is a separate, lightweight endpoint the frontend uses to show a "combination detected" modal before running the full interpretation.

See **[AI-INTERPRETATION.md](AI-INTERPRETATION.md)** for the full breakdown of exactly how the prompt is assembled — every section, ruling, and edge case in `tarot.service.ts` / `prompt-sections.ts`.

## Frontend

**Stack:** React 19 + TypeScript + Vite, `react-router-dom` for routing.

**Entry:** `src/main.tsx` → `src/App.tsx` → `utils/Routing.tsx` defines all routes; `PrivateRoute.tsx` gates spread/my-spreads routes behind auth.

### Routes

| Path | Component | Auth |
|---|---|---|
| `/` | HomePage | public |
| `/tarot-deck` | TarotDeckRoute (78-card browse) | private |
| `/celtic-spread-global` | CelticSpreadRoute (10-card) | private |
| `/three-cards-spread` | ThreeCardsSpreadRoute | private |
| `/master-spread` | MasterSpreadRoute (10-card, manual pick UX) | private |
| `/spread-info/:spreadKey` | SpreadInfoPage | public |
| `/register`, `/login` | Auth forms | public |
| `/my-spreads`, `/my-spreads/:id` | Saved readings list/detail | private |

### Structure

- **Components** (`src/components/`) — per-component folders (`Foo/Foo.tsx` + `Foo/Foo.css`), grouped by route (`*-route/`) plus `general-components/` for shared widgets used across spreads:
  - `InterpretWidget` — fixed bottom-right, fetches/shows the AI interpretation, EN/HE toggle
  - `ConclusionModal` — fixed bottom-center, shows the closing narrative (and event-based story for Celtic)
  - `CombinationsModal` — fixed center-left, shows detected card combinations
  - `FannedDeck` / `CutDeckModal` — shared deck-cutting UX used by all three spreads
- **Services** (`src/services/`) — one per backend concern: `AuthService.ts`, `DeckService.ts` (shuffles/spreads cards from tarotapi.dev), `InterpretService.ts`, `CombinationsService.ts` (also does client-side adjacency filtering), `ReadingService.ts`.
- **State** (`src/state/`) — lightweight global stores (not Redux): `auth-state.ts`, `interpret-state.ts` (per-spread-type interpretation cache + Hebrew lazy-load logic), `lang-state.ts` (shared EN/HE toggle), `deck-state.ts`, `notice-state.ts`, `translations.ts` (UI string glossary).
- **Data/models** (`src/arrays-&-models/`) — `tarotDeck.ts` (78-card array) plus cross-file interfaces (`combinationMatch.interface.ts`, `readingRecord.interface.ts`, `authUser.interface.ts`).
- **Hooks** (`src/hooks/`) — `useTilt.ts` (card hover-tilt effect).

### Notable frontend patterns

- Language (EN/HE) is a single global toggle (`lang-state.ts`) shared by all three modals, so one click switches everything.
- Hebrew translations are lazy-fetched only on explicit user action (never on a passive effect), to avoid firing paid OpenAI calls silently.
- Fixed-position widgets keep their toggle button and panel as independent (non-flexed) children so the button never shifts position when the panel opens.
- Spread routes each cut+shuffle from a different card pool: Celtic/Master use the full 78-card deck, Three Cards uses Major-Arcana-only (22 cards).

## Data flow summary

```
User (browser)
   │
   ▼
frontend (Vite, :3000)
   │  fetch/axios → JWT in Authorization header for protected calls
   ▼
backend (Express, :4000)
   │
   ├─ auth/reading routes ──► MySQL (users, readings)
   └─ tarot routes ─────────► OpenAI (gpt-4o) — prompts built from
                               static card data + owner's personal notes
```
