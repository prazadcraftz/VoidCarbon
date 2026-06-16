import React from 'react';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'warning' | 'error' | 'success';
}

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle2,
};

export function Alert({
  className,
  variant = 'info',
  children,
  ...props
}: AlertProps) {
  const Icon = ICONS[variant];

  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          'flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed backdrop-blur-md',
          {
            'bg-blue-500/10 border-blue-500/20 text-blue-400': variant === 'info',
            'bg-amber-500/10 border-amber-500/20 text-amber-400': variant === 'warning',
            'bg-red-500/10 border-red-500/20 text-red-400': variant === 'error',
            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400': variant === 'success',
          }
        ),
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
export default Alert;
