"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiBell, FiSun, FiMoon, FiGithub, FiStar } from "react-icons/fi";
import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/Input";
import { useTheme } from "next-themes";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { globalSearchQuery, setGlobalSearchQuery, userProfile, githubToken } = useAppStore();
  const [isFocused, setIsFocused] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Search state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!globalSearchQuery || globalSearchQuery.trim().length < 2 || !userProfile || !githubToken) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(globalSearchQuery)}+user:${userProfile.login}&per_page=5`,
          { headers: { Authorization: `token ${githubToken}` } }
        );
        setSearchResults(res.data.items || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [globalSearchQuery, userProfile, githubToken]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSelectResult = (repoName: string) => {
    setIsFocused(false);
    setGlobalSearchQuery('');
    // Instead of routing, we might open it in compare or a future feature. 
    // For now we just route to repo-analytics which lists all repos.
    router.push('/dashboard/repo-analytics');
  };

  return (
    <header className="h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isFocused ? 'text-primary' : 'text-slate-500'}`}>
          <FiSearch className="w-5 h-5" />
        </div>
        <Input
          id="global-search-input"
          type="text"
          placeholder="Search repositories... (Press ⌘K)"
          className="pl-10 bg-surface border-border focus-visible:ring-primary/30 w-full text-foreground"
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchResults.length > 0) {
              handleSelectResult(searchResults[0].name);
            }
          }}
        />
        
        {/* Search Dropdown */}
        {isFocused && globalSearchQuery.trim().length >= 2 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-lg shadow-2xl overflow-hidden py-2 z-50">
            {isSearching ? (
              <div className="p-4 flex items-center justify-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto">
                {searchResults.map((repo) => (
                  <li key={repo.id}>
                    <button
                      onClick={() => handleSelectResult(repo.name)}
                      className="w-full text-left px-4 py-2 hover:bg-surface-hover flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FiGithub className="text-slate-400 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-foreground truncate">{repo.name}</p>
                          <p className="text-xs text-slate-500 truncate">{repo.description || "No description"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 pl-4 flex-shrink-0">
                        <FiStar className="text-amber-400" /> {repo.stargazers_count}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-slate-500">
                No repositories found matching "{globalSearchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 pl-4">
        {mounted && (
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-foreground hover:bg-surface transition-colors"
          >
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        )}
        
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-foreground hover:bg-surface transition-colors relative">
          <FiBell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>

        <div className="h-8 w-px bg-border mx-1"></div>

        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-tight">{userProfile?.name || userProfile?.login || 'Developer'}</p>
            <p className="text-xs text-slate-400">Pro Plan</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7C3AED] to-primary p-[2px]">
            <img 
              src={userProfile?.avatar_url || "https://github.com/identicons/devinsight.png"} 
              alt="Profile" 
              className="w-full h-full rounded-full border-2 border-background object-cover"
            />
          </div>
        </button>
      </div>

    </header>
  );
}
