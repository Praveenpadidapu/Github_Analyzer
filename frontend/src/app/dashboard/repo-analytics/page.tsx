"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { getUserRepositories } from '@/services/githubService';
import { Loader2 } from 'lucide-react';
import { FiPieChart, FiStar, FiGitBranch, FiEye, FiAlertCircle, FiClock, FiCode, FiX } from 'react-icons/fi';
import axios from 'axios';

export default function RepositoryAnalyticsPage() {
  const { githubToken, userProfile } = useAppStore();
  const [repos, setRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [repoDetails, setRepoDetails] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (githubToken && userProfile) {
      getUserRepositories(githubToken, userProfile.login).then((data) => {
        setRepos(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [githubToken, userProfile]);

  const openRepoDetails = async (repo: any) => {
    setSelectedRepo(repo);
    setIsLoadingDetails(true);
    try {
      // Fetch languages breakdown
      const langRes = await axios.get(repo.languages_url, {
        headers: { Authorization: `token ${githubToken}` }
      });
      // Fetch contributors
      const contribRes = await axios.get(repo.contributors_url, {
        headers: { Authorization: `token ${githubToken}` }
      });
      
      setRepoDetails({
        languages: langRes.data,
        contributors: contribRes.data,
      });
    } catch (e) {
      console.error("Failed to load repo details");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FiPieChart className="text-primary" /> Repository Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">Detailed breakdown of all your repositories. Click on any repository for in-depth analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {repos.map(repo => (
          <Card 
            key={repo.id} 
            hoverEffect 
            className="glass-panel cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => openRepoDetails(repo)}
          >
            <CardHeader className="pb-2 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-lg truncate max-w-[80%] text-foreground" title={repo.name}>{repo.name}</CardTitle>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${repo.private ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'}`}>
                {repo.private ? 'Private' : 'Public'}
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-slate-400 line-clamp-2 h-10">{repo.description || "No description provided."}</p>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                {repo.language && <span className="text-primary">{repo.language}</span>}
                <span className="flex items-center gap-1"><FiStar className="text-amber-400"/> {repo.stargazers_count}</span>
                <span className="flex items-center gap-1"><FiGitBranch className="text-purple-400"/> {repo.forks_count}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Drill-down Modal */}
      {selectedRepo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            
            <button 
              onClick={() => setSelectedRepo(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-foreground hover:bg-surface-hover rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{selectedRepo.name}</h2>
                  <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded border ${selectedRepo.private ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'}`}>
                    {selectedRepo.private ? 'Private' : 'Public'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{selectedRepo.description || "No description"}</p>
              </div>

              {/* Top Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-xs text-slate-500 flex items-center gap-1"><FiStar/> Stars</p>
                  <p className="text-xl font-bold text-foreground mt-1">{selectedRepo.stargazers_count}</p>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-xs text-slate-500 flex items-center gap-1"><FiGitBranch/> Forks</p>
                  <p className="text-xl font-bold text-foreground mt-1">{selectedRepo.forks_count}</p>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-xs text-slate-500 flex items-center gap-1"><FiEye/> Watchers</p>
                  <p className="text-xl font-bold text-foreground mt-1">{selectedRepo.watchers_count}</p>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-border">
                  <p className="text-xs text-slate-500 flex items-center gap-1"><FiAlertCircle/> Issues</p>
                  <p className="text-xl font-bold text-foreground mt-1">{selectedRepo.open_issues_count}</p>
                </div>
              </div>

              {/* Dates & Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Repository Meta</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between border-b border-border pb-1">
                      <span className="text-slate-500">Default Branch</span>
                      <span className="text-primary font-mono">{selectedRepo.default_branch}</span>
                    </p>
                    <p className="flex justify-between border-b border-border pb-1">
                      <span className="text-slate-500">Size</span>
                      <span className="text-foreground">{(selectedRepo.size / 1024).toFixed(2)} MB</span>
                    </p>
                    <p className="flex justify-between border-b border-border pb-1">
                      <span className="text-slate-500">Created</span>
                      <span className="text-foreground">{new Date(selectedRepo.created_at).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between border-b border-border pb-1">
                      <span className="text-slate-500">Last Pushed</span>
                      <span className="text-foreground">{new Date(selectedRepo.pushed_at).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                {/* API Fetched Data */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <FiCode className="text-primary" /> Languages & Tech
                  </h3>
                  
                  {isLoadingDetails ? (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing codebase...
                    </div>
                  ) : repoDetails?.languages && Object.keys(repoDetails.languages).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(repoDetails.languages).map(([lang, bytes]: [string, any]) => (
                        <div key={lang} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{lang}</span>
                          <span className="text-slate-500 font-mono text-xs">{bytes} bytes</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No language data found.</p>
                  )}
                </div>
              </div>

              {/* Contributors */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Top Contributors</h3>
                {isLoadingDetails ? (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading contributors...
                  </div>
                ) : repoDetails?.contributors ? (
                  <div className="flex flex-wrap gap-4">
                    {repoDetails.contributors.slice(0, 8).map((c: any) => (
                      <div key={c.id} className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-full">
                        <img src={c.avatar_url} alt={c.login} className="w-6 h-6 rounded-full" />
                        <span className="text-xs text-foreground">{c.login}</span>
                        <span className="text-[10px] text-slate-500 bg-surface-hover px-1.5 py-0.5 rounded">{c.contributions}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No contributor data found.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
