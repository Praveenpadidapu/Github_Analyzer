"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

export default function LanguagePie({ repos }: any) {
  const data = repos.reduce((acc: any, repo: any) => {
    if (!repo.language) return acc;

    const existing = acc.find((item: any) => item.name === repo.language);

    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: repo.language, value: 1 });
    }

    return acc;
  }, []);

  return (
    <div className="bg-[#0f172a] p-5 rounded-xl h-[300px]">
      <h2 className="text-white mb-4">Languages</h2>

      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100}>
            {data.map((_: any, index: number) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}