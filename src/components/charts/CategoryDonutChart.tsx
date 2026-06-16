'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CategoryBreakdown } from '@/lib/schemas';

interface CategoryDonutChartProps {
  breakdown: CategoryBreakdown;
}

export function CategoryDonutChart({ breakdown }: CategoryDonutChartProps) {
  const total = breakdown.transport + breakdown.homeEnergy + breakdown.food + breakdown.consumption || 1;
  
  const data = [
    { name: 'Transport', value: breakdown.transport, color: '#1a7a4a' },
    { name: 'Home Energy', value: breakdown.homeEnergy, color: '#f39c12' },
    { name: 'Food & Diet', value: breakdown.food, color: '#20b2aa' },
    { name: 'Consumption', value: breakdown.consumption, color: '#3498db' },
  ].filter(item => item.value > 0); // only show positive categories

  const renderLegend = (value: string) => {
    const item = data.find(d => d.name === value);
    const pct = item ? Math.round((item.value / total) * 100) : 0;
    return <span className="text-xs text-[#3d5c45] font-medium">{value} ({pct}%)</span>;
  };

  return (
    <div 
      className="w-full h-72 flex flex-col justify-center items-center" 
      role="img" 
      aria-label="Donut chart showing percentage emission breakdown by category."
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={1} />
            ))}
          </Pie>
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
            formatter={(value: unknown) => [`${Math.round((Number(value || 0) / total) * 100)}%`, 'Contribution']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            formatter={renderLegend}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
export default CategoryDonutChart;

