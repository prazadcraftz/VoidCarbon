# VoidCarbon 🌿

VoidCarbon is a personal carbon footprint tracking and AI-driven sustainability advisory platform. It is built as a responsive, light-theme, nature-inspired web application powered by **Next.js 16 (App Router)**, **Tailwind CSS**, and **Google Gemini AI**.

---

## 🗺️ Chosen Vertical

**Personal Environmental Sustainability & Actionable Carbon Reductions**
- **Core Goal**: Bridge the gap between abstract emission metrics (like `t CO₂e`) and daily habits by educating users on their personal environmental footprint and supplying tailored, AI-guided action steps.

---

## 💡 Approach and Logic

### 1. The Dynamic Assessment Wizard
A 6-step responsive wizard guides the user through assessing their carbon impact:
- **Region Select**: Establishes regional grid emission factors and averages.
- **Transport**: Tracks weekly car transit, public transport, and yearly flight counts. Includes smart "no car" configuration disables to prevent form clutter.
- **Home Utilities**: Measures electricity and fuel heating consumption. It supports country-specific units (e.g., converting **kWh** to **Units** for India-based regions and suggesting standard **14.2 kg LPG cylinder** metrics).
- **Food & Diet**: Simple, non-technical categories (e.g., Average Meat Eater, Vegan) to demystify complex agricultural footprints.
- **Consumption**: Translates discretionary shopping and services spend into estimated carbon.
- **Review**: Summarizes inputs before committing calculations.

### 2. Nature-Inspired Aesthetic
- **Color Palette**: Calming, high-contrast light theme consisting of soft sage borders (`#c8e6d0`), mint backgrounds (`#f0faf4` / `#e8f8f0`), and forest green primary action items (`#1a7a4a`).
- **Typography**: Crisp, clean `Inter` sans-serif layout.
- **Visual Feedback**: Real-time interactive charts (Recharts) mapping category contributions and historical trend lines.

### 3. Metric Explanations & Tooltips
- Resolves abstract nomenclature (e.g. `t CO₂e` and `kg CO₂e`) by introducing contextual on-hover tooltip popovers that explain greenhouse gas warming equivalents, tonnes released per year, and the broader concept of environmental impact.
- Containers utilize `overflow-visible` positioning to prevent tooltips from being cropped or clipped near the screen edges.

---

## 🛠️ How the Solution Works

1. **Calculations (`src/lib/calculator.ts`)**:
   - Compiles user inputs across categories using standardized emission factors (from UK BEIS/DEFRA and regional grid databases).
   - Computes annual metric tonnes or kilograms of CO₂ equivalent (`CO₂e`).
2. **AI Action Roadmaps (`src/components/dashboard/GoalPlanPanel.tsx`)**:
   - Integrates the `gemini-2.5-flash` model to analyze the user's biggest emission drivers and region.
   - Returns a structured JSON list of actionable reduction tips categorized by impact, difficulty, and estimated annual savings.
3. **Data Privacy**:
   - Fully client-side storage (`localStorage`) ensuring that user audit profiles remain strictly private.

---

## 📝 Assumptions Made

1. **Extrapolations**: Daily commutes, weekly travel habits, and monthly home utility payments are scaled to estimate total **annual** carbon footprints.
2. **Region Baselines**:
   - Grid emission intensities (e.g., UK grid vs. India grid vs. US grid) are derived from averages.
   - Regional average emissions (e.g., India's average of `1.9 t CO₂e` vs. the Paris Target of `2.1 t CO₂e`) serve as the benchmark comparison.
3. **Currency Conversion**: Monthly expenditure in the consumption section assumes local currency equivalents (e.g. ₹ for India, £ for the UK, € for Germany, $ for the US) to maintain localized pricing relevance.

---

## 📂 Project Structure

```text
VoidCarbon/
├── public/                 # Static brand assets and logo vectors
├── src/
│   ├── app/                # Next.js App Router (views, pages, layouts)
│   │   ├── calculator/     # Multi-step calculator route
│   │   ├── dashboard/      # User metrics dashboard route
│   │   ├── globals.css     # Global light-theme CSS configuration
│   │   ├── layout.tsx      # Root html/body structure & context
│   │   └── page.tsx        # Homepage (calculator wizard mount)
│   ├── components/         # Reusable React components
│   │   ├── ai/             # Google Gemini integration & Tip Cards
│   │   ├── calculator/     # Calculation steps (Region, Transport, etc.)
│   │   ├── charts/         # Category distribution donut, bar, and trend charts
│   │   ├── dashboard/      # Stats displays, comparisons, and goal tracking
│   │   ├── landing/        # Hero header, CTA, and How-It-Works sections
│   │   ├── layout/         # Header logo and footer nav bar
│   │   └── ui/             # Steppers, buttons, cards, and progress bars
│   ├── lib/                # Core domain utility logic
│   │   ├── calculator.ts   # Footprint math and scaling formulas
│   │   ├── comparisons.ts  # Regional average comparisons and benchmarks
│   │   ├── emission-factors.ts  # Region-specific carbon intensity mappings
│   │   ├── gemini.ts       # Gemini API client configuration
│   │   ├── goal.ts         # User carbon reduction goal helpers
│   │   └── storage.ts      # LocalStorage profile handlers
│   └── proxy.ts            # CORS-safe request handlers
├── package.json            # Scripts, dependencies, and metadata
├── tsconfig.json           # TypeScript configuration details
└── vitest.config.ts        # Vitest configuration for the testing suite
```
