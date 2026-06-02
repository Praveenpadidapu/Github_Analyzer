"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Dashboard/Sidebar";
import Header from "@/components/Dashboard/Header";
import { FiCheck, FiUser, FiSettings, FiGithub, FiDatabase, FiLock } from "react-icons/fi";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("settings");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // We just need a dummy user object for the Header, 
    // or fetch real user from local storage/API if needed.
    setUser({ login: "User", avatar_url: "" });
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white relative font-sans flex">
      <Sidebar activeTab={activeTab} setActiveTab={(id: string) => {
        if (id === 'settings') return;
        router.push(`/dashboard?tab=${id}`);
      }} onSettingsClick={() => {}} />

      <main className="md:pl-16 flex-1 flex flex-col relative z-10 min-h-screen bg-[#0B0F19]">
        <Header user={user} searchQuery={""} setSearchQuery={() => {}} />

        <div className="p-6 md:p-10 max-w-5xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <FiSettings className="text-[#22D3EE]" /> Settings
            </h1>
            <p className="text-gray-400">Manage your DevInsight AI preferences and configurations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-[#111827] border border-white/10 text-white font-medium flex items-center gap-3">
                <FiUser className="text-[#22D3EE]" /> Account
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#111827]/50 text-gray-400 font-medium flex items-center gap-3 transition-colors">
                <FiDatabase className="text-gray-500" /> Data Preferences
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#111827]/50 text-gray-400 font-medium flex items-center gap-3 transition-colors">
                <FiLock className="text-gray-500" /> Privacy & Security
              </button>
            </div>

            <div className="md:col-span-2 space-y-8">
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">AI Configuration</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0F172A]">
                    <div>
                      <p className="text-sm font-medium text-white">Strict Analysis Mode</p>
                      <p className="text-xs text-gray-400 mt-1">Force AI to prioritize performance suggestions.</p>
                    </div>
                    <div className="w-10 h-6 bg-[#22D3EE] rounded-full flex items-center p-1 cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                      <div className="w-4 h-4 bg-white rounded-full transform translate-x-4 transition-transform"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0F172A]">
                    <div>
                      <p className="text-sm font-medium text-white">Detailed Reports</p>
                      <p className="text-xs text-gray-400 mt-1">Generate longer, more comprehensive AI insights.</p>
                    </div>
                    <div className="w-10 h-6 bg-gray-700 rounded-full flex items-center p-1 cursor-pointer">
                      <div className="w-4 h-4 bg-gray-400 rounded-full transition-transform"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111827] border border-white/5 rounded-2xl p-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">GitHub Integration</h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-xl border border-white/5 bg-[#0F172A] gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#22D3EE]/10 rounded-full flex items-center justify-center">
                      <FiGithub className="w-6 h-6 text-[#22D3EE]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Connected to GitHub</p>
                      <p className="text-xs text-gray-400 mt-1">Your account is currently synced.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-colors border border-white/10 hover:border-red-500/30">
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
