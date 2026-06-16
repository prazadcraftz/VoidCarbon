import type { Tip } from '@/lib/schemas';
import { Car, Home, Apple, ShoppingBag, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface TipCardProps {
  tip: Tip;
  index: number;
}

const ICONS = {
  transport: Car,
  homeEnergy: Home,
  food: Apple,
  consumption: ShoppingBag,
};

const DIFFICULTY_STYLES = {
  Easy: 'bg-[#e8f8f0] text-[#4caf7d] border-[#c8e6d0]',
  Medium: 'bg-[#e8f4fd] text-[#2196f3] border-[#b3d7ff]',
  Hard: 'bg-[#fef3e8] text-[#e67e22] border-[#fde2cb]',
};

export function TipCard({ tip, index }: TipCardProps) {
  const Icon = ICONS[tip.category] || Sparkles;

  return (
    <div 
      className="glass-panel glass-panel-hover rounded-2xl p-4.5 border-[#c8e6d0] bg-white text-[#3d5c45] shadow-[0_1px_3px_rgba(0,0,0,0.06)] relative overflow-hidden group flex gap-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Category Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f4ee] border border-[#c8e6d0] text-[#7a9e82] group-hover:scale-105 transition-transform">
        <Icon className="h-5 w-5" />
      </div>

      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tip Title */}
          <h4 className="text-sm font-bold text-[#1a2e1e] tracking-tight truncate max-w-[250px] sm:max-w-md">
            {tip.title}
          </h4>
          
          {/* Difficulty Badge */}
          <span className={twMerge('text-[9px] font-semibold border px-2 py-0.5 rounded-full uppercase tracking-wider', DIFFICULTY_STYLES[tip.difficulty])}>
            {tip.difficulty}
          </span>
        </div>

        {/* Rationale text */}
        <p className="text-xs text-[#3d5c45] leading-relaxed">
          {tip.rationale}
        </p>

        {/* Carbon savings tag */}
        <div className="text-[10px] font-bold text-[#1a7a4a] mt-2">
          Estimated saving: {Math.round(tip.savingKgCO2e).toLocaleString()} kg CO₂e/year
        </div>
      </div>
    </div>
  );
}
export default TipCard;

