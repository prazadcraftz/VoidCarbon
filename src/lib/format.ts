import { REGIONAL_CURRENCY } from './emission-factors';
import type { Region } from './schemas';

/**
 * Formats a CO2e value in kg to a reader-friendly string (e.g. "1,200 kg CO₂e" or "3.5 tonnes CO₂e")
 * 
 * @param kg CO2e in kg
 * @returns Formatted string
 */
export function formatCO2e(kg: number): string {
  if (kg >= 1000) {
    const tonnes = kg / 1000;
    return `${tonnes.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} t CO₂e`;
  }
  return `${Math.round(kg).toLocaleString()} kg CO₂e`;
}

/**
 * Formats a currency value based on the user's region
 * 
 * @param amount Number value
 * @param region Selected region
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, region: Region): string {
  const currencyInfo = REGIONAL_CURRENCY[region];
  const locale = region === 'india' ? 'en-IN' : region === 'usa' ? 'en-US' : region === 'uk' ? 'en-GB' : region === 'eu' ? 'de-DE' : region === 'australia' ? 'en-AU' : 'en-US';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyInfo.code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currencyInfo.symbol}${Math.round(amount).toLocaleString()}`;
  }
}

/**
 * Returns the currency symbol for a region.
 * 
 * @param region Selected geographic region
 * @returns The currency symbol character (e.g. "£", "₹", "$")
 */
export function getCurrencySymbol(region: Region): string {
  return REGIONAL_CURRENCY[region].symbol;
}
