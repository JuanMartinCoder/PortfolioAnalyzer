import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { Summary } from '../../types/portfolio';

interface HeaderProps {
  summary: Summary;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ summary, onReset }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-blue-400 transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload another file / Adjust parameters</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
          Portfolio Performance & Risk Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3 bg-[#111827] border border-slate-800/80 rounded-xl px-4 py-2 text-xs text-slate-300">
        <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
        <div>
          <p className="font-semibold">
            {summary.start_date} → {summary.end_date}
          </p>
          <p className="text-slate-400">
            {summary.total_records} records | Window: {summary.rolling_window}d | Rf: {(summary.risk_free_rate * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};
