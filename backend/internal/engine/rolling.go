package engine

import "github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/model"

func CalculateRollingData(points []model.DataPoint, window int, rf float64) []model.RollingMetricPoint{
	n := len(points)
	if window < 0 || window > n {
		return nil
	}
	rfDaily := rf / TradingDaysPerYear

	rollingSeries := make([]model.RollingMetricPoint, 0,n-window+1)

	for i := window; i<=n; i++ {
		// sub set de la ventana movil
		subSet := points[i-window : i]
		currentDate := subSet[window-1].Date.Format("2006-01-02")

		//Calculamos todas las metricas
		totReturn := CalculateTotalReturn(subSet)
		anualReturn := CalculateAnnualizedReturn(totReturn, window)
 		vol := CalculateAnnualizedVolatility(subSet)
		sharpe := CalculateSharpeRatio(rf, rfDaily , vol)

		beta := CalculateBeta(subSet)
		alpha := CalculateAlpha(anualReturn, beta, rf, points)

		rollingSeries = append(rollingSeries, model.RollingMetricPoint{
			Date: currentDate,			
			Volatility: vol,
			Sharpe: sharpe,
			Beta: beta,
			Alpha: alpha,
		})	

	}

	return rollingSeries
}
