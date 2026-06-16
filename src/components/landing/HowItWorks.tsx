import { Calculator, BarChart3, TrendingDown } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Calculator,
      number: '01',
      title: 'Guided assessment',
      description: 'Enter your transportation, home utility usage, dietary choices, and spend patterns in a simple, step-by-step form.',
    },
    {
      icon: BarChart3,
      number: '02',
      title: 'Interactive analytics',
      description: 'See your carbon emissions mapped instantly by category and compared to your regional baseline and global Climate targets.',
    },
    {
      icon: TrendingDown,
      number: '03',
      title: 'Targeted AI reduction',
      description: 'Receive custom, ranked saving recommendations and category-level action plans generated securely by Google Gemini.',
    },
  ];

  return (
    <section className="py-16 sm:py-24" aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="how-it-works-title" className="text-3xl font-bold tracking-tight text-[#1a2e1e] sm:text-4xl">
          How it works
        </h2>
        <p className="mt-4 text-base text-[#3d5c45] max-w-2xl mx-auto">
          VoidCarbon works completely inside your browser. No accounts or server-side databases required.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="glass-panel glass-panel-hover rounded-2xl p-6 text-left relative overflow-hidden group bg-white border border-[#c8e6d0] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            >
              <div className="absolute top-4 right-6 text-4xl font-extrabold text-[#c8e6d0]/30 group-hover:text-[#1a7a4a]/10 transition-colors">
                {step.number}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f8f0] border border-[#c8e6d0] mb-6 group-hover:scale-110 transition-transform text-[#1a7a4a]">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2e1e] mb-2">{step.title}</h3>
              <p className="text-sm text-[#3d5c45] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

