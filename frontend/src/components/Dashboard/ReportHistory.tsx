"use client";
import { useEffect, useState } from "react";

export default function ReportHistory({ githubId }: { githubId: string }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/github/history?github_id=${githubId}`);
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    if (githubId) fetchHistory();
  }, [githubId]);

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Past AI Insights</h2>
      {reports.length === 0 ? (
        <p className="text-gray-400">No reports found yet. Generate your first one!</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report: any) => (
            <div key={report.id} className="p-4 bg-white/5 rounded-lg border border-white/5">
              <p className="text-xs text-indigo-400 mb-1">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-300 text-sm line-clamp-3">
                {/* If report_text is stored as JSON string, parse it; otherwise show text */}
                {typeof report.report_text === 'string' ? report.report_text : JSON.stringify(report.report_text)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}