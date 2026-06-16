import type { FootprintResult, Goal } from './schemas';
import { getComparisonDetails } from './comparisons';
import { getBiggestEmitter } from './breakdown';
import { GRID_INTENSITY } from './emission-factors';

/**
 * Builds the prompt for personalized carbon footprint reduction insights (5 tips).
 */
export function buildGeminiPrompt(result: FootprintResult): string {
  const { input, totalKgCO2e, breakdown } = result;
  const comparisons = getComparisonDetails(result);
  const biggest = getBiggestEmitter(breakdown);
  
  // Find second biggest emitter
  const categories = Object.keys(breakdown) as (keyof typeof breakdown)[];
  const sortedCategories = categories.sort((a, b) => breakdown[b] - breakdown[a]);
  const secondBiggestCat = sortedCategories[1];
  const secondBiggestLabel = secondBiggestCat === 'transport' ? 'Transport' : 
                             secondBiggestCat === 'homeEnergy' ? 'Home Energy' : 
                             secondBiggestCat === 'food' ? 'Food & Diet' : 'Shopping & Consumption';
  
  const transportPct = Math.round((breakdown.transport / totalKgCO2e) * 100) || 0;
  const homePct = Math.round((breakdown.homeEnergy / totalKgCO2e) * 100) || 0;
  const foodPct = Math.round((breakdown.food / totalKgCO2e) * 100) || 0;
  const consumptionPct = Math.round((breakdown.consumption / totalKgCO2e) * 100) || 0;
  
  return `You are a carbon footprint reduction expert. Respond ONLY with a valid JSON matching the schema provided. Do not add markdown fences or explanations.

USER PROFILE:
Region: ${input.region} (grid intensity: ${GRID_INTENSITY[input.region]} kg CO₂e/kWh)
Total Annual Footprint: ${totalKgCO2e} kg CO₂e
vs. Regional Average (${comparisons.regionalAvg} kg): ${comparisons.regionalDiffPercent}%
vs. Paris 1.5°C target (${comparisons.parisTarget} kg): ${comparisons.parisDiffPercent}%

Category breakdown:
- Transport: ${breakdown.transport} kg CO₂e (${transportPct}%)
- Home Energy: ${breakdown.homeEnergy} kg CO₂e (${homePct}%)
- Food & Diet: ${breakdown.food} kg CO₂e (${foodPct}%)
- Consumption: ${breakdown.consumption} kg CO₂e (${consumptionPct}%)

Top 2 biggest emitter categories:
1. ${biggest.label} (${biggest.value} kg CO₂e)
2. ${secondBiggestLabel} (${breakdown[secondBiggestCat]} kg CO₂e)

Details:
- Car travel: ${input.carKmPerWeek} km/week, fuel type: ${input.fuelType}
- Public transit: ${input.publicTransportKm} km/week
- Flights per year: ${input.shortHaulFlights} short-haul, ${input.longHaulFlights} long-haul
- Household size: ${input.householdSize} people
- Heating: ${input.heatingType} (quantity: ${input.heatingQtyPerMonth}/month)
- Renewable energy percentage: ${input.renewablePercent}%
- Diet type: ${input.dietType}
- Consumption monthly spend: Goods: ${input.goodsSpendPerMonth}, Services: ${input.servicesSpendPerMonth}

TASK:
Return exactly 5 highly personalized, actionable carbon reduction tips as JSON.
Rank the tips in descending order of their estimated annual CO₂e savings (savingKgCO2e).
Ensure estimated savings are numerically realistic and tailored specifically to this user's profile.

SCHEMA:
{
  "tips": [
    {
      "title": "string (max 80 chars, clear and actionable)",
      "savingKgCO2e": number (estimated annual saving in kg CO₂e),
      "rationale": "string (max 200 chars, explain why this fits their profile)",
      "difficulty": "Easy" | "Medium" | "Hard",
      "category": "transport" | "homeEnergy" | "food" | "consumption"
    }
  ]
}

Only suggest tips relevant to this user's profile (e.g., do not suggest electric cars if they don't drive, or renewable energy if they already have 100% solar).`;
}

/**
 * Builds the prompt for a category-level goal achievement plan (4 categories).
 */
export function buildGoalPlanPrompt(result: FootprintResult, goal: Goal): string {
  const { input, totalKgCO2e, breakdown } = result;
  const reductionNeeded = totalKgCO2e - goal.targetKgCO2e;
  
  const transportPct = Math.round((breakdown.transport / totalKgCO2e) * 100) || 0;
  const homePct = Math.round((breakdown.homeEnergy / totalKgCO2e) * 100) || 0;
  const foodPct = Math.round((breakdown.food / totalKgCO2e) * 100) || 0;
  const consumptionPct = Math.round((breakdown.consumption / totalKgCO2e) * 100) || 0;

  return `You are a carbon footprint reduction expert. Respond ONLY with a valid JSON matching the schema provided. Do not add markdown fences or explanations.

GOAL DETAILS:
Current annual footprint: ${totalKgCO2e} kg CO₂e
Target annual footprint: ${goal.targetKgCO2e} kg CO₂e
Total reduction required: ${reductionNeeded} kg CO₂e/year
Target date: ${new Date(goal.targetDate).toLocaleDateString()}

Current category breakdown:
- Transport: ${breakdown.transport} kg CO₂e (${transportPct}%)
- Home Energy: ${breakdown.homeEnergy} kg CO₂e (${homePct}%)
- Food & Diet: ${breakdown.food} kg CO₂e (${foodPct}%)
- Consumption: ${breakdown.consumption} kg CO₂e (${consumptionPct}%)

User details:
- Region: ${input.region}
- Car travel: ${input.carKmPerWeek} km/week, fuel type: ${input.fuelType}
- Diet type: ${input.dietType}
- Renewable energy percentage: ${input.renewablePercent}%

TASK:
Create a category-level goal achievement plan showing how the user can distribute the total target reduction of ${reductionNeeded} kg CO₂e across the four categories.
For each of the 4 categories (transport, homeEnergy, food, consumption):
1. Specify the reductionNeeded in kg CO₂e (should be roughly proportional to that category's share of emissions and the total target, but realistic).
2. Recommend 1 to 2 concrete, personalized actions the user can take to achieve it.

SCHEMA:
{
  "categories": [
    {
      "category": "transport" | "homeEnergy" | "food" | "consumption",
      "reductionNeeded": number (allocated kg CO₂e reduction for this category),
      "actions": ["string (max 200 chars)", "string (max 200 chars)"]
    }
  ]
}

Ensure the sum of "reductionNeeded" across the 4 categories matches or exceeds the total required reduction of ${reductionNeeded} kg CO₂e. Only suggest actions relevant to the user's profile.`;
}
