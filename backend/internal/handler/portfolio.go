package handler

import (
	"log"
	"net/http"
	"strconv"

	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/model"
	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/service"
	"github.com/gin-gonic/gin"
)



type PortfolioHandler struct {
	analyticsService *service.AnalyticsService
}

func NewPortfolioHandler(analyticsService *service.AnalyticsService) *PortfolioHandler {
	return &PortfolioHandler{
		analyticsService: analyticsService,
	}
}
func (h *PortfolioHandler) AnalyzePortfolioHandler(c *gin.Context) {
	//Recibir el archivo csv 
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ErrorResponse{
			Error: "BAD_REQUEST",	
			Message: "Se requiere un archivo CSV en el campo 'file'",
		})
    	return
    }

	newFile, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ErrorResponse{
			Error:   "FILE_READ_ERROR",
			Message: "No se pudo leer el archivo subido",
		})
		return
	}
	defer newFile.Close()

	log.Println(file.Filename)

	// Parsear parámetros de consulta
	rfStr := c.DefaultQuery("risk_free_rate", "0.02")
	riskFreeRate, err := strconv.ParseFloat(rfStr, 64)
	if err != nil {
		riskFreeRate = 0.02
	}

	rwStr := c.DefaultQuery("rolling_window", "0")
	rollingWindow, err := strconv.Atoi(rwStr)
	if err != nil {
		rollingWindow = 0
	}

	//Parsear JSON
	dataPoints, err := service.ParseCSV(newFile)
	if err != nil {	
		c.JSON(http.StatusUnprocessableEntity, model.ErrorResponse{
			Error:   "INVALID_CSV",
			Message: err.Error(),
		})
		return
	}
	
	params := model.RequestParams{
		RiskFreeRate: riskFreeRate,
		RollingWindow: rollingWindow,
	}

	result := h.analyticsService.Analyze(dataPoints, params)

	c.JSON(http.StatusOK, gin.H{
		"message":"success",
		"results": result,
	})
}
