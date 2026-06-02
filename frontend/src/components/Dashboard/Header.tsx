"use client";
import { FiBell, FiSearch, FiCommand, FiChevronDown } from "react-icons/fi";

export default function Header({ user }: { user: any }) {
  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-white/[0.01] border-b border-white/[0.05] sticky top-0 z-10 backdrop-blur-md">
      {/* Search / Command Palette */}
      <div className="flex-1 max-w-md hidden md:block relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search repositories, issues, or command..." 
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-10 pr-12 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
          <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono"><FiCommand className="inline w-3 h-3" /> K</kbd>
        </div>
      </div>

      <div className="flex-1 md:hidden"></div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-[#020617]"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-white/10 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
              {user?.login || "Developer"}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              GitHub Profile
            </p>
          </div>
          
          <div className="relative">
            <img 
              src={user?.avatar_url || "https://github.com/identicons/jasonlong.png"} 
              alt="User Avatar" 
              className="w-9 h-9 rounded-full border border-white/10 group-hover:border-indigo-500/50 transition-all"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#020617] rounded-full"></div>
          </div>
          <FiChevronDown className="text-slate-500 w-4 h-4 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </header>
  );
}