"use client";
import { FiGrid, FiCode, FiSettings, FiLogOut, FiZap } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function Sidebar({ activeTab, setActiveTab }: any) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <FiGrid /> },
    { id: "repos", label: "Repositories", icon: <FiCode /> },
    { id: "analytics", label: "AI Analyzer", icon: <FiZap /> },
  ];

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 hidden md:flex">
      {/* Brand Logo */}
      <div className="w-12 h-12 bg-[#00f0ff]/10 rounded-full flex items-center justify-center border border-[#00f0ff]/30 neon-glow-cyan mb-4 backdrop-blur-md">
        <FiZap className="text-[#00f0ff] w-5 h-5" />
      </div>

      {/* Floating Dock */}
      <nav className="glass-panel rounded-full p-3 flex flex-col gap-3 shadow-[0_0_30px_-5px_rgba(0,240,255,0.1)]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group",
              activeTab === item.id 
                ? "bg-[#00f0ff] text-black shadow-[0_0_15px_rgba(0,240,255,0.6)]" 
                : "text-[#808080] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10"
            )}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute left-16 bg-[#111] text-[#fff] text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-[#333] whitespace-nowrap pointer-events-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="glass-panel rounded-full p-3 mt-4 flex flex-col gap-3">
        <button title="Settings" className="w-12 h-12 rounded-full flex items-center justify-center text-[#808080] hover:text-[#fff] hover:bg-white/10 transition-all group relative">
          <FiSettings className="w-5 h-5" />
          <span className="absolute left-16 bg-[#111] text-[#fff] text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-[#333] whitespace-nowrap pointer-events-none">
            Settings
          </span>
        </button>
        <button 
          title="Logout"
          onClick={() => {
            localStorage.removeItem("github_token");
            window.location.href = "/";
          }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-[#ff3366] hover:bg-[#ff3366]/20 transition-all group relative"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="absolute left-16 bg-[#111] text-[#fff] text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-[#333] whitespace-nowrap pointer-events-none">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}