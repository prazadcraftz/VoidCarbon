import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrustStrip } from '@/components/landing/TrustStrip';
import { ClosingCta } from '@/components/landing/ClosingCta';
import { CalculatorForm } from '@/components/calculator/CalculatorForm';
import { DashboardView } from '@/components/dashboard/DashboardView';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const view = resolvedParams.view || 'home';

  if (view === 'calculator') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1a7a4a]">Carbon footprint calculator</span>
          <h1 className="text-2xl font-bold text-[#1a2e1e] mt-1 sm:text-4xl tracking-tight">Personal carbon footprint audit</h1>
          <p className="text-xs text-[#3d5c45] mt-2 max-w-lg mx-auto leading-relaxed">
            Provide your household statistics below. Your answers are processed entirely locally and never stored on our servers.
          </p>
        </div>
        <CalculatorForm />
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="w-full flex-1 flex flex-col">
        <DashboardView />
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <Hero />
      <HowItWorks />
      <TrustStrip />
      <ClosingCta />
    </div>
  );
}
