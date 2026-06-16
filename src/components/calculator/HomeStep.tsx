import React from 'react';
import { HeatingType, Region } from '@/lib/schemas';
import { Home, Flame, Users, ShieldCheck } from 'lucide-react';
 
interface HomeStepProps {
  region: Region;
  data: {
    electricityKwhPerMonth: number;
    heatingType: HeatingType;
    heatingQtyPerMonth: number;
    householdSize: number;
    renewablePercent: number;
  };
  updateData: (fields: Partial<HomeStepProps['data']>) => void;
  errors?: Record<string, string>;
}
 
export function HomeStep({ region, data, updateData, errors }: HomeStepProps) {
  const heatingTypes: { value: HeatingType; label: string; unit: string }[] = [
    { value: 'natural-gas', label: 'Natural Gas', unit: region === 'india' ? 'units' : 'kWh' },
    { value: 'heating-oil', label: 'Heating Oil', unit: 'L' },
    { value: 'lpg', label: 'LPG', unit: 'L' },
    { value: 'electric', label: 'Electric Heat', unit: region === 'india' ? 'units' : 'kWh' },
    { value: 'firewood', label: 'Firewood', unit: 'kg' },
    { value: 'none', label: 'None', unit: '-' },
  ];
 
  const currentHeating = heatingTypes.find((t) => t.value === data.heatingType);
 
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a2e1e]">Home utilities</h2>
        <p className="text-xs text-[#3d5c45] mt-1">
          Tell us about your home utility consumption and household size for proper attribution.
        </p>
      </div>
 
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Electricity */}
        <div>
          <label htmlFor="elec" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
            <Home className="h-4 w-4 text-[#7a9e82]" />
            Monthly electricity ({region === 'india' ? 'units' : 'kWh'})
          </label>
          <input
            type="number"
            id="elec"
            value={data.electricityKwhPerMonth === 0 ? '' : data.electricityKwhPerMonth}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ electricityKwhPerMonth: val });
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') e.preventDefault();
            }}
            className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
            placeholder="250"
            min="0"
          />
          {errors?.electricityKwhPerMonth ? (
            <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.electricityKwhPerMonth}</p>
          ) : null}
        </div>

        {/* Household Size */}
        <div>
          <label htmlFor="hSize" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
            <Users className="h-4 w-4 text-[#7a9e82]" />
            Household size (people)
          </label>
          <input
            type="number"
            id="hSize"
            value={data.householdSize === 0 ? '' : data.householdSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ householdSize: val });
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') e.preventDefault();
            }}
            className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
            placeholder="3"
            min="1"
          />
          {errors?.householdSize ? (
            <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.householdSize}</p>
          ) : null}
        </div>

        {/* Heating Type */}
        <div>
          <label htmlFor="heating" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
            <Flame className="h-4 w-4 text-[#7a9e82]" />
            Heating source
          </label>
          <select
            id="heating"
            value={data.heatingType}
            onChange={(e) => updateData({ heatingType: e.target.value as HeatingType, heatingQtyPerMonth: 0 })}
            className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
          >
            {heatingTypes.map((t) => (
              <option key={t.value} value={t.value} className="bg-white text-[#3d5c45]">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Heating Qty */}
        {data.heatingType !== 'none' ? (
          <div>
            <label htmlFor="heatingQty" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
              <Flame className="h-4 w-4 text-[#7a9e82]" />
              Monthly heating qty ({currentHeating?.unit})
            </label>
            <input
              type="number"
              id="heatingQty"
              value={data.heatingQtyPerMonth === 0 ? '' : data.heatingQtyPerMonth}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < 0) return;
                updateData({ heatingQtyPerMonth: val });
              }}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') e.preventDefault();
              }}
              className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
              placeholder={`50 ${currentHeating?.unit}`}
              min="0"
            />
            {region === 'india' && data.heatingType === 'lpg' && (
              <p className="text-[10px] text-[#7a9e82] mt-1.5 leading-normal">
                💡 Suggestion: In India, a standard domestic LPG cylinder is 14.2 kg, which is approximately 26 Litres.
              </p>
            )}
            {errors?.heatingQtyPerMonth ? (
              <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.heatingQtyPerMonth}</p>
            ) : null}
          </div>
        ) : <div />}

        {/* Renewable Percent */}
        <div>
          <label htmlFor="renew" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
            <ShieldCheck className="h-4 w-4 text-[#7a9e82]" />
            Renewable electricity (%)
          </label>
          <input
            type="number"
            id="renew"
            value={data.renewablePercent}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ renewablePercent: val });
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') e.preventDefault();
            }}
            className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
            placeholder="25"
            min="0"
            max="100"
          />
          {errors?.renewablePercent ? (
            <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.renewablePercent}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default HomeStep;

