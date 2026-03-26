"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

// Components
import Sidebar from "@/components/Dashboard/Sidebar";
import Header from "@/components/Dashboard/Header";
import StatsCard from "@/components/Dashboard/StatsCard";
import RepoCard from "@/components/Dashboard/RepoCard";
import Charts from "@/components/Dashboard/Charts";
import AIArchive from "@/components/Dashboard/AIArchive";

// Icons
import { FiZap, FiActivity, FiGithub, FiLayers, FiBarChart2, FiCheckCircle, FiInfo } from "react-icons/fi";

// 1. Define the actual Dashboard Logic in a separate component
function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // Define API Base URL - Use the Render URL you added to Vercel
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("github_token", token);
      window.history.replaceState({}, document.title, "/dashboard");
    } else if (!localStorage.getItem("github_token")) {
      window.location.href = "/";
    }
    initDashboard();
  }, []);

  const initDashboard = async () => {
    const token = localStorage.getItem("github_token") || searchParams.get("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/api/github/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
      fetchAIHistory(res.data.user.id);
    } catch (err) {
      console.error("Dashboard Sync Error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIHistory = async (githubId: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/github/history?github_id=${githubId}`);
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("History Fetch Error", err);
    }
  };

  const handleDeleteReport = async (id: number) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/github/history/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      if (aiReport?.id === id) setAiReport(null);
    } catch (err) {
      alert("Failed to delete report");
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
    try {
      const res = await axios.post(`${API_BASE_URL}/api/github/analyze`, {
        repoName: data.activeRepo.name,
        github_id: data.user.id,
        owner: data.activeRepo.owner.login
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiReport(res.data);
      fetchAIHistory(data.user.id);
    } catch (err) {
      console.error("AI Analysis Failed", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleRepoSelect = async (repoName: string) => {
    setLoading(true);
    const token = localStorage.getItem("github_token");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/github/data?repo=${repoName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data); 
      setAiReport(null);
      setActiveTab("analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-400 font-mono text-xs animate-pulse">Analyzing Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="flex bg-[#020617] min-h-screen text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <Header user={data?.user} />
        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard title="Repositories" value={data.repos.length} type="repos" />
                <StatsCard title="Followers" value={data.user.followers} type="followers" />
                <StatsCard title="Public Gists" value={data.user.public_gists} type="gists" />
                <StatsCard title="Health Score" value="88%" type="score" />
              </div>
              <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <FiBarChart2 className="text-indigo-400" /> Platform Wide Tech Stack
                </h3>
                <Charts analytics={data.analytics} />
              </div>
              <AIArchive reports={reports} onDelete={handleDeleteReport} onView={handleViewReport} />
            </div>
          )}

          {activeTab === "repos" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in duration-300">
              {data.repos.map((repo: any) => (
                <RepoCard key={repo.id} repo={repo} onSelect={() => handleRepoSelect(repo.name)} />
              ))}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-gradient-to-br from-indigo-950/50 to-transparent p-8 rounded-[2rem] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiGithub className="text-indigo-400" size={20} />
                    <h2 className="text-2xl font-black">{data.activeRepo?.name}</h2>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 max-w-2xl">{data.activeRepo?.description || "No description provided for this repository."}</p>
                </div>
                <button 
                  onClick={handleRunAI}
                  disabled={loadingAI}
                  className="group relative px-8 py-4 bg-indigo-600 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  <FiZap className={loadingAI ? "animate-spin" : "group-hover:text-yellow-300"} />
                  {loadingAI ? "Analyzing..." : "Run AI Review"}
                </button>
              </div>

              {aiReport && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 flex flex-col">
                    <div className="text-center mb-6">
                        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Health Score</span>
                        <div className="text-6xl font-black mt-1 text-white">{aiReport.health_score || aiReport.healthScore}</div>
                        <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${aiReport.health_score || aiReport.healthScore}%` }}></div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                            <FiInfo size={10} /> Score Calculation
                        </h4>
                        <div className="space-y-3 h-32 overflow-y-auto pr-2 custom-scrollbar text-[11px] text-gray-400 italic">
                            <p className="border-l-2 border-indigo-500/30 pl-2">Calculated from <b>Tech Stack Diversity</b>.</p>
                            <p className="border-l-2 border-indigo-500/30 pl-2">Weighted by <b>Commit Frequency</b>.</p>
                        </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xs font-bold text-indigo-300 mb-3 flex items-center gap-2">
                            <FiActivity size={14} /> AI Executive Summary
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                            {aiReport.report_text || aiReport.summary}
                        </p>
                    </div>
                    <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/20">
                        <h3 className="text-xs font-bold text-green-400 mb-4 flex items-center gap-2">
                            <FiCheckCircle size={14} /> Optimization Suggestions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(aiReport.suggestions || []).map((s: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-[11px] text-gray-400 bg-black/20 p-3 rounded-lg border border-white/5">
                                    <span className="text-indigo-400 font-bold">#0{i+1}</span>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <FiBarChart2 className="text-indigo-400" /> Active Repo Insights
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

// 2. Wrap the logic in Suspense to fix the Vercel Build error
export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
        <p className="text-indigo-400 font-mono text-xs animate-pulse">Loading Dashboard Content...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}