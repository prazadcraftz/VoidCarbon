import { round } from './number';
import type { Goal } from './schemas';

export interface GoalProgressDetails {
  reductionRequiredKg: number;
  reductionAchievedKg: number;
  progressPercent: number; // clamped 0-100
  deltaFromTargetKg: number; // current - target (negative is good: user emitted less than target)
  deltaFromBaselineKg: number; // current - baseline
  hasMetGoal: boolean;
}

/**
 * Calculates the user's progress towards their carbon reduction goal.
 * 
 * @param currentTotalKg User's latest footprint total in kg CO2e
 * @param goal The user's active reduction goal
 * @returns Statistics and progress details
 */
export function getGoalProgressDetails(currentTotalKg: number, goal: Goal): GoalProgressDetails {
  const { targetKgCO2e, baselineKg } = goal;
  
  const reductionRequiredKg = baselineKg - targetKgCO2e;
  const reductionAchievedKg = baselineKg - currentTotalKg;
  
  let progressPercent = 0;
  if (reductionRequiredKg > 0) {
    const rawProgress = (reductionAchievedKg / reductionRequiredKg) * 100;
    // Clamp progress between 0 and 100
    progressPercent = round(Math.max(0, Math.min(100, rawProgress)), 1);
  } else {
    // If they set a target equal to or higher than baseline (e.g. no reduction target or negative target),
    // they meet the goal if current emissions are <= target
    progressPercent = currentTotalKg <= targetKgCO2e ? 100 : 0;
  }
  
  const deltaFromTargetKg = currentTotalKg - targetKgCO2e;
  const deltaFromBaselineKg = currentTotalKg - baselineKg;
  const hasMetGoal = currentTotalKg <= targetKgCO2e;
  
  return {
    reductionRequiredKg: round(Math.max(0, reductionRequiredKg)),
    reductionAchievedKg: round(reductionAchievedKg),
    progressPercent,
    deltaFromTargetKg: round(deltaFromTargetKg),
    deltaFromBaselineKg: round(deltaFromBaselineKg),
    hasMetGoal,
  };
}
