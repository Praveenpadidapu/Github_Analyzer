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
    <aside className="fixed left-0 top-0 h-screen w-16 bg-[#0B0F19] border-r border-white/5 z-50 flex flex-col items-center py-6 hidden md:flex">
      
      {/* Main Navigation */}
      <nav className="flex flex-col gap-4 w-full px-2 mt-16">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.label}
            className={cn(
              "w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 relative group",
              activeTab === item.id 
                ? "bg-white/10 text-[#22D3EE] shadow-[inset_2px_0_0_0_#22D3EE]" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute left-14 bg-[#111827] text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap pointer-events-none z-50 shadow-xl">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-4 w-full px-2">
        <button 
          onClick={() => { window.location.href = "/dashboard/settings" }}
          title="Settings" 
          className="w-full aspect-square rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all group relative"
        >
          <FiSettings className="w-5 h-5" />
          <span className="absolute left-14 bg-[#111827] text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap pointer-events-none z-50 shadow-xl">
            Settings
          </span>
        </button>
        <button 
          title="Logout"
          onClick={() => {
            localStorage.removeItem("github_token");
            window.location.href = "/";
          }}
          className="w-full aspect-square rounded-xl flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-all group relative"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="absolute left-14 bg-[#111827] text-white text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap pointer-events-none z-50 shadow-xl">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}