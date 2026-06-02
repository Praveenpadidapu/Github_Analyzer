"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';
import { FiActivity, FiGitCommit, FiGitPullRequest, FiStar, FiInfo, FiDownload } from 'react-icons/fi';
import axios from 'axios';
import { subDays, subMonths, isAfter, isBefore, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';

export default function ActivityTimelinePage() {
  const { githubToken, userProfile } = useAppStore();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter state
  const [period, setPeriod] = useState('30D');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    if (githubToken && userProfile) {
      axios.get(`https://api.github.com/users/${userProfile.login}/events/public?per_page=100`, {
        headers: { Authorization: `token ${githubToken}` }
      }).then(res => {
        setEvents(res.data);
        setIsLoading(false);
      }).catch((e) => {
        toast.error('Failed to fetch activity timeline.');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [githubToken, userProfile]);

  const filteredEvents = useMemo(() => {
    if (!events.length) return [];
    
    const now = new Date();
    let startDate = new Date(0);
    let endDate = now;

    if (period === '7D') startDate = subDays(now, 7);
    else if (period === '30D') startDate = subDays(now, 30);
    else if (period === '3M') startDate = subMonths(now, 3);
    else if (period === '6M') startDate = subMonths(now, 6);
    else if (period === '1Y') startDate = subMonths(now, 12);
    else if (period === 'CUSTOM') {
      if (customStart) startDate = startOfMonth(new Date(customStart + '-01T00:00:00'));
      if (customEnd) endDate = endOfMonth(new Date(customEnd + '-01T00:00:00'));
    }

    // Filter and sort newest first
    return events
      .filter(e => {
        const eventDate = new Date(e.created_at);
        return isAfter(eventDate, startDate) && isBefore(eventDate, endDate);
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [events, period, customStart, customEnd]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent': return <FiGitCommit className="text-emerald-400 w-5 h-5" />;
      case 'PullRequestEvent': return <FiGitPullRequest className="text-purple-400 w-5 h-5" />;
      case 'WatchEvent': return <FiStar className="text-amber-400 w-5 h-5" />;
      default: return <FiInfo className="text-primary w-5 h-5" />;
    }
  };

  const formatEventText = (event: any) => {
    switch (event.type) {
      case 'PushEvent': return `Pushed ${event.payload?.commits?.length || 0} commits to ${event.repo.name}`;
      case 'PullRequestEvent': return `${event.payload.action} a pull request in ${event.repo.name}`;
      case 'WatchEvent': return `Starred ${event.repo.name}`;
      case 'CreateEvent': return `Created ${event.payload.ref_type} in ${event.repo.name}`;
      case 'ForkEvent': return `Forked ${event.repo.name}`;
      default: return `${event.type.replace('Event', '')} on ${event.repo.name}`;
    }
  };

  const escapeCSV = (str: string) => {
    if (!str) return '""';
    const stringified = String(str);
    return `"${stringified.replace(/"/g, '""')}"`;
  };

  const handleExportCSV = () => {
    if (!filteredEvents.length) return;
    const header = ['Timestamp,Event Type,Repository,Actor,Summary,Details\n'];
    const rows = filteredEvents.map(e => {
      const summary = formatEventText(e);
      let details = '';
      if (e.type === 'PushEvent' && e.payload?.commits) {
        details = e.payload.commits.map((c: any) => c.message).join(' | ');
      }
      return `${e.created_at},${e.type},${e.repo.name},${e.actor?.login || ''},${escapeCSV(summary)},${escapeCSV(details)}`;
    });
    const csv = new Blob([header.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(csv, 'activity_timeline.csv');
  };

  const handleExportJSON = () => {
    if (!filteredEvents.length) return;
    const json = new Blob([JSON.stringify(filteredEvents, null, 2)], { type: 'application/json' });
    downloadBlob(json, 'activity_timeline.json');
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported to ${filename}`);
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <FiActivity className="text-primary" /> Activity Timeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">Filter, view, and export your public GitHub activity.</p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportCSV}
            disabled={filteredEvents.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border hover:bg-surface-hover rounded text-sm text-foreground transition-colors disabled:opacity-50"
          >
            <FiDownload /> CSV
          </button>
          <button 
            onClick={handleExportJSON}
            disabled={filteredEvents.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border hover:bg-surface-hover rounded text-sm text-foreground transition-colors disabled:opacity-50"
          >
            <FiDownload /> JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-panel border-border bg-background">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['7D', '30D', '3M', '6M', '1Y', 'CUSTOM'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${period === p ? 'bg-primary text-black' : 'bg-surface text-slate-400 border border-border hover:text-foreground'}`}
              >
                {p}
              </button>
            ))}
          </div>

          {period === 'CUSTOM' && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span>From:</span>
              <input 
                type="month" 
                value={customStart} 
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-surface border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
              <span>To:</span>
              <input 
                type="month" 
                value={customEnd} 
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-surface border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
          )}

          <div className="text-sm text-slate-400">
            <span className="font-mono text-foreground bg-surface-hover px-2 py-0.5 rounded border border-border">{filteredEvents.length}</span> Events Found
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative border-l-2 border-border ml-4 pl-8 space-y-6 py-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center p-12 bg-surface rounded-lg border border-border border-dashed">
             <FiInfo className="w-8 h-8 text-slate-500 mx-auto mb-2" />
             <p className="text-slate-400 font-medium">No activity found for the selected period.</p>
          </div>
        ) : filteredEvents.map(event => (
          <div key={event.id} className="relative group">
            <div className="absolute -left-[49px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center transition-colors group-hover:border-primary">
              {getEventIcon(event.type)}
            </div>
            <Card className="glass-panel border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-foreground font-medium">{formatEventText(event)}</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    {new Date(event.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-500 px-2 py-1 bg-surface rounded border border-border self-start sm:self-auto">
                  {event.type.replace('Event', '')}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
