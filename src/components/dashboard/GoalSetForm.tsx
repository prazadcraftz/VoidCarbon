'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Target, Calendar } from 'lucide-react';

interface GoalSetFormProps {
  currentEmissions: number;
  onSave: (targetKg: number, targetDate: string) => void;
}

export function GoalSetForm({ currentEmissions, onSave }: GoalSetFormProps) {
  // Recommend a 20% reduction as default target
  const recommendedTarget = Math.round(currentEmissions * 0.8);
  const [targetKg, setTargetKg] = useState<number | ''>(recommendedTarget);
  const [dateStr, setDateStr] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Get tomorrow's date in local YYYY-MM-DD format
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetKg || targetKg <= 0) {
      setError('Please enter a valid target.');
      return;
    }
    if (targetKg >= currentEmissions) {
      setError('Target emissions must be lower than your current footprint.');
      return;
    }
    if (!dateStr) {
      setError('Please select a target achievement date.');
      return;
    }
    
    // Compare dates resetting time values to avoid timezone/DST errors
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate <= today) {
      setError('Target date must be a future date.');
      return;
    }

    setError('');
    onSave(Number(targetKg), targetDate.toISOString());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Target emissions input */}
        <div className="flex-1">
          <label htmlFor="targetEmissions" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
            <Target className="h-4 w-4 text-[#7a9e82]" />
            Target footprint (kg CO₂e/year)
          </label>
          <input
            type="number"
            id="targetEmissions"
            value={targetKg}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val < 0) return;
              setTargetKg(e.target.value === '' ? '' : val);
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') e.preventDefault();
            }}
            className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
            placeholder={`${recommendedTarget}`}
            min="0"
          />
        </div>

        {/* Target date input */}
        <div className="flex-1">
          <label htmlFor="targetDate" className="flex items-center gap-1.5 text-xs font-semibold text-[#7a9e82] mb-2">
            <Calendar className="h-4 w-4 text-[#7a9e82]" />
            Target date
          </label>
          <input
            type="date"
            id="targetDate"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            min={tomorrowStr}
            className="w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all"
          />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-[#e74c3c] font-semibold" role="alert">{error}</p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" variant="primary">Set reduction goal</Button>
      </div>
    </form>
  );
}
export default GoalSetForm;

