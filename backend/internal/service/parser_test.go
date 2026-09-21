package service

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseCSV(t *testing.T) {
	tests := []struct {
		name          string
		csvData       string
		wantErr       bool
		expectedLen   int
		errMsgContains string
	}{
		{
			name: "CSV Válido Estándar",
			csvData: `date,portfolio_return,spy
2024-01-02,0.0125,0.0080
2024-01-03,-0.0041,-0.0030
2024-01-04,0.0089,0.0055`,
			wantErr:     false,
			expectedLen: 3,
		},
		{
			name: "Encabezados Alternativos Válidos",
			csvData: `fecha,portfolio,benchmark
02/01/2024,0.0125,0.0080
03/01/2024,-0.0041,-0.0030`,
			wantErr:     false,
			expectedLen: 2,
		},
		{
			name: "Falta Columna Obligatoria",
			csvData: `date,portfolio_return
2024-01-02,0.0125
2024-01-03,-0.0041`,
			wantErr:        true,
			errMsgContains: "encabezados inválidos",
		},
		{
			name: "Retorno No Numérico en Fila",
			csvData: `date,portfolio_return,spy
2024-01-02,0.0125,0.0080
2024-01-03,INVALIDO,-0.0030`,
			wantErr:        true,
			errMsgContains: "retorno de portfolio inválido",
		},
		{
			name: "Formato de Fecha No Soportado",
			csvData: `date,portfolio_return,spy
INVALID_DATE,0.0125,0.0080
2024-01-03,-0.0041,-0.0030`,
			wantErr:        true,
			errMsgContains: "fecha inválida",
		},
		{
			name: "Registros Insuficientes (Menos de 2 filas)",
			csvData: `date,portfolio_return,spy
2024-01-02,0.0125,0.0080`,
			wantErr:        true,
			errMsgContains: "al menos 2 registros válidos",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := strings.NewReader(tt.csvData)
			points, err := ParseCSV(r)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsgContains != "" {
					assert.Contains(t, err.Error(), tt.errMsgContains)
				}
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expectedLen, len(points))
			}
		})
	}
}
