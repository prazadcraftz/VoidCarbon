import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getHistory, saveResult, getGoal, saveGoal } from './storage';
import { makeResult, makeGoal } from '../test/factories';

describe('ZodLocalStorage Manager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('saves and retrieves a calculated result from history', () => {
    const res = makeResult();
    saveResult(res);
    
    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe(res.id);
  });

  it('limits the history array size to exactly 12 items', () => {
    for (let i = 0; i < 15; i++) {
      saveResult(makeResult());
    }
    
    const history = getHistory();
    expect(history).toHaveLength(12);
  });

  it('returns empty array when local storage gets corrupted', () => {
    localStorage.setItem('eco_history', 'broken-json-array{[');
    expect(getHistory()).toEqual([]);
  });

  it('filters out corrupted array objects that fail Zod parser checks', () => {
    const invalidData = [{ badField: 'corrupted' }];
    localStorage.setItem('eco_history', JSON.stringify(invalidData));
    
    expect(getHistory()).toEqual([]);
  });

  it('saves and retrieves goals securely', () => {
    const goal = makeGoal();
    saveGoal(goal);
    
    const storedGoal = getGoal();
    expect(storedGoal).not.toBeNull();
    expect(storedGoal?.targetKgCO2e).toBe(goal.targetKgCO2e);
  });

  it('triggers storage quota exceeded events on DOM limits', () => {
    const dispatchMock = vi.spyOn(window, 'dispatchEvent');
    
    // Force setItem to throw QuotaExceeded DOMException directly on our localStorage mock
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota limit reached', 'QuotaExceededError');
    });

    saveGoal(makeGoal());
    expect(dispatchMock).toHaveBeenCalled();
  });
});
