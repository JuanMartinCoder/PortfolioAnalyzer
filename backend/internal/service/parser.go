package service

import (
	"encoding/csv"
	"fmt"
	"io"
	"strconv"
	"strings"
	"time"

	"github.com/JuanMartinCoder/portfolio-analyzer/backend/internal/model"
)

func ParseCSV(r io.Reader) ([]model.DataPoint, error) {
	reader := csv.NewReader(r)
	reader.TrimLeadingSpace = true


	//Encabezados
	headers, err := reader.Read()
	if err != nil {
		return nil, fmt.Errorf("error al leer encabezados del CSV: %w", err)
	}
	dateIdx, portIdx, benchIdx := -1, -1, -1
	for i, h := range headers {
		cleanH := strings.ToLower(strings.TrimSpace(h))
		switch cleanH {
		case "date", "fecha":
			dateIdx = i
		case "portfolio_return", "portfolio", "return":
			portIdx = i
		case "benchmark_return", "spy", "benchmark":
			benchIdx = i
		}
	}

	if dateIdx == -1 || portIdx == -1 || benchIdx == -1 {
		return nil, fmt.Errorf("encabezados inválidos. Se requieren las columnas: 'date', 'portfolio_return', 'spy' (o 'benchmark_return')")
	}

	var dataPoints []model.DataPoint
	dateFormats := []string{"2006-01-02", "02/01/2006", "2006/01/02", "02-01-2006"}

	lineNum := 1
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		lineNum++
		if err != nil {
			return nil, fmt.Errorf("error al leer la fila %d: %w", lineNum, err)
		}

		if len(record) <= dateIdx || len(record) <= portIdx || len(record) <= benchIdx {
			continue // Omitir filas incompletas
		}

		// Parsear Fecha
		dateStr := strings.TrimSpace(record[dateIdx])
		var parsedDate time.Time
		var parseErr error
		for _, fmtStr := range dateFormats {
			parsedDate, parseErr = time.Parse(fmtStr, dateStr)
			if parseErr == nil {
				break
			}
		}
		if parseErr != nil {
			return nil, fmt.Errorf("fecha inválida '%s' en la fila %d", dateStr, lineNum)
		}

		// Parsear Portfolio Return (simple diario)
		portRet, err := strconv.ParseFloat(strings.TrimSpace(record[portIdx]), 64)
		if err != nil {
			return nil, fmt.Errorf("retorno de portfolio inválido '%s' en la fila %d", record[portIdx], lineNum)
		}

		// Parsear Benchmark Return
		benchRet, err := strconv.ParseFloat(strings.TrimSpace(record[benchIdx]), 64)
		if err != nil {
			return nil, fmt.Errorf("retorno de benchmark inválido '%s' en la fila %d", record[benchIdx], lineNum)
		}

		dataPoints = append(dataPoints, model.DataPoint{
			Date:            parsedDate,
			PortfolioReturn: portRet,
			BenchmarkReturn: benchRet,
		})
	}

	if len(dataPoints) < 2 {
		return nil, fmt.Errorf("el CSV debe contener al menos 2 registros válidos para calcular indicadores")
	}

	return dataPoints, nil
}
