import { Plane } from 'lucide-react';
import { NumberInput } from '@/components/ui/NumberInput';

interface FlightFieldsProps {
  data: {
    shortHaulFlights: number;
    longHaulFlights: number;
  };
  updateData: (fields: Partial<FlightFieldsProps['data']>) => void;
  errors?: Record<string, string>;
}

export function FlightFields({ data, updateData, errors }: FlightFieldsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Plane aria-hidden="true" className="h-5 w-5 text-[#4d7a5a]" />
        <h3 className="text-sm font-semibold text-[#1a2e1e]">Flights (per year)</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="shortFlights" className="block text-xs font-semibold text-[#4d7a5a] mb-2">
            Short-haul flights (under 3 hours, one-way)
          </label>
          <NumberInput
            id="shortFlights"
            value={data.shortHaulFlights === 0 ? '' : data.shortHaulFlights}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ shortHaulFlights: val });
            }}
            errorId={errors?.shortHaulFlights ? 'shortFlights-error' : undefined}
            placeholder="2"
            min={0}
          />
          {errors?.shortHaulFlights ? (
            <p id="shortFlights-error" role="alert" className="text-xs text-[#e74c3c] mt-1 font-medium">
              {errors.shortHaulFlights}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="longFlights" className="block text-xs font-semibold text-[#4d7a5a] mb-2">
            Long-haul flights (over 3 hours, one-way)
          </label>
          <NumberInput
            id="longFlights"
            value={data.longHaulFlights === 0 ? '' : data.longHaulFlights}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ longHaulFlights: val });
            }}
            errorId={errors?.longHaulFlights ? 'longFlights-error' : undefined}
            placeholder="1"
            min={0}
          />
          {errors?.longHaulFlights ? (
            <p id="longFlights-error" role="alert" className="text-xs text-[#e74c3c] mt-1 font-medium">
              {errors.longHaulFlights}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default FlightFields;
