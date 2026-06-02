"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

// Components
import Sidebar from "@/components/Dashboard/Sidebar";
import Header from "@/components/Dashboard/Header";
import StatsCard from "@/components/Dashboard/StatsCard";
import RepoCard from "@/components/Dashboard/RepoCard";
import Charts from "@/components/Dashboard/Charts";
import AIArchive from "@/components/Dashboard/AIArchive";
import SettingsModal from "@/components/Dashboard/SettingsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Icons
import { FiZap, FiActivity, FiGithub, FiBarChart2, FiCheckCircle, FiInfo } from "react-icons/fi";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("github_token", token);
      window.history.replaceState({}, document.title, "/dashboard");
      toast.success("Successfully authenticated with GitHub");
    } else if (!localStorage.getItem("github_token")) {
      window.location.href = "/";
    }
    initDashboard();
  }, []);

  const initDashboard = async () => {
    const token = localStorage.getItem("github_token") || searchParams.get("token");
    if (!token) return;

    try {
      const res = await axios.get(`/api/github/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dashData = res.data;
      
      // Initially set active repo to the first one and fetch its stats
      if (dashData.repos && dashData.repos.length > 0) {
        const firstRepo = dashData.repos[0];
        dashData.activeRepo = firstRepo;
        
        try {
            const statsRes = await axios.get(`/api/github/repo-stats?owner=${firstRepo.owner.login}&repo=${firstRepo.name}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            dashData.analytics = statsRes.data;
        } catch(e) {
            dashData.analytics = { languages: [], commits: [] };
        }
      }

      setData(dashData);
      fetchAIHistory(dashData.user.id);
    } catch (err) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard Sync Error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIHistory = async (githubId: string) => {
    try {
      const res = await axios.get(`/api/github/history?github_id=${githubId}`);
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("History Fetch Error", err);
    }
  };

  const handleDeleteReport = async (id: number) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;
    try {
      await axios.delete(`/api/github/history/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      if (aiReport?.id === id) setAiReport(null);
      toast.success("Report deleted successfully");
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  const handleViewReport = (report: any) => {
    const formattedReport = {
        ...report,
        suggestions: typeof report.suggestions === 'string' ? JSON.parse(report.suggestions) : report.suggestions
    };
    setAiReport(formattedReport);
    setActiveTab("analytics");
  };

  const handleRunAI = async () => {
    setLoadingAI(true);
    const token = localStorage.getItem("github_token");
    const toastId = toast.loading("Analyzing repository...");
    try {
      const res = await axios.post(`/api/github/analyze`, {
        repoName: data.activeRepo.name,
        github_id: data.user.id,
        owner: data.activeRepo.owner.login
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiReport(res.data);
      fetchAIHistory(data.user.id);
      toast.success("AI Analysis complete!", { id: toastId });
    } catch (err) {
      toast.error("AI Analysis failed", { id: toastId });
      console.error("AI Analysis Failed", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleRepoSelect = async (repoName: string) => {
    setLoading(true);
    const token = localStorage.getItem("github_token");
    try {
      const selectedRepo = data.repos.find((r: any) => r.name === repoName);
      if (!selectedRepo) return;
      
      const statsRes = await axios.get(`/api/github/repo-stats?owner=${selectedRepo.owner.login}&repo=${selectedRepo.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setData((prev: any) => ({
        ...prev,
        activeRepo: selectedRepo,
        analytics: statsRes.data
      }));
      
      setAiReport(null);
      setActiveTab("analytics");
    } catch (e) {
      toast.error("Could not fetch repo details");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-purple-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
        </div>
        <p className="text-slate-400 font-mono text-sm animate-pulse tracking-widest uppercase">Initializing Intelligence</p>
      </div>
    </div>
  );

  const filteredRepos = data?.repos?.filter((repo: any) => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="min-h-screen bg-[#000000] text-white relative font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onSettingsClick={() => setIsSettingsOpen(true)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <main className="md:pl-16 flex-1 flex flex-col relative z-10 min-h-screen bg-[#0B0F19]">
        <Header user={data.user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Repositories" value={data.repos.length} type="repos" />
                <StatsCard title="Followers" value={data.user.followers} type="followers" />
                <StatsCard title="Public Gists" value={data.user.public_gists} type="gists" />
                <StatsCard title="Health Score" value="88%" type="score" />
              </div>
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                  <FiBarChart2 className="text-[#22D3EE]" /> Platform Wide Activity
                </h3>
                <Charts analytics={data.analytics} />
              </div>
              <AIArchive reports={reports} onDelete={handleDeleteReport} onView={handleViewReport} />
            </div>
          )}

          {activeTab === "repos" && (
            <div className="space-y-6">
              {searchQuery && (
                <p className="text-sm text-[#808080] font-mono">Found {filteredRepos.length} results for "{searchQuery}"</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in duration-300">
                {filteredRepos.map((repo: any) => (
                  <RepoCard key={repo.id} repo={repo} onSelect={() => handleRepoSelect(repo.name)} />
                ))}
                {filteredRepos.length === 0 && (
                  <div className="col-span-full py-12 text-center border border-dashed border-[#222] rounded-2xl bg-[#050505]">
                    <p className="text-[#808080] text-sm font-mono uppercase tracking-widest">No repositories match your search.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] border border-white/10 p-8 md:p-12 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#22D3EE]/10 to-[#8B5CF6]/10 opacity-50 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#22D3EE] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-[#111827] border border-white/10 rounded-xl shadow-lg">
                        <FiGithub className="text-white w-6 h-6" />
                      </div>
                      <h2 className="text-4xl font-bold tracking-tight text-white">{data.activeRepo?.name}</h2>
                    </div>
                    <p className="text-gray-400 max-w-2xl text-lg mb-6">{data.activeRepo?.description || "No description provided for this repository."}</p>
                    <Button 
                      size="lg"
                      onClick={handleRunAI}
                      disabled={loadingAI}
                      className="bg-white text-black hover:bg-gray-200 transition-colors px-8 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-medium"
                    >
                      <FiZap className={loadingAI ? "animate-spin mr-2" : "text-[#8B5CF6] mr-2"} />
                      {loadingAI ? "Analyzing..." : "Generate AI Insights"}
                    </Button>
                  </div>
                  
                  {aiReport && (
                    <div className="w-full md:w-64 bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-2xl">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4 block">Repository Health</span>
                      <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradientScore)" strokeWidth="8" strokeDasharray={`${(aiReport.health_score || aiReport.healthScore || 0) * 2.83} 283`} className="transition-all duration-1000 ease-out" />
                          <defs>
                            <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#22D3EE" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-white">{aiReport.health_score || aiReport.healthScore || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {aiReport && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                    <h3 className="text-sm font-bold text-[#22D3EE] mb-4 flex items-center gap-2">
                        <FiActivity className="w-4 h-4" /> Executive Summary
                    </h3>
                    <p className="text-base text-gray-300 leading-relaxed relative z-10">
                        {aiReport.report_text || aiReport.summary}
                    </p>
                  </div>
                  <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border-[#8B5CF6]/30">
                    <h3 className="text-sm font-bold text-[#8B5CF6] mb-6 flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4" /> Strategic Recommendations
                    </h3>
                    <div className="space-y-4 relative z-10">
                        {(aiReport.suggestions || []).map((s: string, i: number) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[#0B0F19]/50 border border-white/5 hover:border-white/10 transition-colors">
                                <span className="text-[#8B5CF6] font-bold text-sm bg-[#8B5CF6]/10 w-6 h-6 flex items-center justify-center rounded-md shrink-0">{i+1}</span>
                                <span className="text-sm text-gray-300 leading-relaxed">{s}</span>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 mt-8">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                  <FiBarChart2 className="text-[#22D3EE]" /> Active Repo Insights
                </h3>
                <Charts analytics={data.analytics} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <p className="text-indigo-400 font-mono text-sm animate-pulse">Loading Application Shell...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}