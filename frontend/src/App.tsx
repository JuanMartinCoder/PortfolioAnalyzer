import { useState } from 'react';
import { UploadForm } from './components/UploadForm';
import { Dashboard } from './components/Dashboard';
import type { AnalysisResponse, DailyReturnPoint } from './types/portfolio';

export function App() {
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [dailyReturns, setDailyReturns] = useState<DailyReturnPoint[]>([]);

  const handleSuccess = (data: AnalysisResponse, returns: DailyReturnPoint[]) => {
    setAnalysisData(data);
    setDailyReturns(returns);
  };

  return (
    <main className="w-full min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center">
      {!analysisData ? (
        <UploadForm onSuccess={handleSuccess} />
      ) : (
        <Dashboard  data={analysisData}
                    dailyReturns={dailyReturns}
                    onReset={() => setAnalysisData(null)} />
      )}
    </main>
  );
}

export default App;
