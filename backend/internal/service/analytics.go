package service

import (
	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/engine"
	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/model"
)

const TradingDaysPerYear = 252.0


type AnalyticsService struct{}

func NewAnalyticsService() *AnalyticsService {
	return &AnalyticsService{}
}



func (s *AnalyticsService) Analyze(points []model.DataPoint, params model.RequestParams) model.AnalysisResponse {
	n := len(points)
	//rfDaily = params.RiskFreeRate/TradingDaysPerYear //swapfile


	// 1. Calcular métricas básicas e indicadores de riesgo con engine
	totalReturn := engine.CalculateTotalReturn(points)

	anualizedReturn := engine.CalculateAnnualizedReturn(totalReturn, n, TradingDaysPerYear)

	anualizedVolatility := engine.CalculateAnnualizedVolatility(points)

	sharpeRatio := engine.CalculateSharpeRatio(anualizedReturn, params.RiskFreeRate, anualizedVolatility)

	// 2. Calcular Alpha y Beta con engine
	// 3. Si params.RollingWindow > 0, calcular rolling series con engine
	// 4. Armar y retornar model.AnalysisResult
	return model.AnalysisResponse{
		Summary: model.Summary{
			TotalRecords: len(points),
			RollingWindow: params.RollingWindow,
			RiskFreeRate: params.RiskFreeRate,
		},
		Metrics: model.Metrics{
			TotalReturn: totalReturn,
			AnnualizedReturn: anualizedReturn,
			AnnualizedVolatility: anualizedVolatility,
			SharpeRatio: sharpeRatio,
		},
	}
}
