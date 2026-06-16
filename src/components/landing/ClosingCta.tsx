import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="closing-cta-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden bg-white border border-[#c8e6d0] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h2 id="closing-cta-title" className="text-3xl font-bold tracking-tight text-[#1a2e1e] sm:text-4xl">
            Ready to track your carbon footprint?
          </h2>
          <p className="mt-4 text-base text-[#3d5c45] max-w-xl mx-auto">
            Take the first step toward a carbon-neutral lifestyle today. It takes less than 5 minutes and is 100% private.
          </p>
          
          <div className="mt-8 flex justify-center">
            <Link
              href="/?view=calculator"
              className="group inline-flex items-center justify-center rounded-lg bg-[#1a7a4a] text-white hover:bg-[#0f5533] px-6 py-3.5 text-base font-semibold transition-all hover:scale-[1.02] h-12 shadow-sm"
            >
              Start calculator
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

