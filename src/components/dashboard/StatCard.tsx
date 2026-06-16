import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  variant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
}

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'cyan',
}: StatCardProps) {
  // Variant mapping to tone-on-tone light background color pairs
  const bgColors = {
    cyan: 'bg-[#e8f8f0] text-[#1a7a4a]',
    emerald: 'bg-[#e8f8f0] text-[#1a7a4a]',
    rose: 'bg-[#fdf2f2] text-[#e74c3c]',
    amber: 'bg-[#fef3e8] text-[#e67e22]',
    purple: 'bg-[#fef3e8] text-[#e67e22]',
  };

  const getTooltipContent = (unitStr: string) => {
    const isTonnes = unitStr.includes('t');
    const unitLabel = isTonnes 
      ? 't CO₂e (Tonnes of Carbon Dioxide Equivalent)' 
      : 'kg CO₂e (Kilograms of Carbon Dioxide Equivalent)';
    const descText = isTonnes 
      ? 'Represents the metric tonnes of greenhouse gases released per year.' 
      : 'Represents the kilograms of greenhouse gases released per year.';
    return (
      <>
        <strong>{unitLabel}:</strong> {descText} This measures all greenhouse gases combined (like CO₂ and methane), showing their total warming impact as an equivalent amount of carbon dioxide.
      </>
    );
  };

  const renderValueWithTooltip = (val: string | number) => {
    if (typeof val === 'string') {
      const match = val.match(/^(.*?)(\s*(?:t|kg)\s*CO₂e(?:\/year)?)$/);
      if (match) {
        return (
          <span className="inline-flex items-baseline gap-0.5">
            <span>{match[1]}</span>
            <span className="relative group cursor-help text-lg font-medium text-[#7a9e82] inline-block normal-case tracking-normal">
              {match[2]}
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 scale-95 rounded-xl border border-[#c8e6d0] bg-white px-4 py-3 text-center text-xs font-semibold text-[#3d5c45] opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 leading-normal font-sans">
                {getTooltipContent(match[2])}
                {/* Arrow */}
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-[#c8e6d0] -z-10" />
              </span>
            </span>
          </span>
        );
      }
    }
    return val;
  };

  const renderSubtextWithTooltip = (sub: string) => {
    const match = sub.match(/^(.*?)(\s*(?:t|kg)\s*CO₂e(?:\/year)?)$/);
    if (match) {
      return (
        <span className="inline-flex items-baseline gap-0.5">
          <span>{match[1]}</span>
          <span className="relative group cursor-help text-[11px] font-semibold text-[#7a9e82] inline-block normal-case tracking-normal">
            {match[2]}
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 scale-95 rounded-xl border border-[#c8e6d0] bg-white px-4 py-3 text-center text-xs font-semibold text-[#3d5c45] opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 leading-normal font-sans">
              {getTooltipContent(match[2])}
              {/* Arrow */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-[#c8e6d0] -z-10" />
            </span>
          </span>
        </span>
      );
    }
    return sub;
  };

  return (
    <Card hoverable className="bg-white border-[#c8e6d0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-visible">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#7a9e82] uppercase tracking-wider">
          {title}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${bgColors[variant]}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-[#1a2e1e]">
          {renderValueWithTooltip(value)}
        </h3>
        <p className="mt-1 text-[13px] text-[#3d5c45]">
          {renderSubtextWithTooltip(subtext)}
        </p>
      </div>
    </Card>
  );
}
export default StatCard;

