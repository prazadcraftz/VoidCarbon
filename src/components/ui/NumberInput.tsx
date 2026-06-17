'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * The id of the associated error message element.
   * When provided, adds `aria-describedby` to link the input to its error (NFR-04.4).
   */
  errorId?: string;
}

/** Shared base class for all calculator number inputs. Eliminates repeated 100-char Tailwind strings. */
const BASE_CLASS =
  'w-full rounded-[10px] border border-[#c8e6d0] bg-white px-4 py-2.5 text-[15px] text-[#3d5c45] placeholder-[#7a9e82]/50 focus:border-[#1a7a4a] focus:ring-2 focus:ring-[#1a7a4a] focus:outline-none min-h-[44px] transition-all disabled:bg-[#f0faf4] disabled:text-[#7a9e82] disabled:cursor-not-allowed';

/**
 * A reusable number input primitive for the carbon calculator form steps.
 *
 * Encapsulates:
 * - The shared Tailwind className (avoiding copy-paste across 10+ inputs)
 * - Built-in prevention of `-` and `e` key presses (standard UX for numeric inputs)
 * - `aria-describedby` linking to the error message id for screen reader announcements
 *
 * @example
 * <NumberInput
 *   id="carKm"
 *   value={data.carKmPerWeek}
 *   onChange={(e) => updateData({ carKmPerWeek: Number(e.target.value) })}
 *   errorId={errors?.carKmPerWeek ? 'carKm-error' : undefined}
 *   placeholder="150"
 *   min={0}
 * />
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, onKeyDown, errorId, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevent negative values and scientific notation entry
      if (e.key === '-' || e.key === 'e') e.preventDefault();
      onKeyDown?.(e);
    };

    return (
      <input
        ref={ref}
        type="number"
        className={twMerge(clsx(BASE_CLASS, className))}
        onKeyDown={handleKeyDown}
        aria-describedby={errorId}
        {...props}
      />
    );
  }
);
NumberInput.displayName = 'NumberInput';
