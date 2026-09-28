package engine

import (
	"math"

	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/model"
)

const TradingDaysPerYear = 252.0

type PortfolioStats struct {
	meanPort float64
	meanBench float64
	covariance float64
	benchVariance float64
}

var PortfolioStatsInstance *PortfolioStats

func getPortfolioStatistics(points []model.DataPoint) *PortfolioStats {
		n := float64(len(points))
		if n < 2 {
			return nil 
		}

		// 1. Calcular Medias
		var sumPort, sumBench float64
		for _, p := range points {
			sumPort += p.PortfolioReturn
			sumBench += p.BenchmarkReturn
		}
		meanPort := sumPort / n
		meanBench := sumBench / n

		// 2. Calcular Covarianza(Rp, Rm) y Varianza(Rm)
		var sumCov, sumVarBench float64
		for _, p := range points {
			diffP := p.PortfolioReturn - meanPort
			diffB := p.BenchmarkReturn - meanBench

			sumCov += diffP * diffB
			sumVarBench += diffB * diffB
		}

		covariance := sumCov / (n - 1)
		benchVariance := sumVarBench / (n - 1)

		PortfolioStatsInstance = &PortfolioStats{
			meanPort: meanPort,
			meanBench: meanBench,	
			covariance: covariance,
			benchVariance: benchVariance,
		}
	return PortfolioStatsInstance
}

func calculateAnnualizedDownside(points []model.DataPoint, n int, rfDaily float64) float64{
	var sumSqDownside float64
	for _, p := range points {
		// Downside deviation para Sortino (retornos por debajo de Rf diaria)
		if p.PortfolioReturn < rfDaily {
			downsideDiff := p.PortfolioReturn - rfDaily
			sumSqDownside += downsideDiff * downsideDiff
		}
	}

	dailyDownsideVol := math.Sqrt(sumSqDownside / float64(n))
	return dailyDownsideVol * math.Sqrt(TradingDaysPerYear)
}

func CalculateTotalReturn(points []model.DataPoint) float64 {
	cumSum := 1.0
	for _, point := range points {
		cumSum *= (1.0 + point.PortfolioReturn)
	}
	return cumSum - 1.0
}

func CalculateAnnualizedReturn(totalReturn float64, nDays int) float64 {
 	return	math.Pow((1 + totalReturn),(TradingDaysPerYear/float64(nDays))) - 1
}

func CalculateAnnualizedVolatility(points []model.DataPoint) float64 {
	portfolioStats := getPortfolioStatistics(points)
	var sqDiff float64

	for _, v := range points {
		diff := v.PortfolioReturn - portfolioStats.meanPort

		sqDiff += diff * diff 
	}
	return math.Sqrt(TradingDaysPerYear) * math.Sqrt(sqDiff / float64((len(points))-1))
}

func CalculateSharpeRatio(ranual float64, rf float64, anualVol float64) float64 {
	if anualVol > 0 {
		return (ranual - rf) / anualVol
	} else {
		return 0.0
	}
}

func CalculateSortinoRatio(points []model.DataPoint,ranual float64, rfdiario float64, rf float64) float64 {
	anualdownside := calculateAnnualizedDownside(points, len(points), rfdiario)
	if anualdownside > 0 {
		return (ranual - rf) / anualdownside
	} else {
		return 0.0
	}
}

func CalculateMDD(points []model.DataPoint) float64 {
	maxDD := 0.0
	peak := 0.0
	current := 1.0
	for _,v := range points {
		current *= (1.0 + v.PortfolioReturn)
		if current > peak {
			peak = current
		}
		dd := (current - peak) / peak
		if dd < maxDD {
			maxDD = dd
		}
	}
	return maxDD
}
