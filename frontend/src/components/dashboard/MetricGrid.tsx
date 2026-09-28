import React from 'react';
import type { Metrics } from '../../types/portfolio';
import { MetricCard } from './MetricCard';

interface MetricsGridProps {
  metrics: Metrics;
}

export const MetricGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const fmtPct = (val: number) => `${(val * 100).toFixed(2)}%`;
  const fmtNum = (val: number, decimals = 2) => val.toFixed(decimals);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="ANNUALIZED ALPHA"
        value={fmtPct(metrics.alpha)}
        rawValue={metrics.alpha}
        subtitle="CAPM intercept vs SPY"
      />
      <MetricCard
        title="BETA"
        value={fmtNum(metrics.beta, 3)}
        subtitle="Market exposure vs SPY"
      />
      <MetricCard
        title="SHARPE RATIO"
        value={fmtNum(metrics.sharpe_ratio, 2)}
        rawValue={metrics.sharpe_ratio}
        subtitle="Risk-adjusted return"
      />
      <MetricCard
        title="SORTINO RATIO"
        value={fmtNum(metrics.sortino_ratio, 2)}
        rawValue={metrics.sortino_ratio}
        subtitle="Downside risk-adjusted"
      />
      <MetricCard
        title="CAGR"
        value={fmtPct(metrics.annualized_return)}
        rawValue={metrics.annualized_return}
        subtitle="Annualized growth"
      />
      <MetricCard
        title="VOLATILITY"
        value={fmtPct(metrics.annualized_volatility)}
        subtitle="Annualized std dev"
      />
      <MetricCard
        title="MAX DRAWDOWN"
        value={fmtPct(metrics.max_drawdown)}
        rawValue={metrics.max_drawdown}
        subtitle="Worst peak-to-through"
      />
      <MetricCard
        title="R-Square (CAPM)"
        value={fmtNum(metrics.r_square)}
        subtitle="Variance explained by market"
      />
    </div>
  );
};
