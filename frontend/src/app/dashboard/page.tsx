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
      const res = await axios.get(`${API_BASE_URL}/api/github/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
      fetchAIHistory(res.data.user.id);
    } catch (err) {
      toast.error("Failed to load dashboard data");
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
      const res = await axios.post(`${API_BASE_URL}/api/github/analyze`, {
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
      const res = await axios.get(`${API_BASE_URL}/api/github/data?repo=${repoName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data); 
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

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative">
        <Header user={data?.user} />
        
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Repositories" value={data.repos.length} type="repos" />
                <StatsCard title="Followers" value={data.user.followers} type="followers" />
                <StatsCard title="Public Gists" value={data.user.public_gists} type="gists" />
                <StatsCard title="Health Score" value="88%" type="score" />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBarChart2 className="text-indigo-400" /> Platform Wide Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Charts analytics={data.analytics} />
                </CardContent>
              </Card>
              <AIArchive reports={reports} onDelete={handleDeleteReport} onView={handleViewReport} />
            </div>
          )}

          {activeTab === "repos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in duration-300">
              {data.repos.map((repo: any) => (
                <RepoCard key={repo.id} repo={repo} onSelect={() => handleRepoSelect(repo.name)} />
              ))}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <Card className="bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-transparent border-indigo-500/20">
                <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <FiGithub className="text-indigo-400 w-6 h-6" />
                      </div>
                      <h2 className="text-3xl font-black tracking-tight">{data.activeRepo?.name}</h2>
                    </div>
                    <p className="text-slate-400 max-w-2xl mt-2">{data.activeRepo?.description || "No description provided for this repository."}</p>
                  </div>
                  <Button 
                    size="lg"
                    onClick={handleRunAI}
                    disabled={loadingAI}
                  >
                    <FiZap className={loadingAI ? "animate-spin" : "text-yellow-400"} />
                    {loadingAI ? "Analyzing..." : "Generate AI Insights"}
                  </Button>
                </CardContent>
              </Card>

              {aiReport && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <Card className="flex flex-col border-indigo-500/30 shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]">
                    <CardContent className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-4">Health Score</span>
                        <div className="relative flex items-center justify-center w-40 h-40">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${(aiReport.health_score || aiReport.healthScore || 0) * 2.83} 283`} className="text-indigo-500 transition-all duration-1000 ease-out" />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-slate-100">{aiReport.health_score || aiReport.healthScore || 0}</span>
                            <span className="text-xs text-slate-400 mt-1">/ 100</span>
                          </div>
                        </div>
                    </CardContent>
                  </Card>

                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card className="flex-1">
                      <CardContent className="p-6">
                        <h3 className="text-sm font-bold text-indigo-400 mb-3 flex items-center gap-2">
                            <FiActivity className="w-4 h-4" /> Executive Summary
                        </h3>
                        <p className="text-base text-slate-300 leading-relaxed">
                            {aiReport.report_text || aiReport.summary}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-emerald-500/5 border-emerald-500/20">
                      <CardContent className="p-6">
                        <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                            <FiCheckCircle className="w-4 h-4" /> Optimization Suggestions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(aiReport.suggestions || []).map((s: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 bg-black/40 p-4 rounded-xl border border-white/[0.05]">
                                    <span className="text-emerald-500 font-bold text-sm bg-emerald-500/10 w-6 h-6 flex items-center justify-center rounded-md shrink-0">{i+1}</span>
                                    <span className="text-sm text-slate-300">{s}</span>
                                </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FiBarChart2 className="text-indigo-400" /> Active Repo Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Charts analytics={data.analytics} />
                </CardContent>
              </Card>
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