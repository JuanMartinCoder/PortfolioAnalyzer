package engine

import (
	"math"

	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/model"
)

const TradingDaysPerYear = 252.0

func calculateMean(returns []model.DataPoint) float64 {
	sum := 0.0
	for _, v := range returns {
		sum += v.PortfolioReturn 
	}
	return sum / float64(len(returns))
}

func CalculateTotalReturn(points []model.DataPoint) float64 {
	cumSum := 1.0
	for _, point := range points {
		cumSum *= (1.0 + point.PortfolioReturn)
	}
	return cumSum - 1.0
}


func CalculateAnnualizedReturn(totalReturn float64, nDays int, TradingDaysPerYear float64) float64 {
 	return	math.Pow((1 + totalReturn),(TradingDaysPerYear/float64(nDays))) - 1
}

func CalculateAnnualizedVolatility(points []model.DataPoint) float64 {

	meanReturn := calculateMean(points)

	var sqDiff float64
	for _, v := range points {
		diff := v.PortfolioReturn - meanReturn

		sqDiff += diff * diff 
	}
	
	return math.Sqrt(TradingDaysPerYear) * math.Sqrt(sqDiff / float64((len(points))-1))
}


func CalculateSharpeRatio(ranual float64, rf float64, anualVol float64) float64 {
	return (ranual - rf) / anualVol
}
