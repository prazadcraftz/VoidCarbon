import { Region } from '@/lib/schemas';
import { MapPin } from 'lucide-react';

interface RegionStepProps {
  selectedRegion: Region;
  onChange: (region: Region) => void;
  error?: string;
}

export function RegionStep({ selectedRegion, onChange, error }: RegionStepProps) {
  const regions: { value: Region; label: string; currency: string }[] = [
    { value: 'india', label: 'India', currency: 'INR (₹)' },
    { value: 'uk', label: 'United Kingdom', currency: 'GBP (£)' },
    { value: 'usa', label: 'United States', currency: 'USD ($)' },
    { value: 'eu', label: 'European Union', currency: 'EUR (€)' },
    { value: 'australia', label: 'Australia', currency: 'AUD ($)' },
    { value: 'global', label: 'Global Average', currency: 'USD ($)' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-[#1a2e1e]">Select your geographic region</h2>
        <p className="text-xs text-[#3d5c45] mt-1">
          This applies local electricity grid intensities and displays calculations in your regional currency.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((reg) => {
          const isSelected = selectedRegion === reg.value;
          return (
            <button
              key={reg.value}
              type="button"
              onClick={() => onChange(reg.value)}
              aria-pressed={isSelected}
              className={`flex items-center gap-4 rounded-xl border p-5 text-left transition-all ${
                isSelected
                  ? 'border-2 border-[#1a7a4a] bg-[#e8f8f0] text-[#1a2e1e] shadow-sm scale-[1.01]'
                  : 'border-[#c8e6d0] bg-white text-[#3d5c45] hover:border-[#1a7a4a] hover:bg-[#e8f8f0]/30 hover:text-[#1a2e1e]'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                isSelected ? 'bg-[#1a7a4a] text-white' : 'bg-[#e8f4ee] text-[#7a9e82]'
              }`}>
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{reg.label}</p>
                <p className="text-[10px] text-[#7a9e82] mt-0.5">Currency: {reg.currency}</p>
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
export default RegionStep;

