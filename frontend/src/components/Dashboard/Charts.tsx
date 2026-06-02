import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827]/95 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl text-xs">
        <p className="font-medium text-gray-400 mb-1">{label || payload[0].name}</p>
        <p className="text-white font-bold text-sm">
          {payload[0].value} Commits
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts({ analytics }: { analytics: any }) {
  if (!analytics || (!analytics.languages.length && !analytics.commits.length)) {
    return (
      <div className="h-72 w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-[#0F172A]">
        <p className="text-gray-500 text-sm font-medium">No activity data available</p>
      </div>
    );
  }

  const COLORS = ["#22D3EE", "#8B5CF6", "#3B82F6", "#F43F5E", "#EAB308"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Tech Stack Segmented Progress Bar */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
        <h4 className="text-sm font-semibold text-gray-400 mb-8">Language Distribution</h4>
        
        <div className="space-y-6">
          {analytics.languages.map((lang: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {lang.name}
                </span>
                <span className="text-gray-400">{lang.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-[#0F172A] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${lang.percentage}%`, 
                    backgroundColor: COLORS[index % COLORS.length] 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commit Frequency Area Chart */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
        <h4 className="text-sm font-semibold text-gray-400 mb-6">Commit Activity (12 Months)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.commits} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9CA3AF", fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9CA3AF", fontSize: 12 }} 
              />
              <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, fill: 'transparent' }} content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#22D3EE" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}