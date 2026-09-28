import React, { useState } from 'react';
import type { RollingPoint } from '../../types/portfolio';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface RollingChartProps {
  data: RollingPoint[];
}

type TabType = 'risk' | 'performance';

export const RollingChart: React.FC<RollingChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabType>('risk');

  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <h2 className="text-base font-bold text-slate-200">Rolling Metrics Series</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'risk'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Beta & Alpha
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'performance'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Volatility & Sharpe
          </button>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'risk' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#60a5fa" tick={{ fontSize: 11 }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#4ade80" tick={{ fontSize: 11 }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '12px' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="beta" stroke="#60a5fa" name="Beta" dot={false} strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="alpha" stroke="#4ade80" name="Alpha" dot={false} strokeWidth={2} />
            </LineChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" stroke="#f59e0b" tick={{ fontSize: 11 }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" tick={{ fontSize: 11 }} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '12px' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="volatility" stroke="#f59e0b" name="Volatility" dot={false} strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="sharpe" stroke="#38bdf8" name="Sharpe Ratio" dot={false} strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
