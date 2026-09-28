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
	rfDaily := params.RiskFreeRate/TradingDaysPerYear 
	
	// 1. Calcular métricas básicas e indicadores de riesgo con engine
	totalReturn := engine.CalculateTotalReturn(points)
	
	anualizedReturn := engine.CalculateAnnualizedReturn(totalReturn, n)

	anualizedVolatility := engine.CalculateAnnualizedVolatility(points)

	sharpeRatio := engine.CalculateSharpeRatio(anualizedReturn, params.RiskFreeRate, anualizedVolatility)

 	sortinoRatio := engine.CalculateSortinoRatio(points,anualizedReturn,rfDaily,params.RiskFreeRate)
	
	maxDD := engine.CalculateMDD(points)	

	// 2. Calcular Alpha y Beta con engine

	beta := engine.CalculateBeta(points)
	alpha := engine.CalculateAlpha(anualizedReturn, beta , params.RiskFreeRate , points)	


	// 3. Si params.RollingWindow > 0, calcular rolling series con engine
	
	var rollingSet []model.RollingMetricPoint
	if params.RollingWindow > 0 {
   		rollingSet = engine.CalculateRollingData(points, params.RollingWindow, params.RiskFreeRate)
	} else {
 		rollingSet = nil
	}

	// 4. Armar y retornar model.AnalysisResult
	return model.AnalysisResponse{
		Summary: model.Summary{
			TotalRecords: len(points),
			StartDate: points[0].Date.Format("2006-01-02"),
			EndDate: points[n-1].Date.Format("2006-01-02"),
			RollingWindow: params.RollingWindow,
			RiskFreeRate: params.RiskFreeRate,
		},
		Metrics: model.Metrics{
			TotalReturn: totalReturn,
			AnnualizedReturn: anualizedReturn,
			AnnualizedVolatility: anualizedVolatility,
			SharpeRatio: sharpeRatio,
			SortinoRatio: sortinoRatio,
 			MaxDrawdown: maxDD,
			Beta: beta,
			Alpha: alpha,
		},
		RollingSeries: rollingSet,	
	}
}
