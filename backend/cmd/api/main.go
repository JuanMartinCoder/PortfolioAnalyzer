package main

import (
	"log"
	"net/http"

	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/handler"
	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/service"
	"github.com/gin-gonic/gin"
)

const API_ENDPOINT = "/api/v1"


func main() {

	analyticService := service.NewAnalyticsService() 
	portFolioHandler := handler.NewPortfolioHandler(analyticService)


 	r := gin.Default()

	r.Use(func(ctx *gin.Context) {
		ctx.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		ctx.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		ctx.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if ctx.Request.Method == http.MethodOptions {
			ctx.AbortWithStatus(http.StatusNoContent)
			return
		}
		ctx.Next()
	})


	v1 := r.Group(API_ENDPOINT)
	{
		v1.POST("/portfolio/analyze", portFolioHandler.AnalyzePortfolioHandler)
	}

    log.Println("Backend Go ejecutándose en el puerto 8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}}
