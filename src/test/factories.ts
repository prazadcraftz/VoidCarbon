import type { FootprintInput, FootprintResult, Goal } from '../lib/schemas';
import { calculateFootprint } from '../lib/calculator';

// Standard baseline footprint inputs for test generation
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

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Creates a mock footprint input with optional overrides
 */
export function makeInput(overrides: DeepPartial<FootprintInput> = {}): FootprintInput {
  return { ...BASE_INPUT, ...overrides } as FootprintInput;
}

/**
 * Creates a mock calculated footprint result with optional overrides
 */
export function makeResult(input?: FootprintInput): FootprintResult {
  return calculateFootprint(input ?? makeInput());
}

/**
 * Creates a mock reduction goal with optional overrides
 */
export function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    targetKgCO2e: 3000,
    targetDate:   new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    baselineKg:   5000,
    setAt:        new Date().toISOString(),
    ...overrides,
  };
}
