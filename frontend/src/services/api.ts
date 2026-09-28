import type { AnalysisResponse } from '../types/portfolio';

const API_BASE_URL = 'http://localhost:8080'; // Ajustá el puerto según tu servidor Go

export const uploadCSV = async (
  file: File,
  rollingWindow: number,
  riskFreeRate: number
): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE_URL}/api/v1/portfolio/analyze?risk_free_rate=${riskFreeRate}&rolling_window=${rollingWindow}`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al procesar el archivo CSV');
  }

  return response.json();
};
