package model

import "time"

type DataPoint struct {
	Date            time.Time
	PortfolioReturn float64
	BenchmarkReturn float64 
}

type RequestParams struct {
	RiskFreeRate  float64 `form:"risk_free_rate"`  // Tasa anual (ej. 0.02)
	RollingWindow int     `form:"rolling_window"`  // Ventana en días (ej. 30)
}

type Summary struct {
	TotalRecords  int       `json:"total_records"`
	StartDate     string    `json:"start_date"`
	EndDate       string    `json:"end_date"`
	RollingWindow int       `json:"rolling_window"`
	RiskFreeRate  float64   `json:"risk_free_rate"`
}

type Metrics struct {
	TotalReturn          float64 `json:"total_return"`
	AnnualizedReturn     float64 `json:"annualized_return"`
	AnnualizedVolatility float64 `json:"annualized_volatility"`
	SharpeRatio          float64 `json:"sharpe_ratio"`
	SortinoRatio         float64 `json:"sortino_ratio"`
	MaxDrawdown          float64 `json:"max_drawdown"`
	Beta                 float64 `json:"beta"`
	Alpha                float64 `json:"alpha"`
}

// RollingMetricPoint punto de serie temporal para ventana móvil
type RollingMetricPoint struct {
	Date     string  `json:"date"`
	Sharpe   float64 `json:"sharpe"`
	Volatility float64 `json:"volatility"`
	Beta     float64 `json:"beta"`
}

type AnalysisResponse struct {
	Summary       Summary              `json:"summary"`
	Metrics       Metrics              `json:"metrics"`
	RollingSeries []RollingMetricPoint `json:"rolling_series,omitempty"`
}

