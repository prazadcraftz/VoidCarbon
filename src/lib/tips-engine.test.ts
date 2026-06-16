import { describe, it, expect } from 'vitest';
import { rankTips } from './tips-engine';
import { makeInput } from '../test/factories';

describe('rankTips fallback engine', () => {
  it('does not suggest EV switch if the user does not drive a car', () => {
    const input = makeInput({ fuelType: 'none', carKmPerWeek: 0 });
    const tips = rankTips(input);
    
    const hasEvTip = tips.some((t) => t.title.toLowerCase().includes('electric vehicle'));
    expect(hasEvTip).toBe(false);
  });

  it('suggests EV switch if the user drives a petrol car', () => {
    const input = makeInput({ fuelType: 'petrol', carKmPerWeek: 200 });
    const tips = rankTips(input);
    
    const hasEvTip = tips.some((t) => t.title.toLowerCase().includes('electric vehicle'));
    expect(hasEvTip).toBe(true);
  });

  it('returns exactly 5 tips', () => {
    const input = makeInput();
    const tips = rankTips(input);
    
    expect(tips).toHaveLength(5);
  });

  it('sorts tips in descending order of savings', () => {
    const input = makeInput();
    const tips = rankTips(input);
    
    for (let i = 1; i < tips.length; i++) {
      expect(tips[i - 1].savingKgCO2e).toBeGreaterThanOrEqual(tips[i].savingKgCO2e);
    }
  });
});
