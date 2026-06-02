import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050505]/95 backdrop-blur-md border border-[#333] p-3 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)] text-xs">
        <p className="font-bold text-white mb-1">{label || payload[0].name}</p>
        <p className="text-[#00f0ff] font-bold">
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
      <div className="h-72 w-full flex flex-col items-center justify-center border border-dashed border-[#222] rounded-2xl bg-[#0a0a0a]">
        <div className="w-12 h-12 rounded-full bg-[#111] border border-[#333] flex items-center justify-center mb-3">
          <span className="text-[#808080] text-xl">📉</span>
        </div>
        <p className="text-[#808080] text-sm font-mono uppercase tracking-widest">No activity data</p>
      </div>
    );
  }

  const COLORS = ["#00f0ff", "#00ff66", "#b000ff", "#ff3366", "#facc15"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tech Stack Donut Chart */}
      <div className="h-80 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 relative group hover:border-[#00f0ff]/30 transition-all duration-300">
        <h4 className="text-xs font-bold text-[#808080] uppercase tracking-widest absolute top-6 left-6 group-hover:text-[#00f0ff] transition-colors">
          Language Distribution
        </h4>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <span className="text-3xl drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">💻</span>
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-[0_0_5px_currentColor] outline-none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Commit Frequency Bar Chart */}
      <div className="h-80 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 relative group hover:border-[#00ff66]/30 transition-all duration-300">
        <h4 className="text-xs font-bold text-[#808080] uppercase tracking-widest absolute top-6 left-6 group-hover:text-[#00ff66] transition-colors">
          Commit Activity (30 Days)
        </h4>
        <ResponsiveContainer width="100%" height="100%" className="mt-8">
          <BarChart data={analytics.commits.slice(-30)} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#555", fontSize: 10, fontFamily: "monospace" }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#555", fontSize: 10, fontFamily: "monospace" }} 
            />
            <Tooltip cursor={{ fill: '#111' }} content={<CustomTooltip />} />
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff66" stopOpacity={1}/>
                <stop offset="95%" stopColor="#00ff66" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Bar dataKey="count" fill="url(#colorCount)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}