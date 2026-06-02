import React from 'react';
import { FiCalendar, FiFileText, FiChevronRight, FiTrash2 } from 'react-icons/fi';
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
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 mt-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <FiFileText className="text-[#22D3EE]" />
          Analysis History
        </h3>
        <span className="text-[10px] font-mono bg-[#22D3EE]/10 text-[#22D3EE] px-2 py-0.5 rounded-md border border-[#22D3EE]/20">
          {reports.length} Saved
        </span>
      </div>

      <div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {reports.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/5 rounded-xl bg-[#0F172A]">
              <p className="text-gray-500 text-sm uppercase tracking-widest font-mono">No archived reports found.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div 
                key={report.id} 
                onClick={() => onView(report)}
                className="group flex items-center justify-between p-4 rounded-xl bg-[#0F172A] border border-white/5 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center text-[#22D3EE] border border-[#22D3EE]/30">
                    <span className="text-sm font-black">{report.health_score}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-[200px] group-hover:text-[#22D3EE] transition-colors">
                      {report.repo_name}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 font-mono">
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
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all z-10"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <FiChevronRight className="text-gray-500 group-hover:text-[#22D3EE] transition-colors w-5 h-5" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}