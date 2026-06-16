import {
  FootprintInputSchema,
  FootprintResultSchema,
  GoalSchema,
} from './schemas';
import type { FootprintInput, FootprintResult, Goal } from './schemas';
import { MAX_HISTORY_ENTRIES } from './constants';

const INPUT_KEY = 'eco_input';
const HISTORY_KEY = 'eco_history';
const GOAL_KEY = 'eco_goal';

/**
 * Dispatches a custom window event when a quota limit is exceeded.
 */
function handleQuotaError(e: unknown): void {
  const isQuotaError =
    (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) ||
    (e !== null && typeof e === 'object' && 'name' in e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED'));

  if (isQuotaError) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('storage-quota-exceeded'));
    }
  }
}

/**
 * Gets the stored footprint input (latest unsaved/saved form answers).
 */
export function getStoredInput(): FootprintInput | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(INPUT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validated = FootprintInputSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
    // Silently discard corrupted data
    localStorage.removeItem(INPUT_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * Saves the footprint input.
 */
export function saveStoredInput(input: FootprintInput): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INPUT_KEY, JSON.stringify(input));
  } catch (e) {
    handleQuotaError(e);
  }
}

/**
 * Gets the historical footprint results array.
 */
export function getHistory(): FootprintResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const validated = FootprintResultSchema.array().safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
    // Discard corrupted array
    localStorage.removeItem(HISTORY_KEY);
    return [];
  } catch {
    return [];
  }
}

/**
 * Appends a new footprint result to the history, capping at 12 entries.
 */
export function saveResult(result: FootprintResult): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory();
    // Append and slice to keep the most recent entries up to 12
    const updated = [...history, result].slice(-MAX_HISTORY_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    handleQuotaError(e);
  }
}

/**
 * Gets the user's active goal.
 */
export function getGoal(): Goal | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validated = GoalSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
    localStorage.removeItem(GOAL_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * Saves a new goal.
 */
export function saveGoal(goal: Goal): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
  } catch (e) {
    handleQuotaError(e);
  }
}

/**
 * Clears a set goal.
 */
export function deleteGoal(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GOAL_KEY);
}

/**
 * Clears all user footprint data.
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(INPUT_KEY);
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(GOAL_KEY);
}
