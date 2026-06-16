'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { GoalSetForm } from './GoalSetForm';
import { GoalProgressCard } from './GoalProgressCard';
import { GoalPlanPanel } from './GoalPlanPanel';
import { getGoal, saveGoal, deleteGoal } from '@/lib/storage';
import type { FootprintResult, Goal } from '@/lib/schemas';
import { Target } from 'lucide-react';

interface GoalTrackerProps {
  result: FootprintResult;
}

export function GoalTracker({ result }: GoalTrackerProps) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load goal from localStorage on mount
  useEffect(() => {
    const activeGoal = getGoal();
    if (activeGoal) {
      setTimeout(() => setGoal(activeGoal), 0);
    }
    setTimeout(() => setIsLoaded(true), 0);
  }, []);

  const handleSaveGoal = (targetKg: number, targetDate: string) => {
    const newGoal: Goal = {
      targetKgCO2e: targetKg,
      targetDate,
      baselineKg: result.totalKgCO2e,
      setAt: new Date().toISOString(),
    };
    saveGoal(newGoal);
    setGoal(newGoal);
  };

  const handleClearGoal = () => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal();
      setGoal(null);
    }
  };

  if (!isLoaded) return <div className="text-center py-6 text-xs text-[#7a9e82]">Loading goal tracker...</div>;

  return (
    <Card className="bg-white border-[#c8e6d0] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <CardHeader className="flex flex-row items-center gap-2 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#e8f8f0] text-[#1a7a4a]">
          <Target className="h-4.5 w-4.5" />
        </div>
        <div>
          <CardTitle className="text-base text-[#1a2e1e]">Goal tracker</CardTitle>
          <CardDescription className="text-xs text-[#7a9e82]">
            {goal ? 'Track your carbon savings over time' : 'Set a target footprint to start tracking'}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 text-[#3d5c45]">
        {goal ? (
          <>
            <GoalProgressCard result={result} goal={goal} onClear={handleClearGoal} />
            <GoalPlanPanel result={result} goal={goal} />
          </>
        ) : (
          <GoalSetForm currentEmissions={result.totalKgCO2e} onSave={handleSaveGoal} />
        )}
      </CardContent>
    </Card>
  );
}
export default GoalTracker;

