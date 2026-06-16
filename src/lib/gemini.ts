'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { headers } from 'next/headers';
import {
  FootprintResultSchema,
  GoalSchema,
  GoalPlanResponseSchema,
} from './schemas';
import type { FootprintResult, Goal, GoalPlanResponse } from './schemas';
import { buildGeminiPrompt, buildGoalPlanPrompt } from './prompt-builder';
import { rankTips } from './tips-engine';
import { RATE_LIMIT_REQUESTS } from './constants';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: { responseMimeType: 'application/json' },
});

// Simple in-memory rate limiter sliding window
interface RateLimitTracker {
  timestamps: number[];
}
const rateLimitStore = new Map<string, RateLimitTracker>();

/**
 * Checks if a client IP has exceeded the rate limit.
 * Capped at 10 requests per minute.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 60000; // 1 minute
  
  const tracker = rateLimitStore.get(ip) || { timestamps: [] };
  
  // Remove timestamps older than 1 minute
  tracker.timestamps = tracker.timestamps.filter(t => now - t < limitWindow);
  
  if (tracker.timestamps.length >= RATE_LIMIT_REQUESTS) {
    return true; // Limited
  }
  
  tracker.timestamps.push(now);
  rateLimitStore.set(ip, tracker);
  return false;
}

/**
 * Validates request headers for media type (Content-Type)
 * Returns status code if validation fails, or null if it passes.
 */
async function validateRequestHeaders(): Promise<{ error: string; status: number } | null> {
  const headersList = await headers();
  const contentType = headersList.get('content-type') || '';
  
  // Next.js Server Actions send `text/x-component` or `multipart/form-data`.
  // Standard API requests send `application/json`.
  // We check for these valid content types to prevent content-type spoofing/abuse.
  const isValidType = 
    contentType.includes('application/json') || 
    contentType.includes('text/x-component') || 
    contentType.includes('multipart/form-data') ||
    contentType === ''; // Allow empty content-type from direct function invocations in dev environments
    
  if (!isValidType) {
    return { error: 'Unsupported Media Type', status: 415 };
  }
  
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
  if (isRateLimited(ip)) {
    return { error: 'Too Many Requests', status: 429 };
  }
  
  return null;
}

/**
 * Helper to generate a static fallback goal plan when Gemini fails.
 */
function getStaticGoalPlanFallback(result: FootprintResult, goal: Goal): GoalPlanResponse {
  const reductionNeeded = result.totalKgCO2e - goal.targetKgCO2e;
  
  return {
    categories: [
      {
        category: 'transport',
        reductionNeeded: Math.max(0, Math.round(reductionNeeded * 0.3)),
        actions: [
          'Switch to public transport, walk, or cycle for journeys under 5 km.',
          'Carpool or work from home 1-2 days per week to reduce car mileage.'
        ]
      },
      {
        category: 'homeEnergy',
        reductionNeeded: Math.max(0, Math.round(reductionNeeded * 0.3)),
        actions: [
          'Switch to a 100% renewable electricity tariff or install solar panels.',
          'Lower your heating thermostat by 1-2°C and draught-proof windows.'
        ]
      },
      {
        category: 'food',
        reductionNeeded: Math.max(0, Math.round(reductionNeeded * 0.2)),
        actions: [
          'Transition toward a plant-based diet by adding 2-3 meat-free days per week.',
          'Reduce food waste by planning meals and composting organic leftovers.'
        ]
      },
      {
        category: 'consumption',
        reductionNeeded: Math.max(0, Math.round(reductionNeeded * 0.2)),
        actions: [
          'Buy items second-hand (furniture, electronics, clothing) where possible.',
          'Reduce monthly spend on non-essential goods by 15-20%.'
        ]
      }
    ]
  };
}

/**
 * Server Action to generate personalized carbon reduction tips from Gemini (streaming).
 * 
 * @param result The calculated footprint result
 * @returns A streamable value containing the accumulated tips JSON
 */
export async function generateInsights(result: FootprintResult) {
  // Validate headers, rate limits, content type
  const headerValidationError = await validateRequestHeaders();
  if (headerValidationError) {
    // If rate-limited or unsupported media type, return static fallback immediately
    const fallbackTips = rankTips(result.input);
    return { 
      output: null, 
      error: headerValidationError.error, 
      status: headerValidationError.status,
      fallback: fallbackTips 
    };
  }

  // Parse input result server-side
  const validatedResult = FootprintResultSchema.parse(result);
  
  const stream = createStreamableValue('');
  
  // Trigger async background processing for streaming
  (async () => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('API Key missing');
      }
      
      const prompt = buildGeminiPrompt(validatedResult);
      const responseStream = await model.generateContentStream(prompt);
      
      let accumulatedText = '';
      for await (const chunk of responseStream.stream) {
        const text = chunk.text();
        accumulatedText += text;
        stream.update(accumulatedText);
      }
      stream.done();
    } catch (err) {
      stream.error(err);
    }
  })();
  
  return { output: stream.value, error: null, status: 200 };
}

/**
 * Server Action to generate a category-level goal achievement plan from Gemini.
 * 
 * @param result The footprint result
 * @param goal The target reduction goal
 * @returns A GoalPlanResponse object
 */
export async function generateGoalPlan(result: FootprintResult, goal: Goal): Promise<{
  plan: GoalPlanResponse;
  error: string | null;
  status: number;
}> {
  // Validate headers, rate limits, content type
  const headerValidationError = await validateRequestHeaders();
  if (headerValidationError) {
    const fallbackPlan = getStaticGoalPlanFallback(result, goal);
    return { plan: fallbackPlan, error: headerValidationError.error, status: headerValidationError.status };
  }

  try {
    // Parse inputs server-side
    const validatedResult = FootprintResultSchema.parse(result);
    const validatedGoal = GoalSchema.parse(goal);
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('API Key missing');
    }
    
    const prompt = buildGoalPlanPrompt(validatedResult, validatedGoal);
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    
    // Parse and validate response schema
    const parsed = JSON.parse(text);
    const plan = GoalPlanResponseSchema.parse(parsed);
    
    return { plan, error: null, status: 200 };
  } catch (err) {
    // Graceful fallback to static goal plan
    const fallbackPlan = getStaticGoalPlanFallback(result, goal);
    return { plan: fallbackPlan, error: err instanceof Error ? err.message : 'Unknown error', status: 500 };
  }
}
