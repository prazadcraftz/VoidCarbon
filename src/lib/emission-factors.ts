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

/** kg CO₂e per annual heating fuel unit */
export const HEATING_FACTORS = {
  'natural-gas': 0.202, // kg CO₂e per kWh or m³ depending on average usage, standard factor
  'heating-oil': 2.68,  // kg CO₂e per litre
  lpg:           1.56,  // kg CO₂e per litre
  electric:      0.35,  // standard average heating grid mix
  firewood:      0.015, // low fossil contribution (mostly biomass)
  none:          0,
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

/** Regional currency settings and fixed exchange rates to British Pound (GBP) */
export const REGIONAL_CURRENCY = {
  india: {
    symbol: '₹',
    code: 'INR',
    exchangeRate: 0.0093, // 1 INR = 0.0093 GBP
  },
  uk: {
    symbol: '£',
    code: 'GBP',
    exchangeRate: 1.0, // 1 GBP = 1.0 GBP
  },
  usa: {
    symbol: '$',
    code: 'USD',
    exchangeRate: 0.80, // 1 USD = 0.80 GBP
  },
  eu: {
    symbol: '€',
    code: 'EUR',
    exchangeRate: 0.85, // 1 EUR = 0.85 GBP
  },
  australia: {
    symbol: '$',
    code: 'AUD',
    exchangeRate: 0.52, // 1 AUD = 0.52 GBP
  },
  global: {
    symbol: '$',
    code: 'USD',
    exchangeRate: 0.80, // Use USD as default global currency reference
  },
} as const;
