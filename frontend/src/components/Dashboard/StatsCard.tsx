import { FiLayers, FiCode, FiUsers, FiTrendingUp } from "react-icons/fi";
import { cn } from "@/lib/utils";

type Props = { title: string; value: string | number; type: 'repos' | 'gists' | 'followers' | 'score' };

export default function StatsCard({ title, value, type }: Props) {
  const config = {
    repos: { icon: <FiLayers className="w-5 h-5" />, color: "text-[#22D3EE]", bg: "bg-[#22D3EE]/10" },
    gists: { icon: <FiCode className="w-5 h-5" />, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
    followers: { icon: <FiUsers className="w-5 h-5" />, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
    score: { icon: <FiTrendingUp className="w-5 h-5" />, color: "text-[#F43F5E]", bg: "bg-[#F43F5E]/10" },
  };

  const current = config[type];

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
        </div>
        <div className={cn("p-3 rounded-xl transition-all", current.bg, current.color)}>
          {current.icon}
        </div>
      </div>
    </div>
  );
}