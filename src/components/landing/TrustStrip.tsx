export function TrustStrip() {
  const sources = [
    { name: 'UK DEFRA', desc: 'Department for Environment, Food & Rural Affairs' },
    { name: 'US EPA', desc: 'Environmental Protection Agency' },
    { name: 'IEA', desc: 'International Energy Agency' },
    { name: 'UN IPCC', desc: 'Intergovernmental Panel on Climate Change' }
  ];

  return (
    <section className="py-12 border-t border-b border-[#c8e6d0] bg-[#e2f3e7]" aria-label="Emission factor registries">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#7a9e82] mb-6">
          Calculations verified against global emission registries
        </p>
        
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 items-center justify-items-center">
          {sources.map((src, i) => (
            <div key={i} className="text-center group">
              <div className="text-sm font-bold text-[#3d5c45] group-hover:text-[#1a7a4a] transition-colors">
                {src.name}
              </div>
              <div className="text-[10px] text-[#7a9e82] mt-1 max-w-[150px] mx-auto leading-tight">
                {src.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

