import { FiLayers, FiCode, FiUsers, FiTrendingUp } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Props = { title: string; value: string | number; type: 'repos' | 'gists' | 'followers' | 'score' };

export default function StatsCard({ title, value, type }: Props) {
  const config = {
    repos: { icon: <FiLayers className="w-5 h-5" />, color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "hover:border-[#00f0ff]/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]" },
    gists: { icon: <FiCode className="w-5 h-5" />, color: "text-[#b000ff]", bg: "bg-[#b000ff]/10", border: "hover:border-[#b000ff]/50 hover:shadow-[0_0_20px_rgba(176,0,255,0.2)]" },
    followers: { icon: <FiUsers className="w-5 h-5" />, color: "text-[#00ff66]", bg: "bg-[#00ff66]/10", border: "hover:border-[#00ff66]/50 hover:shadow-[0_0_20px_rgba(0,255,102,0.2)]" },
    score: { icon: <FiTrendingUp className="w-5 h-5" />, color: "text-[#ff3366]", bg: "bg-[#ff3366]/10", border: "hover:border-[#ff3366]/50 hover:shadow-[0_0_20px_rgba(255,51,102,0.2)]" },
  };

  const current = config[type];

  return (
    <Card className={cn("group transition-all duration-300 bg-[#0a0a0a] border-[#1a1a1a]", current.border)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-xs font-mono tracking-widest uppercase text-[#808080]">{title}</p>
            <p className={cn("text-3xl font-black transition-colors text-white group-hover:text-transparent group-hover:bg-clip-text", `group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[${current.color.split("-")[1]}]`)}>
              {value}
            </p>
          </div>
          <div className={cn("p-3 rounded-xl border border-transparent group-hover:border-current transition-all", current.bg, current.color)}>
            {current.icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}