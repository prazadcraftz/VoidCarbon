'use client';

import { useState } from 'react';
import { generateGoalPlan } from '@/lib/gemini';
import type { FootprintResult, Goal, GoalPlanResponse } from '@/lib/schemas';
import { ChevronDown, ChevronUp, Sparkles, AlertCircle } from 'lucide-react';

interface GoalPlanPanelProps {
  result: FootprintResult;
  goal: Goal;
}

const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transport',
  homeEnergy: 'Home energy',
  food: 'Food and diet',
  consumption: 'Shopping and spend',
};

export function GoalPlanPanel({ result, goal }: GoalPlanPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<GoalPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    // Fetch the AI plan on first open and cache it
    if (nextState && !plan && !isLoading) {
      setIsLoading(true);
      setError(null);
      try {
        const res = await generateGoalPlan(result, goal);
        if (res.plan) {
          setPlan(res.plan);
        }
        if (res.error) {
          setError(res.error);
        }
      } catch {
        setError('Failed to fetch plan.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="border border-[#c8e6d0] rounded-xl bg-white overflow-hidden mt-6 shadow-sm">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#e8f8f0] hover:bg-[#e8f8f0]/85 text-xs font-semibold text-[#1a2e1e] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5 text-[#1a2e1e]">
          <Sparkles className="h-4 w-4 text-[#1a7a4a]" />
          AI goal achievement plan
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-[#1a2e1e]" /> : <ChevronDown className="h-4 w-4 text-[#1a2e1e]" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-4">
          {isLoading && (
            <div className="space-y-3 animate-pulse" role="status" aria-label="Loading AI goal plan">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-[#e8f4ee] rounded-lg" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-[#e67e22] bg-[#fef3e8] border border-[#c8e6d0] p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Displaying local goal plan recommendations. ({error})</span>
            </div>
          )}

          {!isLoading && plan && (
            <div className="space-y-4">
              <p className="text-[11px] text-[#7a9e82] leading-relaxed">
                Gemini has calculated category-level targets to reach your goal. 
                Focus on these areas:
              </p>
              
              <div className="space-y-3">
                {plan.categories.map((cat, i) => (
                  <div key={i} className="rounded-lg bg-white border border-[#c8e6d0] p-3.5 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#1a2e1e]">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                      <span className="text-[10px] font-semibold text-[#1a7a4a] px-2 py-0.5 rounded bg-[#e8f8f0] border border-[#c8e6d0]">
                        Target saving: {Math.round(cat.reductionNeeded).toLocaleString()} kg CO₂e
                      </span>
                    </div>
                    
                    <ul className="list-disc pl-4 space-y-1.5">
                      {cat.actions.map((act, idx) => (
                        <li key={idx} className="text-xs text-[#3d5c45] leading-relaxed">
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default GoalPlanPanel;

