"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FiUsers, FiGitCommit, FiStar, FiGitBranch, FiEye, FiAlertCircle, FiClock, FiCode } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function ComparePage() {
  const { githubToken } = useAppStore();
  const [repo1Name, setRepo1Name] = useState('facebook/react');
  const [repo2Name, setRepo2Name] = useState('vuejs/core');
  
  const [repo1Data, setRepo1Data] = useState<any>(null);
  const [repo2Data, setRepo2Data] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  const fetchRepoData = async (fullName: string) => {
    try {
      const headers = githubToken ? { Authorization: `token ${githubToken}` } : {};
      
      const repoRes = await axios.get(`https://api.github.com/repos/${fullName}`, { headers });
      
      // Attempt to get total commits by summing top contributors
      let totalCommits = 0;
      try {
        const contribRes = await axios.get(`https://api.github.com/repos/${fullName}/contributors?per_page=100`, { headers });
        totalCommits = contribRes.data.reduce((acc: number, c: any) => acc + c.contributions, 0);
      } catch (e) {
        console.warn('Could not fetch contributors for commits count', e);
      }

      return {
        ...repoRes.data,
        total_commits: totalCommits > 0 ? totalCommits + '+' : 'N/A'
      };
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('API Rate limit exceeded. Please add a GitHub token in Settings.');
      }
      if (error.response?.status === 404) {
        throw new Error(`Repository ${fullName} not found.`);
      }
      throw new Error(`Failed to fetch ${fullName}`);
    }
  };

  const handleCompare = async () => {
    if (!repo1Name || !repo2Name) return;
    
    setIsComparing(true);
    setRepo1Data(null);
    setRepo2Data(null);

    try {
      const [data1, data2] = await Promise.all([
        fetchRepoData(repo1Name),
        fetchRepoData(repo2Name)
      ]);
      setRepo1Data(data1);
      setRepo2Data(data2);
      toast.success('Comparison complete');
    } catch (error: any) {
      toast.error(error.message || 'Comparison failed');
    } finally {
      setIsComparing(false);
    }
  };

  const renderStat = (icon: React.ReactNode, label: string, value: string | number, isWinner?: boolean) => (
    <div className="flex justify-between items-center border-b border-border pb-3">
      <div className="flex items-center gap-3 text-slate-400">{icon} {label}</div>
      <div className={`font-bold text-lg ${isWinner ? 'text-primary' : 'text-foreground'}`}>
        {value?.toLocaleString() || '0'}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FiUsers className="text-primary" /> Compare Repositories
        </h1>
        <p className="text-slate-400 text-sm mt-1">Compare stars, forks, and commit activity side-by-side with real-time GitHub data.</p>
      </div>

      <Card className="glass-panel border-border">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-medium text-slate-400">Repository 1</label>
            <Input 
              value={repo1Name} 
              onChange={(e) => setRepo1Name(e.target.value)} 
              placeholder="owner/repo"
              className="h-12 bg-background border-border text-foreground"
            />
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-medium text-slate-400">Repository 2</label>
            <Input 
              value={repo2Name} 
              onChange={(e) => setRepo2Name(e.target.value)} 
              placeholder="owner/repo"
              className="h-12 bg-background border-border text-foreground"
            />
          </div>
          <Button variant="primary" size="lg" className="h-12 w-full md:w-32" onClick={handleCompare} disabled={isComparing}>
            {isComparing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Compare'}
          </Button>
        </CardContent>
      </Card>

      {(repo1Data && repo2Data) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
        >
          {/* Repo 1 */}
          <Card className="glass-panel border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <CardHeader className="border-b border-border bg-surface-hover">
              <CardTitle className="text-xl text-primary flex flex-col gap-1">
                {repo1Data.full_name}
                <span className="text-xs text-slate-400 font-normal line-clamp-1">{repo1Data.description}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {renderStat(<FiStar className="text-amber-400" />, 'Stars', repo1Data.stargazers_count, repo1Data.stargazers_count > repo2Data.stargazers_count)}
              {renderStat(<FiGitBranch className="text-purple-400" />, 'Forks', repo1Data.forks_count, repo1Data.forks_count > repo2Data.forks_count)}
              {renderStat(<FiEye className="text-emerald-400" />, 'Watchers', repo1Data.watchers_count, repo1Data.watchers_count > repo2Data.watchers_count)}
              {renderStat(<FiAlertCircle className="text-rose-400" />, 'Open Issues', repo1Data.open_issues_count)}
              {renderStat(<FiGitCommit className="text-blue-400" />, 'Commits (Top 100)', repo1Data.total_commits)}
              {renderStat(<FiCode className="text-slate-400" />, 'Primary Language', repo1Data.language || 'N/A')}
              {renderStat(<FiClock className="text-slate-400" />, 'Last Pushed', new Date(repo1Data.pushed_at).toLocaleDateString())}
            </CardContent>
          </Card>

          {/* Repo 2 */}
          <Card className="glass-panel border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#7C3AED]"></div>
            <CardHeader className="border-b border-border bg-surface-hover">
              <CardTitle className="text-xl text-[#7C3AED] flex flex-col gap-1">
                {repo2Data.full_name}
                <span className="text-xs text-slate-400 font-normal line-clamp-1">{repo2Data.description}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {renderStat(<FiStar className="text-amber-400" />, 'Stars', repo2Data.stargazers_count, repo2Data.stargazers_count > repo1Data.stargazers_count)}
              {renderStat(<FiGitBranch className="text-purple-400" />, 'Forks', repo2Data.forks_count, repo2Data.forks_count > repo1Data.forks_count)}
              {renderStat(<FiEye className="text-emerald-400" />, 'Watchers', repo2Data.watchers_count, repo2Data.watchers_count > repo1Data.watchers_count)}
              {renderStat(<FiAlertCircle className="text-rose-400" />, 'Open Issues', repo2Data.open_issues_count)}
              {renderStat(<FiGitCommit className="text-blue-400" />, 'Commits (Top 100)', repo2Data.total_commits)}
              {renderStat(<FiCode className="text-slate-400" />, 'Primary Language', repo2Data.language || 'N/A')}
              {renderStat(<FiClock className="text-slate-400" />, 'Last Pushed', new Date(repo2Data.pushed_at).toLocaleDateString())}
            </CardContent>
          </Card>
        </motion.div>
      )}

    </div>
  );
}
