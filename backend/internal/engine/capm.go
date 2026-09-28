package engine

import "github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/model"

// CalculateBeta calcula Beta aprovechando el helper estático
func CalculateBeta(points []model.DataPoint) float64 {
	portfolioStats := getPortfolioStatistics(points)
	if portfolioStats.meanBench == 0 {
		return 0.0
	}
	return portfolioStats.covariance / portfolioStats.benchVariance
}

// CalculateAlpha calcula el Alpha de Jensen reutilizando el helper de anualización
func CalculateAlpha(annPortReturn, beta, rfAnnual float64, points []model.DataPoint) float64 {
	n := len(points)
	if n < 2 {
		return 0.0
	}

	// 1. Rendimiento compuesto acumulado del benchmark
	cumBenchReturn := 1.0
	for _, p := range points {
		cumBenchReturn *= (1.0 + p.BenchmarkReturn)
	}
	totalBenchReturn := cumBenchReturn - 1.0

	// 2. Anualizado usando la función común
	annBenchReturn := CalculateAnnualizedReturn(totalBenchReturn, n)

	// 3. CAPM Expected Return
	expectedReturn := rfAnnual + beta*(annBenchReturn-rfAnnual)

	return annPortReturn - expectedReturn
}
