"use client";
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { parseISO, format, subDays, isAfter, startOfMonth, endOfMonth } from 'date-fns';

export function CommitActivityChart({ dynamicData }: { dynamicData?: { date: string; commits: number }[] }) {
  const [timeframe, setTimeframe] = useState('1Y');

  const processedData = useMemo(() => {
    if (!dynamicData || dynamicData.length === 0) return [];
    
    const now = new Date();
    
    if (timeframe === '7D') {
      const start = subDays(now, 7);
      return dynamicData
        .filter(d => isAfter(parseISO(d.date), start))
        .map(d => ({ name: format(parseISO(d.date), 'EEE'), commits: d.commits }));
    }
    
    if (timeframe === '30D') {
      const start = subDays(now, 30);
      return dynamicData
        .filter(d => isAfter(parseISO(d.date), start))
        .map(d => ({ name: format(parseISO(d.date), 'MMM dd'), commits: d.commits }));
    }
    
    if (timeframe === '6M') {
      const start = subDays(now, 180);
      const filtered = dynamicData.filter(d => isAfter(parseISO(d.date), start));
      const grouped: Record<string, number> = {};
      
      filtered.forEach(d => {
        const month = format(parseISO(d.date), 'MMM yy');
        grouped[month] = (grouped[month] || 0) + d.commits;
      });
      
      return Object.entries(grouped).map(([name, commits]) => ({ name, commits }));
    }
    
    // 1Y - default Group by month
    const grouped: Record<string, number> = {};
    dynamicData.forEach(d => {
      const month = format(parseISO(d.date), 'MMM yy');
      grouped[month] = (grouped[month] || 0) + d.commits;
    });
    return Object.entries(grouped).map(([name, commits]) => ({ name, commits }));

  }, [dynamicData, timeframe]);

  return (
    <Card hoverEffect className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Commit Activity</CardTitle>
          <p className="text-sm text-slate-400">Total commits across all repositories</p>
        </div>
        <div className="flex bg-[#111827] rounded-lg p-1 border border-white/5">
          {['7D', '30D', '6M', '1Y'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                timeframe === t 
                  ? 'bg-[#1F2937] text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-color, #00E5FF)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary-color, #00E5FF)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--surface-color, #0B1120)', 
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                itemStyle={{ color: 'var(--fg-color, #fff)' }}
              />
              <Area 
                type="monotone" 
                dataKey="commits" 
                stroke="var(--primary-color, #00E5FF)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCommits)" 
                activeDot={{ r: 6, fill: "var(--primary-color, #00E5FF)", stroke: "var(--surface-color, #0B1120)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
