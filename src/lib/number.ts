/**
 * Rounds a number to a specified number of decimal places.
 * Defaults to 2 decimal places.
 * 
 * @param value The number to round
 * @param decimals The number of decimal places (default 1)
 * @returns The rounded number
 */
export function round(value: number, decimals: number = 1): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
