'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CategoryBreakdown } from '@/lib/schemas';

interface CategoryBarChartProps {
  breakdown: CategoryBreakdown;
}

export function CategoryBarChart({ breakdown }: CategoryBarChartProps) {
  const data = [
    { name: 'Transport', value: Math.round(breakdown.transport), color: '#1a7a4a' },
    { name: 'Home Energy', value: Math.round(breakdown.homeEnergy), color: '#f39c12' },
    { name: 'Food', value: Math.round(breakdown.food), color: '#20b2aa' },
    { name: 'Consumption', value: Math.round(breakdown.consumption), color: '#3498db' },
  ];

  const formatYAxis = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}t`;
    return `${value} kg`;
  };

  return (
    <div 
      className="w-full h-72" 
      role="img" 
      aria-label="Bar chart showing carbon emissions in kg per category: Transport, Home Energy, Food, and Consumption."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#c8e6d0" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#7a9e82" 
            fontSize={11} 
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
            cursor={{ fill: 'rgba(26, 122, 74, 0.04)', radius: 8 }}
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
            formatter={(value: unknown) => [`${Number(value || 0).toLocaleString()} kg CO₂e`, 'Emissions']}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={45}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export default CategoryBarChart;

