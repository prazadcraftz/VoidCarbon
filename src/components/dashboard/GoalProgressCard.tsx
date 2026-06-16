import { getGoalProgressDetails } from '@/lib/goal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import type { FootprintResult, Goal } from '@/lib/schemas';
import { Calendar, Trash2 } from 'lucide-react';

interface GoalProgressCardProps {
  result: FootprintResult;
  goal: Goal;
  onClear: () => void;
}

export function GoalProgressCard({ result, goal, onClear }: GoalProgressCardProps) {
  const details = getGoalProgressDetails(result.totalKgCO2e, goal);
  const targetDateStr = new Date(goal.targetDate).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });

  // Calculate percentage reduction from baseline to current
  const totalReductionPct = goal.baselineKg > 0 
    ? Math.round(((goal.baselineKg - result.totalKgCO2e) / goal.baselineKg) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#7a9e82] uppercase tracking-wider">Goal target</span>
          <h4 className="text-lg font-bold text-[#1a2e1e]">
            Reduce to {goal.targetKgCO2e.toLocaleString()} kg CO₂e
          </h4>
          <div className="flex items-center gap-1 text-[11px] text-[#3d5c45]">
            <Calendar className="h-3.5 w-3.5 text-[#7a9e82]" />
            <span>Target date: {targetDateStr}</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={onClear} className="self-start sm:self-center">
          <Trash2 className="mr-1.5 h-3.5 w-3.5 text-[#e74c3c]" />
          Reset goal
        </Button>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        value={details.progressPercent}
        label={`Progress toward goal: ${details.progressPercent}%`}
        subLabel={details.hasMetGoal ? 'Goal met!' : `${details.deltaFromTargetKg.toLocaleString()} kg above target`}
        variant={details.hasMetGoal ? 'emerald' : details.progressPercent > 50 ? 'cyan' : 'amber'}
      />

      {/* Small Stat Blocks */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#c8e6d0] bg-white p-3 text-center shadow-sm">
          <span className="text-[10px] font-semibold text-[#7a9e82] uppercase">Baseline</span>
          <p className="text-sm font-bold text-[#3d5c45] mt-1">{Math.round(goal.baselineKg).toLocaleString()} kg</p>
        </div>
        <div className="rounded-xl border border-[#c8e6d0] bg-white p-3 text-center shadow-sm">
          <span className="text-[10px] font-semibold text-[#7a9e82] uppercase">Saved so far</span>
          <p className={`text-sm font-bold mt-1 ${details.reductionAchievedKg > 0 ? 'text-[#1a7a4a]' : 'text-[#e74c3c]'}`}>
            {details.reductionAchievedKg > 0 ? '+' : ''}
            {Math.round(details.reductionAchievedKg).toLocaleString()} kg
          </p>
        </div>
        <div className="rounded-xl border border-[#c8e6d0] bg-white p-3 text-center shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold text-[#7a9e82] uppercase">Net change</span>
          <p className={`text-sm font-bold mt-1 ${totalReductionPct > 0 ? 'text-[#1a7a4a]' : 'text-[#e74c3c]'}`}>
            {totalReductionPct > 0 ? '-' : ''}
            {Math.abs(totalReductionPct)}%
          </p>
        </div>
      </div>
    </div>
  );
}
export default GoalProgressCard;

