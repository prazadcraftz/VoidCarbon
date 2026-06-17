import type { FuelType, HeatingType, Region } from '@/lib/schemas';

export const STEP_EXPLANATIONS = [
  // Region
  "Your country or region determines the baseline carbon intensity of the local power grid and public infrastructure. Some countries rely heavily on fossil fuels for energy generation, while others have access to cleaner, renewable power.",
  // Transport
  "Burning petrol or diesel in vehicles emits carbon dioxide (CO₂) and other harmful gases directly from tailpipes. Air travel is highly emission-intensive, releasing pollutants high in the atmosphere where they have an amplified warming impact.",
  // Home Utilities
  "Heating and electricity are massive contributors to emissions. Electricity generated from fossil fuels releases greenhouse gases at power plants, while home heating via natural gas, heating oil, or LPG releases carbon directly at home.",
  // Food & Diet
  "Global food production generates substantial greenhouse gases. Livestock farming releases large amounts of methane (a potent greenhouse gas), and the fertilizer, land clearing, and transport required for meat and dairy amplify its footprint.",
  // Consumption
  "Everything we purchase has hidden 'embedded' emissions. These stem from the energy required to extract raw materials, manufacture the product, ship it across the globe, and operate retail stores.",
  // Review
  "Ready to see your impact? Submit your inputs to view your complete dashboard. Our Google Gemini AI engine will analyze these habits to generate a custom carbon reduction roadmap tailored specifically for you."
];

export const FUEL_TYPES: { value: FuelType; label: string; emoji: string }[] = [
  { value: 'none', label: 'No car', emoji: '🚶' },
  { value: 'petrol', label: 'Petrol', emoji: '⛽' },
  { value: 'diesel', label: 'Diesel', emoji: '🚜' },
  { value: 'hybrid', label: 'Hybrid', emoji: '🔌' },
  { value: 'electric', label: 'Electric', emoji: '⚡' },
];

export function getHeatingTypes(region: Region): { value: HeatingType; label: string; unit: string }[] {
  return [
    { value: 'natural-gas', label: 'Natural Gas', unit: region === 'india' ? 'units' : 'kWh' },
    { value: 'heating-oil', label: 'Heating Oil', unit: 'L' },
    { value: 'lpg', label: 'LPG', unit: 'L' },
    { value: 'electric', label: 'Electric Heat', unit: region === 'india' ? 'units' : 'kWh' },
    { value: 'firewood', label: 'Firewood', unit: 'kg' },
    { value: 'none', label: 'None', unit: '-' },
  ];
}
