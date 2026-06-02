import React from 'react';
import { FiCalendar, FiFileText, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { format } from "date-fns";

interface Report {
  id: number;
  repo_name: string;
  report_text: string;
  health_score: number;
  created_at: string;
}

interface AIArchiveProps {
  reports: Report[];
  onDelete: (id: number) => void;
  onView: (report: Report) => void;
}

export default function AIArchive({ reports, onDelete, onView }: AIArchiveProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FiFileText className="text-indigo-400" />
          Analysis History
        </CardTitle>
        <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/20">
          {reports.length} Saved
        </span>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {reports.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <p className="text-slate-500 text-sm">No archived reports found.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div 
                key={report.id} 
                onClick={() => onView(report)}
                className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <span className="text-sm font-black">{report.health_score}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 truncate max-w-[150px] sm:max-w-[200px] group-hover:text-indigo-300 transition-colors">
                      {report.repo_name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <FiCalendar className="w-3 h-3" />
                      {format(new Date(report.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(report.id);
                    }}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all z-10"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <FiChevronRight className="text-slate-600 group-hover:text-indigo-400 transition-colors w-5 h-5" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}