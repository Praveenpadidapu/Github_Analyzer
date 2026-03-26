"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CommitBarChart({ data }: any) {
  return (
    <div className="bg-[#0f172a] p-5 rounded-xl h-[300px]">
      <h2 className="text-white mb-4">Weekly Commits</h2>

      <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Bar dataKey="commits" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}