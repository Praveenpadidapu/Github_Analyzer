import React from 'react';
import { Calendar, FileText, ChevronRight, Trash2 } from 'lucide-react';

interface Report {
  id: number;
  repo_name: string;
  report_text: string;
  health_score: number;
  created_at: string;
}

// Updated Interface
interface AIArchiveProps {
  reports: Report[];
  onDelete: (id: number) => void;
  onView: (report: Report) => void;
}

export default function AIArchive({ reports, onDelete, onView }: AIArchiveProps) {
  return (
    <div className="bg-[#0f172a]/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="text-indigo-400" size={20} />
          Analysis History
        </h3>
        <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
          {reports.length} Saved
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {reports.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-gray-500 text-sm">No archived reports found.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => onView(report)} // 1. Trigger the view function
              className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <span className="text-xs font-bold">{report.health_score}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white truncate max-w-[150px]">
                    {report.repo_name}
                  </h4>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // 2. Critical: Stops "View" from firing
                    onDelete(report.id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors z-10"
                >
                  <Trash2 size={16} />
                </button>
                <ChevronRight className="text-gray-700 group-hover:text-indigo-400 transition-colors" size={18} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}