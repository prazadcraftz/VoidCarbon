import dynamic from 'next/dynamic';
import React from 'react';

// Spinner/skeleton loaders to show during lazy-loading
const ChartLoader = ({ height, label }: { height: string; label: string }) => (
  <div 
    className={`w-full ${height} rounded-xl border border-white/5 bg-white/2 animate-pulse flex flex-col items-center justify-center gap-3 text-xs text-gray-500`}
    role="status"
    aria-label={`Loading ${label}`}
  >
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-cyan border-t-transparent" />
    <span>Analyzing data...</span>
  </div>
);

export const CategoryBarChart = dynamic(
  () => import('./CategoryBarChart').then((mod) => mod.CategoryBarChart),
  {
    ssr: false,
    loading: () => <ChartLoader height="h-72" label="category bar chart" />,
  }
);

export const CategoryDonutChart = dynamic(
  () => import('./CategoryDonutChart').then((mod) => mod.CategoryDonutChart),
  {
    ssr: false,
    loading: () => <ChartLoader height="h-72" label="category breakdown split" />,
  }
);

export const HistoryTrendChart = dynamic(
  () => import('./HistoryTrendChart').then((mod) => mod.HistoryTrendChart),
  {
    ssr: false,
    loading: () => <ChartLoader height="h-64" label="history trend line chart" />,
  }
);
