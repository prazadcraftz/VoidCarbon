import { round } from './number';
import type { FootprintResult } from './schemas';

export interface ComparisonDetails {
  regionalAvg: number;
  regionalDiffPercent: number;
  isAboveRegionalAvg: boolean;
  regionalComparisonMessage: string;
  
  parisTarget: number;
  parisDiffPercent: number;
  isAboveParisTarget: boolean;
  parisComparisonMessage: string;
}

/**
 * Calculates comparative statistics between the user's footprint and regional/global targets.
 * Handles the unique edge case where India's regional average is already below the Paris 1.5°C target.
 * 
 * @param result The footprint result to analyze
 * @returns Structured comparison details
 */
export function getComparisonDetails(result: FootprintResult): ComparisonDetails {
  const { totalKgCO2e, regionalAvg, parisTarget, input } = result;
  
  // 1. Regional average calculations
  const regionalDiffRaw = ((totalKgCO2e - regionalAvg) / regionalAvg) * 100;
  const regionalDiffPercent = round(Math.abs(regionalDiffRaw), 1);
  const isAboveRegionalAvg = totalKgCO2e > regionalAvg;
  
  let regionalComparisonMessage = '';
  if (totalKgCO2e === regionalAvg) {
    regionalComparisonMessage = 'You are exactly on par with your regional average.';
  } else if (isAboveRegionalAvg) {
    regionalComparisonMessage = `You are ${regionalDiffPercent}% above your regional average.`;
  } else {
    regionalComparisonMessage = `You are ${regionalDiffPercent}% below your regional average.`;
  }
  
  // 2. Paris target calculations
  const parisDiffRaw = ((totalKgCO2e - parisTarget) / parisTarget) * 100;
  const parisDiffPercent = round(Math.abs(parisDiffRaw), 1);
  const isAboveParisTarget = totalKgCO2e > parisTarget;
  
  let parisComparisonMessage = '';
  if (totalKgCO2e === parisTarget) {
    parisComparisonMessage = 'You are exactly at the global 1.5°C climate target.';
  } else if (isAboveParisTarget) {
    parisComparisonMessage = `You are ${parisDiffPercent}% above the global 1.5°C climate target (${parisTarget / 1000} t/year).`;
  } else {
    parisComparisonMessage = `You are ${parisDiffPercent}% below the global 1.5°C climate target (${parisTarget / 1000} t/year).`;
  }
  
  // Special context for India (where regional avg 1.9t is already below the Paris 2.1t target)
  if (input.region === 'india') {
    if (!isAboveParisTarget && isAboveRegionalAvg) {
      regionalComparisonMessage = `You are ${regionalDiffPercent}% above the Indian average, but still within the global 1.5°C limit. Keep it up!`;
    }
  }
  
  return {
    regionalAvg,
    regionalDiffPercent: isAboveRegionalAvg ? regionalDiffPercent : -regionalDiffPercent,
    isAboveRegionalAvg,
    regionalComparisonMessage,
    
    parisTarget,
    parisDiffPercent: isAboveParisTarget ? parisDiffPercent : -parisDiffPercent,
    isAboveParisTarget,
    parisComparisonMessage,
  };
}
