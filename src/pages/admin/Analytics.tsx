import { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios'; 

const STAGE_COLORS: { [key: string]: string } = {
  DISCOVERY: '#3b82f6',   // Blue
  PROPOSAL: '#a855f7',    // Purple
  NEGOTIATION: '#f97316', // Orange
  CLOSED_WON: '#10b981',  // Emerald
  CLOSED_LOST: '#ef4444', // Red
  UNKNOWN: '#64748b'
};

const AnalyticsCard = ({ title, children }: any) => (
  <div className="bg-slate-900 shadow-sm p-6 border border-slate-800 rounded-2xl">
    <h3 className="flex items-center gap-2 mb-6 font-medium text-slate-400">
      <Calendar className="w-4 h-4" /> {title}
    </h3>
    <div className="w-full h-64 min-h-[250px]"> 
      {children}
    </div>
  </div>
);

function Analytics() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // On récupère les deux en parallèle pour la performance
        const [monthlyRes, pipelineRes] = await Promise.all([
          api.get('/analytics/monthly'),
          api.get('/analytics/pipeline')
        ]);
        
        setMonthlyData(monthlyRes.data);
        setPipelineData(pipelineRes.data);
        setError(false);
      } catch (err) {
        console.error("Erreur stats:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="font-bold text-white text-3xl tracking-tight">Analytics Reports</h1>
        <p className="mt-1 text-slate-400">Deep dive into your real-time lead performance.</p>
      </header>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 text-slate-500">
          <Loader2 className="mb-4 w-10 h-10 text-blue-500 animate-spin" />
          <p>Loading analytics...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center bg-red-900/10 p-12 border border-red-900/20 rounded-2xl text-red-400">
          <AlertCircle className="mb-4 w-12 h-12" />
          <p>Failed to load data.</p>
        </div>
      ) : (
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
          {/* Chart 1: Monthly Evolution */}
          <AnalyticsCard title="Lead Generation (Monthly)">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          {/* Chart 2: Pipeline Breakdown (Donut Chart) */}
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
                >
                  {pipelineData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.stage] || STAGE_COLORS.UNKNOWN} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </div>
      )}

      {/* Report Section */}
      <div className="flex md:flex-row flex-col justify-between items-center gap-6 bg-blue-600/10 p-8 border border-blue-500/20 rounded-2xl text-white">
         <div>
           <h2 className="font-bold text-xl">Full Insights Ready</h2>
           <p className="text-slate-400 text-sm">Download the comprehensive performance analysis.</p>
         </div>
         <button className="bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg px-6 py-3 rounded-xl font-bold transition-all">
           Export PDF Report
         </button>
      </div>
    </div>
  );
}

export default Analytics;