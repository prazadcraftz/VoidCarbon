'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { FootprintResult } from '@/lib/schemas';

interface HistoryTrendChartProps {
  history: FootprintResult[];
}

export function HistoryTrendChart({ history }: HistoryTrendChartProps) {
  // Map history to date strings and rounded totals
  const data = history.map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    total: Math.round(item.totalKgCO2e),
  }));

  const formatYAxis = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}t`;
    return `${value} kg`;
  };

  return (
    <div 
      className="w-full h-64" 
      role="img" 
      aria-label="Line chart showing historical footprint trend over time compared against the global climate limit."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 10, left: -15, bottom: 5 }}
          aria-hidden="true"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#c8e6d0" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#7a9e82" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#7a9e82" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={formatYAxis} 
          />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              borderColor: '#c8e6d0',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#1a2e1e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
            itemStyle={{ color: '#3d5c45' }}
            labelStyle={{ fontWeight: 'bold', color: '#1a2e1e' }}
            formatter={(value: unknown) => [`${Number(value || 0).toLocaleString()} kg CO₂e`, 'Footprint']}
          />
          {/* Reference Line for the global target (2.1 tonnes = 2100 kg) */}
          <ReferenceLine 
            y={2100} 
            stroke="rgba(26, 122, 74, 0.4)" 
            strokeDasharray="4 4" 
            label={{ 
              value: 'Global Target (2.1t)', 
              fill: '#1a7a4a', 
              fontSize: 9, 
              position: 'top' 
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#1a7a4a" 
            strokeWidth={3} 
            activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }} 
            dot={{ r: 4, strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default HistoryTrendChart;

