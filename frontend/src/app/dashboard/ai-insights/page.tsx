"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiCpu, FiCode, FiActivity, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppStore } from '@/store/useAppStore';
import { getUserRepositories, getRepositoryReadme } from '@/services/githubService';
import { toast } from 'sonner';

export default function AIInsightsPage() {
  const { githubToken, userProfile } = useAppStore();
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    // Restore selected repo from session storage if exists
    const stored = sessionStorage.getItem('ai_insights_selected_repo');
    if (stored) setSelectedRepo(stored);

    if (githubToken && userProfile) {
      getUserRepositories(githubToken, userProfile.login).then((data) => {
        setRepos(data);
      });
    }
  }, [githubToken, userProfile]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedRepo(val);
    sessionStorage.setItem('ai_insights_selected_repo', val);
  };

  const handleAnalyze = async () => {
    if (!selectedRepo || !githubToken || !userProfile) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const repoData = repos.find(r => r.name === selectedRepo);
      if (!repoData) throw new Error("Repository not found in list");

      // Fetch README content and truncate it client-side
      const readmeContent = await getRepositoryReadme(githubToken, repoData.owner.login, repoData.name);
      const truncatedReadme = readmeContent ? readmeContent.substring(0, 2500) : '';

      const payload = {
        repoName: repoData.full_name,
        language: repoData.language || "Unknown",
        description: repoData.description || "No description provided.",
        topics: repoData.topics || [],
        readmeContent: truncatedReadme
      };

      const res = await fetch('/api/ai/analyze-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Handle non-JSON responses (like 500 HTML server errors)
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (res.ok) {
          setAnalysisResult(data.analysis);
          toast.success(`Analysis generated for ${repoData.name}`);
        } else {
          setAnalysisResult(`Error: ${data.error || 'Failed to analyze repository.'}`);
          toast.error('Analysis failed: ' + (data.error || 'Unknown API Error'));
        }
      } else {
        const text = await res.text();
        console.error("Non-JSON API response:", text);
        setAnalysisResult('The server encountered an unexpected error. Please try again later.');
        toast.error('Server Error: Failed to reach AI service.');
      }
    } catch (err: any) {
      console.error(err);
      setAnalysisResult(`Failed to execute analysis. ${err.message || ''}`);
      toast.error('Network or Execution error.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FiCpu className="text-primary" /> AI Repository Insights
        </h1>
        <p className="text-slate-400 text-sm mt-1">Get an in-depth architectural breakdown and tech stack analysis powered by Gemini.</p>
      </div>

      <Card className="glass-panel border-primary/20 shadow-[0_0_30px_var(--primary-color,rgba(0,0,0,0.05))]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <select
                value={selectedRepo}
                onChange={handleSelectChange}
                className="appearance-none bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 text-foreground text-lg w-full rounded-md h-12 pl-4 pr-10 outline-none transition-all shadow-sm"
              >
                <option value="" disabled>Select a repository to analyze...</option>
                {repos.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-primary">
                <FiChevronDown className="w-5 h-5" />
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto font-bold h-12 px-8 bg-surface-hover text-foreground hover:bg-surface border border-border"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedRepo}
            >
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><FiCode className="w-5 h-5 mr-2 text-primary" /> Generate Analysis</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isAnalyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          <Card className="glass-panel border-border">
            <CardHeader className="bg-surface-hover border-b border-border pb-4 flex items-center gap-3 flex-row">
              <div className="w-6 h-6 rounded-full bg-primary/20 animate-pulse flex-shrink-0" />
              <div className="h-6 w-1/3 bg-surface rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <div className="h-5 w-1/4 bg-surface rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-hover rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-surface-hover rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-hover rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-5 w-1/4 bg-surface rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-hover rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-surface-hover rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-center py-6">
                 <p className="text-primary font-medium animate-pulse flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin" /> Analyzing architecture and code patterns...
                 </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {analysisResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`overflow-hidden border-border glass-panel mt-8 ${analysisResult.startsWith('Error') || analysisResult.startsWith('Failed') || analysisResult.startsWith('The server') ? 'border-red-500/50' : ''}`}>
            <CardHeader className={`${analysisResult.startsWith('Error') || analysisResult.startsWith('Failed') || analysisResult.startsWith('The server') ? 'bg-red-500/10' : 'bg-surface-hover'} border-b border-border pb-4`}>
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                <FiActivity className={analysisResult.startsWith('Error') || analysisResult.startsWith('Failed') || analysisResult.startsWith('The server') ? 'text-red-400' : 'text-primary'} /> 
                {analysisResult.startsWith('Error') || analysisResult.startsWith('Failed') || analysisResult.startsWith('The server') ? 'Analysis Error' : `Detailed AI Analysis for ${selectedRepo}`}
              </CardTitle>
            </CardHeader>
            <CardContent className={`p-6 sm:p-8 text-foreground prose prose-invert prose-headings:text-foreground prose-a:text-primary max-w-none ${analysisResult.startsWith('Error') || analysisResult.startsWith('Failed') || analysisResult.startsWith('The server') ? 'text-red-300' : ''}`}>
              <ReactMarkdown>{analysisResult}</ReactMarkdown>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
