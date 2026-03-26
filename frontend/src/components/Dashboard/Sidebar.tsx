"use client";
import { FiGrid, FiCode, FiBarChart2, FiSettings, FiLogOut, FiZap } from "react-icons/fi";

export default function Sidebar({ activeTab, setActiveTab }: any) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <FiGrid /> },
    { id: "repos", label: "Repositories", icon: <FiCode /> },
    { id: "analytics", label: "AI Analyzer", icon: <FiZap /> },
  ];

  return (
    <aside className="w-64 bg-[#020617] border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FiZap className="text-white" />
          </div>
          <span>DEV<span className="text-indigo-500">INSIGHT</span></span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id 
                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className={activeTab === item.id ? "text-indigo-400" : ""}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-white transition">
          <FiSettings /> Settings
        </button>
        <button 
          onClick={() => window.location.href = "/"}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400/70 hover:text-red-400 transition"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}