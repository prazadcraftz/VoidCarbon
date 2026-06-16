import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StepperProps {
  currentStep: number; // 0 to totalSteps - 1
  steps: string[];
  className?: string;
}

export function Stepper({ currentStep, steps, className }: StepperProps) {
  return (
    <div className={twMerge('w-full py-2', className)} aria-label="Form progress">
      {/* Mobile-only compact progress text */}
      <div className="flex justify-between items-center sm:hidden mb-4 bg-[#e8f8f0] border border-[#c8e6d0] rounded-xl p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <span className="text-xs font-medium text-[#7a9e82]">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-sm font-semibold text-[#1a2e1e]">
          {steps[currentStep]}
        </span>
      </div>

      {/* Desktop step indicators */}
      <div className="hidden sm:flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          
          return (
            <React.Fragment key={index}>
              {/* Step circle indicator */}
              <div 
                className="flex flex-col items-center flex-1 relative"
                aria-current={isActive ? 'step' : undefined}
              >
                <div
                  className={twMerge(
                    clsx(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-300 z-10',
                      {
                        'border-[#1a7a4a] bg-[#1a7a4a] text-white': isCompleted,
                        'border-[#1a7a4a] bg-white text-[#1a7a4a]': isActive,
                        'border-transparent bg-[#e8f4ee] text-[#7a9e82]': !isCompleted && !isActive,
                      }
                    )
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 stroke-[3]" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                <span 
                  className={twMerge(
                    clsx('mt-2 text-xs font-medium text-center truncate max-w-[100px]', {
                      'text-[#1a2e1e] font-semibold': isActive,
                      'text-[#7a9e82]': isCompleted,
                      'text-[#7a9e82]/60': !isCompleted && !isActive,
                    })
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 ? (
                <div
                  className={twMerge(
                    clsx('h-[2px] flex-1 -mt-6 mx-2 transition-all duration-300', {
                      'bg-[#1a7a4a]': currentStep > index,
                      'bg-[#c8e6d0]': currentStep <= index,
                    })
                  )}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Stepper;
