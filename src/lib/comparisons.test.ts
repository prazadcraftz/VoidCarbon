import { describe, it, expect } from 'vitest';
import { getComparisonDetails } from './comparisons';
import { makeInput, makeResult } from '../test/factories';

describe('comparisons module', () => {
  it('calculates above regional average metrics correctly', () => {
    // UK regional avg is 5500. Let's make an input that emits more.
    const input = makeInput({ region: 'uk', electricityKwhPerMonth: 1000 });
    const result = makeResult(input);
    const comparisons = getComparisonDetails(result);

    expect(result.totalKgCO2e).toBeGreaterThan(5500);
    expect(comparisons.isAboveRegionalAvg).toBe(true);
    expect(comparisons.regionalComparisonMessage).toContain('above');
  });

  it('calculates below regional average metrics correctly', () => {
    // UK regional avg is 5500. Let's make a low emission input.
    const input = makeInput({
      region: 'uk',
      carKmPerWeek: 0,
      fuelType: 'none',
      electricityKwhPerMonth: 50,
      dietType: 'vegan'
    });
    const result = makeResult(input);
    const comparisons = getComparisonDetails(result);

    expect(result.totalKgCO2e).toBeLessThan(5500);
    expect(comparisons.isAboveRegionalAvg).toBe(false);
    expect(comparisons.regionalComparisonMessage).toContain('below');
  });

  it('handles Indian average edge case where average is already below global limit', () => {
    // India regional average: 1900 kg. Global Target: 2100 kg.
    // If the user emits 2000 kg:
    // - Above regional average (2000 > 1900)
    // - Below global target (2000 < 2100)
    // The message should say they are above Indian average, but still within global 1.5°C limit.
    const input = makeInput({
      region: 'india',
      carKmPerWeek: 30,
      fuelType: 'petrol',
      electricityKwhPerMonth: 100, // adjust utility to keep emissions around 2000kg
      dietType: 'vegetarian',
      goodsSpendPerMonth: 0,
      servicesSpendPerMonth: 0
    });
    
    // We override total manually to create the exact boundary conditions for the unit test
    const result = makeResult(input);
    result.totalKgCO2e = 2000;
    
    const comparisons = getComparisonDetails(result);
    
    expect(result.totalKgCO2e).toBeGreaterThan(1900); // above India average
    expect(result.totalKgCO2e).toBeLessThan(2100);    // below global Target
    expect(comparisons.regionalComparisonMessage).toContain('above the Indian average, but still within the global 1.5°C limit');
  });
});
