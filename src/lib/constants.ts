export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_YEAR = 52;
export const MAX_HISTORY_ENTRIES = 12;

export const RATE_LIMIT_REQUESTS = 10;
export const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute in milliseconds

export const PARIS_TARGET_LIMIT = 2100; // 2.1 tonnes in kg CO2e
export const KILO_CONVERSION_DIVISOR = 1000; // divisor for metrics per 1000 units (e.g. spend factor)

/** Human-readable region labels for display in the dashboard stat cards. */
export const REGION_LABELS: Record<string, string> = {
  india:     'India average',
  uk:        'UK average',
  usa:       'US average',
  eu:        'EU average',
  australia: 'Australia average',
  global:    'global average',
} as const;

// ─── Tips Engine Thresholds (named to satisfy NFR-01.4 — no magic numbers) ───

/** Minimum weekly car km for the EV tip to be suggested. */
export const EV_MIN_CAR_KM_WEEK = 10;
/** Minimum annual CO₂e saving (kg) for the EV tip to appear. */
export const EV_SAVING_THRESHOLD_KG = 50;
/** Minimum annual CO₂e saving (kg) for the renewable electricity tip to appear. */
export const RENEWABLE_SAVING_THRESHOLD_KG = 30;
/** Minimum annual CO₂e saving (kg) for the heating reduction tip to appear. */
export const HEATING_SAVING_THRESHOLD_KG = 20;
/** Minimum monthly goods spend (local currency) for the second-hand shopping tip to appear. */
export const MIN_GOODS_SPEND = 10;
/** Minimum annual CO₂e saving (kg) for the goods spend reduction tip to appear. */
export const GOODS_SAVING_THRESHOLD_KG = 20;
/** Minimum weekly car km to suggest replacing trips with public transport. */
export const PT_SWAP_MIN_CAR_KM_WEEK = 150;
/** Minimum annual CO₂e saving (kg) for the public transport swap tip to appear. */
export const PT_SAVING_THRESHOLD_KG = 20;
