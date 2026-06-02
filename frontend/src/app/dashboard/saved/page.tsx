"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiBookmark, FiDownload, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

type Report = {
  id: string;
  targetUsername: string;
  repositoryCount: number;
  aiScore: number;
  createdAt: string;
};

export default function SavedReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Implement delete
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <FiBookmark className="text-primary" /> Saved Reports
        </h1>
        <p className="text-slate-400 text-sm mt-1">Access your previously generated AI analysis and user reports.</p>
      </div>

      <Card className="glass-panel border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <FiBookmark className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No saved reports</h3>
              <p className="text-slate-400 text-sm">You haven't saved any repository or user analysis yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reports.map((report) => (
                <div key={report.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-hover transition-colors">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {report.targetUsername}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                      <span>{format(new Date(report.createdAt), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>{report.repositoryCount} Repositories</span>
                      <span>•</span>
                      <span className="text-primary">AI Score: {report.aiScore || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 font-medium">
                      <FiExternalLink className="mr-2 w-4 h-4" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="h-9">
                      <FiDownload className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" className="h-9 w-9 p-0" onClick={() => handleDelete(report.id)}>
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
