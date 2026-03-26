"use client";
import { FiBell, FiChevronDown } from "react-icons/fi";

export default function Header({ user }: { user: any }) {
  return (
    <header className="flex justify-between items-center w-full px-4 py-3">
      {/* Left side empty or Breadcrumbs */}
      <div></div>

      {/* Right side: Profile (Item #2) */}
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-white transition">
          <FiBell size={20} />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/10 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
              {user?.login || "Developer"}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              GitHub Profile
            </p>
          </div>
          
          <div className="relative">
            <img 
              src={user?.avatar_url || "https://github.com/identicons/jasonlong.png"} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-xl border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-all shadow-lg shadow-indigo-500/10"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#020617] rounded-full"></div>
          </div>
          <FiChevronDown className="text-gray-500 group-hover:text-white transition" />
        </div>
      </div>
    </header>
  );
}