import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Charts({ analytics }: { analytics: any }) {
  // If no data, show a placeholder instead of an empty box
  if (!analytics || (!analytics.languages.length && !analytics.commits.length)) {
    return (
      <div className="h-64 w-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
        <p className="text-gray-500 text-sm italic">No data available for this repository yet.</p>
      </div>
    );
  }

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Tech Stack Pie Chart */}
      <div className="h-64">
        <p className="text-[10px] text-gray-500 uppercase mb-4 text-center">Tech Stack Diversity</p>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={analytics.languages}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {analytics.languages.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", fontSize: "10px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Commit Frequency Bar Chart */}
      <div className="h-64">
        <p className="text-[10px] text-gray-500 uppercase mb-4 text-center">Recent Activity Frequency</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics.commits}>
            <XAxis dataKey="day" hide />
            <YAxis hide />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ background: "#0f172a", border: "none", borderRadius: "8px", fontSize: "10px" }} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}