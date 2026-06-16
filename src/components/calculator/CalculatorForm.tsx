'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { Info } from 'lucide-react';
import { RegionStep } from './RegionStep';
import { TransportStep } from './TransportStep';
import { HomeStep } from './HomeStep';
import { FoodStep } from './FoodStep';
import { ConsumptionStep } from './ConsumptionStep';
import { ReviewStep } from './ReviewStep';
import { FootprintInput, FootprintInputSchema } from '@/lib/schemas';
import { calculateFootprint } from '@/lib/calculator';
import { getStoredInput, saveStoredInput, saveResult } from '@/lib/storage';

const INITIAL_DATA: FootprintInput = {
  region: 'uk',
  carKmPerWeek: 0,
  fuelType: 'none',
  publicTransportKm: 0,
  shortHaulFlights: 0,
  longHaulFlights: 0,
  electricityKwhPerMonth: 0,
  heatingType: 'none',
  heatingQtyPerMonth: 0,
  householdSize: 1,
  renewablePercent: 0,
  dietType: 'omnivore',
  goodsSpendPerMonth: 0,
  servicesSpendPerMonth: 0,
};

const STEP_LABELS = ['Region', 'Transport', 'Home Utilities', 'Food & Diet', 'Consumption', 'Review'];

const STEP_EXPLANATIONS = [
  // Region
  "Your country or region determines the baseline carbon intensity of the local power grid and public infrastructure. Some countries rely heavily on fossil fuels for energy generation, while others have access to cleaner, renewable power.",
  // Transport
  "Burning petrol or diesel in vehicles emits carbon dioxide (CO₂) and other harmful gases directly from tailpipes. Air travel is highly emission-intensive, releasing pollutants high in the atmosphere where they have an amplified warming impact.",
  // Home Utilities
  "Heating and electricity are massive contributors to emissions. Electricity generated from fossil fuels releases greenhouse gases at power plants, while home heating via natural gas, heating oil, or LPG releases carbon directly at home.",
  // Food & Diet
  "Global food production generates substantial greenhouse gases. Livestock farming releases large amounts of methane (a potent greenhouse gas), and the fertilizer, land clearing, and transport required for meat and dairy amplify its footprint.",
  // Consumption
  "Everything we purchase has hidden 'embedded' emissions. These stem from the energy required to extract raw materials, manufacture the product, ship it across the globe, and operate retail stores.",
  // Review
  "Ready to see your impact? Submit your inputs to view your complete dashboard. Our Google Gemini AI engine will analyze these habits to generate a custom carbon reduction roadmap tailored specifically for you."
];

export function CalculatorForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FootprintInput>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = getStoredInput();
    if (saved) {
      setTimeout(() => setFormData(saved), 0);
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  const updateFields = (fields: Partial<FootprintInput>) => {
    setFormData((prev) => {
      const next = { ...prev, ...fields };
      saveStoredInput(next);
      return next;
    });
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const rules: Record<number, Array<keyof FootprintInput>> = {
      0: ['region'],
      1: ['carKmPerWeek', 'fuelType', 'publicTransportKm', 'shortHaulFlights', 'longHaulFlights'],
      2: ['electricityKwhPerMonth', 'heatingType', 'heatingQtyPerMonth', 'householdSize', 'renewablePercent'],
      3: ['dietType'],
      4: ['goodsSpendPerMonth', 'servicesSpendPerMonth'],
      5: [],
    };

    const keysToValidate = rules[step] || [];
    if (keysToValidate.length === 0) return true;

    // Pick keys dynamically for this step's validation schema
    const stepSchema = FootprintInputSchema.pick(
      keysToValidate.reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );

    const check = stepSchema.safeParse(formData);
    if (!check.success) {
      const fieldErrors: Record<string, string> = {};
      const zodError = check.error as import('zod').ZodError;
      zodError.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < STEP_LABELS.length - 1) {
      setCurrentStep((c) => c + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((c) => c - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;
    const finalResult = calculateFootprint(formData);
    saveResult(finalResult);
    router.push('/?view=dashboard');
  };

  if (!isLoaded) return <div className="text-center py-12 text-sm text-[#7a9e82]">Loading form...</div>;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-8 max-w-4xl mx-auto border border-[#c8e6d0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] relative">
      <Stepper currentStep={currentStep} steps={STEP_LABELS} />
      
      <div className="mt-8 mb-6 min-h-[300px]" role="region" aria-live="polite">
        {currentStep === 0 && <RegionStep selectedRegion={formData.region} onChange={(r) => updateFields({ region: r })} error={errors.region} />}
        {currentStep === 1 && <TransportStep data={formData} updateData={updateFields} errors={errors} />}
        {currentStep === 2 && <HomeStep region={formData.region} data={formData} updateData={updateFields} errors={errors} />}
        {currentStep === 3 && <FoodStep selectedDiet={formData.dietType} onChange={(d) => updateFields({ dietType: d })} error={errors.dietType} />}
        {currentStep === 4 && <ConsumptionStep region={formData.region} data={formData} updateData={updateFields} errors={errors} />}
        {currentStep === 5 && <ReviewStep data={formData} />}
      </div>

      {/* Educational Contribution Callout */}
      <div className="mb-6 p-4 rounded-xl border border-[#c8e6d0] bg-[#e8f8f0]/30 text-[#2d4c35] text-sm flex gap-3 items-start">
        <Info className="h-5 w-5 text-[#1a7a4a] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-[#1a7a4a]">How this contributes:</strong>{" "}
          <span>{STEP_EXPLANATIONS[currentStep]}</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-[#c8e6d0] pt-6">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
        {currentStep === STEP_LABELS.length - 1 ? (
          <Button variant="primary" onClick={handleSubmit}>Submit and view dashboard</Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
}
