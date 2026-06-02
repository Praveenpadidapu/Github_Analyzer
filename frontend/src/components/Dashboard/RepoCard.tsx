"use client";
import { FiStar, FiGitBranch, FiChevronRight, FiCircle } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/Card";

export default function RepoCard({ repo, onSelect }: any) {
  return (
    <Card 
      onClick={onSelect}
      className="group cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300"
    >
      <CardContent className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-slate-100 truncate w-full mb-2 group-hover:text-indigo-400 transition-colors" title={repo.name}>
          {repo.name}
        </h3>
        
        <p className="text-sm text-slate-400 line-clamp-2 h-10 mb-6 leading-relaxed">
          {repo.description || "No description provided for this repository."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.05]">
          <div className="flex gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5"><FiStar className="text-yellow-500 w-3.5 h-3.5"/> {repo.stars || repo.stargazers_count || 0}</span>
            <span className="flex items-center gap-1.5"><FiCircle className="text-indigo-500 w-3 h-3 fill-indigo-500"/> {repo.language || "Docs"}</span>
          </div>
          <div className="p-1.5 bg-slate-800 rounded-lg group-hover:bg-indigo-600 transition-colors text-slate-400 group-hover:text-white">
            <FiChevronRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}