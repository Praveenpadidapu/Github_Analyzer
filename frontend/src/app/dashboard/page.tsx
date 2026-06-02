"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { FiBook, FiUsers, FiStar, FiGitPullRequest, FiActivity, FiCpu, FiTrendingUp } from 'react-icons/fi';
import { CommitActivityChart } from '@/components/charts/CommitActivityChart';
import { LanguageAnalyticsChart } from '@/components/charts/LanguageAnalyticsChart';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { getAuthenticatedUser, getUserRepositories, getLanguageAnalytics, getCommitActivity } from '@/services/githubService';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardOverview() {
  const { githubToken, setUserProfile } = useAppStore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [languageData, setLanguageData] = useState<any[]>([]);
  const [commitData, setCommitData] = useState<any[]>([]);
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  useEffect(() => {
    if (!githubToken) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch User Profile
        const user = await getAuthenticatedUser(githubToken);
        setUserProfile(user);

        // Fetch Repos
        const repos = await getUserRepositories(githubToken, user.login);
        
        // Calculate total stars
        const totalStars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

        // Process charts
        const langs = getLanguageAnalytics(repos);
        setLanguageData(langs);

        const commits = await getCommitActivity(githubToken, user.login);
        setCommitData(commits);
        const totalContributions = commits.reduce((acc, curr) => acc + curr.commits, 0);

        // Calculate Score
        const calculatedScore = await import('@/utils/scoreCalculator').then(m => m.calculateAIAssistedScore(
          totalContributions,
          totalStars,
          user.public_repos,
          user.followers
        ));
        setScoreResult(calculatedScore);

        setStats([
          { id: 'repos', name: 'Total Repositories', value: user.public_repos, icon: FiBook, trend: null, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { id: 'followers', name: 'Followers', value: user.followers, icon: FiUsers, trend: null, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { id: 'stars', name: 'Stars Earned', value: totalStars, icon: FiStar, trend: null, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { id: 'following', name: 'Following', value: user.following, icon: FiGitPullRequest, trend: null, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { id: 'contributions', name: 'Total Contributions', value: totalContributions, icon: FiActivity, trend: null, color: 'text-primary', bg: 'bg-primary/10' },
          { id: 'score', name: 'AI Productivity Score', value: `${calculatedScore.totalScore}/100`, icon: FiCpu, trend: calculatedScore.tier, color: 'text-pink-400', bg: 'bg-pink-400/10' },
        ]);

      } catch (err) {
        console.error("Error fetching github data", err);
        // Might be an expired token
        if ((err as any)?.response?.status === 401) {
           router.push('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [githubToken, router, setUserProfile]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
         <Loader2 className="w-10 h-10 animate-spin text-primary" />
         <p className="text-slate-400 animate-pulse font-medium">Aggregating your GitHub analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back! Here's your real-time GitHub activity summary.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            key={stat.id}
          >
            <Card 
              hoverEffect 
              className={`group h-full ${stat.id === 'score' ? 'cursor-pointer hover:ring-2 hover:ring-primary/50' : ''}`}
              onClick={() => stat.id === 'score' && setIsScoreModalOpen(true)}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      {stat.name}
                      {stat.id === 'score' && <span className="inline-flex items-center text-primary ml-1" title="How it's calculated">ⓘ</span>}
                    </p>
                    <h3 className="text-3xl font-bold text-foreground mt-2 tracking-tight">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                {stat.trend && (
                  <div className="mt-4 flex items-center text-sm">
                    <FiTrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 font-medium">{stat.trend}</span>
                    <span className="text-slate-500 ml-2">{stat.id === 'score' ? 'Global Rank' : 'vs last month'}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          {/* We pass the dynamic data as a prop (we need to update the chart component to accept it) */}
          <CommitActivityChart dynamicData={commitData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-1"
        >
          <LanguageAnalyticsChart dynamicData={languageData} />
        </motion.div>
      </div>

      {/* Score Modal overlay */}
      {isScoreModalOpen && scoreResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FiCpu className="text-primary" /> Score Calculation
              </h2>
              <button 
                onClick={() => setIsScoreModalOpen(false)}
                className="text-slate-400 hover:text-foreground text-xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {scoreResult.explanation}
            </p>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-border pb-2">Weighted Breakdown</h3>
              {scoreResult.factors.map((factor: any) => (
                <div key={factor.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{factor.name}</span>
                    <span className="text-primary font-bold">+{factor.contribution} pts</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min((factor.contribution / factor.weight) * 100, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-slate-400">{factor.description} (Max {factor.weight} pts)</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Calculation</span>
              <span className="text-2xl font-bold text-foreground">{scoreResult.totalScore} / 100</span>
            </div>
          </motion.div>
        </div>
      )}
      
    </div>
  );
}