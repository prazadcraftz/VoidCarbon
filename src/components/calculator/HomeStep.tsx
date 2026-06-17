import type { HeatingType, Region } from '@/lib/schemas';
import { Home, Users, ShieldCheck } from 'lucide-react';
import { HeatingFields } from './HeatingFields';
import { NumberInput } from '@/components/ui/NumberInput';
 
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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a2e1e]">Home utilities</h2>
        <p className="text-xs text-[#4d7a5a] mt-1">
          Tell us about your home utility consumption and household size for proper attribution.
        </p>
      </div>
 
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Electricity */}
        <div>
          <label htmlFor="elec" className="flex items-center gap-1.5 text-xs font-semibold text-[#4d7a5a] mb-2">
            <Home aria-hidden="true" className="h-4 w-4 text-[#4d7a5a]" />
            Monthly electricity ({region === 'india' ? 'units' : 'kWh'})
          </label>
          <NumberInput
            id="elec"
            value={data.electricityKwhPerMonth === 0 ? '' : data.electricityKwhPerMonth}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ electricityKwhPerMonth: val });
            }}
            errorId={errors?.electricityKwhPerMonth ? 'elec-error' : undefined}
            placeholder="250"
            min={0}
          />
          {errors?.electricityKwhPerMonth ? (
            <p id="elec-error" role="alert" className="text-xs text-[#e74c3c] mt-1 font-medium">
              {errors.electricityKwhPerMonth}
            </p>
          ) : null}
        </div>
 
        {/* Household Size */}
        <div>
          <label htmlFor="hSize" className="flex items-center gap-1.5 text-xs font-semibold text-[#4d7a5a] mb-2">
            <Users aria-hidden="true" className="h-4 w-4 text-[#4d7a5a]" />
            Household size (people)
          </label>
          <NumberInput
            id="hSize"
            value={data.householdSize === 0 ? '' : data.householdSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ householdSize: val });
            }}
            errorId={errors?.householdSize ? 'hSize-error' : undefined}
            placeholder="3"
            min={1}
          />
          {errors?.householdSize ? (
            <p id="hSize-error" role="alert" className="text-xs text-[#e74c3c] mt-1 font-medium">
              {errors.householdSize}
            </p>
          ) : null}
        </div>
 
        {/* Heating Source & Qty */}
        <HeatingFields region={region} data={data} updateData={updateData} errors={errors} />
 
        {/* Renewable Percent */}
        <div>
          <label htmlFor="renew" className="flex items-center gap-1.5 text-xs font-semibold text-[#4d7a5a] mb-2">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#4d7a5a]" />
            Renewable electricity (%)
          </label>
          <NumberInput
            id="renew"
            value={data.renewablePercent}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ renewablePercent: val });
            }}
            errorId={errors?.renewablePercent ? 'renew-error' : undefined}
            placeholder="25"
            min={0}
            max={100}
          />
          {errors?.renewablePercent ? (
            <p id="renew-error" role="alert" className="text-xs text-[#e74c3c] mt-1 font-medium">
              {errors.renewablePercent}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default HomeStep;
