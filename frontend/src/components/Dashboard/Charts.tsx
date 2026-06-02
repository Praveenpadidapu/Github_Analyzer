import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl text-xs">
        <p className="font-semibold text-slate-200 mb-1">{label || payload[0].name}</p>
        <p className="text-indigo-400 font-bold">
          {payload[0].value} {payload[0].name === "count" ? "Commits" : "Bytes"}
        </p>
      </div>
    );
  }
  return null;
};

export default function Charts({ analytics }: { analytics: any }) {
  if (!analytics || (!analytics.languages.length && !analytics.commits.length)) {
    return (
      <div className="h-72 w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <span className="text-slate-500 text-xl">📈</span>
        </div>
        <p className="text-slate-400 text-sm">No activity data available yet.</p>
      </div>
    );
  }

  const COLORS = ["#818cf8", "#a78bfa", "#f472b6", "#fb7185", "#fbbf24"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tech Stack Donut Chart */}
      <div className="h-80 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 relative">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest absolute top-6 left-6">
          Language Distribution
        </h4>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-3xl">💻</span>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={analytics.languages}
              innerRadius={80}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {analytics.languages.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Commit Frequency Bar Chart */}
      <div className="h-80 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 relative">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest absolute top-6 left-6">
          Commit Activity (30 Days)
        </h4>
        <ResponsiveContainer width="100%" height="100%" className="mt-8">
          <BarChart data={analytics.commits.slice(-30)} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 10 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748b", fontSize: 10 }} 
            />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} content={<CustomTooltip />} />
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Bar dataKey="count" fill="url(#colorCount)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}