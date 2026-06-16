import React from 'react';
import { Region } from '@/lib/schemas';
import { getCurrencySymbol } from '@/lib/format';
import { ShoppingBag, Briefcase } from 'lucide-react';

interface ConsumptionStepProps {
  region: Region;
  data: {
    goodsSpendPerMonth: number;
    servicesSpendPerMonth: number;
  };
  updateData: (fields: Partial<ConsumptionStepProps['data']>) => void;
  errors?: Record<string, string>;
}

export function ConsumptionStep({ region, data, updateData, errors }: ConsumptionStepProps) {
  const symbol = getCurrencySymbol(region);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a2e1e]">Consumption and spending</h2>
        <p className="text-xs text-[#3d5c45] mt-1">
          Estimate your monthly spending in your local currency ({symbol}) on manufactured goods and professional services.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Goods Spend */}
        <div>
          <label htmlFor="goods" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
            <ShoppingBag className="h-4 w-4 text-[#7a9e82]" />
            Monthly goods spend ({symbol})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7a9e82] font-semibold">
              {symbol}
            </span>
            <input
              type="number"
              id="goods"
              value={data.goodsSpendPerMonth === 0 ? '' : data.goodsSpendPerMonth}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < 0) return;
                updateData({ goodsSpendPerMonth: val });
              }}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') e.preventDefault();
              }}
              className="w-full rounded-[10px] border border-[#c8e6d0] bg-white pl-9 pr-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
              placeholder="200"
              min="0"
            />
          </div>
          <p className="text-[10px] text-[#7a9e82] mt-1">
            Includes clothing, electronics, furniture, household supplies, and physical items.
          </p>
          {errors?.goodsSpendPerMonth ? (
            <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.goodsSpendPerMonth}</p>
          ) : null}
        </div>

        {/* Services Spend */}
        <div>
          <label htmlFor="services" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
            <Briefcase className="h-4 w-4 text-[#7a9e82]" />
            Monthly services spend ({symbol})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7a9e82] font-semibold">
              {symbol}
            </span>
            <input
              type="number"
              id="services"
              value={data.servicesSpendPerMonth === 0 ? '' : data.servicesSpendPerMonth}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < 0) return;
                updateData({ servicesSpendPerMonth: val });
              }}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') e.preventDefault();
              }}
              className="w-full rounded-[10px] border border-[#c8e6d0] bg-white pl-9 pr-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
              placeholder="100"
              min="0"
            />
          </div>
          <p className="text-[10px] text-[#7a9e82] mt-1">
            Includes insurance, health club memberships, streaming, utility bills, and services.
          </p>
          {errors?.servicesSpendPerMonth ? (
            <p className="text-xs text-[#e74c3c] mt-1 font-medium">{errors.servicesSpendPerMonth}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
export default ConsumptionStep;

