'use client';

import { useState, useEffect, useRef } from 'react';
import { generateInsights } from '@/lib/gemini';
import { rankTips } from '@/lib/tips-engine';
import { readStreamableValue } from '@ai-sdk/rsc';
import type { FootprintResult, Tip } from '@/lib/schemas';
import { TipCard } from './TipCard';
import { Sparkles, AlertCircle } from 'lucide-react';

interface GeminiInsightsProps {
  result: FootprintResult;
}

function extractCompleteTips(text: string): Tip[] {
  const tips: Tip[] = [];
  let depth = 0;
  let start = -1;
  
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      depth++;
      if (depth === 2) start = i; // Inner tip object starts
    } else if (text[i] === '}') {
      if (depth === 2 && start !== -1) {
        const candidate = text.substring(start, i + 1);
        try {
          const parsed = JSON.parse(candidate);
          if (parsed && typeof parsed === 'object' && 'title' in parsed && 'savingKgCO2e' in parsed) {
            tips.push(parsed as Tip);
          }
        } catch {}
      }
      depth--;
    }
  }
  return tips;
}

export function GeminiInsights({ result }: GeminiInsightsProps) {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    async function fetchInsights() {
      setIsLoading(true);
      setErrorMsg(null);
      
      try {
        const res = await generateInsights(result);
        
        if (res.error) {
          setErrorMsg(`Displaying local carbon reduction recommendations. (${res.error})`);
          setTips(res.fallback || rankTips(result.input));
          setIsLoading(false);
          return;
        }

        if (res.output) {
          let hasReceivedTips = false;
          for await (const val of readStreamableValue(res.output)) {
            if (val) {
              const parsed = extractCompleteTips(val);
              if (parsed.length > 0) {
                setTips(parsed);
                hasReceivedTips = true;
                setIsLoading(false); // Remove skeleton once first tip arrives (FR-03.4)
              }
            }
          }
          
          if (!hasReceivedTips) {
            // Fallback if stream was empty
            setTips(rankTips(result.input));
          }
        }
      } catch {
        setErrorMsg('Displaying local carbon reduction recommendations.');
        setTips(rankTips(result.input));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInsights();
  }, [result]);

  return (
    <div className="space-y-6" aria-labelledby="insights-title">
      <div className="flex items-center gap-2 border-b border-[#c8e6d0] pb-3">
        <Sparkles className="h-5 w-5 text-[#1a7a4a]" />
        <h3 id="insights-title" className="text-base font-bold text-[#1a2e1e]">
          {errorMsg ? 'Local carbon reduction plan' : 'Personalized carbon reduction plan'}
        </h3>
      </div>

      {errorMsg ? (
        <div className="flex items-center gap-2 text-xs text-[#e67e22] bg-[#fef3e8] border border-[#c8e6d0] p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      {isLoading && tips.length === 0 ? (
        <div className="space-y-3 animate-pulse" role="status" aria-label="Analyzing emissions for insights">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-[#e8f4ee] rounded-xl border border-[#c8e6d0]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tips.map((tip, index) => (
            <TipCard key={index} tip={tip} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
export default GeminiInsights;

