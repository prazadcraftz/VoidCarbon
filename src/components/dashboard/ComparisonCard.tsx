import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { getComparisonDetails } from '@/lib/comparisons';
import type { FootprintResult } from '@/lib/schemas';
import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';

interface ComparisonCardProps {
  result: FootprintResult;
}

export function ComparisonCard({ result }: ComparisonCardProps) {
  const details = getComparisonDetails(result);

  const regionNames: Record<string, string> = {
    india: 'India',
    uk: 'the UK',
    usa: 'the US',
    eu: 'the EU',
    australia: 'Australia',
    global: 'global average',
  };
  const regionLabel = regionNames[result.input.region] || 'regional';

  const regionHeadingNames: Record<string, string> = {
    india: 'India',
    uk: 'UK',
    usa: 'US',
    eu: 'EU',
    australia: 'Australia',
    global: 'Global',
  };
  const regionHeading = regionHeadingNames[result.input.region] || 'Regional';

  const regionalDiffKg = Math.abs(result.totalKgCO2e - details.regionalAvg);
  const globalDiffKg = Math.abs(result.totalKgCO2e - details.parisTarget);
  const regionalTargetT = details.regionalAvg / 1000;
  const globalTargetT = details.parisTarget / 1000;

  const regionalMessage = result.totalKgCO2e === details.regionalAvg
    ? `You are exactly on par with the ${regionLabel} average (${regionalTargetT} tonnes).`
    : details.isAboveRegionalAvg
      ? `You are ${regionalDiffKg.toLocaleString()} kg CO₂e/year above the ${regionLabel} average (${regionalTargetT} tonnes).`
      : `You are ${regionalDiffKg.toLocaleString()} kg CO₂e/year below the ${regionLabel} average (${regionalTargetT} tonnes).`;

  const globalMessage = result.totalKgCO2e === details.parisTarget
    ? `You are exactly at the global 1.5°C target (${globalTargetT} tonnes).`
    : details.isAboveParisTarget
      ? `You are ${globalDiffKg.toLocaleString()} kg CO₂e/year above the global 1.5°C target (${globalTargetT} tonnes).`
      : `You are ${globalDiffKg.toLocaleString()} kg CO₂e/year below the global 1.5°C target (${globalTargetT} tonnes).`;

  return (
    <Card className="bg-white border-[#c8e6d0] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <CardHeader className="flex flex-row items-center gap-2 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#e8f8f0] text-[#1a7a4a]">
          <Scale className="h-4.5 w-4.5" />
        </div>
        <div>
          <CardTitle className="text-base text-[#1a2e1e]">Climate benchmarks</CardTitle>
          <CardDescription className="text-xs text-[#7a9e82]">Comparison against regional average and international targets</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-2 text-[#3d5c45]">
        {/* Regional Average Comparison */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#c8e6d0]">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#7a9e82]">vs. {regionHeading} average</span>
            <p className="text-[10px] text-[#3d5c45]">Average footprint in {regionLabel} ({regionalTargetT} tonnes)</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold rounded-lg px-2.5 py-1 ${
            details.isAboveRegionalAvg 
              ? 'bg-[#fdf2f2] text-[#e74c3c]' 
              : 'bg-[#e8f8f0] text-[#1a7a4a]'
          }`}>
            {details.isAboveRegionalAvg ? (
              <>
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+{Math.abs(details.regionalDiffPercent)}%</span>
              </>
            ) : (
              <>
                <ArrowDownLeft className="h-3.5 w-3.5" />
                <span>{details.regionalDiffPercent}%</span>
              </>
            )}
          </div>
        </div>

        {/* Global Target Comparison */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#c8e6d0]">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#7a9e82]">vs. global 1.5°C limit</span>
            <p className="text-[10px] text-[#3d5c45]">Global climate target ({globalTargetT} tonnes CO₂e/year)</p>
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold rounded-lg px-2.5 py-1 ${
            details.isAboveParisTarget 
              ? 'bg-[#fdf2f2] text-[#e74c3c]' 
              : 'bg-[#e8f8f0] text-[#1a7a4a]'
          }`}>
            {details.isAboveParisTarget ? (
              <>
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+{Math.abs(details.parisDiffPercent)}%</span>
              </>
            ) : (
              <>
                <ArrowDownLeft className="h-3.5 w-3.5" />
                <span>{details.parisDiffPercent}%</span>
              </>
            )}
          </div>
        </div>

        {/* Informational Summary Message */}
        <div className="text-[11px] leading-relaxed text-[#3d5c45] bg-[#e8f8f0]/40 border border-[#c8e6d0] px-3 py-2.5 rounded-lg space-y-1.5 italic">
          <div className="flex items-start gap-1.5">
            <span>{details.isAboveRegionalAvg ? '💡' : '🎉'}</span>
            <p><strong>{regionHeading} baseline:</strong> {regionalMessage}</p>
          </div>
          <div className="flex items-start gap-1.5 border-t border-[#c8e6d0]/40 pt-1.5">
            <span>{details.isAboveParisTarget ? '💡' : '🎉'}</span>
            <p><strong>Global limit:</strong> {globalMessage}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default ComparisonCard;
