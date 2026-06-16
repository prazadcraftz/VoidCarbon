import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]',
            {
              // Size variants (ensuring minimum 44px height for md and lg)
              'h-9 px-3.5 text-xs': size === 'sm',
              'h-11 px-6 text-sm': size === 'md',
              'h-12 px-8 text-base': size === 'lg',
              
              // Style variants
              'bg-[#1a7a4a] text-white hover:bg-[#0f5533] shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-transparent': variant === 'primary',
              'bg-white border border-[#1a7a4a] text-[#1a7a4a] hover:bg-[#1a7a4a]/5': variant === 'secondary',
              'bg-transparent border border-[#c8e6d0] text-[#7a9e82] hover:text-[#1a7a4a] hover:border-[#1a7a4a]': variant === 'outline',
              'bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-500/20': variant === 'danger',
            },
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 flex h-4 w-4 items-center justify-center">
            <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
