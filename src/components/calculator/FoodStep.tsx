import type { DietType } from '@/lib/schemas';
import { Apple, UtensilsCrossed } from 'lucide-react';

interface FoodStepProps {
  selectedDiet: DietType;
  onChange: (diet: DietType) => void;
  error?: string;
}

export function FoodStep({ selectedDiet, onChange, error }: FoodStepProps) {
  const diets: { value: DietType; label: string; desc: string }[] = [
    { value: 'vegan', label: 'Vegan', desc: 'Only plant foods. No dairy, eggs, or meat.' },
    { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat or fish. Eats dairy and eggs.' },
    { value: 'pescatarian', label: 'Pescatarian (fish eater)', desc: 'Eats fish, dairy, and eggs. No other meat.' },
    { value: 'omnivore', label: 'Average meat eater', desc: 'Eats some meat and fish along with plant foods.' },
    { value: 'high-meat', label: 'Heavy meat eater', desc: 'Eats meat (like beef, pork, or chicken) in most daily meals.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a2e1e]">Food and diet</h2>
        <p className="text-xs text-[#3d5c45] mt-1">
          What you eat has a big impact on the environment. Select the option that best describes how you eat.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {diets.map((diet) => {
          const isSelected = selectedDiet === diet.value;
          return (
            <button
              key={diet.value}
              type="button"
              onClick={() => onChange(diet.value)}
              aria-pressed={isSelected}
              className={`flex items-start gap-4 rounded-xl border p-4.5 text-left transition-all ${
                isSelected
                  ? 'border-2 border-[#1a7a4a] bg-[#e8f8f0] text-[#1a2e1e] shadow-sm scale-[1.01]'
                  : 'border-[#c8e6d0] bg-white text-[#3d5c45] hover:border-[#1a7a4a] hover:bg-[#e8f8f0]/30 hover:text-[#1a2e1e]'
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isSelected ? 'bg-[#1a7a4a] text-white' : 'bg-[#e8f4ee] text-[#7a9e82]'
              }`}>
                {diet.value === 'vegan' || diet.value === 'vegetarian' ? (
                  <Apple className="h-5 w-5" />
                ) : (
                  <UtensilsCrossed className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">{diet.label}</p>
                <p className="text-xs text-[#7a9e82] mt-0.5 leading-relaxed">{diet.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
      
      {error ? (
        <p className="text-xs text-[#e74c3c] font-semibold" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
export default FoodStep;

