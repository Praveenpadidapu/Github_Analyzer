"use client";
import { FiStar, FiChevronRight, FiCircle } from "react-icons/fi";

export default function RepoCard({ repo, onSelect }: any) {
  return (
    <div 
      onClick={onSelect}
      className="group cursor-pointer bg-[#111827] border border-white/5 rounded-2xl hover:border-white/20 transition-all duration-300"
    >
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-white truncate w-full mb-2 group-hover:text-[#22D3EE] transition-colors" title={repo.name}>
          {repo.name}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2 h-10 mb-6 leading-relaxed">
          {repo.description || "No description provided for this repository."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex gap-4 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-1.5"><FiStar className="text-yellow-400 w-3.5 h-3.5"/> {repo.stars || repo.stargazers_count || 0}</span>
            <span className="flex items-center gap-1.5"><FiCircle className="text-[#8B5CF6] w-3 h-3 fill-[#8B5CF6]"/> {repo.language || "Docs"}</span>
          </div>
          <div className="p-1.5 bg-[#0F172A] border border-white/10 rounded-lg group-hover:bg-[#22D3EE] group-hover:border-[#22D3EE] transition-colors text-gray-400 group-hover:text-black">
            <FiChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}