"use client";
import { FiStar, FiGitBranch, FiChevronRight } from "react-icons/fi";

export default function RepoCard({ repo, onSelect }: any) {
  return (
    <div 
      onClick={onSelect}
      className="group bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Name Truncation Fix */}
      <h3 className="text-lg font-bold text-white truncate w-full mb-2 group-hover:text-indigo-400 transition" title={repo.name}>
        {repo.name}
      </h3>
      
      <p className="text-xs text-gray-500 line-clamp-2 h-8 mb-6">
        {repo.description || "No description provided for this repository."}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-4 text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-1"><FiStar className="text-yellow-500"/> {repo.stargazers_count}</span>
          <span className="flex items-center gap-1"><FiGitBranch className="text-indigo-500"/> {repo.language || "Docs"}</span>
        </div>
        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-600 transition-colors">
          <FiChevronRight className="text-white" />
        </div>
      </div>
    </div>
  );
}