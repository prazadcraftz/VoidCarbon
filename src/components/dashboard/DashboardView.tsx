'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getHistory, clearAllData } from '@/lib/storage';
import { getBiggestEmitter } from '@/lib/breakdown';
import { getComparisonDetails } from '@/lib/comparisons';
import { formatCO2e } from '@/lib/format';
import { REGION_LABELS } from '@/lib/constants';
import type { FootprintResult } from '@/lib/schemas';
import { StatCard } from './StatCard';
import { ComparisonCard } from './ComparisonCard';
import { GoalTracker } from './GoalTracker';
import { GeminiInsights } from '@/components/ai/GeminiInsights';
import { CategoryBarChart, CategoryDonutChart, HistoryTrendChart } from '@/components/charts/lazy';
import { Button } from '@/components/ui/Button';
import { Trash2, Sparkles, Flame, Percent } from 'lucide-react';

export function DashboardView() {
  const router = useRouter();
  const [history, setHistory] = useState<FootprintResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = getHistory();
    // Redirect if no footprint history found (FR-06.4)
    if (data.length === 0) {
      router.push('/?view=calculator');
      return;
    }
    setTimeout(() => {
      setHistory(data);
      setIsLoaded(true);
    }, 0);
  }, [router]);

  const handleReset = () => {
    if (confirm('Are you sure you want to delete all your footprint and goal history? This cannot be undone.')) {
      clearAllData();
      router.push('/?view=calculator');
    }
  };

  if (!isLoaded || history.length === 0) {
    return <div className="text-center py-20 text-sm text-[#7a9e82] animate-pulse">Loading dashboard analytics...</div>;
  }

  const latest = history[history.length - 1];
  const biggest = getBiggestEmitter(latest.breakdown);
  const comparisons = getComparisonDetails(latest);


  // Format percent difference from regional average
  const regionalPctText = comparisons.regionalDiffPercent > 0 
    ? `+${Math.round(comparisons.regionalDiffPercent)}% above average`
    : `${Math.round(Math.abs(comparisons.regionalDiffPercent))}% below average`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header section with Reset */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#c8e6d0] pb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2e1e] tracking-tight sm:text-3xl">Carbon analytics</h1>
          <p className="text-xs text-[#3d5c45] mt-1">Personal carbon footprint breakdown and reduction strategy.</p>
        </div>
        <Button variant="danger" size="sm" onClick={handleReset} className="self-start sm:self-center">
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Clear all data
        </Button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total carbon footprint" value={formatCO2e(latest.totalKgCO2e)} subtext="Annual carbon footprint" icon={Sparkles} variant="cyan" />
        <StatCard title="Primary emission driver" value={biggest.label} subtext={`${formatCO2e(biggest.value)}/year`} icon={Flame} variant="rose" />
        <StatCard 
          title={`vs. ${REGION_LABELS[latest.input.region] || 'regional average'}`} 
          value={regionalPctText} 
          subtext={`Average: ${formatCO2e(comparisons.regionalAvg)}`} 
          icon={Percent} 
          variant={comparisons.isAboveRegionalAvg ? 'amber' : 'emerald'} 
        />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Benchmarks & AI (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <ComparisonCard result={latest} />
          <GeminiInsights result={latest} />
        </div>

        {/* Right Column: Goal Tracker & Charts (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <GoalTracker result={latest} />
          
          <div className="glass-panel border-[#c8e6d0] bg-white rounded-2xl p-4 sm:p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-bold text-[#1a2e1e] tracking-tight">Emissions breakdown</h3>
            <CategoryBarChart breakdown={latest.breakdown} />
            <CategoryDonutChart breakdown={latest.breakdown} />
          </div>

          {history.length > 1 && (
            <div className="glass-panel border-[#c8e6d0] bg-white rounded-2xl p-4 sm:p-6 space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h3 className="text-sm font-bold text-[#1a2e1e] tracking-tight">Footprint history</h3>
              <HistoryTrendChart history={history} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default DashboardView;

