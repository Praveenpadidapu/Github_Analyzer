import { Layers, Code, Users, TrendingUp } from "lucide-react";

type Props = { title: string; value: string; type: 'repos' | 'gists' | 'followers' | 'score' };

export default function StatsCard({ title, value, type }: Props) {
  const icons = {
    repos: <Layers className="text-blue-400" />,
    gists: <Code className="text-purple-400" />,
    followers: <Users className="text-green-400" />,
    score: <TrendingUp className="text-orange-400" />,
  };

  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-indigo-500/50 transition duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 group-hover:text-indigo-400 transition">{value}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-xl">
          {icons[type]}
        </div>
      </div>
    </div>
  );
}