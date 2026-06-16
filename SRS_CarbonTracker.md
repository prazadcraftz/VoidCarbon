# 📄 Software Requirements Specification (SRS)
## Carbon Footprint Awareness Platform
### Virtual Prompt Wars — Challenge 3

---

**Version:** 1.0  
**Date:** 2026-06-16  
**Problem Statement:** *Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.*

---

## Table of Contents

1. [Phase 1 — Functional & Non-Functional Requirements](#phase-1)
2. [Phase 2 — System Design & Database Design](#phase-2)
3. [Phase 3 — Tool Selection & Implementation Plan](#phase-3)
4. [Phase 4 — Implementation](#phase-4)
5. [Phase 5 — Testing](#phase-5)

---

# PHASE 1 — Functional & Non-Functional Requirements {#phase-1}

---

## 1.1 Purpose & Scope

The Carbon Footprint Awareness Platform is a web application that allows any individual to:
- **Understand** their personal annual CO₂e footprint through a guided calculator
- **Track** their reduction progress over time via goal-setting and historical charts
- **Reduce** their emissions through AI-generated, context-specific action recommendations

The system is evaluated on: Code Quality · Security · Efficiency · Testing · Accessibility · Problem Statement Alignment · Google Services Usage.

---

## 1.2 Functional Requirements

### Module FR-01: Carbon Footprint Calculator

| ID | Requirement | Priority |
|---|---|---|
| FR-01.1 | The system SHALL provide a multi-step form with exactly 6 steps: Region, Transport, Home Energy, Food, Consumption, Review | MUST |
| FR-01.2 | The system SHALL allow users to select their geographic region from a predefined list (India, UK, USA, EU, Australia, Global) to apply correct grid intensity | MUST |
| FR-01.3 | The system SHALL collect transport data: weekly car km + fuel type (petrol/diesel/hybrid/electric), weekly public transport km, number of short-haul + long-haul flights/year | MUST |
| FR-01.4 | The system SHALL collect home energy data: monthly electricity kWh, heating fuel type + monthly quantity, household size (for per-person attribution), renewable energy percentage | MUST |
| FR-01.5 | The system SHALL collect food/diet data: diet type (vegan/vegetarian/pescatarian/omnivore/high-meat) | MUST |
| FR-01.6 | The system SHALL collect consumption data: monthly spend on goods, monthly spend on services | MUST |
| FR-01.7 | The system SHALL display a step progress indicator (Stepper component) showing current step and total steps | MUST |
| FR-01.8 | The system SHALL validate all inputs using Zod schemas before allowing the user to proceed to the next step | MUST |
| FR-01.9 | The system SHALL surface validation errors inline, adjacent to the relevant field, with accessible error messages | MUST |
| FR-01.10 | The system SHALL persist form state to localStorage so the user does not lose progress on page refresh | MUST |
| FR-01.11 | The system SHALL display a Review step summarizing all entered data before final submission | MUST |

### Module FR-02: Results Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-02.1 | The system SHALL compute the user's total annual CO₂e in kg using published emission factors (DEFRA/EPA/IEA) | MUST |
| FR-02.2 | The system SHALL break down the footprint into categories: Transport, Home Energy, Food, Consumption | MUST |
| FR-02.3 | The system SHALL display a Category Bar Chart showing kg CO₂e per category | MUST |
| FR-02.4 | The system SHALL display a Category Donut Chart showing percentage split per category | MUST |
| FR-02.5 | The system SHALL display a Comparison Card showing: user total vs. regional average, user total vs. 1.5°C Paris target (2.1 tCO₂e/year) | MUST |
| FR-02.6 | The system SHALL display a Historical Trend Line Chart showing footprint across past sessions | SHOULD |
| FR-02.7 | The system SHALL display key Stat Cards: Total Footprint, Biggest Emitter, % above/below target | MUST |

### Module FR-03: AI-Powered Personalized Insights (Gemini)

| ID | Requirement | Priority |
|---|---|---|
| FR-03.1 | The system SHALL call the Gemini AI API via a Next.js Server Action, passing the user's full footprint profile as context | MUST |
| FR-03.2 | The system SHALL request exactly 5 personalized, ranked reduction tips from Gemini | MUST |
| FR-03.3 | Each tip SHALL include: title, estimated annual CO₂e saving (kg, specific to this user), one-sentence rationale, difficulty level (Easy/Medium/Hard) | MUST |
| FR-03.4 | The system SHALL stream the Gemini response and render tips progressively as they arrive | SHOULD |
| FR-03.5 | The system SHALL display a loading skeleton while Gemini generates insights | MUST |
| FR-03.6 | The system SHALL handle Gemini API errors gracefully, falling back to static ranked tips | MUST |
| FR-03.7 | The Gemini API key SHALL reside exclusively in a server-side environment variable and SHALL NOT appear in any client bundle | MUST |
| FR-03.8 | The prompt sent to Gemini SHALL include: region, total CO₂e, category breakdown %, top 2 emitters, fuel type, diet type, flight frequency | MUST |

### Module FR-04: Goal Tracking

| ID | Requirement | Priority |
|---|---|---|
| FR-04.1 | The system SHALL allow the user to set a reduction goal: target kg CO₂e/year and target date | MUST |
| FR-04.2 | The system SHALL calculate and display current progress toward the goal as a percentage | MUST |
| FR-04.3 | The system SHALL display a progress bar with ARIA attributes (`role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`) | MUST |
| FR-04.4 | The system SHALL compare the user's latest footprint against their goal and show delta (kg saved, % reduction) | MUST |
| FR-04.5 | The system SHALL persist the goal in localStorage, re-validated with Zod on every read | MUST |
| FR-04.6 | The system SHALL call Gemini AI (via a **separate** Server Action `generateGoalPlan()`) to generate a **category-level goal achievement plan**: for each of the 4 categories (Transport, Home Energy, Food, Consumption), Gemini SHALL specify the exact kg CO₂e reduction needed from that category and the top 1–2 concrete actions the user can take to achieve it — displayed as an expandable `GoalPlanPanel` within the Goal Tracker section. The response MUST be validated against `GoalPlanResponseSchema` (see §2.4.2). | MUST |

### Module FR-05: Data Persistence

| ID | Requirement | Priority |
|---|---|---|
| FR-05.1 | All user data SHALL be stored in browser localStorage — no server-side user data storage | MUST |
| FR-05.2 | localStorage reads SHALL re-validate data against Zod schemas; corrupted data SHALL be silently discarded and the user prompted to re-enter | MUST |
| FR-05.3 | The system SHALL store a history array of FootprintResult objects, capped at 12 entries (one per month) | MUST |
| FR-05.4 | The system SHALL store the user's current goal in a separate localStorage key | MUST |

### Module FR-06: Navigation & UX

| ID | Requirement | Priority |
|---|---|---|
| FR-06.1 | The system SHALL provide a landing page with: hero section, "How It Works" (3 steps), trust strip with emission factor sources, CTA button | MUST |
| FR-06.2 | The system SHALL provide a persistent site header with navigation links (Home, Calculator, Dashboard) | MUST |
| FR-06.3 | The system SHALL provide a site footer with methodology note and Google Services attribution | MUST |
| FR-06.4 | The system SHALL redirect users from `/dashboard` to `/calculator` if no footprint data is found in localStorage | MUST |

---

## 1.3 Non-Functional Requirements

### NFR-01: Code Quality

| ID | Requirement | Metric |
|---|---|---|
| NFR-01.1 | TypeScript `strict: true` — zero `any`, zero `@ts-ignore`, zero `@ts-expect-error` | Enforced by `tsconfig.json` + ESLint |
| NFR-01.2 | All exported `lib/` functions MUST have explicit return types and TSDoc comments | Enforced by `@typescript-eslint/explicit-function-return-type` |
| NFR-01.3 | Zod schemas SHALL be the single source of truth for all data shapes | Single `schemas.ts` file imported everywhere |
| NFR-01.4 | No magic numbers — all constants in named exports in `constants.ts` | ESLint `no-magic-numbers` rule |
| NFR-01.5 | No copy-paste — shared utilities extracted to `src/lib/number.ts`, `src/lib/format.ts` | Code review + DRY linting |
| NFR-01.6 | Components SHALL be ≤ 150 lines each, single-responsibility | `max-lines` ESLint rule |
| NFR-01.7 | All imports SHALL use `import type` for type-only imports | `@typescript-eslint/consistent-type-imports` |

### NFR-02b: Rate Limiting & Abuse Protection

| ID | Requirement | Metric |
|---|---|---|
| NFR-02b.1 | The `generateInsights()` and `generateGoalPlan()` Server Actions SHALL enforce a per-IP rate limit of **10 requests / minute** using an in-memory sliding window (or upstash/redis if deployed); requests exceeding the limit SHALL return HTTP 429 without calling the Gemini API | Manual load test + response header check |
| NFR-02b.2 | The Server Actions SHALL verify that the request `Content-Type` is `application/json` and reject all others with HTTP 415 | Automated API test |
| NFR-02b.3 | Gemini API spend SHALL be capped via a Google Cloud Budget Alert at a configurable monthly USD threshold | Cloud Billing console |

### NFR-02: Security

| ID | Requirement | Metric |
|---|---|---|
| NFR-02.1 | Content Security Policy headers MUST be set in `next.config.ts` using **per-request nonces** (Next.js `headers()` + `middleware.ts` nonce injection); `unsafe-inline` and `unsafe-eval` are **prohibited** for `script-src` | CSP header validated in browser DevTools; no `unsafe-*` directives present |
| NFR-02.2 | Gemini API key MUST be a server-side env variable (`GEMINI_API_KEY`) | Never appears in client bundle (verified with bundle analyzer) |
| NFR-02.3 | All localStorage reads MUST be wrapped in `try/catch` and Zod-validated | 0 unvalidated reads |
| NFR-02.4 | No `dangerouslySetInnerHTML` usage | ESLint rule enforced |
| NFR-02.5 | All user inputs MUST be validated server-side in the Server Action before passing to Gemini | Zod `.parse()` in Server Action |

### NFR-03: Performance / Efficiency

| ID | Requirement | Metric |
|---|---|---|
| NFR-03.1 | Chart components SHALL be lazy-loaded using Next.js `dynamic()` | No chart JS in initial bundle |
| NFR-03.2 | Gemini insights SHALL be streamed — first tip visible within 2 seconds | `streamText()` from Vercel AI SDK or Google SDK streaming |
| NFR-03.3 | Lighthouse Performance score ≥ 90 on mobile | Measured pre-submission |
| NFR-03.4 | Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms | Measured pre-submission |
| NFR-03.5 | Total initial JS bundle SHOULD be < 300 KB gzipped; MUST be < 500 KB gzipped. (Note: Next.js runtime + Tailwind + Recharts + Gemini SDK make the original 200 KB target infeasible without removing major dependencies — see §3.1 rationale.) | Next.js bundle analyzer |

### NFR-04: Accessibility

| ID | Requirement | Metric |
|---|---|---|
| NFR-04.1 | All form fields MUST have an associated `<label>` or `aria-label` | axe-core automated check |
| NFR-04.2 | All chart SVGs MUST have `aria-label` with a text description of the data shown | Manual + automated check |
| NFR-04.3 | Color contrast ratio ≥ 4.5:1 for all body text, ≥ 3:1 for large text | Lighthouse accessibility score ≥ 95 |
| NFR-04.4 | Full keyboard navigation — all interactive elements reachable and operable via Tab/Enter/Space/Escape | Manual test |
| NFR-04.5 | Progress indicators MUST use `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` | Component-level |

### NFR-05: Reliability & Compatibility

| ID | Requirement | Metric |
|---|---|---|
| NFR-05.1 | Application MUST function without Gemini API (fallback to static tips engine) | Tested with API disabled |
| NFR-05.2 | Application MUST support Chrome, Firefox, Safari, Edge (latest 2 versions) | Manual cross-browser test |
| NFR-05.3 | Application MUST be responsive: usable on viewport widths 320px–1920px | CSS media queries + manual test |
| NFR-05.4 | localStorage quota errors MUST be caught and surfaced as a user-facing message | `try/catch` on all writes |

---

# PHASE 2 — System Design & Database Design {#phase-2}

---

## 2.1 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌───────────────────┐   │
│  │  Landing     │   │  Calculator  │   │    Dashboard      │   │
│  │  Page        │──▶│  (6 Steps)   │──▶│  + AI Insights    │   │
│  │  /           │   │  /calculator │   │  /dashboard       │   │
│  └──────────────┘   └──────┬───────┘   └────────┬──────────┘   │
│                            │                    │              │
│                     Zod Validation         Reads data          │
│                            │                    │              │
│              ┌─────────────▼────────────────────▼──────┐       │
│              │           localStorage                   │       │
│              │  eco_history[]       |  eco_goal         │       │
│              │  eco_input           |  (Zod-validated)  │       │
│              └─────────────────────────────────────────┘       │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Server Action (HTTPS POST)
                               │ [footprintProfile JSON]
                               ▼
              ┌────────────────────────────────┐
              │   Next.js Server (Cloud Run)   │
              │                                │
              │  ┌──────────────────────────┐  │
              │  │  Server Action:          │  │
              │  │  generateInsights()      │  │
              │  │  1. Zod validate input   │  │
              │  │  2. Build Gemini prompt  │  │
              │  │  3. Call Gemini API      │  │
              │  │  4. Stream response      │  │
              │  └──────────┬───────────────┘  │
              └─────────────┼──────────────────┘
                            │ HTTPS
                            ▼
              ┌─────────────────────────────┐
              │   Google Gemini API          │
              │   (gemini-2.5-flash)         │
              │   Streaming JSON response    │
              └──────────────────────────────┘
```

---

## 2.2 Component Architecture

```
App (layout.tsx)
├── SiteHeader
│   └── Navigation links
├── Page: Landing (/)
│   ├── Hero
│   ├── HowItWorks
│   ├── TrustStrip
│   └── ClosingCta
│
├── Page: Calculator (/calculator)
│   └── CalculatorForm (state machine: step 0–5)
│       ├── StepPanel (progress bar + nav buttons)
│       │   ├── StepIndicator
│       │   └── NavButtons (Back / Next / Submit)
│       ├── Step 0: RegionStep
│       │   └── SelectField
│       ├── Step 1: TransportStep
│       │   ├── NumberField (car km)
│       │   ├── RadioGroup (fuel type)
│       │   ├── NumberField (public transport km)
│       │   ├── NumberField (short-haul flights)
│       │   └── NumberField (long-haul flights)
│       ├── Step 2: HomeStep
│       │   ├── NumberField (electricity kWh)
│       │   ├── SelectField (heating type)
│       │   ├── NumberField (heating qty)
│       │   ├── NumberField (household size)
│       │   └── NumberField (renewable %)
│       ├── Step 3: FoodStep
│       │   └── RadioGroup (diet type)
│       ├── Step 4: ConsumptionStep
│       │   ├── NumberField (goods spend)
│       │   └── NumberField (services spend)
│       └── Step 5: ReviewStep
│           └── Summary of all inputs
│
├── Page: Dashboard (/dashboard)
│   └── DashboardView (reads localStorage)
│       ├── StatCard × 3 (total, biggest emitter, vs target)
│       ├── ComparisonCard (vs avg, vs 1.5°C)
│       ├── Charts (lazy-loaded)
│       │   ├── CategoryBarChart (Recharts)
│       │   └── CategoryDonutChart (Recharts)
│       ├── HistoryTrendChart (Recharts, lazy-loaded)
│       ├── GeminiInsights
│       │   ├── InsightSkeleton (loading state)
│       │   └── TipCard × 5
│       └── GoalTracker
│           ├── GoalSetForm (if no goal)
│           └── GoalProgressCard (if goal exists)
│               ├── ProgressBar
│               └── GoalPlanPanel (expandable, driven by generateGoalPlan())
│                   └── CategoryPlanRow × 4
│
└── SiteFooter
```

---

## 2.3 Data Flow Diagram

```
User fills Step 1–5
        │
        ▼
  [useCalculatorForm hook]
  ├── Zod validates each step
  ├── Persists to localStorage("eco_input")
  └── On submit:
        │
        ▼
  calculateFootprint(input: FootprintInput)
        │ returns FootprintResult
        ▼
  Storage.saveResult(result)
  ├── Reads history[] from localStorage("eco_history")
  ├── Appends new result
  ├── Caps at 12 entries
  └── Saves back to localStorage("eco_history")
        │
        ▼
  Router.push("/dashboard")
        │
        ▼
  DashboardView reads localStorage
  ├── Storage.getLatestResult() → FootprintResult   (from "eco_history")
  ├── Storage.getHistory()     → FootprintResult[]  (from "eco_history")
  └── Storage.getGoal()        → Goal | null        (from "eco_goal")
        │
        ├──▶ Renders charts + stat cards + comparison
        │
        ├──▶ generateInsights(profile) [Server Action — always]
        │         │
        │         ▼
        │   Gemini API (gemini-2.5-flash, streaming)
        │         │
        │         ▼
        │   TipCard × 5 render progressively
        │
        └──▶ generateGoalPlan(profile, goal) [Server Action — only if eco_goal set]
                  │
                  ▼
            Gemini API (gemini-2.5-flash, non-streaming)
                  │
                  ▼
            GoalPlanPanel — CategoryPlanRow × 4
```

---

## 2.4 Database Design

> The application uses **browser localStorage** as its persistence layer. There is no server-side database. All schemas are defined in Zod and serve as the single source of truth.

### 2.4.1 localStorage Key Map

> **Canonical key names** — these exact strings are used in all code, diagrams, and schemas throughout this document.

| Key | Schema | Description |
|---|---|---|
| `eco_input` | `FootprintInputSchema` | Most recent calculator answers |
| `eco_history` | `FootprintResultSchema[]` | Array of past results (max 12) |
| `eco_goal` | `GoalSchema` | User's reduction goal |

---

### 2.4.2 Schema Definitions (Zod = TypeScript types)

#### FootprintInputSchema

```typescript
const RegionSchema = z.enum([
  'india', 'uk', 'usa', 'eu', 'australia', 'global'
]);

const FuelTypeSchema = z.enum([
  'petrol', 'diesel', 'hybrid', 'electric', 'none'
]);

const DietTypeSchema = z.enum([
  'vegan', 'vegetarian', 'pescatarian', 'omnivore', 'high-meat'
]);

const HeatingTypeSchema = z.enum([
  'natural-gas', 'heating-oil', 'lpg', 'electric', 'firewood', 'none'
]);

const FootprintInputSchema = z.object({
  // Step 0 — Region
  region: RegionSchema,

  // Step 1 — Transport
  carKmPerWeek:       z.number().min(0).max(5000),
  fuelType:           FuelTypeSchema,
  publicTransportKm:  z.number().min(0).max(2000),
  shortHaulFlights:   z.number().int().min(0).max(50),
  longHaulFlights:    z.number().int().min(0).max(30),

  // Step 2 — Home
  electricityKwhPerMonth: z.number().min(0).max(5000),
  heatingType:            HeatingTypeSchema,
  heatingQtyPerMonth:     z.number().min(0),
  householdSize:          z.number().int().min(1).max(20),
  renewablePercent:       z.number().min(0).max(100),

  // Step 3 — Food
  dietType: DietTypeSchema,

  // Step 4 — Consumption
  goodsSpendPerMonth:    z.number().min(0),
  servicesSpendPerMonth: z.number().min(0),
});

type FootprintInput = z.infer<typeof FootprintInputSchema>;
```

#### FootprintResultSchema

```typescript
const CategoryBreakdownSchema = z.object({
  transport:   z.number(),   // kg CO₂e/year
  homeEnergy:  z.number(),
  food:        z.number(),
  consumption: z.number(),
});

const FootprintResultSchema = z.object({
  id:            z.string().uuid(),
  timestamp:     z.string().datetime(),     // ISO 8601
  input:         FootprintInputSchema,
  totalKgCO2e:   z.number(),
  breakdown:     CategoryBreakdownSchema,
  regionalAvg:   z.number(),               // kg CO₂e/year for user's region
  parisTarget:   z.literal(2100),          // 2.1 tCO₂e = 2100 kg
});

type FootprintResult = z.infer<typeof FootprintResultSchema>;
```

#### GoalSchema

```typescript
const GoalSchema = z.object({
  targetKgCO2e: z.number().min(0),         // user's annual target
  targetDate:   z.string().datetime(),      // ISO 8601
  baselineKg:   z.number(),                // footprint when goal was set
  setAt:        z.string().datetime(),
});

type Goal = z.infer<typeof GoalSchema>;
```

#### TipSchema (Gemini response structure)

```typescript
const TipSchema = z.object({
  title:         z.string().max(80),
  savingKgCO2e:  z.number().min(0),       // estimated annual saving
  rationale:     z.string().max(200),
  difficulty:    z.enum(['Easy', 'Medium', 'Hard']),
  category:      z.enum(['transport', 'homeEnergy', 'food', 'consumption']),
});

const GeminiResponseSchema = z.object({
  tips: z.array(TipSchema).length(5),
});

type Tip = z.infer<typeof TipSchema>;
```

#### GoalPlanResponseSchema (FR-04.6)

```typescript
const CategoryGoalActionSchema = z.object({
  category:        z.enum(['transport', 'homeEnergy', 'food', 'consumption']),
  reductionNeeded: z.number().min(0),   // kg CO₂e that must come from this category
  actions:         z.array(z.string().max(200)).min(1).max(2),
});

const GoalPlanResponseSchema = z.object({
  categories: z.array(CategoryGoalActionSchema).length(4),
});

type CategoryGoalAction = z.infer<typeof CategoryGoalActionSchema>;
type GoalPlanResponse   = z.infer<typeof GoalPlanResponseSchema>;
```

---

### 2.4.3 ER-Style Data Model

```
┌──────────────────────────────┐
│      FootprintResult         │
├──────────────────────────────┤
│ id           UUID (PK)       │
│ timestamp    datetime        │
│ totalKgCO2e  number          │
│ regionalAvg  number          │
│ parisTarget  2100 (literal)  │
│                              │
│ ┌──────────────────────┐     │
│ │  CategoryBreakdown   │     │
│ ├──────────────────────┤     │
│ │ transport   number   │     │
│ │ homeEnergy  number   │     │
│ │ food        number   │     │
│ │ consumption number   │     │
│ └──────────────────────┘     │
│                              │
│ ┌──────────────────────┐     │
│ │   FootprintInput     │     │  (embedded, full calculator answers)
│ ├──────────────────────┤     │
│ │ region      enum     │     │
│ │ fuelType    enum     │     │
│ │ dietType    enum     │     │
│ │ ... 12 more fields   │     │
│ └──────────────────────┘     │
└──────────────────────────────┘
            ▲
            │  stored as array (max 12)
            │
┌───────────────────────────┐
│    localStorage           │
│    "eco_history" [ ]      │
└───────────────────────────┘

┌───────────────────────────┐
│         Goal              │
├───────────────────────────┤
│ targetKgCO2e  number      │
│ targetDate    datetime    │
│ baselineKg    number      │
│ setAt         datetime    │
└───────────────────────────┘
            │
            │ stored at
            │
┌───────────────────────────┐
│  localStorage "eco_goal"  │
└───────────────────────────┘
```

---

### 2.4.4 Emission Factors Reference Table

```typescript
// src/lib/emission-factors.ts

/** kg CO₂e per km driven */
export const CAR_FACTORS = {
  petrol:   0.192,
  diesel:   0.171,
  hybrid:   0.111,
  electric: 0.053,
  none:     0,
} as const;

/** kg CO₂e per passenger-km */
export const PUBLIC_TRANSPORT_FACTOR = 0.06;

/** kg CO₂e per one-way flight */
export const FLIGHT_FACTORS = {
  shortHaul: 250,
  longHaul:  1100,
} as const;

/** Electricity grid carbon intensity kg CO₂e/kWh */
export const GRID_INTENSITY = {
  india:     0.713,
  uk:        0.207,
  usa:       0.386,
  eu:        0.276,
  australia: 0.656,
  global:    0.490,
} as const;

/** kg CO₂e per annual diet */
export const DIET_FACTORS = {
  vegan:        1500,
  vegetarian:   1700,
  pescatarian:  1900,
  omnivore:     2500,
  'high-meat':  3300,
} as const;

/** kg CO₂e per £1000 spend/year */
export const CONSUMPTION_FACTORS = {
  goods:    400,
  services: 100,
} as const;

/** Regional average annual footprint (kg CO₂e) */
export const REGIONAL_AVERAGES = {
  india:     1900,
  uk:        5500,
  usa:       15000,
  eu:        8000,
  australia: 15400,
  global:    7000,
} as const;

/** 1.5°C compatible per-capita budget (kg CO₂e/year) */
export const PARIS_TARGET_KG = 2100;
```

---

# PHASE 3 — Tool Selection & Implementation Plan {#phase-3}

---

## 3.1 Tool Selection Matrix

| Tool | Role in Project | Why Selected | Where Used |
|---|---|---|---|
| **Anti-Gravity (this AI)** | Architect · Scaffolder · Reviewer | End-to-end code generation with project context | Architecture design, all boilerplate, test generation, code review, Gemini prompt iteration |
| **Google Gemini API** (`gemini-2.5-flash`) | Personalized insights engine (tips) + goal achievement plan | Current-generation model; fast, cost-efficient, supports structured JSON output and streaming; directly satisfies Google Services scoring criterion | `src/lib/gemini.ts`, `src/components/ai/GeminiInsights.tsx`, `src/components/ai/GoalPlanPanel.tsx` |
| **Google Cloud Run** | Production deployment | Native Google Cloud = explicit Google Services signal; Docker-based, scales to zero | `Dockerfile`, `cloudbuild.yaml`, deployment |
| **Next.js 15 (App Router)** | Full-stack framework | Server Actions for secure Gemini calls; best DX for TypeScript + React | Entire application |
| **TypeScript (strict)** | Type safety | Required for Code Quality scoring; prevents runtime errors | All `*.ts` / `*.tsx` files |
| **Zod** | Schema validation | Single source of truth for all data shapes; server + client validation | `src/lib/schemas.ts`, all data reads/writes |
| **Recharts** | Data visualization | Accessible, React-native, composable charts | `src/components/charts/` |
| **Vitest + React Testing Library** | Unit + component testing | Fast, ESM-native test runner; Testing criterion scoring | `*.test.ts` / `*.test.tsx` |
| **ESLint + `@typescript-eslint`** | Code quality enforcement | Automated enforcement of strict rules = mechanical quality | `.eslintrc.json`, CI |
| **Tailwind CSS** | Styling | Rapid development; consistent design tokens | All components |

> **Firebase/Firestore excluded**: FR-05.1 mandates no server-side user data storage. Adding Firestore would directly contradict this requirement. All persistence remains in `localStorage`.

---

## 3.2 Gemini Integration Detail

### Model Choice
- **`gemini-2.5-flash`** — current-generation model; lower latency, higher quality, and lower cost than the deprecated 1.5-flash family. Supports structured JSON output natively.
- `gemini-1.5-flash` and `gemini-2.0-flash` are **deprecated** and MUST NOT be used in new code.

### Prompt Architecture

```
SYSTEM: You are a carbon footprint reduction expert. Respond ONLY with valid JSON 
        matching the schema provided. Do not add markdown fences or explanations.

USER:
User carbon footprint profile:
  Region: {region} (grid: {gridKgPerKwh} kg CO₂e/kWh)
  Total annual footprint: {totalKg} kg CO₂e
  vs. regional average ({regionalAvg} kg): {diffPct}%
  vs. Paris 1.5°C target (2100 kg): {targetDiffPct}%

  Category breakdown:
    Transport:    {transportKg} kg ({transportPct}%)
    Home Energy:  {homeKg} kg ({homePct}%)
    Food:         {foodKg} kg ({foodPct}%)
    Consumption:  {consumptionKg} kg ({consumptionPct}%)

  Details:
    Car: {carKm} km/week, fuel: {fuelType}
    Public transport: {ptKm} km/week
    Flights: {shortHaul} short-haul, {longHaul} long-haul per year
    Heating: {heatingType}
    Diet: {dietType}
    Renewable energy: {renewablePct}%

Return exactly 5 reduction tips as JSON:
{
  "tips": [
    {
      "title": "string (max 10 words)",
      "savingKgCO2e": number,
      "rationale": "string (max 200 chars, specific to this user)",
      "difficulty": "Easy" | "Medium" | "Hard",
      "category": "transport" | "homeEnergy" | "food" | "consumption"
    }
  ]
}

Rank by savingKgCO2e descending. Only suggest tips relevant to this user's profile.
```

### Server Action Pattern

```typescript
// src/lib/gemini.ts
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponseSchema, GoalPlanResponseSchema } from './schemas';
import type { FootprintResult, Goal, Tip, GoalPlanResponse } from './schemas';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateInsights(result: FootprintResult): Promise<Tip[]> {
  // 1. Validate input server-side
  // 2. Enforce rate limit (see NFR-02b.1)
  // 3. Build prompt
  // 4. Call Gemini (gemini-2.5-flash)
  // 5. Parse + validate response with GeminiResponseSchema
  // 6. Return tips or throw (fallback handled by client)
}

export async function generateGoalPlan(
  result: FootprintResult,
  goal: Goal,
): Promise<GoalPlanResponse> {
  // 1. Validate inputs server-side (FootprintResultSchema + GoalSchema)
  // 2. Enforce rate limit (shared bucket with generateInsights)
  // 3. Build goal-plan prompt (see §3.2 Goal Plan Prompt)
  // 4. Call Gemini (gemini-2.5-flash)
  // 5. Parse + validate response with GoalPlanResponseSchema
  // 6. Return plan or throw (client shows static per-category fallback)
}
```

### Goal Plan Prompt Architecture (FR-04.6)

```
SYSTEM: You are a carbon footprint reduction expert. Respond ONLY with valid JSON
        matching the schema provided. Do not add markdown fences or explanations.

USER:
The user's current annual footprint is {totalKg} kg CO₂e (target: {targetKg} kg CO₂e).
They need to reduce by {reductionNeeded} kg CO₂e total by {targetDate}.

Current category breakdown:
  Transport:    {transportKg} kg ({transportPct}%)
  Home Energy:  {homeKg} kg ({homePct}%)
  Food:         {foodKg} kg ({foodPct}%)
  Consumption:  {consumptionKg} kg ({consumptionPct}%)

User details:
  Region: {region}, Fuel: {fuelType}, Diet: {dietType},
  Renewable energy: {renewablePct}%

Return a category-level plan as JSON:
{
  "categories": [
    {
      "category": "transport" | "homeEnergy" | "food" | "consumption",
      "reductionNeeded": number,   // kg CO₂e this category must contribute
      "actions": ["string", "string"]  // 1–2 concrete actions, specific to this user
    }
  ]  // exactly 4 entries, one per category
}

Distribute the total reduction proportionally to each category's share.
Only suggest actions relevant to this user's actual profile.
```

---

## 3.3 Cloud Run Deployment Design

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**Environment Variables on Cloud Run:**
- `GEMINI_API_KEY` — Secret Manager reference
- `NEXT_PUBLIC_APP_URL` — Production URL

---

## 3.4 Implementation Plan (Week-by-Week)

### Week 1 — Foundation (Days 1–2)
```
Day 1:
  [ ] Initialize Next.js 15 project (npx create-next-app@latest)
  [ ] Configure TypeScript strict mode
  [ ] Set up ESLint with @typescript-eslint strict rules
  [ ] Set up Vitest + React Testing Library
  [ ] Set up Tailwind CSS
  [ ] Create src/lib/schemas.ts (all Zod schemas)
  [ ] Create src/lib/emission-factors.ts (all constants)
  [ ] Create src/lib/constants.ts (named magic numbers)

Day 2:
  [ ] Implement src/lib/calculator.ts + calculator.test.ts
  [ ] Implement src/lib/comparisons.ts + comparisons.test.ts
  [ ] Implement src/lib/tips-engine.ts + tips-engine.test.ts (static fallback)
  [ ] Implement src/lib/goal.ts + goal.test.ts
  [ ] Implement src/lib/storage.ts + storage.test.ts
  [ ] Implement src/lib/format.ts + format.test.ts
  [ ] Implement src/lib/number.ts + number.test.ts
  [ ] Create src/test/factories.ts (typed test factories)
  [ ] Run: npm run lint && npm run typecheck && npm run test ✓
```

### Week 1 — UI Foundation (Days 3–4)
```
Day 3:
  [ ] Build src/components/ui/ primitives:
      Button, Card, Field, NumberField, SelectField,
      RadioGroup, Checkbox, ProgressBar, Stepper, Badge
  [ ] Build src/components/layout/SiteHeader.tsx
  [ ] Build src/components/layout/SiteFooter.tsx
  [ ] Build landing page components: Hero, HowItWorks, TrustStrip, ClosingCta

Day 4:
  [ ] Build CalculatorForm (step state machine + useCalculatorForm hook)
  [ ] Build all 6 step components (Region, Transport, Home, Food, Consumption, Review)
  [ ] Wire localStorage persistence for form state
  [ ] Add step-by-step Zod validation
```

### Week 1 — Dashboard & AI (Days 5–7)
```
Day 5:
  [ ] Build chart components: CategoryBarChart, CategoryDonutChart, HistoryTrendChart
  [ ] Wrap in lazy.tsx (dynamic imports)
  [ ] Build DashboardView, StatCard, ComparisonCard

Day 6:
  [ ] Build GoalTracker, GoalSetForm, GoalProgressCard
  [ ] Implement src/lib/gemini.ts (Server Action)
  [ ] Build GeminiInsights, InsightSkeleton, TipCard

Day 7:
  [ ] Connect full data flow: calculator → localStorage → dashboard → Gemini
  [ ] Add DashboardLoader redirect guard
  [ ] Wire streaming response to progressive TipCard rendering
  [ ] Write component tests for CalculatorForm, GoalTracker, GeminiInsights
```

### Week 2 — Quality, Security, Deploy (Days 8–10)
```
Day 8:
  [ ] Add CSP headers in next.config.ts + middleware.ts
  [ ] Add skip-to-content link in layout.tsx
  [ ] Audit all ARIA attributes (forms, charts, progress bars)
  [ ] Audit color contrast (Lighthouse ≥ 95 accessibility)

Day 9:
  [ ] Run Lighthouse — fix any Performance / Accessibility issues
  [ ] Write Dockerfile
  [ ] Set up Google Cloud Run (gcloud CLI or Console)
  [ ] Deploy with GEMINI_API_KEY from Secret Manager

Day 10:
  [ ] Write README.md with full tool documentation (validation requirement)
  [ ] Write METHODOLOGY.md (emission factor sources)
  [ ] Final: npm run lint && typecheck && test && build (all green)
  [ ] Record Loom / screenshots for LinkedIn post
  [ ] Submit
```

---

# PHASE 4 — Implementation {#phase-4}

---

## 4.1 Scaffolding Order (Dependency-Safe)

Implement in this exact order to avoid circular imports:

```
1. src/lib/schemas.ts          ← No dependencies
2. src/lib/emission-factors.ts ← No dependencies
3. src/lib/constants.ts        ← No dependencies
4. src/lib/number.ts           ← No dependencies
5. src/lib/format.ts           ← imports number.ts
6. src/lib/calculator.ts       ← imports schemas, emission-factors, number
7. src/lib/comparisons.ts      ← imports schemas, emission-factors
8. src/lib/tips-engine.ts      ← imports schemas, emission-factors, number
9. src/lib/breakdown.ts        ← imports schemas
10. src/lib/goal.ts            ← imports schemas, number
11. src/lib/storage.ts         ← imports schemas (uses localStorage)
12. src/lib/gemini.ts          ← imports schemas (server-only)
13. src/components/ui/*        ← No lib imports
14. src/components/calculator/* ← imports ui, lib
15. src/components/charts/*    ← imports recharts
16. src/components/dashboard/* ← imports ui, charts, lib
17. src/components/ai/*        ← imports lib/gemini, ui
18. src/app/*/page.tsx         ← assembles components
```

---

## 4.2 Critical Code Patterns

### Pattern 1 — Calculator Engine

```typescript
// src/lib/calculator.ts

import { CAR_FACTORS, DIET_FACTORS, FLIGHT_FACTORS,
         GRID_INTENSITY, PUBLIC_TRANSPORT_FACTOR,
         CONSUMPTION_FACTORS, REGIONAL_AVERAGES, PARIS_TARGET_KG
} from './emission-factors';
import { round } from './number';
import type { FootprintInput, FootprintResult, CategoryBreakdown } from './schemas';

/** Converts annual footprint input into kg CO₂e per category */
export function calculateFootprint(input: FootprintInput): FootprintResult {
  const transport = calculateTransport(input);
  const homeEnergy = calculateHomeEnergy(input);
  const food = DIET_FACTORS[input.dietType];
  const consumption = calculateConsumption(input);

  const breakdown: CategoryBreakdown = { transport, homeEnergy, food, consumption };
  const totalKgCO2e = round(transport + homeEnergy + food + consumption);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    input,
    totalKgCO2e,
    breakdown,
    regionalAvg: REGIONAL_AVERAGES[input.region],
    parisTarget: PARIS_TARGET_KG,
  };
}
```

### Pattern 2 — Zod-Safe Storage

```typescript
// src/lib/storage.ts

import { FootprintResultSchema, GoalSchema } from './schemas';
import type { FootprintResult, Goal } from './schemas';

const HISTORY_KEY = 'eco_history';
const GOAL_KEY    = 'eco_goal';
const MAX_HISTORY = 12;

export function getHistory(): FootprintResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Re-validate on every read — corrupted data is silently discarded
    return FootprintResultSchema.array().parse(parsed);
  } catch {
    return [];
  }
}

export function saveResult(result: FootprintResult): void {
  try {
    const history = getHistory();
    const updated = [...history, result].slice(-MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      // Surface to user via event or toast
      window.dispatchEvent(new Event('storage-quota-exceeded'));
    }
  }
}
```

### Pattern 3 — Gemini Server Action

```typescript
// src/lib/gemini.ts
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponseSchema, FootprintResultSchema } from './schemas';
import type { FootprintResult, Tip } from './schemas';
import { buildGeminiPrompt } from './prompt-builder';
import { rankTips } from './tips-engine';  // static fallback

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function generateInsights(rawResult: unknown): Promise<Tip[]> {
  // 1. Server-side input validation (never trust client)
  const result = FootprintResultSchema.parse(rawResult);

  try {
    const prompt = buildGeminiPrompt(result);
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const parsed = JSON.parse(text);
    const validated = GeminiResponseSchema.parse(parsed);
    return validated.tips;
  } catch {
    // Graceful fallback to static tips engine
    return rankTips(result.input, result);
  }
}
```

### Pattern 4 — Tips Ranking Engine (Static Fallback)

```typescript
// src/lib/tips-engine.ts

import { FLIGHT_FACTORS, CAR_FACTORS } from './emission-factors';
import { round } from './number';
import type { FootprintInput, FootprintResult, Tip } from './schemas';

const EV_SAVINGS_PER_KM = CAR_FACTORS.petrol - CAR_FACTORS.electric; // 0.139 kg/km

/** Generates context-aware tips ranked by CO₂e saving, largest first */
export function rankTips(input: FootprintInput, result: FootprintResult): Tip[] {
  const tips: Tip[] = [];

  // Only suggest EV if driving a petrol/diesel car
  if (input.fuelType === 'petrol' || input.fuelType === 'diesel') {
    const saving = round(input.carKmPerWeek * 52 * EV_SAVINGS_PER_KM);
    tips.push({
      title: 'Switch to an electric vehicle',
      savingKgCO2e: saving,
      rationale: `At ${input.carKmPerWeek} km/week, switching from ${input.fuelType} would save ${saving} kg CO₂e/year.`,
      difficulty: 'Hard',
      category: 'transport',
    });
  }

  // Only suggest flight reduction if they fly
  if (input.longHaulFlights > 0) {
    const saving = round(input.longHaulFlights * FLIGHT_FACTORS.longHaul * 0.5);
    tips.push({ ... });
  }

  // ... more context-aware tips

  return tips.sort((a, b) => b.savingKgCO2e - a.savingKgCO2e).slice(0, 5);
}
```

---

## 4.3 Security Headers (next.config.ts)

```typescript
// middleware.ts — generates a fresh nonce per request and injects it into headers
// (Next.js App Router CSP nonce pattern)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,   // NO unsafe-inline / unsafe-eval
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",  // CSS inline is acceptable
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self' https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
  ].join('; ');

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Nonce', nonce);               // read by layout.tsx to set nonce on <script>
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = { matcher: '/((?!_next/static|_next/image|favicon.ico).*)' };
```

```typescript
// next.config.ts — standalone output only; CSP is set in middleware.ts

export default {
  output: 'standalone',  // Required for Cloud Run Docker build
};
```

> **Why nonces instead of `unsafe-inline`?** NFR-02.1 explicitly prohibits `unsafe-inline` for `script-src`. Next.js App Router supports nonce-based CSP: the nonce is generated in `middleware.ts`, injected via a response header, and read by `layout.tsx` to stamp the nonce attribute on all `<script>` tags Next.js renders.

---

# PHASE 5 — Testing {#phase-5}

---

## 5.1 Testing Strategy

| Test Type | Tool | What It Covers | Target Coverage |
|---|---|---|---|
| Unit | Vitest | All `src/lib/` functions | 100% |
| Integration | Vitest | Storage read/write + Zod validation chains | 90% |
| Component | React Testing Library | CalculatorForm, GoalTracker, GeminiInsights | Key interactions |
| Accessibility | axe-core (via `jest-axe`) | All pages — no ARIA violations | 0 violations |
| Security | Manual + audit | No secrets in bundle, CSP headers, localStorage validation | Pre-submission |
| Performance | Lighthouse CI | Performance ≥ 90, Accessibility ≥ 95 | Pre-submission |

---

## 5.2 Unit Test Examples

### Calculator Test

```typescript
// src/lib/calculator.test.ts

import { describe, it, expect } from 'vitest';
import { calculateFootprint } from './calculator';
import { makeInput } from '../test/factories';
import { PARIS_TARGET_KG, REGIONAL_AVERAGES } from './emission-factors';

describe('calculateFootprint', () => {
  it('returns correct regional average for India', () => {
    const input = makeInput({ region: 'india' });
    const result = calculateFootprint(input);
    expect(result.regionalAvg).toBe(REGIONAL_AVERAGES.india);
  });

  it('sets Paris target to 2100 kg', () => {
    const result = calculateFootprint(makeInput());
    expect(result.parisTarget).toBe(PARIS_TARGET_KG);
  });

  it('computes zero transport for non-driver with no flights', () => {
    const input = makeInput({
      fuelType: 'none',
      carKmPerWeek: 0,
      publicTransportKm: 0,
      shortHaulFlights: 0,
      longHaulFlights: 0,
    });
    expect(calculateFootprint(input).breakdown.transport).toBe(0);
  });

  it('petrol car emits more than electric for same km', () => {
    const petrol   = calculateFootprint(makeInput({ fuelType: 'petrol',   carKmPerWeek: 200 }));
    const electric = calculateFootprint(makeInput({ fuelType: 'electric', carKmPerWeek: 200 }));
    expect(petrol.breakdown.transport).toBeGreaterThan(electric.breakdown.transport);
  });

  it('high-meat diet emits more than vegan', () => {
    const highMeat = calculateFootprint(makeInput({ dietType: 'high-meat' }));
    const vegan    = calculateFootprint(makeInput({ dietType: 'vegan' }));
    expect(highMeat.breakdown.food).toBeGreaterThan(vegan.breakdown.food);
  });
});
```

### Tips Engine Test

```typescript
// src/lib/tips-engine.test.ts

import { describe, it, expect } from 'vitest';
import { rankTips } from './tips-engine';
import { makeInput, makeResult } from '../test/factories';

describe('rankTips', () => {
  it('does NOT suggest EV switch for non-drivers', () => {
    const input = makeInput({ fuelType: 'none', carKmPerWeek: 0 });
    const tips = rankTips(input, makeResult(input));
    expect(tips.some(t => t.title.includes('electric vehicle'))).toBe(false);
  });

  it('suggests EV switch for petrol drivers', () => {
    const input = makeInput({ fuelType: 'petrol', carKmPerWeek: 300 });
    const tips = rankTips(input, makeResult(input));
    expect(tips.some(t => t.category === 'transport')).toBe(true);
  });

  it('returns at most 5 tips', () => {
    const input = makeInput();
    const tips = rankTips(input, makeResult(input));
    expect(tips.length).toBeLessThanOrEqual(5);
  });

  it('tips are sorted by savingKgCO2e descending', () => {
    const tips = rankTips(makeInput(), makeResult(makeInput()));
    for (let i = 1; i < tips.length; i++) {
      expect(tips[i - 1].savingKgCO2e).toBeGreaterThanOrEqual(tips[i].savingKgCO2e);
    }
  });
});
```

### Storage Test

```typescript
// src/lib/storage.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { getHistory, saveResult, getGoal, saveGoal } from './storage';
import { makeResult, makeGoal } from '../test/factories';

beforeEach(() => localStorage.clear());

describe('saveResult / getHistory', () => {
  it('saves and retrieves a result', () => {
    const result = makeResult();
    saveResult(result);
    expect(getHistory()).toHaveLength(1);
    expect(getHistory()[0].id).toBe(result.id);
  });

  it('caps history at 12 entries', () => {
    for (let i = 0; i < 15; i++) saveResult(makeResult());
    expect(getHistory()).toHaveLength(12);
  });

  it('returns empty array for corrupted localStorage', () => {
    localStorage.setItem('eco_history', 'not-json{{{');
    expect(getHistory()).toEqual([]);
  });

  it('discards entries that fail Zod validation', () => {
    localStorage.setItem('eco_history', JSON.stringify([{ bad: 'data' }]));
    expect(getHistory()).toEqual([]);
  });
});
```

### Typed Test Factory

```typescript
// src/test/factories.ts

import type { DeepPartial } from 'ts-essentials';
import type { FootprintInput, FootprintResult, Goal } from '../lib/schemas';
import { calculateFootprint } from '../lib/calculator';

const BASE_INPUT: FootprintInput = {
  region:               'uk',
  carKmPerWeek:         100,
  fuelType:             'petrol',
  publicTransportKm:    50,
  shortHaulFlights:     2,
  longHaulFlights:      1,
  electricityKwhPerMonth: 250,
  heatingType:          'natural-gas',
  heatingQtyPerMonth:   50,
  householdSize:        2,
  renewablePercent:     0,
  dietType:             'omnivore',
  goodsSpendPerMonth:   200,
  servicesSpendPerMonth: 100,
};

export function makeInput(overrides: DeepPartial<FootprintInput> = {}): FootprintInput {
  return { ...BASE_INPUT, ...overrides } as FootprintInput;
}

export function makeResult(input?: FootprintInput): FootprintResult {
  return calculateFootprint(input ?? makeInput());
}

export function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    targetKgCO2e: 3000,
    targetDate:   new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    baselineKg:   5000,
    setAt:        new Date().toISOString(),
    ...overrides,
  };
}
```

---

## 5.3 Component Tests

```typescript
// src/components/calculator/CalculatorForm.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalculatorForm } from './CalculatorForm';

describe('CalculatorForm', () => {
  it('renders Step 1 (Region) by default', () => {
    render(<CalculatorForm />);
    expect(screen.getByText(/select your region/i)).toBeInTheDocument();
  });

  it('shows validation error when required field is empty', async () => {
    render(<CalculatorForm />);
    // Skip region selection, click Next
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('advances to step 2 when region is selected', async () => {
    render(<CalculatorForm />);
    fireEvent.click(screen.getByLabelText(/india/i));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText(/transport/i)).toBeInTheDocument();
  });
});
```

---

## 5.4 Accessibility Tests

```typescript
// src/components/dashboard/DashboardView.test.tsx

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';
import { DashboardView } from './DashboardView';
import { makeResult } from '../../test/factories';

expect.extend(toHaveNoViolations);

it('has no ARIA violations on Dashboard', async () => {
  const { container } = render(<DashboardView result={makeResult()} history={[]} goal={null} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 5.5 CI Configuration

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type-check
        run: npm run typecheck

      - name: Test (with coverage)
        run: npm run test -- --coverage

      - name: Build
        run: npm run build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

---

## 5.6 Pre-Submission Verification Checklist

### Automated (CI must be green)
- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm run typecheck` — 0 TypeScript errors
- [ ] `npm run test` — all tests pass, coverage ≥ 80% on `src/lib/`
- [ ] `npm run build` — successful production build

### Manual (before final submission)
- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Keyboard-only navigation works on all pages
- [ ] Screen reader test: form labels announced correctly
- [ ] Gemini API disabled: app falls back to static tips without error
- [ ] localStorage cleared: app redirects to calculator gracefully
- [ ] Gemini API key NOT visible in browser Network tab or JS bundle
- [ ] CSP headers present in browser DevTools → Network → Response Headers
- [ ] Cloud Run URL live and accessible
- [ ] README.md tool documentation complete

---

*End of SRS — Carbon Footprint Awareness Platform v1.0*
