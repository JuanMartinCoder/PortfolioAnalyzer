package engine

import (
	"math"

	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/model"
)

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

func CalculateRSquared(points []model.DataPoint) float64 {
	n := len(points)
	if n < 2 {
		return 0.0
	}

	// 1. Calcular las medias de las series de retornos
	var sumP, sumB float64
	for _, p := range points {
		sumP += p.PortfolioReturn
		sumB += p.BenchmarkReturn
	}
	meanP := sumP / float64(n)
	meanB := sumB / float64(n)

	// 2. Calcular Covarianza y Varianzas acumuladas
	var covPB, varP, varB float64
	for _, p := range points {
		diffP := p.PortfolioReturn - meanP
		diffB := p.BenchmarkReturn - meanB

		covPB += diffP * diffB
		varP += diffP * diffP
		varB += diffB * diffB
	}

	// Evitar divisiones por cero en casos de varianza nula
	if varP == 0 || varB == 0 {
		return 0.0
	}

	// 3. Coeficiente de Correlación de Pearson (r)
	r := covPB / (math.Sqrt(varP) * math.Sqrt(varB))

	// 4. Coeficiente de Determinación R^2 = r^2
	rSquared := r * r

	if math.IsNaN(rSquared) {
		return 0.0
	}

	return rSquared
}
