import Papa from 'papaparse';
import type { DailyReturnPoint } from '../types/portfolio';

export const parseCSVReturns = (file: File): Promise<DailyReturnPoint[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData: DailyReturnPoint[] = results.data.map((row: any) => {
            // Se mapean los nombres de columnas de tu CSV
            // Ajusta 'portfolio_return' y 'spy_return' según las cabeceras exactas de tu archivo CSV
            return {
              date: String(row.date || row.Date),
              portfolio_return: Number(row.portfolio_return ?? row.portfolio ?? row.Return ?? 0),
              spy_return: Number(row.spy_return ?? row.spy ?? row.SPY ?? 0),
            };
          });

          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
};
