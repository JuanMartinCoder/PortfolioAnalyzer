import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { DailyReturnPoint, EquityPoint } from '../../types/portfolio';

interface EquityCurveChartProps {
  dailyReturns: DailyReturnPoint[];
}

export const EquityChart: React.FC<EquityCurveChartProps> = ({ dailyReturns }) => {
  const [initialBase, setInitialBase] = useState<number>(1);

  // Genera la curva acumulada (Growth of Base)
  const equityData = useMemo<EquityPoint[]>(() => {
    if (!dailyReturns || dailyReturns.length === 0) return [];

    let portfolioVal = initialBase;
    let spyVal = initialBase;

    return dailyReturns.map((point) => {
      portfolioVal *= 1 + (point.portfolio_return || 0);
      spyVal *= 1 + (point.spy_return || 0);

      return {
        date: point.date,
        portfolio: Number(portfolioVal.toFixed(2)),
        spy: Number(spyVal.toFixed(2)),
      };
    });
  }, [dailyReturns, initialBase]);

  const formatCurrency = (val: number) => {
    if (initialBase === 1) return `$${val.toFixed(2)}`;
    return `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-6 shadow-sm">
      {/* Header del Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-200">
            Equity Curve — Cumulative Growth
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Portfolio performance vs SPY benchmark based on daily compounding
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Selector de Base Inicial */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-1.5 font-medium">Base:</span>
            {[1, 1000, 10000].map((base) => (
              <button
                key={base}
                onClick={() => setInitialBase(base)}
                className={`px-2 py-1 rounded font-semibold transition-colors ${
                  initialBase === base
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ${base.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Leyenda */}
          <div className="hidden md:flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full inline-block" />
              <span className="text-slate-300">Portfolio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-sky-400 inline-block" />
              <span className="text-slate-400">SPY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={equityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#475569"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#475569"
              tick={{ fontSize: 11 }}
              domain={['auto', 'auto']}
              tickFormatter={formatCurrency}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.5rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value: any, name: string) => [
                formatCurrency(Number(value)),
                name === 'portfolio' ? 'Portfolio' : 'SPY',
              ]}
            />
            <Line
              type="monotone"
              dataKey="portfolio"
              stroke="#10b981"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="spy"
              stroke="#38bdf8"
              strokeDasharray="3 3"
              dot={false}
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
