
export interface Summary {
  total_records: number;
  start_date: string;
  end_date: string;
  rolling_window: number;
  risk_free_rate: number;
}

export interface Metrics {
  total_return: number;
  annualized_return: number;
  annualized_volatility: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown: number;
  r_square: number;
  beta: number;
  alpha: number;
}

export interface RollingPoint {
  date: string;
  volatility: number;
  sharpe: number;
  beta: number;
  alpha: number;
}

export interface AnalysisResponse {
  message: string;
  results: {
    summary: Summary;
    metrics: Metrics;
    rolling_series: RollingPoint[];
  };
}
export interface WindowOption {
  days: number;
  label: string;
}

export const PRESET_WINDOWS: Record<string, WindowOption> = {
  '21': { days: 21, label: '21 - 1 month' },
  '63': { days: 63, label: '63 - 1 quarter' },
  '126': { days: 126, label: '126 - 6 months' },
  '252': { days: 252, label: '252 - 1 year' },
  'CUSTOM': { days: 0, label: 'Custom days' },
};


export interface DailyReturnPoint {
  date: string;
  portfolio_return: number; // Ej: 0.012 para +1.2%
  spy_return: number;       // Ej: -0.005 para -0.5%
}

export interface EquityPoint {
  date: string;
  portfolio: number;
  spy: number;
}
