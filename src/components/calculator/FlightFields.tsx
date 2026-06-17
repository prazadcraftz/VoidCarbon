import React from 'react';
import { Plane } from 'lucide-react';

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
        <Plane className="h-5 w-5 text-[#7a9e82]" />
        <h3 className="text-sm font-semibold text-[#1a2e1e]">Flights (per year)</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="shortFlights" className="block text-xs font-semibold text-[#7a9e82] mb-2">
            Short-haul flights (under 3 hours, one-way)
          </label>
          <input
            type="number"
            id="shortFlights"
            value={data.shortHaulFlights === 0 ? '' : data.shortHaulFlights}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ shortHaulFlights: val });
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') e.preventDefault();
            }}
            className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
            placeholder="2"
            min="0"
          />
          {errors?.shortHaulFlights ? (
            <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.shortHaulFlights}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="longFlights" className="block text-xs font-semibold text-[#7a9e82] mb-2">
            Long-haul flights (over 3 hours, one-way)
          </label>
          <input
            type="number"
            id="longFlights"
            value={data.longHaulFlights === 0 ? '' : data.longHaulFlights}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ longHaulFlights: val });
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') e.preventDefault();
            }}
            className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
            placeholder="1"
            min="0"
          />
          {errors?.longHaulFlights ? (
            <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.longHaulFlights}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default FlightFields;
