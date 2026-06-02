"use client";
import { FiBell, FiSearch, FiCommand, FiChevronDown } from "react-icons/fi";
import { useState } from "react";

export default function Header({ user }: { user: any }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-transparent border-b border-[#1a1a1a] sticky top-0 z-40 backdrop-blur-2xl">
      {/* Search / Command Palette */}
      <div className="flex-1 max-w-md hidden md:block relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#808080] w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search repositories, issues, or command..." 
          className="w-full bg-[#111] border border-[#222] rounded-xl py-2 pl-10 pr-12 text-sm text-[#fff] focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all placeholder:text-[#555]"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
          <kbd className="bg-black border border-[#333] px-1.5 py-0.5 rounded text-[10px] font-mono text-[#00f0ff]"><FiCommand className="inline w-3 h-3" /> K</kbd>
        </div>
      </div>

      <div className="flex-1 md:hidden"></div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6 relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-[#808080] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-full transition-all"
        >
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#00ff66] rounded-full shadow-[0_0_10px_rgba(0,255,102,0.8)]"></span>
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-12 right-10 w-72 bg-[#050505] border border-[#222] rounded-xl p-4 shadow-2xl z-50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#808080] mb-3">Notifications</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start border-b border-[#222] pb-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-[#00f0ff] animate-pulse"></div>
                <div>
                  <p className="text-sm text-white font-medium">New Feature: Repo Stats</p>
                  <p className="text-xs text-[#808080]">Click any repo to view specific insights.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-[#00ff66]"></div>
                <div>
                  <p className="text-sm text-white font-medium">Migration Complete</p>
                  <p className="text-xs text-[#808080]">Serverless API routes are live.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-[#222] group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors neon-text-cyan">
              {user?.login || "Developer"}
            </p>
            <p className="text-[10px] text-[#555] uppercase tracking-widest font-mono">
              GitHub Profile
            </p>
          </div>
          
          <div className="relative">
            <img 
              src={user?.avatar_url || "https://github.com/identicons/jasonlong.png"} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full border border-[#333] group-hover:border-[#00f0ff] transition-all"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00ff66] border border-black rounded-full shadow-[0_0_5px_rgba(0,255,102,0.8)]"></div>
          </div>
          <FiChevronDown className="text-[#555] w-4 h-4 group-hover:text-[#00f0ff] transition-colors" />
        </div>
      </div>
    </header>
  );
}