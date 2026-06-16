import { Globe } from 'lucide-react';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#c8e6d0]/20 bg-[#0f2318] py-8 text-xs text-white/60" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-1.5 font-semibold text-white/90">
              <Globe className="h-4.5 w-4.5 text-[#c8e6d0]" />
              <span>Carbon Track Methodology</span>
            </div>
            <p className="leading-relaxed">
              Emissions calculated using standard greenhouse gas conversion factors sourced from international registries: 
              <strong> DEFRA (UK Department for Environment, Food & Rural Affairs)</strong>, 
              <strong> EPA (US Environmental Protection Agency)</strong>, and 
              <strong> IEA (International Energy Agency)</strong>.
            </p>
          </div>
          
          <div className="space-y-2 sm:text-right">
            <p className="text-white/80">
              Powered by <span className="font-semibold text-white">Google Gemini API</span> (gemini-2.5-flash)
            </p>
            <p className="text-[10px] text-white/50">
              &copy; {currentYear} VoidCarbon. Created for Virtual Prompt Wars Challenge 3.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
