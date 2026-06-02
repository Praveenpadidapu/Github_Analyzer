"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const mockData = [
  { name: 'TypeScript', value: 400, color: '#3178c6' },
  { name: 'JavaScript', value: 300, color: '#f1e05a' },
  { name: 'Python', value: 200, color: '#3572A5' },
  { name: 'Go', value: 100, color: '#00ADD8' },
  { name: 'Other', value: 50, color: '#8b949e' },
];

export function LanguageAnalyticsChart({ dynamicData }: { dynamicData?: any[] }) {
  const activeData = dynamicData && dynamicData.length > 0 ? dynamicData : mockData;

  return (
    <Card hoverEffect className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle>Top Languages</CardTitle>
        <p className="text-sm text-slate-400">Distribution across all repos</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0B1120', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
