import React, { useState, useRef } from 'react';
import { PRESET_WINDOWS } from '../types/portfolio';
import type { AnalysisResponse, DailyReturnPoint } from '../types/portfolio';
import { uploadCSV } from '../services/api';
import { parseCSVReturns } from '../utils/csvParser';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

interface UploadFormProps {
  onSuccess: (data: AnalysisResponse, dailyReturns: DailyReturnPoint[]) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedWindowKey, setSelectedWindowKey] = useState<string>('63');
  const [customDays, setCustomDays] = useState<number>(30);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(2.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('File must have a .csv extension');
      setFile(null);
      return;
    }

    if (selectedFile.size === 0) {
      setError('The selected file is empty');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a valid CSV file.');
      return;
    }

    setLoading(true);
    setError(null);

    const effectiveWindow =
      selectedWindowKey === 'CUSTOM'
        ? customDays
        : PRESET_WINDOWS[selectedWindowKey].days;

    const decimalRf = riskFreeRate / 100;

    try {
      const dailyReturns = await parseCSVReturns(file);

      const response = await uploadCSV(file, effectiveWindow, decimalRf);
      onSuccess(response, dailyReturns);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the file on the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl text-slate-100">
      <h2 className="text-2xl font-bold mb-2 text-blue-400 text-center">Quantitative Analysis</h2>
      <p className="text-slate-400 text-sm mb-6 text-center">
        Upload your returns CSV and set the rolling window parameters to calculate metrics in Go.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">
            Data File (.csv)
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : file
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-center gap-3 text-emerald-400">
                <FileText className="w-8 h-8 shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload className="w-8 h-8 text-slate-500" />
                <p className="text-sm font-medium">
                  Drag & drop your CSV file here or <span className="text-blue-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500">Only .csv files supported</p>
              </div>
            )}
          </div>
        </div>

        {/* Rolling Window & Risk-Free Rate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wider">
              Rolling Window (Days)
            </label>
            <select
              value={selectedWindowKey}
              onChange={(e) => setSelectedWindowKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {Object.entries(PRESET_WINDOWS).map(([key, item]) => (
                <option key={key} value={key} className="bg-slate-900 text-slate-200">
                  {item.label}
                </option>
              ))}
            </select>

            {selectedWindowKey === 'CUSTOM' && (
              <div className="mt-2">
                <input
                  type="number"
                  min="2"
                  value={customDays}
                  onChange={(e) => setCustomDays(Math.max(2, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="Custom days"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wider">
              Risk-Free Rate (R<sub>f</sub>) %
            </label>
            <input
              type="number"
              step="0.01"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              placeholder="2.0"
            />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Dataset...</span>
            </>
          ) : (
            <span>Analyze Portfolio</span>
          )}
        </button>
      </form>

      {/* Expected Format Footer */}
      <div className="mt-8 pt-6 border-t border-slate-700/80 text-left">
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          Expected CSV format
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          A date column plus daily simple returns (decimals, e.g. <code className="text-blue-400">0.001</code> = 0.1%):
        </p>

        <div className="bg-slate-900 border border-slate-700/70 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto">
          <div className="text-blue-400 font-bold mb-1">date,portfolio_return,SPY</div>
          <div className="text-slate-400">2023-01-03,-0.0008,0.0034</div>
          <div className="text-slate-400">2023-01-04,-0.0068,-0.0102</div>
          <div className="text-slate-400">2023-01-05,0.0120,0.0079</div>
        </div>

        <p className="text-[11px] text-slate-500 mt-2 italic">
          Column names are matched flexibly (case-insensitive): <span className="text-slate-400">portfolio</span>, <span className="text-slate-400">portfolio_return</span> and <span className="text-slate-400">spy/SPY/spy_return</span> all work.
        </p>
      </div>
    </div>
  );
};
