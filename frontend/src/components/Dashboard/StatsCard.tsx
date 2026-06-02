import { FiLayers, FiCode, FiUsers, FiTrendingUp } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Props = { title: string; value: string | number; type: 'repos' | 'gists' | 'followers' | 'score' };

export default function StatsCard({ title, value, type }: Props) {
  const config = {
    repos: { icon: <FiLayers className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-400/10" },
    gists: { icon: <FiCode className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/10" },
    followers: { icon: <FiUsers className="w-5 h-5" />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    score: { icon: <FiTrendingUp className="w-5 h-5" />, color: "text-orange-400", bg: "bg-orange-400/10" },
  };

  const current = config[type];

  return (
    <Card className="group hover:border-indigo-500/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-3xl font-black text-slate-100 group-hover:text-indigo-400 transition-colors">
              {value}
            </p>
          </div>
          <div className={cn("p-3 rounded-xl", current.bg, current.color)}>
            {current.icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}