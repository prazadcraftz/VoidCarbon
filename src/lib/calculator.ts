import {
  CAR_FACTORS,
  PUBLIC_TRANSPORT_FACTOR,
  FLIGHT_FACTORS,
  GRID_INTENSITY,
  HEATING_FACTORS,
  DIET_FACTORS,
  CONSUMPTION_FACTORS,
  REGIONAL_AVERAGES,
  PARIS_TARGET_KG,
  REGIONAL_CURRENCY,
} from './emission-factors';
import { MONTHS_PER_YEAR, WEEKS_PER_YEAR, KILO_CONVERSION_DIVISOR } from './constants';
import { round } from './number';
import type { FootprintInput, FootprintResult, CategoryBreakdown } from './schemas';

/**
 * Calculates annual transport emissions in kg CO₂e.
 * 
 * @param input The validated carbon footprint inputs
 * @returns Estimated annual transport emissions in kg CO₂e
 */
export function calculateTransport(input: FootprintInput): number {
  const carEmissions = input.carKmPerWeek * WEEKS_PER_YEAR * CAR_FACTORS[input.fuelType];
  const publicTransportEmissions = input.publicTransportKm * WEEKS_PER_YEAR * PUBLIC_TRANSPORT_FACTOR;
  const flightEmissions = (input.shortHaulFlights * FLIGHT_FACTORS.shortHaul) +
                          (input.longHaulFlights * FLIGHT_FACTORS.longHaul);
  
  return round(carEmissions + publicTransportEmissions + flightEmissions);
}

/**
 * Calculates annual home energy emissions in kg CO₂e per person.
 * 
 * @param input The validated carbon footprint inputs
 * @returns Attributed annual home energy emissions in kg CO₂e per person
 */
export function calculateHomeEnergy(input: FootprintInput): number {
  const electricityEmissions = input.electricityKwhPerMonth * MONTHS_PER_YEAR * GRID_INTENSITY[input.region];
  const heatingEmissions = input.heatingQtyPerMonth * MONTHS_PER_YEAR * HEATING_FACTORS[input.heatingType];
  const totalHouseholdEmissions = electricityEmissions + heatingEmissions;
  
  // Apply renewable energy offsets and divide by household size
  const offsetMultiplier = 1 - (input.renewablePercent / 100);
  const attributedEmissions = (totalHouseholdEmissions * offsetMultiplier) / input.householdSize;
  
  return round(attributedEmissions);
}

/**
 * Calculates annual diet/food emissions in kg CO₂e.
 * 
 * @param input The validated carbon footprint inputs
 * @returns Estimated annual diet/food emissions in kg CO₂e
 */
export function calculateFood(input: FootprintInput): number {
  return round(DIET_FACTORS[input.dietType]);
}

/**
 * Calculates annual consumption emissions in kg CO₂e based on spend,
 * converting local currency to GBP first before applying the per-£1000 factors.
 * 
 * @param input The validated carbon footprint inputs
 * @returns Estimated annual consumption emissions in kg CO₂e
 */
export function calculateConsumption(input: FootprintInput): number {
  const exchangeRate = REGIONAL_CURRENCY[input.region].exchangeRate;
  
  // Convert monthly spend in local currency to monthly spend in GBP
  const goodsSpendGBP = input.goodsSpendPerMonth * exchangeRate;
  const servicesSpendGBP = input.servicesSpendPerMonth * exchangeRate;
  
  // Convert monthly spend to annual spend in GBP
  const annualGoodsSpendGBP = goodsSpendGBP * MONTHS_PER_YEAR;
  const annualServicesSpendGBP = servicesSpendGBP * MONTHS_PER_YEAR;
  
  // Calculate emissions: spend * factor / 1000 (since factors are per £1000 spend)
  const goodsEmissions = (annualGoodsSpendGBP * CONSUMPTION_FACTORS.goods) / KILO_CONVERSION_DIVISOR;
  const servicesEmissions = (annualServicesSpendGBP * CONSUMPTION_FACTORS.services) / KILO_CONVERSION_DIVISOR;
  
  return round(goodsEmissions + servicesEmissions);
}

/**
 * Computes the user's total carbon footprint and returns a full result object.
 * 
 * @param input The validated calculator inputs
 * @returns The structured FootprintResult
 */
export function calculateFootprint(input: FootprintInput): FootprintResult {
  const transport = calculateTransport(input);
  const homeEnergy = calculateHomeEnergy(input);
  const food = calculateFood(input);
  const consumption = calculateConsumption(input);
  
  const breakdown: CategoryBreakdown = {
    transport,
    homeEnergy,
    food,
    consumption,
  };
  
  const totalKgCO2e = round(transport + homeEnergy + food + consumption);
  
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    input,
    totalKgCO2e,
    breakdown,
    regionalAvg: REGIONAL_AVERAGES[input.region],
    parisTarget: PARIS_TARGET_KG,
  };
}
