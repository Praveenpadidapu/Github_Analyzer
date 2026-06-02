"use client";
import { FiGrid, FiCode, FiBarChart2, FiSettings, FiLogOut, FiZap } from "react-icons/fi";
import { cn } from "@/lib/utils";

export default function Sidebar({ activeTab, setActiveTab }: any) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <FiGrid /> },
    { id: "repos", label: "Repositories", icon: <FiCode /> },
    { id: "analytics", label: "AI Analyzer", icon: <FiZap /> },
  ];

  return (
    <aside className="w-64 bg-white/[0.02] border-r border-white/5 flex flex-col h-screen sticky top-0 backdrop-blur-xl shrink-0 hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FiZap className="text-white w-4 h-4" />
          </div>
          <span>Dev<span className="text-indigo-400">Insight</span></span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <div className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase px-4 mb-4">
          Main Menu
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              activeTab === item.id 
                ? "bg-indigo-500/10 text-indigo-400" 
                : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
            )}
          >
            <span className={cn("flex items-center justify-center", activeTab === item.id ? "text-indigo-400" : "text-slate-500")}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-lg transition-all">
            <FiSettings className="text-slate-500" /> Settings
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("github_token");
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}