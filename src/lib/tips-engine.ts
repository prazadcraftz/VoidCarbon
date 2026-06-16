import {
  CAR_FACTORS,
  PUBLIC_TRANSPORT_FACTOR,
  FLIGHT_FACTORS,
  GRID_INTENSITY,
  HEATING_FACTORS,
  DIET_FACTORS,
  CONSUMPTION_FACTORS,
  REGIONAL_CURRENCY,
} from './emission-factors';
import { MONTHS_PER_YEAR, WEEKS_PER_YEAR, KILO_CONVERSION_DIVISOR } from './constants';
import { round } from './number';
import type { FootprintInput, Tip } from './schemas';

/**
 * Evaluates the user's footprint inputs and returns exactly 5 ranked, context-specific tips
 * with estimated annual CO₂e savings and rationales.
 * 
 * @param input Calculator inputs
 * @param result Calculated footprint result
 * @returns Array of exactly 5 Tip objects sorted by saving descending
 */
export function rankTips(input: FootprintInput): Tip[] {
  const tips: Tip[] = [];
  const exchangeRate = REGIONAL_CURRENCY[input.region].exchangeRate;
  const hSize = input.householdSize;

  // 1. Electric Vehicle Tip
  if ((input.fuelType === 'petrol' || input.fuelType === 'diesel' || input.fuelType === 'hybrid') && input.carKmPerWeek > 10) {
    const currentCarFactor = CAR_FACTORS[input.fuelType];
    const evFactor = CAR_FACTORS.electric;
    const saving = round(input.carKmPerWeek * WEEKS_PER_YEAR * (currentCarFactor - evFactor));
    
    if (saving > 50) {
      tips.push({
        title: 'Switch to an Electric Vehicle (EV)',
        savingKgCO2e: saving,
        rationale: `At ${input.carKmPerWeek} km/week, replacing your ${input.fuelType} car with an electric vehicle saves ${saving} kg CO₂e annually.`,
        difficulty: 'Hard',
        category: 'transport',
      });
    }
  }

  // 2. Flight Reduction Tip
  if (input.longHaulFlights > 0 || input.shortHaulFlights > 0) {
    let saving = 0;
    let flightDesc = '';
    
    if (input.longHaulFlights > 0) {
      saving = FLIGHT_FACTORS.longHaul; // replace 1 long-haul flight
      flightDesc = 'one long-haul flight';
    } else {
      saving = FLIGHT_FACTORS.shortHaul; // replace 1 short-haul flight
      flightDesc = 'one short-haul flight';
    }
    
    tips.push({
      title: 'Substitute flight with train or video call',
      savingKgCO2e: saving,
      rationale: `Avoiding just ${flightDesc} this year reduces your annual carbon emissions by ${saving} kg CO₂e.`,
      difficulty: 'Medium',
      category: 'transport',
    });
  }

  // 3. Switch to 100% Renewable electricity
  if (input.renewablePercent < 100 && input.electricityKwhPerMonth > 0) {
    const remainingPercent = 100 - input.renewablePercent;
    const electricityEmissions = input.electricityKwhPerMonth * MONTHS_PER_YEAR * GRID_INTENSITY[input.region];
    const saving = round((electricityEmissions * (remainingPercent / 100)) / hSize);
    
    if (saving > 30) {
      tips.push({
        title: 'Switch to a 100% renewable electricity tariff',
        savingKgCO2e: saving,
        rationale: `Powering your home with green energy offsets your share of household electricity, saving ${saving} kg CO₂e/year.`,
        difficulty: 'Easy',
        category: 'homeEnergy',
      });
    }
  }

  // 4. Heating Reduction / Insulation Tip
  if (input.heatingType !== 'none' && input.heatingQtyPerMonth > 0) {
    const heatingEmissions = input.heatingQtyPerMonth * MONTHS_PER_YEAR * HEATING_FACTORS[input.heatingType];
    const saving = round((heatingEmissions * 0.15) / hSize); // 15% savings from smart thermostat / insulation
    
    if (saving > 20) {
      tips.push({
        title: 'Lower thermostat by 1°C & improve insulation',
        savingKgCO2e: saving,
        rationale: `Reducing heating usage by 15% through smart adjustments saves your household share of ${saving} kg CO₂e/year.`,
        difficulty: 'Medium',
        category: 'homeEnergy',
      });
    }
  }

  // 5. Diet Switch Tip
  if (input.dietType === 'high-meat' || input.dietType === 'omnivore') {
    const currentDietEmissions = DIET_FACTORS[input.dietType];
    const veggieEmissions = DIET_FACTORS.vegetarian;
    const saving = round(currentDietEmissions - veggieEmissions);
    
    tips.push({
      title: 'Adopt a vegetarian diet',
      savingKgCO2e: saving,
      rationale: `Reducing meat consumption by transitioning to vegetarian options reduces your dietary emissions by ${saving} kg CO₂e/year.`,
      difficulty: 'Medium',
      category: 'food',
    });
  } else if (input.dietType === 'vegetarian' || input.dietType === 'pescatarian') {
    const currentDietEmissions = DIET_FACTORS[input.dietType];
    const veganEmissions = DIET_FACTORS.vegan;
    const saving = round(currentDietEmissions - veganEmissions);
    
    tips.push({
      title: 'Adopt a plant-based (vegan) diet',
      savingKgCO2e: saving,
      rationale: `Switching from a ${input.dietType} diet to a fully vegan lifestyle saves another ${saving} kg CO₂e/year.`,
      difficulty: 'Hard',
      category: 'food',
    });
  }

  // 6. Reduce Goods Spend / Buying Second Hand
  if (input.goodsSpendPerMonth > 10) {
    const goodsEmissions = (input.goodsSpendPerMonth * exchangeRate * MONTHS_PER_YEAR * CONSUMPTION_FACTORS.goods) / KILO_CONVERSION_DIVISOR;
    const saving = round(goodsEmissions * 0.20); // 20% reduction
    
    if (saving > 20) {
      tips.push({
        title: 'Buy second-hand or reduce goods purchases by 20%',
        savingKgCO2e: saving,
        rationale: `Buying 20% fewer new products prevents raw material extraction and production, saving ${saving} kg CO₂e/year.`,
        difficulty: 'Easy',
        category: 'consumption',
      });
    }
  }

  // 7. Public Transport swap
  if (input.carKmPerWeek > 150 && input.fuelType !== 'none') {
    const carFactor = CAR_FACTORS[input.fuelType];
    const ptFactor = PUBLIC_TRANSPORT_FACTOR;
    const saving = round(input.carKmPerWeek * 0.25 * WEEKS_PER_YEAR * (carFactor - ptFactor)); // replace 25% of car travel with public transport
    
    if (saving > 20) {
      tips.push({
        title: 'Replace 25% of car trips with public transit',
        savingKgCO2e: saving,
        rationale: `Taking buses or trains for a quarter of your usual car journeys cuts your travel footprint by ${saving} kg CO₂e/year.`,
        difficulty: 'Easy',
        category: 'transport',
      });
    }
  }

  // --- Baseline standard tips (to fill the list to exactly 5 if needed) ---
  const baselineTips: Tip[] = [
    {
      title: 'Reduce food waste at home',
      savingKgCO2e: 150,
      rationale: 'Wasting less food avoids methane emissions from landfills and saves around 150 kg CO₂e annually.',
      difficulty: 'Easy',
      category: 'food',
    },
    {
      title: 'Unplug standby electronics (vampire load)',
      savingKgCO2e: 45,
      rationale: 'Unplugging electronics when not in use stops background energy draw, saving 45 kg CO₂e/year.',
      difficulty: 'Easy',
      category: 'homeEnergy',
    },
    {
      title: 'Wash laundry in cold water (30°C)',
      savingKgCO2e: 60,
      rationale: 'Heating water accounts for 90% of a washing machine\'s energy. Washing cold saves 60 kg CO₂e/year.',
      difficulty: 'Easy',
      category: 'homeEnergy',
    },
    {
      title: 'Cancel unused subscriptions and services',
      savingKgCO2e: 80,
      rationale: 'Digital services rely on heavy data center power. Canceling unused services saves 80 kg CO₂e/year.',
      difficulty: 'Easy',
      category: 'consumption',
    },
    {
      title: 'Line-dry clothes instead of tumble drying',
      savingKgCO2e: 200,
      rationale: 'Tumble dryers consume high electricity. Line-drying saves approximately 200 kg CO₂e annually.',
      difficulty: 'Easy',
      category: 'homeEnergy',
    }
  ];

  // Append baselines until we have a diverse pool
  for (const bTip of baselineTips) {
    if (tips.length >= 10) break; // limit pool size
    // check if similar category is already heavily populated or if we need to add variety
    if (!tips.some(t => t.title === bTip.title)) {
      tips.push(bTip);
    }
  }

  // Sort by savings descending, take the top 5
  return tips.sort((a, b) => b.savingKgCO2e - a.savingKgCO2e).slice(0, 5);
}
