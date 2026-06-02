"use client";
import { FiGrid, FiCode, FiSettings, FiLogOut, FiZap } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function Sidebar({ activeTab, setActiveTab, onSettingsClick }: any) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <FiGrid className="w-5 h-5" /> },
    { id: "repos", label: "Repositories", icon: <FiCode className="w-5 h-5" /> },
    { id: "analytics", label: "AI Analyzer", icon: <FiZap className="w-5 h-5" /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-[#050505] border-r border-[#1a1a1a] z-50 flex flex-col items-center py-6 hidden md:flex">
      {/* Brand Logo */}
      <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center mb-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        <FiZap className="w-5 h-5" />
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-4 w-full px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={cn(
              "w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 relative group",
              activeTab === item.id 
                ? "bg-[#111] text-white border border-[#333]" 
                : "text-[#808080] hover:text-white hover:bg-[#111]"
            )}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute left-16 bg-[#111] text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-[#333] whitespace-nowrap pointer-events-none z-50 shadow-xl">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-4 w-full px-3">
        <button 
          onClick={onSettingsClick}
          title="Settings" 
          className="w-full aspect-square rounded-xl flex items-center justify-center text-[#808080] hover:text-white hover:bg-[#111] transition-all group relative"
        >
          <FiSettings className="w-5 h-5" />
          <span className="absolute left-16 bg-[#111] text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-[#333] whitespace-nowrap pointer-events-none z-50 shadow-xl">
            Settings
          </span>
        </button>
        <button 
          title="Logout"
          onClick={() => {
            localStorage.removeItem("github_token");
            window.location.href = "/";
          }}
          className="w-full aspect-square rounded-xl flex items-center justify-center text-[#ff3366] hover:bg-[#ff3366]/10 transition-all group relative"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="absolute left-16 bg-[#111] text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-[#333] whitespace-nowrap pointer-events-none z-50 shadow-xl">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}