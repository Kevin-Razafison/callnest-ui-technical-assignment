import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios'; 

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // Appel à ton nouveau AnalyticsController
        const response = await api.get('/analytics/monthly');
        setMonthlyData(response.data);
        setError(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des stats:", err);
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
            <p>Loading your data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center bg-red-900/10 p-12 border border-red-900/20 rounded-2xl text-red-400">
            <AlertCircle className="mb-4 w-12 h-12" />
            <p className="font-medium">Failed to load analytics data.</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm underline">Try again</button>
          </div>
        ) : (
          <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
            <AnalyticsCard title="Lead Generation (Monthly)">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </AnalyticsCard>

            <AnalyticsCard title="Lead Volume Breakdown">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  />
                  <Bar dataKey="leads" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </AnalyticsCard>
          </div>
        )}

        <div className="flex md:flex-row flex-col justify-between items-center gap-6 bg-blue-600/10 p-8 border border-blue-500/20 rounded-2xl text-white md:text-left text-center">
           <div>
             <h2 className="font-bold text-xl">Report</h2>
           </div>
           <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all">
             Export PDF Report
           </button>
        </div>
      </div>
  );
}

export default Analytics;