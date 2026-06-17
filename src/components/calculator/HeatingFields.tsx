import React from 'react';
import type { HeatingType, Region } from '@/lib/schemas';
import { Flame } from 'lucide-react';
import { getHeatingTypes } from './form-constants';

interface HeatingFieldsProps {
  region: Region;
  data: {
    heatingType: HeatingType;
    heatingQtyPerMonth: number;
  };
  updateData: (fields: Partial<HeatingFieldsProps['data']>) => void;
  errors?: Record<string, string>;
}

export function HeatingFields({ region, data, updateData, errors }: HeatingFieldsProps) {
  const heatingTypes = getHeatingTypes(region);
  const currentHeating = heatingTypes.find((t) => t.value === data.heatingType);

  return (
    <>
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
    </>
  );
}
export default HeatingFields;
