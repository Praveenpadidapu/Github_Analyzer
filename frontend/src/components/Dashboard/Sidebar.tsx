import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/components/ui/Card";
import { 
  FiHome, 
  FiPieChart, 
  FiCpu, 
  FiBookmark, 
  FiUsers, 
  FiActivity, 
  FiSettings, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: FiHome },
  { name: "Repository Analytics", href: "/dashboard/repo-analytics", icon: FiPieChart },
  { name: "AI Insights", href: "/dashboard/ai-insights", icon: FiCpu },
  { name: "Saved Reports", href: "/dashboard/saved", icon: FiBookmark },
  { name: "Compare Repositories", href: "/dashboard/compare", icon: FiUsers },
  { name: "Activity Timeline", href: "/dashboard/activity", icon: FiActivity },
  { name: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "bg-background border-r border-border transition-all duration-300 flex flex-col h-screen sticky top-0 z-40",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
        <div className={cn("flex items-center gap-3 overflow-hidden", !isSidebarOpen && "hidden")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#7C3AED] flex items-center justify-center shadow-[0_0_15px_var(--primary-color,rgba(0,229,255,0.4))]">
            <FiCpu className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-foreground tracking-tight whitespace-nowrap text-lg">
            Dev<span className="text-primary">Insight</span>
          </span>
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface transition-colors w-10 h-10 flex items-center justify-center shrink-0 mx-auto"
        >
          {isSidebarOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-surface-hover text-foreground" 
                  : "text-slate-400 hover:text-foreground hover:bg-surface"
              )}
              title={!isSidebarOpen ? item.name : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_var(--primary-color)]" />
              )}
              <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
              {isSidebarOpen && (
                <span className="font-medium whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border shrink-0">
        <button className={cn(
          "flex items-center gap-3 w-full p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors",
          !isSidebarOpen && "justify-center"
        )}>
          <FiLogOut className="w-5 h-5 shrink-0" />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}