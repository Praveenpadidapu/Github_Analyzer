"use client";
import { FiStar, FiChevronRight, FiCircle } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/Card";

export default function RepoCard({ repo, onSelect }: any) {
  return (
    <Card 
      onClick={onSelect}
      className="group cursor-pointer bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#00f0ff]/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all duration-300"
    >
      <CardContent className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-white truncate w-full mb-2 group-hover:text-[#00f0ff] transition-colors" title={repo.name}>
          {repo.name}
        </h3>
        
        <p className="text-sm text-[#808080] line-clamp-2 h-10 mb-6 leading-relaxed">
          {repo.description || "No description provided for this repository."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1a1a1a]">
          <div className="flex gap-4 text-xs font-mono text-[#555]">
            <span className="flex items-center gap-1.5"><FiStar className="text-[#facc15] w-3.5 h-3.5"/> {repo.stars || repo.stargazers_count || 0}</span>
            <span className="flex items-center gap-1.5"><FiCircle className="text-[#00f0ff] w-3 h-3 fill-[#00f0ff]"/> {repo.language || "Docs"}</span>
          </div>
          <div className="p-1.5 bg-[#111] border border-[#333] rounded-lg group-hover:bg-[#00f0ff] group-hover:border-[#00f0ff] transition-colors text-[#555] group-hover:text-black">
            <FiChevronRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}