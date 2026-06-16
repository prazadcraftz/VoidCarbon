import type { CategoryBreakdown } from './schemas';

export interface EmitterDetail {
  category: keyof CategoryBreakdown;
  value: number;
  label: string;
}

const CATEGORY_LABELS: Record<keyof CategoryBreakdown, string> = {
  transport: 'Transport',
  homeEnergy: 'Home Energy',
  food: 'Food & Diet',
  consumption: 'Shopping & Consumption',
};

/**
 * Finds the largest carbon emitting category in a breakdown.
 * 
 * @param breakdown The CategoryBreakdown object containing category values in kg CO2e
 * @returns Details of the largest emitting category
 */
export function getBiggestEmitter(breakdown: CategoryBreakdown): EmitterDetail {
  const categories: (keyof CategoryBreakdown)[] = ['transport', 'homeEnergy', 'food', 'consumption'];
  
  let maxCategory: keyof CategoryBreakdown = 'transport';
  let maxValue = breakdown.transport;
  
  for (const cat of categories) {
    if (breakdown[cat] > maxValue) {
      maxValue = breakdown[cat];
      maxCategory = cat;
    }
  }
  
  return {
    category: maxCategory,
    value: maxValue,
    label: CATEGORY_LABELS[maxCategory],
  };
}
