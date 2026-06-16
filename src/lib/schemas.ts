import { z } from 'zod';

export const RegionSchema = z.enum([
  'india', 'uk', 'usa', 'eu', 'australia', 'global'
]);

export const FuelTypeSchema = z.enum([
  'petrol', 'diesel', 'hybrid', 'electric', 'none'
]);

export const DietTypeSchema = z.enum([
  'vegan', 'vegetarian', 'pescatarian', 'omnivore', 'high-meat'
]);

export const HeatingTypeSchema = z.enum([
  'natural-gas', 'heating-oil', 'lpg', 'electric', 'firewood', 'none'
]);

export const FootprintInputSchema = z.object({
  // Step 0 — Region
  region: RegionSchema,

  // Step 1 — Transport
  carKmPerWeek:       z.number({ message: 'Required field' }).min(0, 'Must be positive').max(5000, 'Max 5000 km/week'),
  fuelType:           FuelTypeSchema,
  publicTransportKm:  z.number({ message: 'Required field' }).min(0, 'Must be positive').max(2000, 'Max 2000 km/week'),
  shortHaulFlights:   z.number({ message: 'Required field' }).int('Must be a whole number').min(0, 'Must be positive').max(50, 'Max 50 flights/year'),
  longHaulFlights:    z.number({ message: 'Required field' }).int('Must be a whole number').min(0, 'Must be positive').max(30, 'Max 30 flights/year'),

  // Step 2 — Home
  electricityKwhPerMonth: z.number({ message: 'Required field' }).min(0, 'Must be positive').max(5000, 'Max 5000 kWh/month'),
  heatingType:            HeatingTypeSchema,
  heatingQtyPerMonth:     z.number({ message: 'Required field' }).min(0, 'Must be positive'),
  householdSize:          z.number({ message: 'Required field' }).int('Must be a whole number').min(1, 'Min 1 person').max(20, 'Max 20 people'),
  renewablePercent:       z.number({ message: 'Required field' }).min(0, 'Min 0%').max(100, 'Max 100%'),

  // Step 3 — Food
  dietType: DietTypeSchema,

  // Step 4 — Consumption
  goodsSpendPerMonth:    z.number({ message: 'Required field' }).min(0, 'Must be positive'),
  servicesSpendPerMonth: z.number({ message: 'Required field' }).min(0, 'Must be positive'),
});

export const CategoryBreakdownSchema = z.object({
  transport:   z.number(),   // kg CO₂e/year
  homeEnergy:  z.number(),
  food:        z.number(),
  consumption: z.number(),
});

export const FootprintResultSchema = z.object({
  id:            z.string().uuid(),
  timestamp:     z.string().datetime(),
  input:         FootprintInputSchema,
  totalKgCO2e:   z.number(),
  breakdown:     CategoryBreakdownSchema,
  regionalAvg:   z.number(),
  parisTarget:   z.literal(2100),
});

export const GoalSchema = z.object({
  targetKgCO2e: z.number().min(0, 'Must be positive'),
  targetDate:   z.string().datetime(),
  baselineKg:   z.number(),
  setAt:        z.string().datetime(),
});

export const TipSchema = z.object({
  title:         z.string().max(80),
  savingKgCO2e:  z.number().min(0),
  rationale:     z.string().max(200),
  difficulty:    z.enum(['Easy', 'Medium', 'Hard']),
  category:      z.enum(['transport', 'homeEnergy', 'food', 'consumption']),
});

export const GeminiResponseSchema = z.object({
  tips: z.array(TipSchema).length(5),
});

export const CategoryGoalActionSchema = z.object({
  category:        z.enum(['transport', 'homeEnergy', 'food', 'consumption']),
  reductionNeeded: z.number().min(0),
  actions:         z.array(z.string().max(200)).min(1).max(2),
});

export const GoalPlanResponseSchema = z.object({
  categories: z.array(CategoryGoalActionSchema).length(4),
});

export type Region = z.infer<typeof RegionSchema>;
export type FuelType = z.infer<typeof FuelTypeSchema>;
export type DietType = z.infer<typeof DietTypeSchema>;
export type HeatingType = z.infer<typeof HeatingTypeSchema>;
export type FootprintInput = z.infer<typeof FootprintInputSchema>;
export type CategoryBreakdown = z.infer<typeof CategoryBreakdownSchema>;
export type FootprintResult = z.infer<typeof FootprintResultSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type Tip = z.infer<typeof TipSchema>;
export type CategoryGoalAction = z.infer<typeof CategoryGoalActionSchema>;
export type GoalPlanResponse = z.infer<typeof GoalPlanResponseSchema>;
