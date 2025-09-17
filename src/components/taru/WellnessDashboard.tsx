'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendChart } from './TrendChart';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5001/api';

interface BurnoutData {
  riskProbability: number;
  reason: string;
}

interface TrendData {
  timestamp: string;
  mood: number;
  energy: number;
}

export function WellnessDashboard() {
  const [burnoutData, setBurnoutData] = useState<BurnoutData | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [burnoutRes, trendsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/burnout-risk`),
          axios.get(`${API_BASE_URL}/trends`)
        ]);
        setBurnoutData(burnoutRes.data);
        setTrendData(trendsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const riskPercent = burnoutData ? Math.round(burnoutData.riskProbability * 100) : 0;
  const isHighRisk = riskPercent > 60;

  return (
    <aside className="w-full md:w-80 lg:w-96 p-6 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col gap-6">
      <h2 className="text-xl font-bold">🧘 Wellness Dashboard</h2>
      
      <div className="p-4 rounded-lg bg-card border">
        <h3 className="font-semibold mb-2">Burnout Risk Alert</h3>
        {isLoading ? (
          <div className="h-24 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        ) : burnoutData && (
          <>
            <div className={`text-4xl font-bold ${isHighRisk ? 'text-red-500' : 'text-green-500'}`}>
              {riskPercent}%
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{burnoutData.reason}</p>
            <div className={`mt-4 p-3 rounded-md text-sm flex items-start gap-3 ${isHighRisk ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'}`}>
              {isHighRisk ? <AlertTriangle className="h-5 w-5 mt-0.5"/> : <ShieldCheck className="h-5 w-5 mt-0.5" />}
              <span>{isHighRisk ? "High risk detected! Consider taking a break or reaching out." : "Risk level is low. Keep up the great work!"}</span>
            </div>
          </>
        )}
      </div>

      <div className="p-4 rounded-lg bg-card border">
        <h3 className="font-semibold mb-2">Your Mood & Energy Trend</h3>
        {isLoading ? (
           <div className="h-48 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        ) : (
          <TrendChart data={trendData} />
        )}
      </div>
    </aside>
  );
}