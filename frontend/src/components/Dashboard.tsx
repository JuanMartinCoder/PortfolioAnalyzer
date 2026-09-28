import React from 'react';
import type { AnalysisResponse } from '../types/portfolio';
import { Header } from './dashboard/Header';
import { MetricGrid } from './dashboard/MetricGrid';
import { RollingChart } from './dashboard/RollingChart';
import { EquityChart } from './dashboard/EquityChart';

interface DashboardProps {
  data: AnalysisResponse;
  dailyReturns: DailyReturnPoint[];
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, dailyReturns, onReset }) => {
  const { summary, metrics, rolling_series } = data.results;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-100 font-sans">
      <Header summary={summary} onReset={onReset} />
      <MetricGrid metrics={metrics} />
      {dailyReturns && <EquityChart dailyReturns={dailyReturns} />}
      <RollingChart data={rolling_series} />
    </div>
  );
};
