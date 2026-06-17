import React from 'react';
import type { FuelType } from '@/lib/schemas';
import { Car, Train } from 'lucide-react';
import { FUEL_TYPES } from './form-constants';
import { FlightFields } from './FlightFields';

interface TransportStepProps {
  data: {
    carKmPerWeek: number;
    fuelType: FuelType;
    publicTransportKm: number;
    shortHaulFlights: number;
    longHaulFlights: number;
  };
  updateData: (fields: Partial<TransportStepProps['data']>) => void;
  errors?: Record<string, string>;
}

export function TransportStep({ data, updateData, errors }: TransportStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a2e1e]">Transportation habits</h2>
        <p className="text-xs text-[#3d5c45] mt-1">
          Tell us about your weekly travel and annual flight counts.
        </p>
      </div>

      {/* Car Section */}
      <div className="border-b border-[#c8e6d0] pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Car className="h-5 w-5 text-[#7a9e82]" />
          <h3 className="text-sm font-semibold text-[#1a2e1e]">Car travel</h3>
        </div>
        
        <div className="max-w-sm space-y-4">
          <div>
            <label htmlFor="carKm" className="block text-xs font-semibold text-[#7a9e82] mb-2">
              Weekly distance (km)
            </label>
            <input
              type="number"
              id="carKm"
              value={data.fuelType === 'none' ? '0' : (data.carKmPerWeek === 0 ? '' : data.carKmPerWeek)}
              disabled={data.fuelType === 'none'}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < 0) return;
                updateData({ carKmPerWeek: val });
              }}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') e.preventDefault();
              }}
              className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all disabled:bg-[#f0faf4] disabled:text-[#7a9e82] disabled:cursor-not-allowed"
              placeholder="150"
              min="0"
            />
            {errors?.carKmPerWeek ? (
              <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.carKmPerWeek}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="fuelType" className="block text-xs font-semibold text-[#7a9e82] mb-2">
              Fuel type
            </label>
            <select
              id="fuelType"
              value={data.fuelType}
              onChange={(e) => {
                const val = e.target.value as FuelType;
                const updates: Partial<typeof data> = { fuelType: val };
                if (val === 'none') {
                  updates.carKmPerWeek = 0;
                }
                updateData(updates);
              }}
              className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
            >
              {FUEL_TYPES.map((fuel) => (
                <option 
                  key={fuel.value} 
                  value={fuel.value} 
                  className="bg-white text-[#3d5c45]"
                >
                  {fuel.emoji} {fuel.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Public Transit Section */}
      <div className="border-b border-[#c8e6d0] pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Train className="h-5 w-5 text-[#7a9e82]" />
          <h3 className="text-sm font-semibold text-[#1a2e1e]">Public transport</h3>
        </div>
        
        <div>
          <label htmlFor="ptKm" className="block text-xs font-semibold text-[#7a9e82] mb-2">
            Weekly public transit distance (km)
          </label>
          <input
            type="number"
            id="ptKm"
            value={data.publicTransportKm === 0 ? '' : data.publicTransportKm}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              updateData({ publicTransportKm: val });
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') e.preventDefault();
            }}
            className="w-full max-w-sm rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
            placeholder="50"
            min="0"
          />
          {errors?.publicTransportKm ? (
            <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.publicTransportKm}</p>
          ) : null}
        </div>
      </div>

      {/* Flights Section */}
      <FlightFields data={data} updateData={updateData} errors={errors} />
    </div>
  );
}
export default TransportStep;
