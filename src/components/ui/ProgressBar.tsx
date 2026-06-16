import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  subLabel?: string;
  variant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

export function ProgressBar({
  value,
  label,
  subLabel,
  variant = 'cyan',
  className,
}: ProgressBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={twMerge('w-full', className)}>
      <div className="flex justify-between items-end mb-2">
        {label ? (
          <span className="text-xs font-medium text-[#3d5c45]">{label}</span>
        ) : null}
        {subLabel ? (
          <span className="text-xs text-[#7a9e82] font-medium">{subLabel}</span>
        ) : null}
      </div>
      
      <div 
        className="w-full h-2.5 rounded-full bg-[#e8f4ee] overflow-hidden border border-[#c8e6d0]"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={twMerge(
            clsx('h-full rounded-full transition-all duration-500 ease-out', {
              'bg-[#1a7a4a]': variant === 'cyan' || variant === 'emerald',
              'bg-[#f39c12]': variant === 'purple' || variant === 'amber',
              'bg-[#e74c3c]': variant === 'rose',
            })
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
