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
    <Card className="bg-[#0a0a0a] border-[#1a1a1a]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-white">
          <FiFileText className="text-[#00f0ff]" />
          Analysis History
        </CardTitle>
        <span className="text-[10px] font-mono bg-[#00f0ff]/10 text-[#00f0ff] px-2 py-0.5 rounded-md border border-[#00f0ff]/20 neon-glow-cyan">
          {reports.length} Saved
        </span>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {reports.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[#333] rounded-xl bg-[#111]">
              <p className="text-[#808080] text-sm uppercase tracking-widest font-mono">No archived reports found.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div 
                key={report.id} 
                onClick={() => onView(report)}
                className="group flex items-center justify-between p-4 rounded-xl bg-[#111] border border-[#222] hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] border border-[#00f0ff]/30">
                    <span className="text-sm font-black">{report.health_score}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white truncate max-w-[150px] sm:max-w-[200px] group-hover:text-[#00f0ff] transition-colors">
                      {report.repo_name}
                    </h4>
                    <p className="text-xs text-[#555] flex items-center gap-1.5 mt-0.5 font-mono">
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
                    className="p-2 text-[#555] hover:text-[#ff3366] hover:bg-[#ff3366]/10 rounded-lg transition-all z-10"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <FiChevronRight className="text-[#555] group-hover:text-[#00f0ff] transition-colors w-5 h-5" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}