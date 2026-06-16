import { describe, it, expect } from 'vitest';
import { getGoalProgressDetails } from './goal';
import { makeGoal } from '../test/factories';

describe('goal progress tracker', () => {
  it('calculates progress percentage correctly from baseline to target', () => {
    // Baseline: 5000 kg. Target: 3000 kg. Required reduction = 2000 kg.
    // If current is 4000 kg, achieved reduction is 1000 kg. Progress = 50%.
    const goal = makeGoal({ baselineKg: 5000, targetKgCO2e: 3000 });
    const details = getGoalProgressDetails(4000, goal);
    
    expect(details.reductionRequiredKg).toBe(2000);
    expect(details.reductionAchievedKg).toBe(1000);
    expect(details.progressPercent).toBe(50);
    expect(details.hasMetGoal).toBe(false);
  });

  it('clamps progress to 100% and sets hasMetGoal to true if current emissions are below target', () => {
    // Baseline: 5000 kg. Target: 3000 kg.
    // If current is 2500 kg (met goal). Progress = 100%.
    const goal = makeGoal({ baselineKg: 5000, targetKgCO2e: 3000 });
    const details = getGoalProgressDetails(2500, goal);
    
    expect(details.progressPercent).toBe(100);
    expect(details.hasMetGoal).toBe(true);
    expect(details.deltaFromTargetKg).toBeLessThanOrEqual(0);
  });

  it('clamps progress to 0% if current emissions are higher than baseline', () => {
    // Baseline: 5000 kg. Target: 3000 kg.
    // If current is 5500 kg. Progress = 0%.
    const goal = makeGoal({ baselineKg: 5000, targetKgCO2e: 3000 });
    const details = getGoalProgressDetails(5500, goal);
    
    expect(details.progressPercent).toBe(0);
    expect(details.hasMetGoal).toBe(false);
    expect(details.deltaFromBaselineKg).toBe(500);
  });
});
