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

  it('sets global target to 2100 kg CO2e', () => {
    const result = calculateFootprint(makeInput());
    expect(result.parisTarget).toBe(PARIS_TARGET_KG);
  });

  it('computes zero transport emissions for a non-driver with no transit and no flights', () => {
    const input = makeInput({
      fuelType: 'none',
      carKmPerWeek: 0,
      publicTransportKm: 0,
      shortHaulFlights: 0,
      longHaulFlights: 0,
    });
    const result = calculateFootprint(input);
    expect(result.breakdown.transport).toBe(0);
  });

  it('calculates that a petrol car emits more than an electric car for the same distance', () => {
    const petrolInput = makeInput({ fuelType: 'petrol', carKmPerWeek: 200 });
    const electricInput = makeInput({ fuelType: 'electric', carKmPerWeek: 200 });
    
    const petrolResult = calculateFootprint(petrolInput);
    const electricResult = calculateFootprint(electricInput);
    
    expect(petrolResult.breakdown.transport).toBeGreaterThan(electricResult.breakdown.transport);
  });

  it('calculates that a high-meat diet emits more than a vegan diet', () => {
    const highMeat = calculateFootprint(makeInput({ dietType: 'high-meat' }));
    const vegan = calculateFootprint(makeInput({ dietType: 'vegan' }));
    
    expect(highMeat.breakdown.food).toBeGreaterThan(vegan.breakdown.food);
  });

  it('applies currency exchange rate and divisions correctly in consumption spend', () => {
    // 200 per month * 12 months = 2400 spend.
    // In UK (GBP exchange rate 1.0):
    // goods emissions = (2400 * 400) / 1000 = 960 kg CO2e
    // services emissions = (100 * 12 * 100) / 1000 = 120 kg CO2e
    // Total consumption = 960 + 120 = 1080 kg CO2e.
    const ukInput = makeInput({
      region: 'uk',
      goodsSpendPerMonth: 200,
      servicesSpendPerMonth: 100
    });
    const result = calculateFootprint(ukInput);
    expect(result.breakdown.consumption).toBe(1080);
  });
});
