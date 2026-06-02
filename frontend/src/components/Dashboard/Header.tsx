"use client";
import { FiBell, FiSearch, FiCommand, FiChevronDown, FiZap } from "react-icons/fi";
import { useState } from "react";

export default function Header({ user, searchQuery, setSearchQuery }: { user: any, searchQuery?: string, setSearchQuery?: (q: string) => void }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex justify-between items-center w-full px-6 py-4 bg-[#0B0F19]/80 border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl">
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22D3EE]/10 text-[#22D3EE] rounded-lg flex items-center justify-center border border-[#22D3EE]/20">
            <FiZap className="w-4 h-4" />
          </div>
          <span className="font-bold text-white tracking-tight hidden sm:block">DevInsight</span>
        </div>

        <div className="flex-1 max-w-md hidden md:block relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search repositories..." 
            className="w-full bg-[#111827] border border-white/10 rounded-lg py-2 pl-10 pr-12 text-sm text-white focus:outline-none focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE] transition-all placeholder:text-gray-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
            <kbd className="bg-[#0F172A] border border-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400"><FiCommand className="inline w-3 h-3" /> K</kbd>
          </div>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6 relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <FiBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22D3EE] rounded-full ring-2 ring-[#0B0F19]"></span>
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-12 right-10 w-80 bg-[#111827] border border-white/10 rounded-xl p-4 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Notifications</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start border-b border-white/5 pb-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-[#22D3EE]"></div>
                <div>
                  <p className="text-sm text-white font-medium">New UI Deployed</p>
                  <p className="text-xs text-gray-400 mt-1">Enjoy the minimalist Vercel-style redesign.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-[#8B5CF6]"></div>
                <div>
                  <p className="text-sm text-white font-medium">AI Insights Ready</p>
                  <p className="text-xs text-gray-400 mt-1">Language-specific AI prompt improvements are live.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-white/10 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white group-hover:text-[#22D3EE] transition-colors">
              {user?.login || "Developer"}
            </p>
          </div>
          
          <img 
            src={user?.avatar_url || "https://github.com/identicons/jasonlong.png"} 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#22D3EE] transition-all"
          />
          <FiChevronDown className="text-gray-500 w-4 h-4 group-hover:text-[#22D3EE] transition-colors" />
        </div>
      </div>
    </header>
  );
}