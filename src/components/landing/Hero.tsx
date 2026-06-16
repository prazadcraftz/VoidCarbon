import Link from 'next/link';
import { ArrowRight, Leaf, ShieldAlert, Sparkles } from 'lucide-react';

export function Hero() {
  const renderStatValue = (val: string) => {
    const match = val.match(/^(.*?)(\s*t\s*CO₂e)$/);
    if (match) {
      return (
        <span className="inline-flex items-baseline gap-0.5">
          <span>{match[1]}</span>
          <span className="relative group cursor-help inline-block normal-case tracking-normal">
            {match[2]}
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 scale-95 rounded-xl border border-[#c8e6d0] bg-white px-4 py-3 text-center text-xs font-semibold text-[#3d5c45] opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 leading-normal font-sans">
              <strong>t CO₂e (Tonnes of Carbon Dioxide Equivalent):</strong> Represents the metric tonnes of greenhouse gases released per year. This measures all greenhouse gases combined (like CO₂ and methane), showing their total warming impact as an equivalent amount of carbon dioxide.
              {/* Arrow */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-[#c8e6d0] -z-10" />
            </span>
          </span>
        </span>
      );
    }
    return val;
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-28" aria-labelledby="hero-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c8e6d0] bg-[#e8f8f0] px-3.5 py-1 text-xs text-[#1a7a4a] font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Challenge emissions with Google Gemini AI</span>
        </div>
        
        <h1 id="hero-title" className="text-3xl font-bold tracking-tight text-[#1a2e1e] sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
          Measure Your <br />
          <span className="relative group cursor-help text-[#1a7a4a] inline-block">
            Environmental Impact
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 w-64 -translate-x-1/2 scale-95 rounded-xl border border-[#c8e6d0] bg-white px-4 py-3 text-center text-xs font-bold italic tracking-normal text-[#1a7a4a] opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 leading-relaxed font-sans md:bottom-auto md:top-1/2 md:left-full md:mb-0 md:ml-4 md:translate-x-0 md:-translate-y-1/2 md:text-left">
              How your daily choices and resource usage affect nature.
              {/* Bottom pointer arrow (mobile) */}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white md:hidden" />
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-[#c8e6d0] -z-10 md:hidden" />
              {/* Left pointer arrow (desktop) */}
              <span className="absolute hidden md:block right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-white" />
              <span className="absolute hidden md:block right-full top-1/2 -translate-y-1/2 border-[7px] border-transparent border-r-[#c8e6d0] -z-10 mr-[-1px]" />
            </span>
          </span>
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-[#3d5c45] max-w-2xl mx-auto leading-relaxed">
          Calculate your annual emissions across transport, energy, and diet in 5 minutes. 
          Set targets and get personalized, AI-driven reduction plans to meet global Climate targets.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/?view=calculator"
            className="group inline-flex items-center justify-center rounded-lg bg-[#1a7a4a] text-white hover:bg-[#0f5533] px-6 py-3.5 text-base font-semibold transition-all hover:scale-[1.02] h-12 shadow-sm"
          >
            Calculate your footprint
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            href="/?view=dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-[#c8e6d0] bg-white text-[#1a7a4a] hover:bg-[#1a7a4a]/5 px-6 py-3.5 text-base font-semibold transition-all h-12 shadow-sm"
          >
            View live dashboard
          </Link>
        </div>
        
        {/* Stats Strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 max-w-2xl mx-auto overflow-visible">
          {[
            { icon: Leaf, label: "Global target", value: "2.1 t CO₂e" },
            { icon: ShieldAlert, label: "Strictly private", value: "Local only" },
            { icon: Sparkles, label: "AI powered", value: "Gemini 2.5" }
          ].map((stat, i) => (
            <div key={i} className="glass-panel rounded-2xl p-4 flex items-center gap-3 bg-white border border-[#c8e6d0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-visible">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f8f0] text-[#1a7a4a]">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-[#7a9e82]">{stat.label}</p>
                <p className="text-sm font-bold text-[#1a2e1e]">{renderStatValue(stat.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

