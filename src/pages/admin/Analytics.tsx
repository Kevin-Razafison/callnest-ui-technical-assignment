import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Calendar, Loader2, AlertCircle, Download } from 'lucide-react';
import api from '../../api/axios'; 

// --- Interfaces ---
interface PipelineData {
  stage: string;
  count: number;
}

interface MonthlyData {
  name: string;
  leads: number;
}

// --- Configuration ---
const STAGE_COLORS: { [key: string]: string } = {
  DISCOVERY: '#3b82f6',
  PROPOSAL: '#a855f7',
  NEGOTIATION: '#f97316',
  CLOSED_WON: '#10b981',
  CLOSED_LOST: '#ef4444',
  UNKNOWN: '#64748b'
};

// --- component content card ---
const AnalyticsCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-slate-900 shadow-sm p-6 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all">
    <h3 className="flex items-center gap-2 mb-6 font-medium text-slate-400">
      <Calendar className="w-4 h-4" /> {title}
    </h3>
    <div className="w-full h-64 min-h-[250px]"> 
      {children}
    </div>
  </div>
);

function Analytics() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [pipelineData, setPipelineData] = useState<PipelineData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const [monthlyRes, pipelineRes] = await Promise.all([
          api.get<MonthlyData[]>('/analytics/monthly'),
          api.get<PipelineData[]>('/analytics/pipeline')
        ]);
        
        setMonthlyData(monthlyRes.data);
        setPipelineData(pipelineRes.data);
        setError(false);
      } catch (err) {
        console.error("Error in statistics fetch: ", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /// Function to trigger the PDF export
    const handleDownloadReport = () => {
      // Simple, native, and supports oklch perfectly
      window.print();
    };

  return (
    <div className="space-y-8 mx-auto p-8 max-w-7xl">
      <header>
        <h1 className="font-bold text-white text-3xl tracking-tight">Analytics Reports</h1>
        <p className="mt-1 text-slate-400">Deep dive into your real-time lead performance.</p>
      </header>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 text-slate-500">
          <Loader2 className="mb-4 w-10 h-10 text-blue-500 animate-spin" />
          <p className="animate-pulse">Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center bg-red-900/10 p-12 border border-red-900/20 rounded-2xl text-red-400">
          <AlertCircle className="mb-4 w-12 h-12" />
          <p className="font-semibold">Failed to load data.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-red-300 hover:text-red-200 text-sm underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* export PDF content */}
          <div id="analytics-content" className="gap-6 grid grid-cols-1 lg:grid-cols-2">
            <AnalyticsCard title="Lead Generation (Monthly)">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} 
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </AnalyticsCard>

            <AnalyticsCard title="Opportunity Pipeline Breakdown">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="stage"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Add percentage labels
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STAGE_COLORS[entry.stage.toUpperCase()] || STAGE_COLORS.UNKNOWN} 
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </AnalyticsCard>
          </div>

          {/* Section Repport with Export */}
          <div className="flex md:flex-row flex-col justify-between items-center gap-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 p-8 border border-blue-500/20 rounded-2xl text-white">
            <div>
              <h2 className="font-bold text-xl">Full Insights Ready</h2>
              <p className="text-slate-400 text-sm">Download the comprehensive performance analysis for this month.</p>
            </div>
            <button 
                onClick={handleDownloadReport}
                className="bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg px-8 py-3 rounded-xl font-bold active:scale-95 transition-all"
              >
                <Download className="inline mr-2 w-5 h-5" />
                Export PDF Report
              </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;